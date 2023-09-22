import { getReference } from "./getReference";
import { visitMediaTypeObjects } from "./visitMediaTypeObjects";
import {
  isReferenceObject,
  OpenApiObject,
  SchemaObject,
  SchemaObjectCodec,
} from "@ollierelph/openapi-parser";

export function visitSchemaObjects<T>(schema: OpenApiObject) {
  const goto = getReference(schema);
  const visitParent = visitMediaTypeObjects(schema);
  return (visit: (schemaObject: SchemaObject) => void) => {
    visitParent((parent) => {
      const schemaObject = parent.node.definition.schema;
      if (schemaObject) {
        if (isReferenceObject(schemaObject)) {
          goto(schemaObject, SchemaObjectCodec).map(visit);
        } else {
          visit(schemaObject);
        }
      }
    });
  };
}
