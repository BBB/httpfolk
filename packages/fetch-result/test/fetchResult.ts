import { expect, it } from "vitest";
import { fetchResult, NotImplemented } from "~/src/fetchResult";
import { Response } from "undici";
import { Result } from "@ollierelph/result4t";

const underTest = fetchResult(async () => Response.error());
it("responds with an error", async () => {
  expect(await underTest("/woo").run()).toEqual(
    Result.failure(new NotImplemented()),
  );
});
