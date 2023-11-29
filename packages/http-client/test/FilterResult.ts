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

it("is something like this", async () => {
  const f = await Filter.alwaysRespondWith(
    ImmutableResponse.of(null, {
      status: StatusCode.OK,
    }),
  )
    .mapRequest((req) =>
      req.copy({ headers: req.headers.append("woo", "hoo") }),
    )
    .mapResponse(async (res): Promise<Result<boolean, Error>> => {
      return res.map((res) => false);
    })
    .map((next) => (request: ImmutableRequest) => next(request))
    .call(ImmutableRequest.get(ImmutableURL.fromPathname(`/}`)))
    .then((result) =>
      result.getOrElse((err) => {
        throw err;
      }),
    );
  expect(f).toEqual(true);
});
