import * as S from "@effect/schema/Schema";
import { ExternalDocumentationObject } from "./ExternalDocumentationObject";
import { ReferenceObject, referenceOr } from "./ReferenceObject";
import { ParameterObject } from "./ParameterObject";
import { RequestBodyObject } from "./RequestBodyObject";
import { ResponsesObject } from "./ResponsesObject";
import { CallbackObject } from "./CallbackObject";
import { SecurityRequirementObject } from "./SecurityRequirementObject";
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
export const OperationObject: S.Schema<any, OperationObject> = S.lazy(() =>
  S.struct({
    tags: S.optional(S.array(S.string)),
    summary: S.optional(S.string),
    description: S.optional(S.string),
    externalDocs: S.optional(ExternalDocumentationObject),
    operationId: S.optional(S.string),
    parameters: S.optional(S.array(referenceOr(ParameterObject))),
    requestBody: S.optional(S.array(referenceOr(RequestBodyObject))),
    responses: S.optional(ResponsesObject),
    callbacks: S.optional(S.record(S.string, referenceOr(CallbackObject))),
    deprecated: S.optional(S.boolean),
    security: S.optional(S.array(SecurityRequirementObject)),
    servers: S.optional(S.array(ServerObject)),
  })
);
