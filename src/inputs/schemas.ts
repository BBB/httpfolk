import { SchemaObject } from "../parsers/fp-ts/schemaObject";

export const stringSchema = () => ({ type: "string" as const });
export const numberSchema = () => ({ type: "number" as const });
export const objectSchema = () => ({ type: "object" as const });
export const arraySchema = (items: SchemaObject) => ({
  type: "array",
  items,
});
export const enumSchema = (...strings: string[]) => ({
  type: "string",
  enum: strings,
});
export const booleanSchema = () => ({ type: "boolean" });
export const oneOfSchema = (...oneOf: SchemaObject[]) => ({
  oneOf,
});
export const allOfSchema = (...allOf: SchemaObject[]) => ({
  allOf,
});
