import { Result } from "@ollierelph/result4t";

export class BuildFailure {
  name = "BuildFailure" as const;
}

export interface Builder {
  build(input: unknown): Result<string, BuildFailure>;
}
