import * as S from "@effect/schema/Schema";
import { HeaderObject } from "./HeaderObject";

export const EncodingObject = S.struct({
  contentType: S.optional(S.string),
  headers: S.optional(S.record(S.string, S.union(HeaderObject))),
  style: S.optional(S.string),
  explode: S.optional(S.boolean),
  allowReserved: S.optional(S.boolean),
});
export type EncodingObject = S.To<typeof EncodingObject>;
