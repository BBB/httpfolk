import { SchemaObject2 } from "../parsers/effect-schema/SchemaObject2";

export const stringSchema = () => ({ type: "string" as const });
export const numberSchema = () => ({ type: "number" as const });
export const objectSchema = () => ({ type: "object" as const });
export const arraySchema = (items: SchemaObject2) => ({
  type: "array",
  items,
});
export const enumSchema = (...strings: string[]) => ({
  type: "string",
  enum: strings,
});
export const booleanSchema = () => ({ type: "boolean" });
export const oneOfSchema = (...oneOf: SchemaObject2[]) => ({
  oneOf,
});
export const allOfSchema = (...allOf: SchemaObject2[]) => ({
  allOf,
});
