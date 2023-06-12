import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";
import { PathItemObject } from "./PathItemObject";

export const PathsObject = S.record(S.string, referenceOr(PathItemObject));
export type PathsObject = S.To<typeof PathsObject>;
