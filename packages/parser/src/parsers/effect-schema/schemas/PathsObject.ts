import * as S from "@effect/schema/Schema";
import { referenceOr } from "./ReferenceObject";
import { PathItemObjectCodec } from "./PathItemObject";

export const PathsObjectCodec = S.record(
  S.string,
  referenceOr(PathItemObjectCodec),
);
export type PathsObject = S.Schema.To<typeof PathsObjectCodec>;
