import * as S from "@effect/schema/Schema";
import { url } from "./lib/scalar/url";
import { ContactObject } from "./ContactObject";
import { LicenseObject } from "./LicenseObject";

/**
 * https://spec.openapis.org/oas/v3.1.0.html#info-object
 */
export const InfoObject = S.struct({
  title: S.string,
  description: S.optional(S.string),
  termsOfService: S.optional(url),
  contact: ContactObject,
  license: LicenseObject,
  version: S.optional(S.string),
});
export type InfoObject = S.To<typeof InfoObject>;
