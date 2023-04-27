import * as S from "@effect/schema/Schema";

export const HeaderObject = S.struct({
  required: S.boolean,
  deprecated: S.optional(S.boolean),
  allowEmptyValue: S.optional(S.boolean),
});
export type HeaderObject = S.To<typeof HeaderObject>;