import * as S from "@effect/schema/Schema";
import { MediaTypeObjectCodec } from "./MediaTypeObject";

export const ContentObjectCodec = S.record(S.string, MediaTypeObjectCodec);
export type ContentObject = S.Schema.To<typeof ContentObjectCodec>;
