import * as S from "@effect/schema/Schema";
import { InfoObject } from "./InfoObject";
import { ServerObject } from "./ServerObject";
import { restrictedStringKey } from "./lib/scalar/restrictedStringKey";
import { ResponsesObject } from "./ResponsesObject";
import { referenceOr } from "./ReferenceObject";
import { ParameterObject } from "./ParameterObject";
import { ExampleObject } from "./ExampleObject";
import { RequestBodyObject } from "./RequestBodyObject";
import { HeaderObject } from "./HeaderObject";
import { LinkObject } from "./LinkObject";
import { PathsObject } from "./PathsObject";
import { SchemaObject } from "./schemaObject";

export const OpenApi = S.struct({
  openapi: S.union(S.literal("3.0.0"), S.literal("3.1.0")), // https://spec.openapis.org/oas/v3.1.0.html
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
export type OpenApi = S.To<typeof OpenApi>;
