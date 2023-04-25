import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { visitPathItemObjects } from "./visitPathItemObjects";
import { OperationObject } from "../parsers/effect-schema/OperationObject";

const operationNames = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const;

export function visitOperationObjects<T>(schema: OpenApi) {
  const visitParent = visitPathItemObjects(schema);
  return (visit: (operationObject: OperationObject) => void) => {
    visitParent((parent) => {
      operationNames.forEach((operationName) => {
        const operation = parent[operationName];
        if (operation) {
          visit(operation);
        }
      });
    });
  };
}