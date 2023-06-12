import { getReference } from "./getReference";
import { Operation, visitOperationObjects } from "./visitOperationObjects";
import { OpenApiObject } from "../parsers/effect-schema/schemas/OpenApiObject";
import { ResponseObject } from "../parsers/effect-schema/schemas/ResponseObject";
import { isReferenceObject } from "../parsers/effect-schema/schemas/ReferenceObject";
import { OperationObject } from "../parsers/effect-schema/schemas/OperationObject";
import { NodeAndParent } from "~/src/visitor/lib/NodeAndParent";

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
