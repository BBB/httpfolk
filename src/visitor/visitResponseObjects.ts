import { getReference } from "./getReference";
import { visitOperationObjects } from "./visitOperationObjects";
import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";
import { ResponseObject } from "../parsers/effect-schema/schemas/ResponseObject";
import { isReferenceObject } from "../parsers/effect-schema/schemas/ReferenceObject";
import { OperationObject } from "../parsers/effect-schema/schemas/OperationObject";

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
