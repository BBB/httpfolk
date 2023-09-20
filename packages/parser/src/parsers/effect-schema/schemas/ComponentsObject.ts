import * as S from "@effect/schema/Schema";
import { restrictedStringKey } from "../lib/scalar/restrictedStringKey";
import { SchemaObjectCodec } from "./SchemaObject";
import { ResponsesObjectCodec } from "./ResponsesObject";
import { referenceOr } from "./ReferenceObject";
import { ParameterObjectCodec } from "./ParameterObject";
import { ExampleObjectCodec } from "./ExampleObject";
import { RequestBodyObjectCodec } from "./RequestBodyObject";
import { HeaderObjectCodec } from "./HeaderObject";
import { LinkObjectCodec } from "./LinkObject";

/**
 * Holds a set of reusable objects for different aspects of the OAS
 * https://spec.openapis.org/oas/latest.html#components-object
 */
export const ComponentsObjectCodec = S.struct({
  schemas: S.optional(S.record(restrictedStringKey, SchemaObjectCodec)),
  responses: S.optional(ResponsesObjectCodec),
  parameters: S.optional(
    S.record(restrictedStringKey, referenceOr(ParameterObjectCodec)),
  ),
  examples: S.optional(
    S.record(restrictedStringKey, referenceOr(ExampleObjectCodec)),
  ),
  requestBodies: S.optional(
    S.record(restrictedStringKey, referenceOr(RequestBodyObjectCodec)),
  ),
  headers: S.optional(
    S.record(restrictedStringKey, referenceOr(HeaderObjectCodec)),
  ),
  securitySchemes: S.optional(S.record(restrictedStringKey, S.any)),
  links: S.optional(
    S.record(restrictedStringKey, referenceOr(LinkObjectCodec)),
  ),
  callbacks: S.optional(S.record(restrictedStringKey, S.any)),
  pathItems: S.optional(S.record(restrictedStringKey, S.any)),
});

export type ComponentsObject = S.To<typeof ComponentsObjectCodec>;
