import * as S from "@effect/schema/Schema";
import { MediaTypeObjectCodec } from "./MediaTypeObject";

export const RequestBodyObjectCodec = S.struct({
  description: S.optional(S.string),
  content: S.record(S.string, MediaTypeObjectCodec),
  required: S.optional(S.boolean),
});
export type RequestBodyObject = S.Schema.To<typeof RequestBodyObjectCodec>;
