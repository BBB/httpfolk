import { PathItem, visitPathItemObjects } from "./visitPathItemObjects";
import { OpenApiObject, OperationObject } from "@ollierelph/openapi-parser";
import { NodeAndParent } from "./lib/NodeAndParent";

const allOperationNames = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const;

type OperationName = (typeof allOperationNames)[number];

type OperationNode = { name: string; definition: OperationObject };

export class Operation implements NodeAndParent<OperationNode, PathItem> {
  protected constructor(public node: OperationNode, public parent: PathItem) {}
  static of(
    name: OperationName,
    definition: OperationObject,
    parent: PathItem
  ) {
    return new Operation({ name, definition }, parent);
  }
}

export function visitOperationObjects<T>(
  schema: OpenApiObject,
  operations: readonly OperationName[] = allOperationNames
) {
  const visitParent = visitPathItemObjects(schema);
  return (visit: (operation: Operation) => void) => {
    visitParent((parent) => {
      operations.forEach((operationName) => {
        const operation = parent.node.definition[operationName];
        if (operation) {
          visit(Operation.of(operationName, operation, parent));
        }
      });
    });
  };
}
