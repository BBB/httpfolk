import * as S from "@effect/schema/Schema";
import { url } from "./lib/scalar/url";
import { ContactObject } from "./ContactObject";
import { LicenseObject } from "./LicenseObject";

export const InfoObject = S.struct({
  title: S.string,
  description: S.optional(S.string),
  termsOfService: S.optional(url),
  contact: ContactObject,
  license: LicenseObject,
  version: S.string,
});
export type InfoObject = S.To<typeof InfoObject>;
