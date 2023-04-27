import { visitOpenApi } from "./visitOpenApi";
import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";
import { PathsObject } from "../parsers/effect-schema/schemas/PathsObject";

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
