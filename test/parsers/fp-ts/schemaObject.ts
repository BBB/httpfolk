import {describe, expect, it} from "vitest";
import {SchemaObject} from "../../../src/parsers/fp-ts/schemaObject";
import {decode} from "@fp-ts/schema/Parser";
import {
  allOfSchema,
  arraySchema,
  booleanSchema,
  enumSchema,
  numberSchema,
  objectSchema,
  oneOfSchema,
  stringSchema
} from "../../../src/inputs/schemas";

describe("oneOf", () => {
  it("should allow oneOf", () => {
    expect(decode(SchemaObject)(oneOfSchema(stringSchema(), numberSchema())))
      .toMatchInlineSnapshot(`
      {
        "_tag": "Right",
        "right": {
          "oneOf": [
            {
              "type": "string",
            },
            {
              "type": "number",
            },
          ],
        },
      }
    `);
  });
});
describe("allOf", () => {
  it("should allow allOf", () => {
    expect(decode(SchemaObject)(allOfSchema(stringSchema(), numberSchema())))
      .toMatchInlineSnapshot(`
      {
        "_tag": "Right",
        "right": {
          "allOf": [
            {
              "type": "string",
            },
            {
              "type": "number",
            },
          ],
        },
      }
    `);
  });
});

describe("object", () => {
  it("should allow objects", () => {
    expect(decode(SchemaObject)(objectSchema())).toMatchInlineSnapshot(`
      {
        "_tag": "Right",
        "right": {
          "type": "object",
        },
      }
    `);
  });

  it("should allow objects with properties", () => {
    expect(
      decode(SchemaObject)({
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
        "_tag": "Right",
        "right": {
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
        },
      }
    `);
  });
});

describe("array", () => {
  it("should allow arrays", () => {
    expect(decode(SchemaObject)(arraySchema(stringSchema())))
      .toMatchInlineSnapshot(`
      {
        "_tag": "Right",
        "right": {
          "items": {
            "type": "string",
          },
          "type": "array",
        },
      }
    `);
  });
});
describe("integer", () => {
  it("should allow integers", () => {
    expect(
      decode(SchemaObject)({
        type: "integer",
      })
    ).toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "type": "integer",
      },
    }
  `);
  });
});

describe("boolean", () => {
  it("should allow booleans", () => {
    expect(
      decode(SchemaObject)({
        type: "boolean",
      })
    ).toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "type": "boolean",
      },
    }
  `);
  });
});

describe("number", () => {
  it("should allow numbers", () => {
    expect(decode(SchemaObject)(numberSchema())).toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "type": "number",
      },
    }
  `);
  });
});

describe("string", () => {
  it("should allow strings", () => {
    expect(decode(SchemaObject)(stringSchema())).toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "type": "string",
      },
    }
  `);
  });

  it("should allow enums", () => {
    expect(decode(SchemaObject)(enumSchema("ONE", "TWO", "THREE")))
      .toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "enum": [
          "ONE",
          "TWO",
          "THREE",
        ],
        "type": "string",
      },
    }
  `);
  });
});
