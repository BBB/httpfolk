import { describe, expect, it } from "vitest";
import { decodeToResult } from "~/src/parsers/effect-schema/lib/decodeToResult";
import { Failure, Result } from "@ollierelph/result4t";
import * as S from "@effect/schema/Schema";
import {
  isReferenceObject,
  ReferenceObjectCodec,
  referenceOr,
} from "~/src/parsers/effect-schema/schemas/ReferenceObject";

describe("referenceOr", () => {
  it("expands the schema into a union", () => {
    const Schema = referenceOr(S.string);
    const decode = decodeToResult(Schema);
    expect(decode("woo")).toStrictEqual(Result.success("woo"));
    expect(decode({ $ref: "#/components/responses/a" })).toStrictEqual(
      Result.success({ $ref: "#/components/responses/a" }),
    );
  });
});

describe("localRef", () => {
  it.each([["#/components/responses/a"], ["#/components/schemas/a"]])(
    "should parse a valid ref",
    ($ref: string) => {
      const valid = {
        $ref,
      };
      expect(decodeToResult(ReferenceObjectCodec)(valid)).toEqual(
        Result.success({ $ref }),
      );
      expect(isReferenceObject(valid)).toEqual(true);
    },
  );
  it("should not allow an invalid ref", () => {
    expect(
      // @ts-ignores
      decodeToResult(ReferenceObjectCodec)({ $ref: "#/components/responses" }),
    ).toBeInstanceOf(Failure);
  });
});
