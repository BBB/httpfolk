import { Builder, BuildFailure } from "../lib/Builder";
import ts from "typescript";

import { OpenApiObject } from "@ollierelph/openapi-parser";
import { Result } from "@ollierelph/result4t";
import { visitPathItemObjects } from "@ollierelph/openapi-visitor/src/visitPathItemObjects";
import { printAst } from "~/src/lib/printAst";

class MethodPaths {
  private getPaths: Array<string> = [];
  private putPaths: Array<string> = [];
  private patchPaths: Array<string> = [];
  private postPaths: Array<string> = [];
  private deletePaths: Array<string> = [];
  public addGetPath(path: string) {
    this.getPaths.push(path);
  }

  public addPutPath(path: string) {
    this.putPaths.push(path);
  }

  public addPostPath(path: string) {
    this.postPaths.push(path);
  }

  public addPatchPath(path: string) {
    this.patchPaths.push(path);
  }

  public addDeletePath(path: string) {
    this.deletePaths.push(path);
  }

  toObjectLiteral() {
    const createPropertiesForMethod = (
      method: string,
      paths: Array<string>
    ) => {
      if (paths.length > 0) {
        return [
          ts.factory.createPropertyAssignment(
            method,
            ts.factory.createObjectLiteralExpression(
              this.getPaths.map((p) =>
                ts.factory.createPropertyAssignment(
                  ts.factory.createStringLiteral(p),
                  ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                      "responses",
                      ts.factory.createIdentifier("undefined")
                    ),
                  ])
                )
              )
            )
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

    return ts.factory.createVariableStatement(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            ts.factory.createIdentifier("paths"),
            undefined,
            undefined,
            ts.factory.createObjectLiteralExpression(properties)
          ),
        ],
        ts.NodeFlags.Const
      )
    );
  }
}

export class EffectBuilder implements Builder {
  build(input: OpenApiObject) {
    return Result.success(input)
      .map(() => {
        const methodPaths = new MethodPaths();

        visitPathItemObjects(input)((pathItem) => {
          if (pathItem.node.definition.get) {
            methodPaths.addGetPath(pathItem.node.path);
          }
          if (pathItem.node.definition.put) {
            methodPaths.addPutPath(pathItem.node.path);
          }
          if (pathItem.node.definition.post) {
            methodPaths.addPostPath(pathItem.node.path);
          }
          if (pathItem.node.definition.patch) {
            methodPaths.addPatchPath(pathItem.node.path);
          }
          if (pathItem.node.definition.delete) {
            methodPaths.addDeletePath(pathItem.node.path);
          }
        });

        return printAst(methodPaths.toObjectLiteral());
      })
      .mapFailure(() => new BuildFailure());
  }
}
