import * as S from "@effect/schema/Schema";
import { InfoObjectCodec } from "./InfoObject";
import { ServerObject } from "./ServerObject";
import { PathsObjectCodec } from "./PathsObject";
import { ComponentsObjectCodec } from "./ComponentsObject";

export const OpenApiObjectCodec = S.struct({
  openapi: S.union(S.literal("3.0.0"), S.literal("3.0.1"), S.literal("3.1.0")), // https://spec.openapis.org/oas/v3.1.0.html
  info: InfoObjectCodec,
  jsonSchemaDialect: S.optional(S.string),
  servers: S.optional(S.array(ServerObject)),
  components: S.optional(ComponentsObjectCodec),
  paths: S.optional(PathsObjectCodec),
});
export type OpenApiObject = S.Schema.To<typeof OpenApiObjectCodec>;

export function buildOpenApi(): OpenApiObject {
  return {
    openapi: "3.1.0",
    info: {
      title: "My Schema.ts",
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
          type: "object",
          properties: {
            foo: {
              type: "string",
            },
            bingo: {
              type: "number",
            },
          },
          required: ["foo"],
        },
      },
    },
  };
}
