import { Builder, BuildFailure } from "../lib/Builder";
import * as ts from "typescript";

import { OpenApiObject } from "@ollierelph/openapi-parser";
import { Result } from "@ollierelph/result4t";
import { visitPathItemObjects } from "@ollierelph/openapi-visitor/src/visitPathItemObjects";
import { ObjectLiteralElementLike } from "typescript";
import { printAst } from "~/src/lib/printAst";

export class EffectBuilder implements Builder {
  build(input: OpenApiObject) {
    return Result.success(input)
      .map(() => {
        const pathProperties: ObjectLiteralElementLike[] = [];

        console.log({ fac: ts.factory });

        visitPathItemObjects(input)((pathItem) => {
          pathProperties.push(
            ts.factory.createPropertyAssignment(
              pathItem.node.path,
              ts.factory.createObjectLiteralExpression()
            )
          );
        });

        return printAst(
          ts.factory.createObjectLiteralExpression(pathProperties)
        );
      })
      .mapFailure(() => new BuildFailure());
  }
}
