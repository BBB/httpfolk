import * as S from "@effect/schema/Schema";

export const SecurityRequirementObject = S.record(S.string, S.array(S.string));
export type SecurityRequirementObject = S.To<typeof SecurityRequirementObject>;
