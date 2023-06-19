import { OpenApi, visitOpenApi } from "./visitOpenApi";
import { OpenApiObject, PathsObject } from "@ollierelph/openapi-parser";
import { NodeAndParent } from "./lib/NodeAndParent";

type PathsObjectNode = PathsObject;

export class Paths implements NodeAndParent<PathsObjectNode, OpenApi> {
  protected constructor(public node: PathsObjectNode, public parent: OpenApi) {}
  static of(definition: PathsObject, parent: OpenApi) {
    return new Paths(definition, parent);
  }
}
export function visitPathsObject<T>(schema: OpenApiObject) {
  const visitParent = visitOpenApi(schema);
  return (visit: (paths: Paths) => void) => {
    visitParent((parent) => {
      if (schema.paths) {
        visit(Paths.of(schema.paths, parent));
      }
    });
  };
}
