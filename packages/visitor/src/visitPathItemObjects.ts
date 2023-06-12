import { getReference } from "./getReference";
import { Paths, visitPathsObject } from "./visitPathsObject";
import { OpenApiObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/OpenApiObject";
import { PathItemObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/PathItemObject";
import { isReferenceObject } from "@ollierelph/openapi-parser/src/parsers/effect-schema/schemas/ReferenceObject";
import { NodeAndParent } from "./lib/NodeAndParent";

type PathItemNode = { path: string; definition: PathItemObject };

export class PathItem implements NodeAndParent<PathItemNode, Paths> {
  protected constructor(public node: PathItemNode, public parent: Paths) {}
  static of(path: string, definition: PathItemObject, parent: Paths) {
    return new PathItem({ path, definition }, parent);
  }
}
export function visitPathItemObjects<T>(schema: OpenApiObject) {
  const goto = getReference(schema);
  const visitParent = visitPathsObject(schema);
  return (visit: (pathItemObject: PathItem) => void) => {
    visitParent((parent) => {
      Object.entries(parent.node).forEach(([path, pathItem]) =>
        isReferenceObject(pathItem)
          ? goto(pathItem, PathItemObject).map((definition) =>
              visit(PathItem.of(path, definition, parent))
            )
          : visit(PathItem.of(path, pathItem, parent))
      );
    });
  };
}
