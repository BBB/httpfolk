import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { getReference } from "./getReference";
import { visitPathsObject } from "./visitPathsObject";
import { PathItemObject } from "../parsers/effect-schema/PathItemObject";
import { isReferenceObject } from "../parsers/effect-schema/ReferenceObject";

export function visitPathItemObjects<T>(schema: OpenApi) {
  const goto = getReference(schema);
  const visitParent = visitPathsObject(schema);
  return (visit: (pathItemObject: PathItemObject) => void) => {
    visitParent((parent) => {
      Object.entries(parent).forEach(([path, pathItem]) =>
        isReferenceObject(pathItem)
          ? goto(pathItem, PathItemObject).map(visit)
          : visit(pathItem)
      );
    });
  };
}
