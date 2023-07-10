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

export const localRef = S.templateLiteral(
  S.literal("#/components/"),
  componentFieldNames,
  S.literal("/"),
  S.string
);

/**
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally.
 * https://spec.openapis.org/oas/latest.html#reference-object
 */
export const ReferenceObjectCodec = S.struct({ $ref: localRef });
export type ReferenceObject = S.To<typeof ReferenceObjectCodec>;
export const isReferenceObject = S.is(ReferenceObjectCodec);
export const referenceOr = <Members extends readonly S.Schema<any, any>[]>(
  ...members: Members
) => S.union(ReferenceObjectCodec, ...members);
