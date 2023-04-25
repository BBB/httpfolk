import * as S from "@effect/schema/Schema";
import { MediaTypeObject } from "./MediaTypeObject";

export const ContentObject = S.record(S.string, MediaTypeObject);
export type ContentObject = S.To<typeof ContentObject>;
