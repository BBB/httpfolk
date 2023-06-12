import { it, expect } from "vitest";
import { EffectBuilder } from "~/src/effect-schema/EffectBuilder";
import { EffectSchema } from "@ollierelph/openapi-parser/src/parsers/effect-schema/EffectSchema";
import {
  OpenApiObject,
  buildOpenApi,
} from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";

it("should create a paths dictionary", () => {
  expect(underTest().get()).toEqual("");
});

class BuildFailure {
  constructor(public inner: unknown) {}
}
const underTest = (
  parser = EffectSchema.for(OpenApiObject),
  Builder = EffectBuilder
) => {
  const input = buildOpenApi();
  return parser
    .parse(input)
    .mapFailure((inner) => new BuildFailure(inner))
    .flatMap((openApi) =>
      new Builder()
        .build(openApi)
        .mapFailure((inner) => new BuildFailure(inner))
    );
};
