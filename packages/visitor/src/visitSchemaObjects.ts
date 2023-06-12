import { getReference } from "./getReference";
import { visitMediaTypeObjects } from "./visitMediaTypeObjects";
import { SchemaObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/SchemaObject";
import { OpenApiObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";
import { isReferenceObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/ReferenceObject";

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
