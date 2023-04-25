import { Schema } from "@effect/schema/src/Schema";
import * as S from "@effect/schema/Schema";

export const ReferenceObject = S.struct({ $ref: S.string });
export type ReferenceObject = S.To<typeof ReferenceObject>;
export const isReferenceObject = S.is(ReferenceObject);
export const referenceOr = <Members extends ReadonlyArray<Schema<any>>>(
  ...members: Members
) => S.union(ReferenceObject, ...members);
