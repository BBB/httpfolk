import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { visitOpenApi } from "./visitOpenApi";
import { PathsObject } from "../parsers/effect-schema/PathsObject";

export function visitPathsObject<T>(schema: OpenApi) {
  const visitParent = visitOpenApi(schema);
  return (visit: (pathsObject: PathsObject) => void) => {
    visitParent((parent) => {
      if (schema.paths) {
        visit(schema.paths);
      }
    });
  };
}
