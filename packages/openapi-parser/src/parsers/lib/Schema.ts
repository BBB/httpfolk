import { Result } from "@ollierelph/result4t";

export class InvalidInput {
  name = "InvalidInput" as const;
  constructor(public issue: string) {}
}
export interface Schema<Out> {
  parse(input: unknown): Result<Out, InvalidInput>;
}
