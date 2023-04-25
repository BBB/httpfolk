import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";
import { EncodingObject } from "./EncodingObject";
import { SchemaObject2 } from "./SchemaObject2";
import { ExampleObject } from "./ExampleObject";

const MediaTypeCommon = S.struct({
  schema: S.optional(referenceOr(SchemaObject)),
  encoding: S.optional(S.record(S.string, referenceOr(EncodingObject))),
});
type MediaTypeCommon = S.To<typeof MediaTypeCommon>;
export const MediaTypeObject = S.union(
  S.extend(MediaTypeCommon)(
    S.struct({
      examples: S.optional(S.record(S.string, referenceOr(ExampleObject))),
    })
  ),
  S.extend(MediaTypeCommon)(
    S.struct({
      example: S.optional(S.any),
    })
  )
);
export type MediaTypeObject = S.To<typeof MediaTypeObject>;
