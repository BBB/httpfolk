import { expect, it } from "vitest";
import { ImmutableURLSearchParams } from "~/src/ImmutableURLSearchParams";
import { URLSearchParams } from "url";

it("can be constructed from a URLSearchParams", () => {
  const underTest = new ImmutableURLSearchParams(
    new URLSearchParams("one=1&two=2"),
  );
  expect(underTest.get("one")).toEqual("1");
  expect(underTest.get("two")).toEqual("2");
  expect(underTest.toString()).toMatchInlineSnapshot('"one=1&two=2"');
});
it("can be constructed from a string", () => {
  const underTest = new ImmutableURLSearchParams("one=1&two=2");
  expect(underTest.get("one")).toEqual("1");
  expect(underTest.get("two")).toEqual("2");
  expect(underTest.toString()).toMatchInlineSnapshot('"one=1&two=2"');
});

it("does not mutate when setting", () => {
  const underTest = new ImmutableURLSearchParams("one=1&two=2");
  const changed = underTest.set("three", "3");
  expect(underTest.get("three")).not.toEqual(changed.get("three"));
  expect(underTest.toString()).toMatchInlineSnapshot('"one=1&two=2"');
  expect(changed.toString()).toMatchInlineSnapshot('"one=1&two=2&three=3"');
});
it("does not mutate when deleting", () => {
  const underTest = new ImmutableURLSearchParams("one=1&two=2");
  const changed = underTest.delete("one");
  expect(underTest.get("one")).not.toEqual(changed.get("one"));
  expect(underTest.toString()).toMatchInlineSnapshot('"one=1&two=2"');
  expect(changed.toString()).toMatchInlineSnapshot('"two=2"');
});
it("does not mutate when appending", () => {
  const underTest = new ImmutableURLSearchParams("one=1&two=2");
  const changed = underTest.append("three", "3");
  expect(underTest.get("three")).not.toEqual(changed.get("three"));
  expect(underTest.toString()).toMatchInlineSnapshot('"one=1&two=2"');
  expect(changed.toString()).toMatchInlineSnapshot('"one=1&two=2&three=3"');
});
it("does not mutate when sorting", () => {
  const underTest = new ImmutableURLSearchParams("two=2&one=1");
  const changed = underTest.sort();
  expect(underTest.toString()).toMatchInlineSnapshot('"two=2&one=1"');
  expect(changed.toString()).toMatchInlineSnapshot('"one=1&two=2"');
});
it("gives the correct size", () => {
  const underTest = new ImmutableURLSearchParams("two=2&one=1");
  expect(underTest.size).toEqual(2);
});
it("can get multiple with the same name", () => {
  const underTest = new ImmutableURLSearchParams("two=2&one=1&one=111");
  expect(underTest.getAll("one")).toEqual(["1", "111"]);
});
