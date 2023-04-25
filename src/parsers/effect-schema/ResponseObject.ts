import * as S from "@effect/schema/Schema";
import { ReferenceObject } from "./ReferenceObject";
import { HeaderObject } from "./HeaderObject";
import { LinkObject } from "./LinkObject";
import { ContentObject } from "./ContentObject";

export const ResponseObject = S.struct({
  description: S.string,
  headers: S.optional(
    S.record(S.string, S.union(ReferenceObject, HeaderObject))
  ),
  content: S.optional(ContentObject),
  links: S.optional(S.record(S.string, LinkObject)),
});
export type ResponseObject = S.To<typeof ResponseObject>;
