import { ImmutableRequest } from "~/src/ImmutableRequest";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableResponse } from "~/src/ImmutableResponse";
import { expect, it } from "vitest";
import { Filter, HttpHandler } from "~/src/Filter";
import { ImmutableURL } from "~/src/ImmutableURL";

const setHostnameForEnvironment = (env: string) =>
  Filter.from((next) => async (request: ImmutableRequest) => {
    const finalUrl = request.url.copy({ hostname: `${env}.example.com` });
    return next(request.copy({ url: finalUrl }));
  });

const addAuth = Filter.from((next) => async (request: ImmutableRequest) => {
  const finalHeaders = request.headers.append("Authorization", "Basic 123");
  return next(request.copy({ headers: finalHeaders }));
});

const alwaysStatusAndReflectRequest =
  (status: StatusCode): HttpHandler =>
  async (req) =>
    ImmutableResponse.of(null, {
      status,
      url: req.url,
      headers: req.headers,
    });

it("can build a filter chain", async () => {
  const myClient = setHostnameForEnvironment("stg")
    .then(addAuth)
    .apply(alwaysStatusAndReflectRequest(StatusCode.OK));

  const response = await myClient(
    ImmutableRequest.get(ImmutableURL.fromPathname("/woo")),
  );
  expect(response.status.value).toEqual(200);
  expect(response.url.toString()).toEqual("http://stg.example.com/woo");
  expect(response.headers.get("Authorization")).toEqual("Basic 123");
});

it("applies filters top down", async () => {
  const myClient = setHostnameForEnvironment("stg")
    .then(setHostnameForEnvironment("prd"))
    .apply(alwaysStatusAndReflectRequest(StatusCode.OK));

  const response = await myClient(
    ImmutableRequest.get(ImmutableURL.fromPathname("/woo")),
  );
  expect(response.url.toString()).toEqual("http://prd.example.com/woo");
});
