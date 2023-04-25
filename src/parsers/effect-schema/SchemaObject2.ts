import * as S from "@effect/schema/Schema";
import { PropertySignature, Schema } from "@effect/schema/src/Schema";
import { ReferenceObject, referenceOr } from "./ReferenceObject";
import { format } from "./lib/scalar/format";

type SchemaCommon = {
  readonly title?: string;
  readonly description?: string;
  readonly default?: any;
  readonly nullable?: boolean;
  readonly format?: S.To<typeof format>;
};
export type SchemaObject2 =
  | (SchemaCommon &
      (
        | { type: "string"; enum?: ReadonlyArray<string> }
        | { type: "number" }
        | { type: "boolean" }
        | { type: "integer" }
        | {
            type: "array";
            items: ReferenceObject | SchemaObject2;
          }
      ))
  | {
      type: "object";
      properties?: Record<PropertyKey, ReferenceObject | SchemaObject2>;
      required?: ReadonlyArray<string>;
      additionalProperties?:
        | true
        | Record<PropertyKey, ReferenceObject | SchemaObject2>;
    }
  | {
      allOf: ReadonlyArray<ReferenceObject | SchemaObject2>;
    }
  | {
      oneOf: ReadonlyArray<ReferenceObject | SchemaObject2>;
    };

const SchemaObjectCommon = S.struct({
  title: S.optional(S.string),
  description: S.optional(S.string),
  default: S.optional(S.unknown),
  nullable: S.optional(S.boolean),
  format: S.optional(format),
});

function schemaCommonAnd<
  Fields extends Record<
    PropertyKey,
    | Schema<any>
    | Schema<never>
    | PropertySignature<any, boolean, any, boolean>
    | PropertySignature<never, boolean, never, boolean>
  >
>(fields: Fields) {
  return S.extend(SchemaObjectCommon)(S.struct(fields));
}

/**
 * The Schema Object allows the definition of input and output data types
 * https://spec.openapis.org/oas/latest.html#schema-object
 */
export const SchemaObject: S.Schema<any, SchemaObject2> = S.lazy(() =>
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
