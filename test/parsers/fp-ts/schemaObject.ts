import {describe, expect, it} from "vitest";
import {SchemaObject} from "../../../src/parsers/fp-ts/schemaObject";
import {decode} from "@fp-ts/schema/Parser";

describe("string", () => {

  it("should allow strings", () => {
    expect(
      decode(SchemaObject)({
        type: "string"
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
        enum: ["ONE", "TWO", "THREE"]
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

})
