import { ImmutableRequest } from "~/src/ImmutableRequest";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableResponse } from "~/src/ImmutableResponse";
import { Result } from "@ollierelph/result4t";
import { expect, it } from "vitest";
import { Filter, HttpHandler, FilterApply } from "~/src/FilterResult";
import { ImmutableURL } from "~/src/ImmutableURL";

const setHostnameForEnvironment = (env: string) =>
  Filter.from(
    <SuccessIn, FailureIn>(
      next: HttpHandler<SuccessIn, FailureIn>,
    ): HttpHandler<SuccessIn, FailureIn> =>
      async (request: ImmutableRequest) => {
        const finalUrl = request.url.copy({ hostname: `${env}.example.com` });
        return next(request.copy({ url: finalUrl }));
      },
  );

const addAuth = () =>
  Filter.from(
    <SuccessIn, FailureIn>(
      next: HttpHandler<SuccessIn, FailureIn>,
    ): HttpHandler<SuccessIn, FailureIn> =>
      (request: ImmutableRequest) => {
        const finalHeaders = request.headers.append(
          "Authorization",
          "Basic 123",
        );
        return next(request.copy({ headers: finalHeaders }));
      },
  );

const alwaysStatusAndReflectRequest =
  (status: StatusCode): HttpHandler<ImmutableResponse, Error> =>
  async (req: ImmutableRequest) =>
    Result.success(
      ImmutableResponse.of(null, {
        status,
        url: req.url,
        headers: req.headers,
      }),
    );

it("can build a filter chain", async () => {
  const chain: Filter<ImmutableResponse, Error, StatusCode, Error> =
    setHostnameForEnvironment("stg")
      .then(addAuth())
      .then(
        Filter.from(
          (
            next: HttpHandler<ImmutableResponse, Error>,
          ): HttpHandler<StatusCode, Error> =>
            (request: ImmutableRequest) =>
              next(request).then((res) => res.map((it) => it.status)),
        ),
      );
  const client = chain.apply(alwaysStatusAndReflectRequest(StatusCode.OK));
  const response = await client(
    ImmutableRequest.get(ImmutableURL.fromPathname("/")),
  );
  expect(response.isSuccess()).toEqual(true);
  expect(response.get()).toHaveProperty("status", StatusCode.OK);
});
