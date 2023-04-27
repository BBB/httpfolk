import { OpenApi } from "../parsers/effect-schema/schemas/OpenApi";

export const visitOpenApi = (schema: OpenApi) => {
  return (visit: (openApi: OpenApi) => void) => {
    visit(schema);
  };
};
