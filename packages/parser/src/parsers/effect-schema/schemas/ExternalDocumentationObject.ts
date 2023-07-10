import * as S from "@effect/schema/Schema";
import { url } from "../lib/scalar/url";

export const ExternalDocumentationObjectCodec = S.struct({
  description: S.optional(S.string),
  url: url,
});
export type ExternalDocumentationObject = S.To<
  typeof ExternalDocumentationObjectCodec
>;
