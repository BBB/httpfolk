import {
  componentFieldNames,
  ReferenceObject,
} from "../parsers/effect-schema/ReferenceObject";
import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { Result } from "@ollierelph/result4t";
import { decodeToResult } from "../parsers/effect-schema/lib/decodeToResult";

class ReferenceNotFound {
  protected constructor(public ref: ReferenceObject) {}

  static of(ref: ReferenceObject) {
    return new ReferenceNotFound(ref);
  }
}

const decodeComponentFieldNames = decodeToResult(componentFieldNames);
export const getReference =
  (schema: OpenApi) =>
  <T>(ref: ReferenceObject): Result<T, ReferenceNotFound> => {
    if (!schema.components) {
      return Result.failure(ReferenceNotFound.of(ref));
    }
    const [section, id] = ref.$ref.replace("#/components/", "").split("/");
    return decodeComponentFieldNames(section as any)
      .mapFailure((_) => ReferenceNotFound.of(ref))
      .flatMap((s) => {
        const component = schema.components[s];
        const item = component?.[id];
        console.log({ section, id });
        if (!item) {
          return Result.failure(ReferenceNotFound.of(ref));
        }
        return Result.success(item);
      });
  };
