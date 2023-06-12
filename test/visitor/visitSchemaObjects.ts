import { expect, it } from "vitest";
import { visitSchemaObjects } from "~/src/visitor/visitSchemaObjects";
import { SchemaObject } from "~/src/parsers/effect-schema/schemas/SchemaObject";
import { buildOpenApi } from "~/src/parsers/effect-schema/schemas/OpenApiObject";

it("visits every schemaObject", () => {
  const schemas: SchemaObject[] = [];
  visitSchemaObjects(buildOpenApi())((schemaObject) => {
    schemas.push(schemaObject);
  });
  expect(schemas).toHaveLength(3);
  expect(schemas).toMatchInlineSnapshot(`
    [
      {
        "type": "string",
      },
      {
        "type": "string",
      },
      {
        "type": "string",
      },
    ]
  `);
});
