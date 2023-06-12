import { expect, it } from "vitest";
import { visitSchemaObjects } from "~/src/visitSchemaObjects";
import { SchemaObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/SchemaObject";
import { buildOpenApi } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";

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
