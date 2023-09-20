import { describe, expect, it } from "vitest";
import {
  allOfSchema,
  arraySchema,
  booleanSchema,
  enumSchema,
  numberSchema,
  objectSchema,
  oneOfSchema,
  stringSchema,
} from "~/src/inputs/schemas";
import { EffectSchema } from "~/src/parsers/effect-schema/EffectSchema";
import { SchemaObjectCodec } from "~/src/parsers/effect-schema/schemas/SchemaObject";

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
      }),
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
      }),
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
      }),
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

function underTest(value: unknown) {
  return EffectSchema.for(SchemaObjectCodec)
    .parse(value)
    .getOrElse((err) => {
      console.log(err);
      throw err;
    });
}
