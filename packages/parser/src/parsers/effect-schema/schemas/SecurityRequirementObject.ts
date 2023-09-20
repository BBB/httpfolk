import * as S from "@effect/schema/Schema";

export const SecurityRequirementObjectCodec = S.record(
  S.string,
  S.array(S.string),
);
export type SecurityRequirementObject = S.To<
  typeof SecurityRequirementObjectCodec
>;
