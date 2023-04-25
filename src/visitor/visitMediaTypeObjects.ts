import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { getReference } from "./getReference";
import { visitContentObjects } from "./visitContentObjects";
import { MediaTypeObject } from "../parsers/effect-schema/MediaTypeObject";
import { isReferenceObject } from "../parsers/effect-schema/ReferenceObject";

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
