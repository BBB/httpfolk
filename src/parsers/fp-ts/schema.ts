import * as S from "@fp-ts/schema/Schema";

const url = S.string;
const email = S.string;
const format = S.string;
const restrictedStringKey = S.pattern(/^[a-zA-Z0-9.\-_]+$/)(S.string);

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

const serverVariables = S.optional(
  S.record(
    S.string,
    S.struct({
      enum: S.optional(S.array(S.string)),
      default: S.string,
      description: S.string,
    })
  )
);
const server = S.struct({
  url,
  description: S.optional(S.string),
  variables: serverVariables,
});

type SharedSchema = {
  readonly title?: string;
  readonly description?: string;
  readonly default?: any;
  readonly nullable?: boolean;
  readonly format?: S.Infer<typeof format>;
};
export type Schema =
  | (SharedSchema &
      (
        | { type: "string"; enum?: ReadonlyArray<string> }
        | { type: "number" }
        | { type: "boolean" }
        | { type: "integer" }
        | {
            type: "array";
            items: Ref | Schema;
          }
      ))
  | {
      type: "object";
      properties?: Record<PropertyKey, Ref | Schema>;
      required?: ReadonlyArray<string>;
      additionalProperties?: true | Record<PropertyKey, Ref | Schema>;
    }
  | {
      allOf: ReadonlyArray<Ref | Schema>;
    }
  | {
      oneOf: ReadonlyArray<Ref | Schema>;
    };

const ref = S.struct({ $ref: S.string });
type Ref = S.Infer<typeof ref>;
const refOrSchema = S.lazy(() => S.union(schema, ref));

const sharedSchema = S.struct({
  title: S.optional(S.string),
  description: S.optional(S.string),
  default: S.optional(S.unknown),
  nullable: S.optional(S.boolean),
  format: S.optional(format),
});

function sharedSchemaAnd<Fields extends Record<PropertyKey, S.Schema<any>>>(
  fields: Fields
) {
  return S.extend(sharedSchema)(S.struct(fields));
}

type A = { type: "woo"; woo: string } | { type: "foo"; foo: any };

const a: S.Schema<A> = S.lazy(() =>
  S.union(
    S.struct({ type: S.literal("woo"), woo: S.string }),
    S.struct({ type: S.literal("foo"), foo: a })
  )
);

const schema: S.Schema<Schema> = S.lazy(() =>
  S.union(
    sharedSchemaAnd({
      type: S.literal("string"),
      enum: S.optional(S.array(S.string)),
    }),
    sharedSchemaAnd({
      type: S.literal("number"),
    }),
    sharedSchemaAnd({
      type: S.literal("boolean"),
    }),
    sharedSchemaAnd({
      type: S.literal("integer"),
    }),
    sharedSchemaAnd({
      type: S.literal("array"),
      items: refOrSchema,
    }),
    sharedSchemaAnd({
      type: S.literal("object"),
      required: S.optional(S.array(S.string)),
      properties: S.optional(S.record(S.string, refOrSchema)),
      additionalProperties: S.optional(
        S.union(S.literal(true), S.record(S.string, refOrSchema))
      ),
    }),
    sharedSchemaAnd({
      allOf: S.array(refOrSchema),
    }),
    sharedSchemaAnd({
      oneOf: S.array(refOrSchema),
    })
    // Do I really want to support this?
    // sharedSchemaAnd({ anyOf: S.optional(S.array(schema)) })
  )
);

export const openApiV3 = S.struct({
  openapi: S.literal("3.0.3"),
  info: info,
  servers: S.array(server),
  components: S.struct({
    schemas: S.optional(S.record(restrictedStringKey, S.struct({}))),
    responses: S.optional(S.record(restrictedStringKey, S.struct({}))),
    parameters: S.optional(S.record(restrictedStringKey, S.struct({}))),
    examples: S.optional(S.record(restrictedStringKey, S.struct({}))),
    requestBodies: S.optional(S.record(restrictedStringKey, S.struct({}))),
    headers: S.optional(S.record(restrictedStringKey, S.struct({}))),
    securitySchemes: S.optional(S.record(restrictedStringKey, S.struct({}))),
    links: S.optional(S.record(restrictedStringKey, S.struct({}))),
    callbacks: S.optional(S.record(restrictedStringKey, S.struct({}))),
  }),
});
