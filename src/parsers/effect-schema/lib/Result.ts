import { Result as Result4t } from "@ollierelph/result4t";

export type Result<S, F> = Result4t<S, F>;
type Either<L, R> = { _tag: "Left"; left: L } | { _tag: "Right"; right: R };
export const Result = {
  ...Result4t,
  ofEither<S, F>(either: Either<F, S>): Result4t<S, F> {
    return either._tag === "Right"
      ? Result4t.success(either.right)
      : Result4t.failure(either.left);
  },
};
