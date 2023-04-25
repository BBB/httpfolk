import {
  isReferenceObject,
  OpenApi,
  ReferenceObject,
  SchemaObject,
} from "../parsers/effect-schema/schemaObject";

const getReference = (schema: OpenApi) => (ref: ReferenceObject) => {};

const visitSchemaObjects = (schema: OpenApi) => {
  const goto = getReference(schema);
  const visited = new Set<SchemaObject>();
  return (visit: (schemaObject: SchemaObject) => void) => {
    if (schema.paths) {
      Object.values(schema.paths).forEach((value) => {
        if (isReferenceObject(value)) {
          goto(value);
          // TODO recurse
        } else if (value.get?.responses) {
          Object.values(value.get?.responses).forEach((response) => {
            if (isReferenceObject(response)) {
              goto(response);
              // TODO recurse
            } else if (response.content) {
              Object.values(response.content).forEach((content) => {
                if (isReferenceObject(content.schema)) {
                  goto(content.schema);
                  // TODO recurse
                } else if (content.schema) {
                  visit(content.schema);
                }
              });
            }
          });
        }
      });
    }
  };
};
