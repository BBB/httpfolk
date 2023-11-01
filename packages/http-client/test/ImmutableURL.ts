import { expect, it } from "vitest";
import { ImmutableURL } from "~/src/ImmutableURL";

it("can copy the fields", () => {
  const underTest = new ImmutableURL("https://example.com/api");
  const changed = underTest.copy({ username: "user", password: "pass" });
  expect(underTest.username).not.toEqual(changed.username);
  expect(underTest.password).not.toEqual(changed.password);
  expect(changed.toString()).toEqual("https://user:pass@example.com/api");
});

it("can copy using search params", () => {
  const underTest = new ImmutableURL("https://example.com/api");
  const changed = underTest.copy({
    searchParams: underTest.searchParams.set("updated", "true"),
  });
  expect(underTest.searchParams).not.toEqual(changed.searchParams);
  expect(underTest.search).not.toEqual(changed.search);
  expect(changed.toString()).toEqual("https://example.com/api?updated=true");
  expect(changed.search).toEqual("?updated=true");
});
