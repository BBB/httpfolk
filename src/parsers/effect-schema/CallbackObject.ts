import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";

import { PathItemObject } from "./PathItemObject";

export const CallbackObject = S.record(S.string, referenceOr(PathItemObject));
export type CallbackObject = S.To<typeof CallbackObject>;
