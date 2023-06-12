import { Response, visitResponseObjects } from "./visitResponseObjects";
import { OpenApiObject } from "../parsers/effect-schema/schemas/OpenApiObject";
import { ContentObject } from "../parsers/effect-schema/schemas/ContentObject";
import { NodeAndParent } from "~/src/visitor/lib/NodeAndParent";

export class Content implements NodeAndParent<ContentObject, Response> {
  protected constructor(public node: ContentObject, public parent: Response) {}
  static of(definition: ContentObject, parent: Response) {
    return new Content(definition, parent);
  }
}

export function visitContentObjects<T>(schema: OpenApiObject) {
  const visitParent = visitResponseObjects(schema);
  return (visit: (contentObject: Content) => void) => {
    visitParent((parent) => {
      const content = parent.node.definition.content;
      if (content) {
        visit(Content.of(content, parent));
      }
    });
  };
}
