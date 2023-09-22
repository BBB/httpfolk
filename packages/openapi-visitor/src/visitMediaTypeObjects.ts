import { getReference } from "./getReference";
import { Content, visitContentObjects } from "./visitContentObjects";
import {
  isReferenceObject,
  MediaTypeObject,
  MediaTypeObjectCodec,
  OpenApiObject,
} from "@ollierelph/openapi-parser";
import { NodeAndParent } from "./lib/NodeAndParent";

type MediaTypeNode = {
  contentType: string;
  definition: MediaTypeObject;
};

export class MediaType implements NodeAndParent<MediaTypeNode, Content> {
  protected constructor(
    public node: MediaTypeNode,
    public parent: Content,
  ) {}
  static of(contentType: string, definition: MediaTypeObject, parent: Content) {
    return new MediaType({ contentType, definition }, parent);
  }
}
export function visitMediaTypeObjects<T>(schema: OpenApiObject) {
  const goto = getReference(schema);
  const visitParent = visitContentObjects(schema);
  return (visit: (mediaTypeObject: MediaType) => void) => {
    visitParent((parent) => {
      Object.entries(parent.node).forEach(([contentType, mediaTypeObject]) => {
        isReferenceObject(mediaTypeObject)
          ? goto(mediaTypeObject, MediaTypeObjectCodec).map((definition) =>
              visit(MediaType.of(contentType, definition, parent)),
            )
          : visit(MediaType.of(contentType, mediaTypeObject, parent));
      });
    });
  };
}
