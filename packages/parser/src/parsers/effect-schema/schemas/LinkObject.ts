import * as S from "@effect/schema/Schema";
import { ServerObject } from "./ServerObject";

export const LinkObjectCodec = S.struct({
  operationRef: S.optional(S.string),
  operationId: S.optional(S.string),
  parameters: S.optional(S.record(S.string, S.any)),
  requestBody: S.optional(S.any),
  description: S.optional(S.string),
  server: S.optional(ServerObject),
});
export type LinkObject = S.Schema.To<typeof LinkObjectCodec>;
