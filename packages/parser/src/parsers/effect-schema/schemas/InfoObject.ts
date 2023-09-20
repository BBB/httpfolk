import * as S from "@effect/schema/Schema";
import { ContactObjectCodec } from "./ContactObject";
import { LicenseObjectCodec } from "./LicenseObject";
import { url } from "../lib/scalar/url";

/**
 * https://spec.openapis.org/oas/v3.1.0.html#info-object
 */
export const InfoObjectCodec = S.struct({
  title: S.string,
  description: S.optional(S.string),
  termsOfService: S.optional(url),
  contact: ContactObjectCodec,
  license: LicenseObjectCodec,
  version: S.optional(S.string),
});
export type InfoObject = S.Schema.To<typeof InfoObjectCodec>;
