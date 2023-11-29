import { ImmutableRequest } from "~/src/ImmutableRequest";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableResponse } from "~/src/ImmutableResponse";
import { Result } from "@ollierelph/result4t";
import { expect, it } from "vitest";
import { Filter } from "~/src/FilterResult";
import { ImmutableURL } from "~/src/ImmutableURL";

it("can build a filter chain", async () => {
  const myClient = Filter.of(async (request: ImmutableRequest) =>
    Result.success(ImmutableResponse.of(null, { status: StatusCode.OK })),
  );

  const response = await myClient.call(
    ImmutableRequest.get(ImmutableURL.fromPathname("/woo")),
  );
  expect(response.isSuccess()).toEqual(true);
});
