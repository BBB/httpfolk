import { describe, expect, it } from "vitest";
import {
  ReferenceObject,
  referenceOr,
} from "../../../src/parsers/effect-schema/ReferenceObject";
import { decodeToResult } from "../../../src/parsers/effect-schema/lib/decodeToResult";
import { Failure, Result } from "@ollierelph/result4t";
import * as S from "@effect/schema/Schema";

describe("referenceOr", () => {
  it("expands the schema into a union", () => {
    const Schema = referenceOr(S.string);
    const decode = decodeToResult(Schema);
    expect(decode("woo")).toStrictEqual(Result.success("woo"));
    expect(decode({ $ref: "#/components/responses/a" })).toStrictEqual(
      Result.success({ $ref: "#/components/responses/a" })
    );
  });
});

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
