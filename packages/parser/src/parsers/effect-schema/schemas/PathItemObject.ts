import { OperationObject, OperationObjectCodec } from "./OperationObject";
import { ServerObject } from "./ServerObject";
import { ParameterObject, ParameterObjectCodec } from "./ParameterObject";
import { ReferenceObject, ReferenceObjectCodec } from "./ReferenceObject";
import * as S from "@effect/schema/Schema";

export const httpVerbsWithBody = ["put", "post", "patch"] as const;
export const httpVerbs = [
  "put",
  "post",
  "patch",
  "get",
  "delete",
  "options",
  "head",
  "trace",
] as const;

export type HttpVerb = (typeof httpVerbs)[number];

export type PathItemObject = {
  summary?: string;
  description?: string;
  servers?: ReadonlyArray<ServerObject>;
  parameters?: ReadonlyArray<ParameterObject | ReferenceObject>;
} & Partial<Record<HttpVerb, OperationObject>>;

export const PathItemObjectCodec: S.Schema<any, PathItemObject> = S.lazy(() =>
  S.struct(
    httpVerbs.reduce(
      (agg, verb) => ({
        ...agg,
        [verb]: S.optional(OperationObjectCodec),
      }),
      {
        summary: S.optional(S.string),
        description: S.optional(S.string),
        servers: S.optional(S.array(ServerObject)),
        parameters: S.optional(
          S.array(S.union(ParameterObjectCodec, ReferenceObjectCodec)),
        ),
      },
    ),
  ),
);
