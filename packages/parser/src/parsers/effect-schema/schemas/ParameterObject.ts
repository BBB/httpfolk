import * as S from "@effect/schema/Schema";

export const ParameterObjectCodec = S.struct({
  name: S.string,
  in: S.union(
    S.literal("query"),
    S.literal("header"),
    S.literal("path"),
    S.literal("cookie"),
  ),
  description: S.optional(S.string),
  required: S.boolean,
  deprecated: S.optional(S.boolean),
  allowEmptyValue: S.optional(S.boolean),
});
export type ParameterObject = S.To<typeof ParameterObjectCodec>;
