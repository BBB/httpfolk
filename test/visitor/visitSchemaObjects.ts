import { expect, it } from "vitest";
import { visitSchemaObjects } from "../../src/visitor/visitSchemaObjects";
import { buildOpenApi } from "../../src/parsers/effect-schema/OpenApi";
import { SchemaObject } from "../../src/parsers/effect-schema/SchemaObject";

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
