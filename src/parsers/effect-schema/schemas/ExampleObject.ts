import * as S from "@effect/schema/Schema";

export const ExampleObject = S.struct({
  summary: S.optional(S.string),
  description: S.optional(S.string),
  value: S.any,
  externalValue: S.string,
});
export type ExampleObject = S.To<typeof ExampleObject>;