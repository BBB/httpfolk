import { OperationObject, OperationObjectCodec } from "./OperationObject";
import { ServerObject } from "./ServerObject";
import { ParameterObject, ParameterObjectCodec } from "./ParameterObject";
import { ReferenceObject, ReferenceObjectCodec } from "./ReferenceObject";
import * as S from "@effect/schema/Schema";

export type PathItemObject = {
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ReadonlyArray<ServerObject>;
  parameters?: ReadonlyArray<ParameterObject | ReferenceObject>;
};

export const PathItemObjectCodec: S.Schema<any, PathItemObject> = S.lazy(() =>
  S.struct({
    summary: S.optional(S.string),
    description: S.optional(S.string),
    get: S.optional(OperationObjectCodec),
    put: S.optional(OperationObjectCodec),
    post: S.optional(OperationObjectCodec),
    delete: S.optional(OperationObjectCodec),
    options: S.optional(OperationObjectCodec),
    head: S.optional(OperationObjectCodec),
    patch: S.optional(OperationObjectCodec),
    trace: S.optional(OperationObjectCodec),
    servers: S.optional(S.array(ServerObject)),
    parameters: S.optional(
      S.array(S.union(ParameterObjectCodec, ReferenceObjectCodec))
    ),
  })
);
