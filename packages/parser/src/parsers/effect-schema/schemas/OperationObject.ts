import * as S from "@effect/schema/Schema";
import {
  ExternalDocumentationObject,
  ExternalDocumentationObjectCodec,
} from "./ExternalDocumentationObject";
import { referenceOr, ReferenceObject } from "./ReferenceObject";
import { ParameterObject, ParameterObjectCodec } from "./ParameterObject";
import { RequestBodyObjectCodec, RequestBodyObject } from "./RequestBodyObject";
import { ResponsesObjectCodec, ResponsesObject } from "./ResponsesObject";
import { CallbackObject, CallbackObjectCodec } from "./CallbackObject";
import {
  SecurityRequirementObjectCodec,
  SecurityRequirementObject,
} from "./SecurityRequirementObject";
import { ServerObject } from "./ServerObject";

export type OperationObject = {
  tags?: ReadonlyArray<string>;
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: ReadonlyArray<ReferenceObject | ParameterObject>;
  requestBody?: ReadonlyArray<ReferenceObject | RequestBodyObject>;
  responses?: ResponsesObject;
  callbacks?: Record<string, ReferenceObject | CallbackObject>;
  deprecated?: boolean;
  security?: ReadonlyArray<SecurityRequirementObject>;
  servers?: ReadonlyArray<ServerObject>;
};
export const OperationObjectCodec: S.Schema<any, OperationObject> = S.lazy(() =>
  S.struct({
    tags: S.optional(S.array(S.string)),
    summary: S.optional(S.string),
    description: S.optional(S.string),
    externalDocs: S.optional(ExternalDocumentationObjectCodec),
    operationId: S.optional(S.string),
    parameters: S.optional(S.array(referenceOr(ParameterObjectCodec))),
    requestBody: S.optional(S.array(referenceOr(RequestBodyObjectCodec))),
    responses: S.optional(ResponsesObjectCodec),
    callbacks: S.optional(S.record(S.string, referenceOr(CallbackObjectCodec))),
    deprecated: S.optional(S.boolean),
    security: S.optional(S.array(SecurityRequirementObjectCodec)),
    servers: S.optional(S.array(ServerObject)),
  })
);
