import { expect, it } from "vitest";
import { getReference, ReferenceNotFound } from "~/src/getReference";
import { Result } from "@ollierelph/result4t";
import { buildOpenApi, SchemaObject } from "@ollierelph/openapi-parser";

it("resolves a known item", () => {
  const result = getReference(buildOpenApi())(
    {
      $ref: "#/components/schemas/a",
    },
    SchemaObject
  );
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
  const result = getReference(buildOpenApi())(ref, SchemaObject);
  expect(result).toStrictEqual(Result.failure(ReferenceNotFound.of(ref)));
});
