import { expect, it } from "vitest";
import { StatusCode } from "~/src/StatusCode";

it("validates the number passed", () => {
  expect(() => StatusCode.from(0)).toThrow("0 is not a valid statusCode");
  expect(StatusCode.from(100)).toEqual(StatusCode.of(100));
});

it("narrows the value contained", () => {
  const underTest = StatusCode.from(100 as number);
  expect(underTest.is1xx()).toEqual(true);
});
