import { expect, it } from "vitest";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { ImmutableURL } from "~/src/ImmutableURL";

it("can copy the fields", () => {
  const underTest = new ImmutableURL("https://example.com/api");
  const changed = underTest.copy({ username: "user", password: "pass" });
  expect(underTest.username).not.toEqual(changed.username);
  expect(underTest.password).not.toEqual(changed.password);
  expect(changed.toString()).toEqual("https://user:pass@example.com/api");
});
