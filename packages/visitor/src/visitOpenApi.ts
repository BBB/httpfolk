import { OpenApiObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";
import { NodeAndParent } from "./lib/NodeAndParent";

type OpenApiNode = OpenApiObject;

export class OpenApi implements NodeAndParent<OpenApiNode> {
  public parent = null;
  protected constructor(public node: OpenApiNode) {}
  static of(definition: OpenApiObject) {
    return new OpenApi(definition);
  }
}
export const visitOpenApi = (schema: OpenApiObject) => {
  return (visit: (openApi: OpenApi) => void) => {
    visit(OpenApi.of(schema));
  };
};
