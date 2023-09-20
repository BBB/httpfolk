import { Builder, BuildFailure } from "../lib/Builder";
import ts, { CallExpression, PropertyAssignment } from "typescript";

import {
  isReferenceObject,
  ReferenceObject,
  OpenApiObject,
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
import { match } from "ts-pattern";

type PathResponses = {
  path: string;
  responses: ResponsesObject;
};

class MethodPaths {
  constructor(private resolveReference: ReturnType<typeof getReference>) {}

  private getPaths: Array<PathResponses> = [];
  private putPaths: Array<PathResponses> = [];
  private patchPaths: Array<PathResponses> = [];
  private postPaths: Array<PathResponses> = [];
  private deletePaths: Array<PathResponses> = [];

  public addGetPath(path: PathResponses) {
    this.getPaths.push(path);
  }

  public addPutPath(path: PathResponses) {
    this.putPaths.push(path);
  }

  public addPostPath(path: PathResponses) {
    this.postPaths.push(path);
  }

  public addPatchPath(path: PathResponses) {
    this.patchPaths.push(path);
  }

  public addDeletePath(path: PathResponses) {
    this.deletePaths.push(path);
  }

  schemaObjectToCodec(
    maybeSchema: SchemaObject | ReferenceObject,
  ): CallExpression {
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

    if ("type" in schema) {
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
        .with(
          { type: "string" },
          { type: "number" },
          { type: "integer" },
          (it) =>
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("S"),
                ts.factory.createIdentifier("literal"),
              ),
              undefined,
              [],
            ),
        )
        .with({ type: "object" }, (it) =>
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("S"),
              ts.factory.createIdentifier("struct"),
            ),
            undefined,
            it.properties
              ? [
                  ts.factory.createObjectLiteralExpression(
                    Object.entries(it.properties).reduce(
                      (agg, [key, value]) =>
                        agg.concat([
                          ts.factory.createPropertyAssignment(
                            ts.factory.createIdentifier(key),
                            this.schemaObjectToCodec(value),
                          ),
                        ]),
                      [] as PropertyAssignment[],
                    ),
                  ),
                ]
              : [],
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
        .exhaustive();
    }

    return ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier("S"),
        ts.factory.createIdentifier("struct"),
      ),
      undefined,
      [],
    );
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
      method: string,
      paths: Array<PathResponses>,
    ) => {
      if (paths.length > 0) {
        return [
          ts.factory.createPropertyAssignment(
            method,
            ts.factory.createObjectLiteralExpression(
              this.getPaths.map((p) =>
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
    const properties = createPropertiesForMethod("get", this.getPaths)
      .concat(createPropertiesForMethod("put", this.putPaths))
      .concat(createPropertiesForMethod("post", this.postPaths))
      .concat(createPropertiesForMethod("patch", this.patchPaths))
      .concat(createPropertiesForMethod("delete", this.deletePaths));

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
          if (pathItem.node.definition.get?.responses) {
            methodPaths.addGetPath({
              path: pathItem.node.path,
              responses: pathItem.node.definition.get.responses,
            });
          }
          if (pathItem.node.definition.put?.responses) {
            methodPaths.addPutPath({
              path: pathItem.node.path,
              responses: pathItem.node.definition.put.responses,
            });
          }
          if (pathItem.node.definition.post?.responses) {
            methodPaths.addPostPath({
              path: pathItem.node.path,
              responses: pathItem.node.definition.post.responses,
            });
          }
          if (pathItem.node.definition.patch?.responses) {
            methodPaths.addPatchPath({
              path: pathItem.node.path,
              responses: pathItem.node.definition.patch.responses,
            });
          }
          if (pathItem.node.definition.delete?.responses) {
            methodPaths.addDeletePath({
              path: pathItem.node.path,
              responses: pathItem.node.definition.delete.responses,
            });
          }
        });

        return methodPaths.toObjectLiteral().map(printAst).join("\n");
      })
      .mapFailure(() => new BuildFailure());
  }
}
