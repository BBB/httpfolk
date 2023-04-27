import * as S from "@effect/schema/Schema";
import { Schema } from "@effect/schema/Schema";
import { ParseOptions } from "@effect/schema/AST";
import { ParseError } from "@effect/schema/ParseResult";
import { Result } from "./Result";

export const decodeToResult = <In, Out>(schema: Schema<In, Out>) => {
  const decodeSchema = S.parseEither(schema);
  return (input: unknown, options?: ParseOptions): Result<Out, ParseError> => {
    return Result.ofEither(decodeSchema(input, options));
  };
};
