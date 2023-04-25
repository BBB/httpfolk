import { OpenApi } from "../parsers/effect-schema/OpenApi";
import { visitResponseObjects } from "./visitResponseObjects";
import { ContentObject } from "../parsers/effect-schema/ContentObject";

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
