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
    import * as S from "@effect/schema/Schema";
    export const paths = {
      get: {
        "/a": {
          responses: S.union(
            S.struct({
              status: S.literal(200),
              contentType: S.literal("application/json"),
              body: S.struct(),
            })
          ),
        },
        "/b": {
          responses: S.union(
            S.struct({
              status: S.literal(200),
              contentType: S.literal("application/json"),
              body: S.struct(),
            })
          ),
        },
      },
      post: {
        "/a": {
          responses: S.union(
            S.struct({
              status: S.literal(200),
              contentType: S.literal("application/json"),
              body: S.struct(),
            })
          ),
        },
        "/b": {
          responses: S.union(
            S.struct({
              status: S.literal(200),
              contentType: S.literal("application/json"),
              body: S.struct(),
            })
          ),
        },
      },
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
