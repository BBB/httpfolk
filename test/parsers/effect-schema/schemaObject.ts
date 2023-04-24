import { describe, expect, it } from "vitest";
import { SchemaObject } from "../../../src/parsers/effect-schema/schemaObject";
import {
  allOfSchema,
  arraySchema,
  booleanSchema,
  enumSchema,
  numberSchema,
  objectSchema,
  oneOfSchema,
  stringSchema,
} from "../../../src/inputs/schemas";
import { decodeToResult } from "../../../src/parsers/effect-schema/decodeToResult";

describe("oneOf", () => {
  it("should allow oneOf", () => {
    expect(underTest(oneOfSchema(stringSchema(), numberSchema())))
      .toMatchInlineSnapshot(`
        {
          "oneOf": [
            {
              "type": "string",
            },
            {
              "type": "number",
            },
          ],
        }
      `);
  });
});
describe("allOf", () => {
  it("should allow allOf", () => {
    expect(underTest(allOfSchema(stringSchema(), numberSchema())))
      .toMatchInlineSnapshot(`
        {
          "allOf": [
            {
              "type": "string",
            },
            {
              "type": "number",
            },
          ],
        }
      `);
  });
});

describe("object", () => {
  it("should allow objects", () => {
    expect(underTest(objectSchema())).toMatchInlineSnapshot(`
      {
        "type": "object",
      }
    `);
  });

  it("should allow objects with properties", () => {
    expect(
      underTest({
        type: "object",
        properties: {
          key: stringSchema(),
        },
        required: ["key"],
        additionalProperties: {
          woo: booleanSchema(),
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "additionalProperties": {
          "woo": {
            "type": "boolean",
          },
        },
        "properties": {
          "key": {
            "type": "string",
          },
        },
        "required": [
          "key",
        ],
        "type": "object",
      }
    `);
  });
});

describe("array", () => {
  it("should allow arrays", () => {
    expect(underTest(arraySchema(stringSchema()))).toMatchInlineSnapshot(`
      {
        "items": {
          "type": "string",
        },
        "type": "array",
      }
    `);
  });
});
describe("integer", () => {
  it("should allow integers", () => {
    expect(
      underTest({
        type: "integer",
      })
    ).toMatchInlineSnapshot(`
      {
        "type": "integer",
      }
    `);
  });
});

describe("boolean", () => {
  it("should allow booleans", () => {
    expect(
      underTest({
        type: "boolean",
      })
    ).toMatchInlineSnapshot(`
      {
        "type": "boolean",
      }
    `);
  });
});

describe("number", () => {
  it("should allow numbers", () => {
    expect(underTest(numberSchema())).toMatchInlineSnapshot(`
      {
        "type": "number",
      }
    `);
  });
});

describe("string", () => {
  it("should allow strings", () => {
    expect(underTest(stringSchema())).toMatchInlineSnapshot(`
      {
        "type": "string",
      }
    `);
  });

  it("should allow enums", () => {
    expect(underTest(enumSchema("ONE", "TWO", "THREE"))).toMatchInlineSnapshot(`
      {
        "enum": [
          "ONE",
          "TWO",
          "THREE",
        ],
        "type": "string",
      }
    `);
  });
});

const decoder = decodeToResult(SchemaObject);

function underTest(value: unknown) {
  return decoder(value).getOrElse(() => {
    throw new Error("Unexpected");
  });
}
