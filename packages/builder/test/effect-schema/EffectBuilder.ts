import { expect, it } from "vitest";
import { EffectBuilder } from "~/src/effect-schema/EffectBuilder";
import {
  buildOpenApi,
  EffectSchema,
  OpenApiObjectCodec,
} from "@ollierelph/openapi-parser";
import { TypeScriptProgram } from "~/test/lib/TypeScriptProgram";

it("should create a paths dictionary", () => {
  const result = underTest();
  expect(result.get()).toMatchInlineSnapshot(
    `
    // typescript
    import * as S from "@effect/schema/Schema";
    export const paths = {};
  `,
  );
});

class BuildFailure {
  constructor(public inner: unknown) {}
}
const underTest = (
  parser = EffectSchema.for(OpenApiObjectCodec),
  Builder = EffectBuilder,
) => {
  const input = buildOpenApi();
  return parser
    .parse(input)
    .mapFailure((inner) => new BuildFailure(inner))
    .flatMap((openApi) =>
      new Builder()
        .build(openApi)
        .mapFailure((inner) => new BuildFailure(inner)),
    )
    .map(TypeScriptProgram.of);
};
