import * as S from "@effect/schema/Schema";
import { url } from "./lib/scalar/url";

const ServerVariablesObject = S.optional(
  S.record(
    S.string,
    S.struct({
      enum: S.optional(S.array(S.string)),
      default: S.string,
      description: S.string,
    })
  )
);
export const ServerObject = S.struct({
  url,
  description: S.optional(S.string),
  variables: ServerVariablesObject,
});
export type ServerObject = S.To<typeof ServerObject>;
