import { getReference } from "./getReference";
import { visitContentObjects } from "./visitContentObjects";
import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";
import { MediaTypeObject } from "../parsers/effect-schema/schemas/MediaTypeObject";
import { isReferenceObject } from "../parsers/effect-schema/schemas/ReferenceObject";

export function visitMediaTypeObjects<T>(schema: OpenApi) {
  const goto = getReference(schema);
  const visitParent = visitContentObjects(schema);
  return (visit: (mediaTypeObject: MediaTypeObject) => void) => {
    visitParent((parent) => {
      Object.entries(parent).forEach(([contentType, mediaTypeObject]) => {
        isReferenceObject(mediaTypeObject)
          ? goto(mediaTypeObject, MediaTypeObject).map(visit)
          : visit(mediaTypeObject);
      });
    });
  };
}
