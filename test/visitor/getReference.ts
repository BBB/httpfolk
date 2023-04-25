import { expect, it } from "vitest";
import { getReference } from "../../src/visitor/getReference";
import { Result } from "@ollierelph/result4t";

it("resolves a known item", () => {
  const result = getReference({
    openapi: "3.1.0",
    info: {
      title: "My Schema",
      version: "1",
    },
    servers: [],
    components: {
      schemas: {
        a: {
          type: "string",
        },
        b: {
          type: "string",
        },
      },
    },
  })({
    $ref: "#/components/schemas/a",
  });
  expect(result).toStrictEqual(
    Result.success({
      type: "string",
    })
  );
});
