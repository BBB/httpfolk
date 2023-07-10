import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";

import { PathItemObjectCodec } from "./PathItemObject";

export const CallbackObjectCodec = S.lazy(() =>
  S.record(S.string, referenceOr(PathItemObjectCodec))
);
export type CallbackObject = S.To<typeof CallbackObjectCodec>;
