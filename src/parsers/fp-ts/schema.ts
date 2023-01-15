import * as S from "@fp-ts/schema/Schema";

const url = S.string;
const email = S.string;

const types = S.union(
  S.literal("integer"),
  S.literal("number"),
  S.literal("string")
);

const contact = S.optional(
  S.struct({
    name: S.optional(S.string),
    url: S.optional(url),
    email: S.optional(email),
  })
);

const license = S.optional(
  S.struct({
    name: S.string,
    url: S.optional(url),
  })
);

const info = S.struct({
  title: S.string,
  description: S.optional(S.string),
  termsOfService: S.optional(url),
  contact: contact,
  license: license,
  version: S.string,
});

const server = S.struct({
  url,
  description: S.optional(S.string),
  variables: S.optional(
    S.record(
      S.string,
      S.struct({
        enum: S.optional(S.array(S.string)),
        default: S.string,
        description: S.string,
      })
    )
  ),
});

export const openApiV3 = S.struct({
  openapi: S.literal("3.0.3"),
  info: info,
  servers: S.array(server),
});
