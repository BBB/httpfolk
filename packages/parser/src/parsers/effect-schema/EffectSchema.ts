import { decodeToResult } from "./lib/decodeToResult";
import { InvalidInput, Schema } from "../lib/Schema";
import * as S from "@effect/schema/Schema";
import { ParseError } from "@effect/schema/ParseResult";
import { Result } from "./lib/Result";
import { ParseOptions } from "@effect/schema/AST";
import { formatErrors } from "@effect/schema/TreeFormatter";

export class EffectSchema<
  TheSchema extends S.Schema<any>,
  Out = TheSchema extends S.Schema<infer R> ? R : never,
> implements Schema<Out>
{
  private readonly decoder: (
    input: unknown,
    options?: ParseOptions,
  ) => Result<Out, ParseError>;

  protected constructor(private theSchema: TheSchema) {
    this.decoder = decodeToResult(this.theSchema);
  }

  parse(input: unknown) {
    return this.decoder(input).mapFailure(
      (err) => new InvalidInput(formatErrors(err.errors)),
    );
  }

  static for<TheSchema extends S.Schema<any>>(schema: TheSchema) {
    return new EffectSchema(schema);
  }
}
