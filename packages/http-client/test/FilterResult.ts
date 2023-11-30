import { ImmutableRequest } from "~/src/ImmutableRequest";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableResponse } from "~/src/ImmutableResponse";
import { Result } from "@ollierelph/result4t";
import { expect, it } from "vitest";
import { Filter, HttpHandler } from "~/src/FilterResult";
import { ImmutableURL } from "~/src/ImmutableURL";

const alwaysStatusAndReflectRequest =
  (
    status: StatusCode,
  ): HttpHandler<Promise<Result<ImmutableResponse, Error>>> =>
  async (req: ImmutableRequest) =>
    Result.success(
      ImmutableResponse.of(null, {
        status,
        url: req.url,
        headers: req.headers,
      }),
    );

it("can build a filter chain", async () => {
  /**
   * We have to specify all 4 generics for each Filter for the composition to work
   * which kind of ruins the point, as we want it to be inferred
   */
  type ResultHttpHandler = (
    request: ImmutableRequest,
  ) => Promise<Result<ImmutableResponse, Error>>;

  const client = Filter.from(
    (next: ResultHttpHandler) => async (request: ImmutableRequest) => {
      const finalUrl = request.url.copy({ hostname: `${"stg"}.example.com` });
      return next(request.copy({ url: finalUrl }));
    },
  )
    .then(
      Filter.from(
        (next: ResultHttpHandler) => async (request: ImmutableRequest) => {
          const finalHeaders = request.headers.append(
            "Authorization",
            "Basic 123",
          );
          return next(request.copy({ headers: finalHeaders }));
        },
      ),
    )
    .then(
      Filter.from(
        (next: ResultHttpHandler) => (request: ImmutableRequest) =>
          next(request),
      ),
    )
    .apply(alwaysStatusAndReflectRequest(StatusCode.OK));
  const response = await client(
    ImmutableRequest.get(ImmutableURL.fromPathname("/")),
  );
  expect(response.isSuccess()).toEqual(true);
  expect(response.get()).toHaveProperty("status.value", StatusCode.OK.value);
});
