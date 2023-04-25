import { describe, expect, it } from "vitest";
import {
  localRef,
  ReferenceObject,
} from "../../../src/parsers/effect-schema/ReferenceObject";
import { decodeToResult } from "../../../src/parsers/effect-schema/lib/decodeToResult";
import { Failure, Result } from "@ollierelph/result4t";

describe("localRef", () => {
  it("should parse a valid ref", () => {
    expect(
      decodeToResult(ReferenceObject)({ $ref: "#/components/responses/a" })
    ).toEqual(Result.success({ $ref: "#/components/responses/a" }));
  });
  it("should not allow an invalid ref", () => {
    expect(
      // @ts-ignores
      decodeToResult(ReferenceObject)({ $ref: "#/components/responses" })
    ).toBeInstanceOf(Failure);
  });
});
