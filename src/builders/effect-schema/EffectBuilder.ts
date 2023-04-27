import { Builder, BuildFailure } from "~/src/builders/lib/Builder";
import { OpenApi } from "~/src/parsers/effect-schema/schemas/OpenApi";
import { Result } from "@ollierelph/result4t";
import { visitOperationObjects } from "~/src/visitor/visitOperationObjects";

export class EffectBuilder implements Builder {
  build(input: OpenApi) {
    return Result.success(input)
      .map(() => {
        const pathItems = [];
        visitOperationObjects(input)((method, pathItem) => {
          pathItems.push(pathItem);
        });
        return "";
      })
      .mapFailure(() => new BuildFailure());
  }
}
