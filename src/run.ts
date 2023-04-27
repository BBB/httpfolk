import { EffectSchema } from "~/src/parsers/effect-schema/EffectSchema";
import {
  buildOpenApi,
  OpenApi,
} from "~/src/parsers/effect-schema/schemas/OpenApi";
import { EffectBuilder } from "~/src/builders/effect-schema/EffectBuilder";

export const run = (
  parser = EffectSchema.for(OpenApi),
  Builder = EffectBuilder
) => {
  const input = buildOpenApi();
  return parser.parse(input).map((openApi) => new Builder().build(openApi));
};
