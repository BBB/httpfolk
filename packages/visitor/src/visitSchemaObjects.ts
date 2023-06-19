import { getReference } from "./getReference";
import { visitMediaTypeObjects } from "./visitMediaTypeObjects";
import {
  isReferenceObject,
  OpenApiObject,
  SchemaObject,
} from "@ollierelph/openapi-parser";

export function visitSchemaObjects<T>(schema: OpenApiObject) {
  const goto = getReference(schema);
  const visitParent = visitMediaTypeObjects(schema);
  return (visit: (schemaObject: SchemaObject) => void) => {
    visitParent((parent) => {
      const schemaObject = parent.node.definition.schema;
      if (schemaObject) {
        if (isReferenceObject(schemaObject)) {
          goto(schemaObject, SchemaObject).map(visit);
        } else {
          visit(schemaObject);
        }
      }
    });
  };
}
