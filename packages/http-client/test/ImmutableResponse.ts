import { expect, it } from "vitest";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { ImmutableURL } from "~/src/ImmutableURL";
import { ImmutableResponse } from "~/src/ImmutableResponse";
import { Response } from "undici";

it("allows filtering of the status", () => {
  const underTest = ImmutableResponse.fromResponse(
    new Response(null, { status: 200 }),
  );
  const status = underTest.status;
  if (status.is2xx()) {
    status.value;
  }
});
