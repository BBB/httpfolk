import * as S from "@fp-ts/schema/Schema";

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

export const SchemaObject: S.Schema<SchemaObject> = S.lazy(() =>
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

const MediaTypeCommon = S.struct({
  schema: S.optional(referenceOr(SchemaObject)),
  encoding: S.optional(S.record(S.string, referenceOr(EncodingObject))),
});

export const MediaTypeObject = S.union(
  S.extend(MediaTypeCommon)(
    S.struct({
      examples: S.optional(S.record(S.string, referenceOr(ExampleObject))),
    })
  ),
  S.extend(MediaTypeCommon)(
    S.struct({
      example: S.optional(S.any),
    })
  )
);

const LinkObject = S.struct({
  operationRef: S.optional(S.string),
  operationId: S.optional(S.string),
  parameters: S.optional(S.record(S.string, S.any)),
  requestBody: S.optional(S.any),
  description: S.optional(S.string),
  server: S.optional(ServerObject),
});

export const ResponseObject = S.struct({
  description: S.string,
  headers: S.optional(
    S.record(S.string, S.union(ReferenceObject, HeaderObject))
  ),
  content: S.optional(S.record(S.string, MediaTypeObject)),
  links: S.optional(S.record(S.string, LinkObject)),
});

const RequestBodyObject = S.struct({
  description: S.optional(S.string),
  content: S.record(S.string, MediaTypeObject),
  required: S.optional(S.boolean),
});

const ExternalDocumentationObject = S.struct({
  description: S.optional(S.string),
  url: url,
});

const ResponsesObject = S.record(
  restrictedStringKey,
  referenceOr(ResponseObject)
);

const SecurityRequirementObject = S.record(S.string, S.array(S.string));
const OperationObject: S.Schema<any> = S.lazy(() =>
  S.struct({
    tags: S.optional(S.array(S.string)),
    summary: S.optional(S.string),
    description: S.optional(S.string),
    externalDocs: S.optional(ExternalDocumentationObject),
    operationId: S.optional(S.string),
    parameters: S.optional(S.array(referenceOr(ParameterObject))),
    requestBody: S.optional(S.array(referenceOr(RequestBodyObject))),
    responses: S.optional(ResponsesObject),
    callbacks: S.optional(S.record(S.string, referenceOr(CallbackObject))),
    deprecated: S.optional(S.boolean),
    security: S.optional(S.array(SecurityRequirementObject)),
    servers: S.optional(S.array(ServerObject)),
  })
);

const PathItemObject: S.Schema<any> = S.lazy(() =>
  S.struct({
    summary: S.optional(S.string),
    description: S.optional(S.string),
    get: S.optional(OperationObject),
    put: S.optional(OperationObject),
    post: S.optional(OperationObject),
    delete: S.optional(OperationObject),
    options: S.optional(OperationObject),
    head: S.optional(OperationObject),
    patch: S.optional(OperationObject),
    trace: S.optional(OperationObject),
    servers: S.optional(S.array(ServerObject)),
    parameters: S.optional(S.array(S.union(ParameterObject, ReferenceObject))),
  })
);
const CallbackObject = S.record(S.string, referenceOr(PathItemObject));

const PathsObject = S.record(S.string, referenceOr(PathItemObject));
export const OpenApi = S.struct({
  openapi: S.union(S.literal("3.0.0"),S.literal("3.1.0")), // https://spec.openapis.org/oas/v3.1.0.html
  info: InfoObject,
  jsonSchemaDialect: S.optional(S.string),
  servers: S.array(ServerObject),
  components: S.struct({
    schemas: S.optional(S.record(restrictedStringKey, SchemaObject)),
    responses: S.optional(ResponsesObject),
    parameters: S.optional(
      S.record(restrictedStringKey, referenceOr(ParameterObject))
    ),
    examples: S.optional(
      S.record(restrictedStringKey, referenceOr(ExampleObject))
    ),
    requestBodies: S.optional(
      S.record(restrictedStringKey, referenceOr(RequestBodyObject))
    ),
    headers: S.optional(
      S.record(restrictedStringKey, referenceOr(HeaderObject))
    ),
    securitySchemes: S.optional(S.record(restrictedStringKey, S.any)),
    links: S.optional(S.record(restrictedStringKey, referenceOr(LinkObject))),
    callbacks: S.optional(S.record(restrictedStringKey, S.any)),
    pathItems: S.optional(S.record(restrictedStringKey, S.any)),
  }),
  paths: S.optional(PathsObject),
});
