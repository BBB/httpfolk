import { decodeEither, Schema } from "@effect/schema/Schema";
import { Result } from "@ollierelph/result4t";
import { ParseOptions } from "@effect/schema/AST";
import { ParseError } from "@effect/schema/ParseResult";

export const decodeToResult = <Success>(schema: Schema<unknown, Success>) => {
  const decodeSchema = decodeEither(schema);
  return (
    input: unknown,
    options?: ParseOptions
  ): Result<Success, ParseError> => {
    const either = decodeSchema(input, options);
    return either._tag === "Right"
      ? Result.success(either.right)
      : Result.failure(either.left);
  };
};
