import { describe, expect, it } from "vitest";
import { SchemaObject } from "../../../src/parsers/fp-ts/schemaObject";
import { decode } from "@fp-ts/schema/Parser";

describe("object", () => {
  it("should allow objects", () => {
    expect(
      decode(SchemaObject)({
        type: "object",
      })
    ).toMatchInlineSnapshot(`
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
          key: { type: "string" },
        },
        required: ["key"],
        additionalProperties: {
          woo: { type: "boolean" },
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
    expect(
      decode(SchemaObject)({
        type: "array",
        items: {
          type: "string",
        },
      })
    ).toMatchInlineSnapshot(`
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
    expect(
      decode(SchemaObject)({
        type: "number",
      })
    ).toMatchInlineSnapshot(`
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
    expect(
      decode(SchemaObject)({
        type: "string",
      })
    ).toMatchInlineSnapshot(`
    {
      "_tag": "Right",
      "right": {
        "type": "string",
      },
    }
  `);
  });

  it("should allow enums", () => {
    expect(
      decode(SchemaObject)({
        type: "string",
        enum: ["ONE", "TWO", "THREE"],
      })
    ).toMatchInlineSnapshot(`
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
