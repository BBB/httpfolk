import * as S from "@effect/schema/Schema";
import { url } from "../lib/scalar/url";

export const LicenseObject = S.optional(
  S.struct({
    name: S.string,
    url: S.optional(url),
  })
);
export type LicenseObject = S.To<typeof LicenseObject>;
