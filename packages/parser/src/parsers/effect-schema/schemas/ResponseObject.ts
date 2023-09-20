import * as S from "@effect/schema/Schema";
import { ReferenceObjectCodec } from "./ReferenceObject";
import { HeaderObjectCodec } from "./HeaderObject";
import { LinkObjectCodec } from "./LinkObject";
import { ContentObjectCodec } from "./ContentObject";

export const ResponseObjectCodec = S.struct({
  description: S.string,
  headers: S.optional(
    S.record(S.string, S.union(ReferenceObjectCodec, HeaderObjectCodec)),
  ),
  content: S.optional(ContentObjectCodec),
  links: S.optional(S.record(S.string, LinkObjectCodec)),
});
export type ResponseObject = S.Schema.To<typeof ResponseObjectCodec>;
