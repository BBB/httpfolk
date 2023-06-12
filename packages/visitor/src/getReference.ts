import * as S from "@effect/schema/Schema";
import { Result } from "@ollierelph/result4t";
import { decodeToResult } from "@ollierelph/openapi-parser/src/parsers/effect-schema/lib/decodeToResult";
import {
  componentFieldNames,
  ReferenceObject,
} from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/ReferenceObject";
import { OpenApiObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";

export class ReferenceNotFound {
  protected constructor(public ref: ReferenceObject) {}

  static of(ref: ReferenceObject) {
    return new ReferenceNotFound(ref);
  }
}
export class ReferenceNotExpected {
  protected constructor(public ref: ReferenceObject) {}

  static of(ref: ReferenceObject) {
    return new ReferenceNotExpected(ref);
  }
}

const decodeComponentFieldNames = decodeToResult(componentFieldNames);

export type Goto = <T>(
  ref: ReferenceObject,
  itemSchema: S.Schema<T>
) => Result<T, ReferenceNotFound | ReferenceNotExpected>;
export const getReference =
  (schema: OpenApiObject): Goto =>
  <T>(
    ref: ReferenceObject,
    itemSchema: S.Schema<T>
  ): Result<T, ReferenceNotFound | ReferenceNotExpected> => {
    if (!schema.components) {
      return Result.failure(ReferenceNotFound.of(ref));
    }
    const [section, id] = ref.$ref.replace("#/components/", "").split("/");
    return decodeComponentFieldNames(section as any)
      .mapFailure((_) => ReferenceNotFound.of(ref))
      .flatMap((s) => {
        const component = schema.components?.[s];
        const item = component?.[id];
        if (!item) {
          return Result.failure(ReferenceNotFound.of(ref));
        }
        return Result.success(item);
      })
      .flatMap((v) =>
        decodeToResult(itemSchema)(v).mapFailure((_) =>
          ReferenceNotExpected.of(ref)
        )
      );
  };
