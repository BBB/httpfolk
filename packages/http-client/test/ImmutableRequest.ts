import { expect, it } from "vitest";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { ImmutableURL } from "~/src/ImmutableURL";

it("constructs a request", () => {
  ImmutableRequest.get(new ImmutableURL("http://example.com/api"));
  ImmutableRequest.delete(new ImmutableURL("http://example.com/api"));
  ImmutableRequest.put(new ImmutableURL("http://example.com/api"));
  ImmutableRequest.post(new ImmutableURL("http://example.com/api"));
  ImmutableRequest.patch(new ImmutableURL("http://example.com/api"));
});

it("can modify the headers a header", () => {
  const underTest = ImmutableRequest.get(
    new ImmutableURL("https://example.com/api"),
  );
  const updated = underTest.setHeaders(underTest.headers.set("bingo", "bango"));
  expect(underTest.headers.get("bingo")).not.toEqual(
    updated.headers.get("bingo"),
  );
  expect(updated.headers.toJSON()).toMatchInlineSnapshot(`
    {
      "bingo": "bango",
    }
  `);
});
