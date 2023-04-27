import * as S from "@effect/schema/Schema";
import { restrictedStringKey } from "../lib/scalar/restrictedStringKey";
import { referenceOr } from "./ReferenceObject";
import { ResponseObject } from "./ResponseObject";

export const ResponsesObject = S.record(
  restrictedStringKey,
  referenceOr(ResponseObject)
);
export type ResponsesObject = S.To<typeof ResponsesObject>;
