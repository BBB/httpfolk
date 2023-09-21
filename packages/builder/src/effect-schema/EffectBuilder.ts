import { Builder, BuildFailure } from "../lib/Builder";
import ts, {
  CallExpression,
  Expression,
  PropertyAccessExpression,
  PropertyAssignment,
} from "typescript";

import {
  HttpVerb,
  httpVerbs,
  isReferenceObject,
  OpenApiObject,
  ReferenceObject,
  ResponseObjectCodec,
  ResponsesObject,
  SchemaObject,
  SchemaObjectCodec,
} from "@ollierelph/openapi-parser";
import { Result } from "@ollierelph/result4t";
import {
  getReference,
  visitPathItemObjects,
} from "@ollierelph/openapi-visitor";
import { printAst } from "~/src/lib/printAst";
import { match, P } from "ts-pattern";
import { DefaultDict } from "~/src/lib/DefaultDict";

type PathResponses<T = any> = {
  path: string;
  body?: T;
  responses: ResponsesObject;
};

class MethodPaths {
  constructor(private resolveReference: ReturnType<typeof getReference>) {}

  private paths = new DefaultDict<HttpVerb, Array<PathResponses>>(() => []);

  public addPath(verb: HttpVerb, path: PathResponses) {
    this.paths.set(verb, this.paths.get(verb).concat([path]));
  }

  private schemaObjectToCodec(
    maybeSchema: SchemaObject | ReferenceObject,
  ): CallExpression | PropertyAccessExpression {
    const schema: SchemaObject | undefined = isReferenceObject(maybeSchema)
      ? this.resolveReference(maybeSchema, SchemaObjectCodec).getOrElse(
          (err) => {
            throw err;
          },
        )
      : maybeSchema;

    if (!schema) {
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("S"),
          ts.factory.createIdentifier("struct"),
        ),
        undefined,
        [],
      );
    }

    return match(schema)
      .with({ type: "boolean" }, (it) =>
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("S"),
            ts.factory.createIdentifier("bool"),
          ),
          undefined,
          [],
        ),
      )
      .with({ type: "string" }, { type: "number" }, { type: "integer" }, (it) =>
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("S"),
            ts.factory.createIdentifier("literal"),
          ),
          undefined,
          [],
        ),
      )
      .with({ type: "array" }, (it) =>
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("S"),
            ts.factory.createIdentifier("array"),
          ),
          undefined,
          [],
        ),
      )
      .with(
        { type: "object" },
        { properties: P.map() },
        { required: P.array<string>() },
        (it) =>
          "properties" in it
            ? ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier("S"),
                  ts.factory.createIdentifier("struct"),
                ),
                undefined,
                [
                  ts.factory.createObjectLiteralExpression(
                    Object.entries(it.properties || {}).reduce(
                      (agg, [key, value]) => {
                        const propertyAssignment = (initializer: Expression) =>
                          ts.factory.createPropertyAssignment(
                            ts.factory.createIdentifier(key),
                            initializer,
                          );
                        return agg.concat([
                          it.required?.includes(key)
                            ? propertyAssignment(
                                this.schemaObjectToCodec(value),
                              )
                            : propertyAssignment(
                                ts.factory.createCallExpression(
                                  ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("S"),
                                    ts.factory.createIdentifier("optional"),
                                  ),
                                  undefined,
                                  [this.schemaObjectToCodec(value)],
                                ),
                              ),
                        ]);
                      },
                      [] as PropertyAssignment[],
                    ),
                  ),
                ],
              )
            : ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("S"),
                ts.factory.createIdentifier("unknown"),
              ),
      )
      .with({ allOf: P.any }, (it) => {
        throw new Error("Not implemented");
      })
      .with({ oneOf: P.any }, (it) => {
        throw new Error("Not implemented");
      })
      .exhaustive();
  }

  toObjectLiteral() {
    const responsesToCodec = (definition: ResponsesObject): ts.Expression => {
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("S"),
          ts.factory.createIdentifier("union"),
        ),
        undefined,
        Object.entries(definition).flatMap(([status, def]) => {
          const res = isReferenceObject(def)
            ? this.resolveReference(def, ResponseObjectCodec).getOrElse(
                (err) => {
                  throw err;
                },
              )
            : def;
          if (!res.content) {
            return [];
          }
          return Object.entries(res.content).map(([contentType, media]) => {
            return ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("S"),
                ts.factory.createIdentifier("struct"),
              ),
              undefined,
              [
                ts.factory.createObjectLiteralExpression(
                  [
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier("status"),
                      ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                          ts.factory.createIdentifier("S"),
                          ts.factory.createIdentifier("literal"),
                        ),
                        undefined,
                        [ts.factory.createNumericLiteral(status)],
                      ),
                    ),
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier("contentType"),
                      ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                          ts.factory.createIdentifier("S"),
                          ts.factory.createIdentifier("literal"),
                        ),
                        undefined,
                        [ts.factory.createStringLiteral(contentType)],
                      ),
                    ),
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier("body"),
                      this.schemaObjectToCodec(media.schema),
                    ),
                  ],
                  true,
                ),
              ],
            );
          });
        }),
      );
    };
    const createPropertiesForMethod = (
      method: HttpVerb,
      paths: Array<PathResponses>,
    ) => {
      if (paths.length > 0) {
        return [
          ts.factory.createPropertyAssignment(
            method,
            ts.factory.createObjectLiteralExpression(
              paths.map((p) =>
                ts.factory.createPropertyAssignment(
                  ts.factory.createStringLiteral(p.path),
                  ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                      "responses",
                      responsesToCodec(p.responses),
                    ),
                  ]),
                ),
              ),
            ),
          ),
        ];
      }
      return [];
    };

    const properties = httpVerbs.reduce(
      (agg, verb) =>
        agg.concat(createPropertiesForMethod(verb, this.paths.get(verb))),
      [] as PropertyAssignment[],
    );

    return [
      ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          false,
          undefined,
          ts.factory.createNamespaceImport(ts.factory.createIdentifier("S")),
        ),
        ts.factory.createStringLiteral("@effect/schema/Schema"),
        undefined,
      ),
      ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              ts.factory.createIdentifier("paths"),
              undefined,
              undefined,
              ts.factory.createObjectLiteralExpression(properties),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    ];
  }
}

export class EffectBuilder implements Builder {
  build(input: OpenApiObject) {
    return Result.success(input)
      .map(() => {
        const methodPaths = new MethodPaths(getReference(input));

        visitPathItemObjects(input)((pathItem) => {
          for (const verb of httpVerbs) {
            const responses = pathItem.node.definition[verb]?.responses;
            if (responses) {
              methodPaths.addPath(verb, {
                path: pathItem.node.path,
                responses: responses,
              });
            }
          }
        });

        return methodPaths.toObjectLiteral().map(printAst).join("\n");
      })
      .mapFailure(() => new BuildFailure());
  }
}
