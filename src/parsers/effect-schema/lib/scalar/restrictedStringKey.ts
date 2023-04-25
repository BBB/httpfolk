import * as S from "@effect/schema/Schema";

export const restrictedStringKey = S.pattern(/^[a-zA-Z0-9.\-_]+$/)(S.string);
