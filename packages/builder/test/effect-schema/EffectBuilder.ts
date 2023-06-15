import { expect, it } from "vitest";
import { EffectBuilder } from "~/src/effect-schema/EffectBuilder";
import { EffectSchema } from "@ollierelph/openapi-parser/src/parsers/effect-schema/EffectSchema";
import {
  buildOpenApi,
  OpenApiObject,
} from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";
import { TypeScriptProgram } from "~/test/lib/TypeScriptProgram";

it("should create a paths dictionary", () => {
  const result = underTest();
  expect(result.get()).toMatchInlineSnapshot(
    `
    // typescript
    export const paths = {
      get: { "/a": { responses: undefined }, "/b": { responses: undefined } },
      post: { "/a": { responses: undefined }, "/b": { responses: undefined } },
    };
  `
  );
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
    )
    .map(TypeScriptProgram.of);
};
