import * as S from "@effect/schema/Schema";
import { InfoObject } from "./InfoObject";
import { ServerObject } from "./ServerObject";
import { PathsObject } from "./PathsObject";
import { ComponentsObject } from "./ComponentsObject";

export const OpenApi = S.struct({
  openapi: S.union(S.literal("3.0.0"), S.literal("3.0.1"), S.literal("3.1.0")), // https://spec.openapis.org/oas/v3.1.0.html
  info: InfoObject,
  jsonSchemaDialect: S.optional(S.string),
  servers: S.optional(S.array(ServerObject)),
  components: S.optional(ComponentsObject),
  paths: S.optional(PathsObject),
});
export type OpenApi = S.To<typeof OpenApi>;

export function buildOpenApi(): OpenApi {
  return {
    openapi: "3.1.0",
    info: {
      title: "My Schema",
      version: "1",
    },
    servers: [],
    paths: {
      "/a": {
        get: {
          responses: {
            "200": {
              description: "lists the a",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/a",
                  },
                },
              },
            },
          },
        },
      },
      "/b": {
        get: {
          responses: {
            "200": {
              description: "lists the b",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/b",
                  },
                },
              },
            },
          },
        },
      },
      "/c": {
        post: {
          responses: {
            "200": {
              description: "creates the c",
              content: {
                "application/json": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        a: {
          type: "string",
        },
        b: {
          type: "string",
        },
      },
    },
  };
}
