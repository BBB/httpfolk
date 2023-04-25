import * as S from "@effect/schema/Schema";
import { url } from "./lib/scalar/url";
import { email } from "./lib/scalar/email";

export const ContactObject = S.optional(
  S.struct({
    name: S.optional(S.string),
    url: S.optional(url),
    email: S.optional(email),
  })
);
export type ContactObject = S.To<typeof ContactObject>;
