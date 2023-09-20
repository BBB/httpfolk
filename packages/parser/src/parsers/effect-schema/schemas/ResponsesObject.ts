import * as S from "@effect/schema/Schema";
import { restrictedStringKey } from "../lib/scalar/restrictedStringKey";
import { referenceOr } from "./ReferenceObject";
import { ResponseObjectCodec } from "./ResponseObject";

export const ResponsesObjectCodec = S.record(
  restrictedStringKey,
  referenceOr(ResponseObjectCodec),
);
export type ResponsesObject = S.To<typeof ResponsesObjectCodec>;
