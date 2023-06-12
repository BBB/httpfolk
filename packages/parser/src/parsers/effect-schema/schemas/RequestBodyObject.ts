import * as S from "@effect/schema/Schema";
import { MediaTypeObject } from "./MediaTypeObject";

export const RequestBodyObject = S.struct({
  description: S.optional(S.string),
  content: S.record(S.string, MediaTypeObject),
  required: S.optional(S.boolean),
});
export type RequestBodyObject = S.To<typeof RequestBodyObject>;
