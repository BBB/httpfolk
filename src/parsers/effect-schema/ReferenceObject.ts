import { Schema } from "@effect/schema/src/Schema";
import * as S from "@effect/schema/Schema";

export const componentFieldNames = S.union(
  S.literal("schemas"),
  S.literal("responses"),
  S.literal("parameters"),
  S.literal("examples"),
  S.literal("requestBodies"),
  S.literal("headers"),
  S.literal("securitySchemes"),
  S.literal("links"),
  S.literal("callbacks"),
  S.literal("pathItems")
);

/**
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally.
 * https://spec.openapis.org/oas/latest.html#reference-object
 */

export const localRef = S.templateLiteral(
  S.literal("#/components/"),
  componentFieldNames,
  S.literal("/"),
  S.string
);

export const ReferenceObject = S.struct({ $ref: localRef });
export type ReferenceObject = S.To<typeof ReferenceObject>;
export const isReferenceObject = S.is(ReferenceObject);
export const referenceOr = <Members extends readonly Schema<any, any>[]>(
  ...members: Members
) => S.union(ReferenceObject, ...members);
