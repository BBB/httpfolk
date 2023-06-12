import { EffectSchema } from "~/src/parsers/effect-schema/EffectSchema";
import {
  buildOpenApi,
  OpenApiObject,
} from "~/src/parsers/effect-schema/schemas/OpenApiObject";
import { EffectBuilder } from "~/src/builders/effect-schema/EffectBuilder";

export const run = (
  parser = EffectSchema.for(OpenApiObject),
  Builder = EffectBuilder
) => {
  const input = buildOpenApi();
  return parser.parse(input).map((openApi) => new Builder().build(openApi));
};
