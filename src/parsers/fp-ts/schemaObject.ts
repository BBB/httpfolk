import * as S from "@fp-ts/schema/Schema";
import { string } from "@fp-ts/schema/Schema";

const url = S.string;
const email = S.string;
const format = S.string;
const restrictedStringKey = S.pattern(/^[a-zA-Z0-9.\-_]+$/)(S.string);

const ContactObject = S.optional(
  S.struct({
    name: S.optional(S.string),
    url: S.optional(url),
    email: S.optional(email),
  })
);

const LicenseObject = S.optional(
  S.struct({
    name: S.string,
    url: S.optional(url),
  })
);

const InfoObject = S.struct({
  title: S.string,
  description: S.optional(S.string),
  termsOfService: S.optional(url),
  contact: ContactObject,
  license: LicenseObject,
  version: S.string,
});

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
const ServerObject = S.struct({
  url,
  description: S.optional(S.string),
  variables: S.optional(ServerVariablesObject),
});

type SchemaCommon = {
  readonly title?: string;
  readonly description?: string;
  readonly default?: any;
  readonly nullable?: boolean;
  readonly format?: S.Infer<typeof format>;
};
export type SchemaObject =
  | (SchemaCommon &
      (
        | { type: "string"; enum?: ReadonlyArray<string> }
        | { type: "number" }
        | { type: "boolean" }
        | { type: "integer" }
        | {
            type: "array";
            items: ReferenceObject | SchemaObject;
          }
      ))
  | {
      type: "object";
      properties?: Record<PropertyKey, ReferenceObject | SchemaObject>;
      required?: ReadonlyArray<string>;
      additionalProperties?:
        | true
        | Record<PropertyKey, ReferenceObject | SchemaObject>;
    }
  | {
      allOf: ReadonlyArray<ReferenceObject | SchemaObject>;
    }
  | {
      oneOf: ReadonlyArray<ReferenceObject | SchemaObject>;
    };

const ReferenceObject = S.struct({ $ref: S.string });
type ReferenceObject = S.Infer<typeof ReferenceObject>;

const referenceOr = (...members: S.Schema<any>[]) =>
  S.union(ReferenceObject, ...members);

const SchemaObjectCommon = S.struct({
  title: S.optional(S.string),
  description: S.optional(S.string),
  default: S.optional(S.unknown),
  nullable: S.optional(S.boolean),
  format: S.optional(format),
});

function schemaCommonAnd<Fields extends Record<PropertyKey, S.Schema<any>>>(
  fields: Fields
) {
  return S.extend(SchemaObjectCommon)(S.struct(fields));
}

const SchemaObject: S.Schema<SchemaObject> = S.lazy(() =>
  S.union(
    schemaCommonAnd({
      type: S.literal("string"),
      enum: S.optional(S.array(S.string)),
    }),
    schemaCommonAnd({
      type: S.literal("number"),
    }),
    schemaCommonAnd({
      type: S.literal("boolean"),
    }),
    schemaCommonAnd({
      type: S.literal("integer"),
    }),
    schemaCommonAnd({
      type: S.literal("array"),
      items: referenceOr(SchemaObject),
    }),
    schemaCommonAnd({
      type: S.literal("object"),
      required: S.optional(S.array(S.string)),
      properties: S.optional(S.record(S.string, referenceOr(SchemaObject))),
      additionalProperties: S.optional(
        S.union(S.literal(true), S.record(S.string, referenceOr(SchemaObject)))
      ),
    }),
    schemaCommonAnd({
      allOf: S.array(referenceOr(SchemaObject)),
    }),
    schemaCommonAnd({
      oneOf: S.array(referenceOr(SchemaObject)),
    })
    // Do I really want to support this?
    // sharedSchemaAnd({ anyOf: S.optional(S.array(schema)) })
  )
);

const ParameterObject = S.struct({
  name: S.string,
  in: S.union(
    S.literal("query"),
    S.literal("header"),
    S.literal("path"),
    S.literal("cookie")
  ),
  description: S.optional(S.string),
  required: S.boolean,
  deprecated: S.optional(S.boolean),
  allowEmptyValue: S.optional(S.boolean),
});
const HeaderObject = S.struct({
  required: S.boolean,
  deprecated: S.optional(S.boolean),
  allowEmptyValue: S.optional(S.boolean),
});

const ExampleObject = S.struct({
  summary: S.optional(S.string),
  description: S.optional(S.string),
  value: S.any,
  externalValue: S.string,
});

const EncodingObject = S.struct({
  contentType: S.optional(S.string),
  headers: S.optional(
    S.record(S.string, S.union(ReferenceObject, HeaderObject))
  ),
  style: S.optional(S.string),
  explode: S.optional(S.boolean),
  allowReserved: S.optional(S.boolean),
});

const MediaTypeObject = S.struct({
  schema: referenceOr(SchemaObject),
  example: S.any,
  examples: S.record(S.string, referenceOr(ExampleObject)),
  encoding: S.record(S.string, referenceOr(EncodingObject)),
});

const LinkObject = S.struct({
  operationRef: S.optional(S.string),
  operationId: S.optional(S.string),
  parameters: S.optional(S.record(S.string, S.any)),
  requestBody: S.optional(S.any),
  description: S.optional(S.string),
  server: S.optional(ServerObject),
});

const ResponseObject = S.struct({
  description: S.string,
  headers: S.optional(
    S.record(S.string, S.union(ReferenceObject, HeaderObject))
  ),
  content: S.optional(S.record(S.string, MediaTypeObject)),
  links: S.optional(S.record(S.string, LinkObject)),
});

export const OpenApi = S.struct({
  openapi: S.literal("3.1.0"), // https://spec.openapis.org/oas/v3.1.0.html
  info: InfoObject,
  jsonSchemaDialect: S.string,
  servers: S.array(ServerObject),
  components: S.struct({
    schemas: S.optional(S.record(restrictedStringKey, SchemaObject)),
    responses: S.optional(
      S.record(restrictedStringKey, referenceOr(ResponseObject))
    ),
    parameters: S.optional(
      S.record(restrictedStringKey, referenceOr(ParameterObject))
    ),
    examples: S.optional(
      S.record(restrictedStringKey, referenceOr(ExampleObject))
    ),
    requestBodies: S.optional(S.record(restrictedStringKey, S.struct({}))),
    headers: S.optional(S.record(restrictedStringKey, S.struct({}))),
    securitySchemes: S.optional(S.record(restrictedStringKey, S.struct({}))),
    links: S.optional(S.record(restrictedStringKey, S.struct({}))),
    callbacks: S.optional(S.record(restrictedStringKey, S.struct({}))),
  }),
});
