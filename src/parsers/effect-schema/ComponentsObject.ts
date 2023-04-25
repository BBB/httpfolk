import * as S from "@effect/schema/Schema";
import { restrictedStringKey } from "./lib/scalar/restrictedStringKey";
import { SchemaObject } from "./SchemaObject";
import { ResponsesObject } from "./ResponsesObject";
import { referenceOr } from "./ReferenceObject";
import { ParameterObject } from "./ParameterObject";
import { ExampleObject } from "./ExampleObject";
import { RequestBodyObject } from "./RequestBodyObject";
import { HeaderObject } from "./HeaderObject";
import { LinkObject } from "./LinkObject";

/**
 * Holds a set of reusable objects for different aspects of the OAS
 * https://spec.openapis.org/oas/latest.html#components-object
 */
export const ComponentsObject = S.struct({
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
  headers: S.optional(S.record(restrictedStringKey, referenceOr(HeaderObject))),
  securitySchemes: S.optional(S.record(restrictedStringKey, S.any)),
  links: S.optional(S.record(restrictedStringKey, referenceOr(LinkObject))),
  callbacks: S.optional(S.record(restrictedStringKey, S.any)),
  pathItems: S.optional(S.record(restrictedStringKey, S.any)),
});
