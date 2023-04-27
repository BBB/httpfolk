import { visitPathItemObjects } from "./visitPathItemObjects";
import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";
import { OperationObject } from "../parsers/effect-schema/schemas/OperationObject";

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
  return (
    visit: (
      method: (typeof operationNames)[number],
      operationObject: OperationObject
    ) => void
  ) => {
    visitParent((parent) => {
      operationNames.forEach((operationName) => {
        const operation = parent[operationName];
        if (operation) {
          visit(operationName, operation);
        }
      });
    });
  };
}
