import { expect, it } from "vitest";
import { fetchResult } from "~/src/fetchResult";
import { Response } from "undici";
import { Result } from "@ollierelph/result4t";

const underTest = (response: Response) => fetchResult(async () => response);
it("responds with an error", async () => {
  const res = Response.error();
  expect(await underTest(res)("/woo").run()).toEqual(Result.failure(res));
});
