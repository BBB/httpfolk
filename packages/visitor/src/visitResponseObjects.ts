import { getReference } from "./getReference";
import { Operation, visitOperationObjects } from "./visitOperationObjects";
import {
  isReferenceObject,
  OpenApiObject,
  OperationObject,
  ResponseObject,
} from "@ollierelph/openapi-parser";
import { NodeAndParent } from "./lib/NodeAndParent";

type ResponseNode = {
  statusCode: string;
  definition: ResponseObject;
};

export class Response implements NodeAndParent<ResponseNode, Operation> {
  protected constructor(public node: ResponseNode, public parent: Operation) {}
  static of(statusCode: string, definition: ResponseObject, parent: Operation) {
    return new Response({ statusCode, definition }, parent);
  }
}

export function visitResponseObjects<T>(schema: OpenApiObject) {
  const goto = getReference(schema);
  const visitParent = visitOperationObjects(schema);
  return (visit: (response: Response) => void) => {
    visitParent((parent) => {
      const responses = parent.node.definition.responses;
      if (responses) {
        Object.entries(responses).forEach(([statusCode, responseObject]) => {
          isReferenceObject(responseObject)
            ? goto(responseObject, OperationObject).map(visit)
            : visit(Response.of(statusCode, responseObject, parent));
        });
      }
    });
  };
}
