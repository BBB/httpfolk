import { expect, it } from "vitest";
import {
  getReference,
  ReferenceNotFound,
} from "../../src/visitor/getReference";
import { Result } from "@ollierelph/result4t";
import { OpenApi } from "../../src/parsers/effect-schema/OpenApi";

function baseSchema(): OpenApi {
  return {
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
  };
}

it("resolves a known item", () => {
  const result = getReference(baseSchema())({
    $ref: "#/components/schemas/a",
  });
  expect(result).toStrictEqual(
    Result.success({
      type: "string",
    })
  );
});

it("cant find an item", () => {
  const ref = {
    $ref: "#/components/schemas/c",
  } as const;
  const result = getReference(baseSchema())(ref);
  expect(result).toStrictEqual(Result.failure(ReferenceNotFound.of(ref)));
});
