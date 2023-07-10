import * as S from "@effect/schema/Schema";
import { HeaderObjectCodec } from "./HeaderObject";

export const EncodingObjectCodec = S.struct({
  contentType: S.optional(S.string),
  headers: S.optional(S.record(S.string, S.union(HeaderObjectCodec))),
  style: S.optional(S.string),
  explode: S.optional(S.boolean),
  allowReserved: S.optional(S.boolean),
});
export type EncodingObject = S.To<typeof EncodingObjectCodec>;
