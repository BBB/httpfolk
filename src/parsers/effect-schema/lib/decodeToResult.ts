import { decodeEither, Schema } from "@effect/schema/Schema";
import { ParseOptions } from "@effect/schema/AST";
import { ParseError } from "@effect/schema/ParseResult";
import { Result } from "./Result";

export const decodeToResult = <In, Out>(schema: Schema<In, Out>) => {
  const decodeSchema = decodeEither(schema);
  return (input: In, options?: ParseOptions): Result<Out, ParseError> => {
    return Result.ofEither(decodeSchema(input, options));
  };
};
