import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { getReference } from "./getReference";
import { visitOperationObjects } from "./visitOperationObjects";
import { ResponseObject } from "../parsers/effect-schema/ResponseObject";
import { isReferenceObject } from "../parsers/effect-schema/ReferenceObject";
import { OperationObject } from "../parsers/effect-schema/OperationObject";

export function visitResponseObjects<T>(schema: OpenApi) {
  const goto = getReference(schema);
  const visitParent = visitOperationObjects(schema);
  return (visit: (operationObject: ResponseObject) => void) => {
    visitParent((parent) => {
      const responses = parent.responses;
      if (responses) {
        Object.entries(responses).forEach(([statusCode, operationObject]) => {
          isReferenceObject(operationObject)
            ? goto(operationObject, OperationObject).map(visit)
            : visit(operationObject);
        });
      }
    });
  };
}
