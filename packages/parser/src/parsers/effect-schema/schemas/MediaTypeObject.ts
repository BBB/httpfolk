import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";
import { EncodingObjectCodec } from "./EncodingObject";
import { SchemaObjectCodec } from "./SchemaObject";
import { ExampleObjectCodec } from "./ExampleObject";

const MediaTypeCommon = S.struct({
  schema: S.optional(referenceOr(SchemaObjectCodec)),
  encoding: S.optional(S.record(S.string, referenceOr(EncodingObjectCodec))),
});
type MediaTypeCommon = S.Schema.To<typeof MediaTypeCommon>;
export const MediaTypeObjectCodec = S.union(
  S.extend(MediaTypeCommon)(
    S.struct({
      examples: S.optional(S.record(S.string, referenceOr(ExampleObjectCodec))),
    }),
  ),
  S.extend(MediaTypeCommon)(
    S.struct({
      example: S.optional(S.any),
    }),
  ),
);
export type MediaTypeObject = S.Schema.To<typeof MediaTypeObjectCodec>;
