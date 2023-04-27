import * as S from "@effect/schema/Schema";
import { url } from "../lib/scalar/url";

export const ExternalDocumentationObject = S.struct({
  description: S.optional(S.string),
  url: url,
});
export type ExternalDocumentationObject = S.To<
  typeof ExternalDocumentationObject
>;
