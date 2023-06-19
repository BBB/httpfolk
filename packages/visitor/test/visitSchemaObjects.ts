import { expect, it } from "vitest";
import { visitSchemaObjects } from "~/src/visitSchemaObjects";
import { buildOpenApi, SchemaObject } from "@ollierelph/openapi-parser";

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
