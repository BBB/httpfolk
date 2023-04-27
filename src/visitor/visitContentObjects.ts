import { visitResponseObjects } from "./visitResponseObjects";
import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";
import { ContentObject } from "../parsers/effect-schema/schemas/ContentObject";

export function visitContentObjects<T>(schema: OpenApi) {
  const visitParent = visitResponseObjects(schema);
  return (visit: (contentObject: ContentObject) => void) => {
    visitParent((parent) => {
      const content = parent.content;
      if (content) {
        visit(content);
      }
    });
  };
}
