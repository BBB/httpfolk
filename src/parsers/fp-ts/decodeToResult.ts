import { Schema } from "@fp-ts/schema/Schema";
import { decode, ParseOptions } from "@fp-ts/schema/Parser";
import { Result } from "@ollierelph/result4t";
import { ParseError } from "@fp-ts/schema/ParseError";

export const decodeToResult = <Success>(schema: Schema<Success>) => {
  const decodeSchema = decode(schema);
  return (
    input: unknown,
    options?: ParseOptions
  ): Result<Success, ReadonlyArray<ParseError>> => {
    const either = decodeSchema(input, options);
    return either._tag === "Right"
      ? Result.success(either.right)
      : Result.failure(either.left);
  };
};
