import { OperationObject } from "./OperationObject";
import { ServerObject } from "./ServerObject";
import { ParameterObject } from "./ParameterObject";
import { ReferenceObject } from "./ReferenceObject";
import * as S from "@effect/schema/Schema";

interface PathItemObject {
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
}

export const PathItemObject: S.Schema<any, PathItemObject> = S.lazy(() =>
  S.struct({
    summary: S.optional(S.string),
    description: S.optional(S.string),
    get: S.optional(OperationObject),
    put: S.optional(OperationObject),
    post: S.optional(OperationObject),
    delete: S.optional(OperationObject),
    options: S.optional(OperationObject),
    head: S.optional(OperationObject),
    patch: S.optional(OperationObject),
    trace: S.optional(OperationObject),
    servers: S.optional(S.array(ServerObject)),
    parameters: S.optional(S.array(S.union(ParameterObject, ReferenceObject))),
  })
);
