import { it } from "vitest";

import { EffectSchema } from "~/src/parsers/effect-schema/EffectSchema";
import {
  buildOpenApi,
  OpenApiObject,
} from "~/src/parsers/effect-schema/schemas/OpenApiObject";

it.each([
  [buildOpenApi()],
  [
    // From https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.json
    {
      openapi: "3.1.0",
      info: {
        title: "Webhook Example",
        version: "1.0.0",
      },
      webhooks: {
        newPet: {
          post: {
            requestBody: {
              description: "Information about a new pet in the system",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Pet",
                  },
                },
              },
            },
            responses: {
              "200": {
                description:
                  "Return a 200 status to indicate that the data was received successfully",
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Pet: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: {
                type: "integer",
                format: "int64",
              },
              name: {
                type: "string",
              },
              tag: {
                type: "string",
              },
            },
          },
        },
      },
    },
  ],
  [
    // From https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.json
    {
      openapi: "3.0.0",
      info: {
        title: "Simple API overview",
        version: "2.0.0",
      },
      paths: {
        "/": {
          get: {
            operationId: "listVersionsv2",
            summary: "List API versions",
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {
                    examples: {
                      foo: {
                        value: {
                          versions: [
                            {
                              status: "CURRENT",
                              updated: "2011-01-21T11:33:21Z",
                              id: "v2.0",
                              links: [
                                {
                                  href: "http://127.0.0.1:8774/v2/",
                                  rel: "self",
                                },
                              ],
                            },
                            {
                              status: "EXPERIMENTAL",
                              updated: "2013-07-23T11:33:21Z",
                              id: "v3.0",
                              links: [
                                {
                                  href: "http://127.0.0.1:8774/v3/",
                                  rel: "self",
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
              "300": {
                description: "300 response",
                content: {
                  "application/json": {
                    examples: {
                      foo: {
                        value:
                          '{\n "versions": [\n       {\n         "status": "CURRENT",\n         "updated": "2011-01-21T11:33:21Z",\n         "id": "v2.0",\n         "links": [\n             {\n                 "href": "http://127.0.0.1:8774/v2/",\n                 "rel": "self"\n             }\n         ]\n     },\n     {\n         "status": "EXPERIMENTAL",\n         "updated": "2013-07-23T11:33:21Z",\n         "id": "v3.0",\n         "links": [\n             {\n                 "href": "http://127.0.0.1:8774/v3/",\n                 "rel": "self"\n             }\n         ]\n     }\n ]\n}\n',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v2": {
          get: {
            operationId: "getVersionDetailsv2",
            summary: "Show API version details",
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {
                    examples: {
                      foo: {
                        value: {
                          version: {
                            status: "CURRENT",
                            updated: "2011-01-21T11:33:21Z",
                            "media-types": [
                              {
                                base: "application/xml",
                                type: "application/vnd.openstack.compute+xml;version=2",
                              },
                              {
                                base: "application/json",
                                type: "application/vnd.openstack.compute+json;version=2",
                              },
                            ],
                            id: "v2.0",
                            links: [
                              {
                                href: "http://127.0.0.1:8774/v2/",
                                rel: "self",
                              },
                              {
                                href: "http://docs.openstack.org/api/openstack-compute/2/os-compute-devguide-2.pdf",
                                type: "application/pdf",
                                rel: "describedby",
                              },
                              {
                                href: "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",
                                type: "application/vnd.sun.wadl+xml",
                                rel: "describedby",
                              },
                              {
                                href: "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",
                                type: "application/vnd.sun.wadl+xml",
                                rel: "describedby",
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
              "203": {
                description: "203 response",
                content: {
                  "application/json": {
                    examples: {
                      foo: {
                        value: {
                          version: {
                            status: "CURRENT",
                            updated: "2011-01-21T11:33:21Z",
                            "media-types": [
                              {
                                base: "application/xml",
                                type: "application/vnd.openstack.compute+xml;version=2",
                              },
                              {
                                base: "application/json",
                                type: "application/vnd.openstack.compute+json;version=2",
                              },
                            ],
                            id: "v2.0",
                            links: [
                              {
                                href: "http://23.253.228.211:8774/v2/",
                                rel: "self",
                              },
                              {
                                href: "http://docs.openstack.org/api/openstack-compute/2/os-compute-devguide-2.pdf",
                                type: "application/pdf",
                                rel: "describedby",
                              },
                              {
                                href: "http://docs.openstack.org/api/openstack-compute/2/wadl/os-compute-2.wadl",
                                type: "application/vnd.sun.wadl+xml",
                                rel: "describedby",
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
] as const)("parses an openApi", (input) => {
  underTest(input);
});

function underTest(value: unknown) {
  return EffectSchema.for(OpenApiObject)
    .parse(value)
    .getOrElse((err) => {
      console.log(err);
      throw err;
    });
}
