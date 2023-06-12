import { Builder, BuildFailure } from "../lib/Builder";
import { OpenApiObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";
import { Result } from "@ollierelph/result4t";
import { visitOperationObjects } from "@ollierelph/openapi-visitor/src/visitOperationObjects";

export class EffectBuilder implements Builder {
  build(input: OpenApiObject) {
    return Result.success(input)
      .map(() => {
        const pathItems = [];
        visitOperationObjects(input)((operation) => {
          pathItems.push(operation.node.definition);
        });
        return "";
      })
      .mapFailure(() => new BuildFailure());
  }
}
