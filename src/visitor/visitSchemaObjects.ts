import { SchemaObject } from "../parsers/effect-schema/SchemaObject";
import { isReferenceObject } from "../parsers/effect-schema/ReferenceObject";
import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { getReference } from "./getReference";
import { visitMediaTypeObjects } from "./visitMediaTypeObjects";

export function visitSchemaObjects<T>(schema: OpenApi) {
  const goto = getReference(schema);
  const visitParent = visitMediaTypeObjects(schema);
  return (visit: (schemaObject: SchemaObject) => void) => {
    visitParent((parent) => {
      const schemaObject = parent.schema;
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
