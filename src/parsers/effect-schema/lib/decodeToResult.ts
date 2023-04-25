import { decodeEither, Schema } from "@effect/schema/Schema";
import { ParseOptions } from "@effect/schema/AST";
import { ParseError } from "@effect/schema/ParseResult";
import { Result } from "./Result";

export const decodeToResult = <Success>(schema: Schema<unknown, Success>) => {
  const decodeSchema = decodeEither(schema);
  return (
    input: unknown,
    options?: ParseOptions
  ): Result<Success, ParseError> => {
    return Result.ofEither(decodeSchema(input, options));
  };
};
