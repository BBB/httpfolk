import { ImmutableRequest } from "~/src/ImmutableRequest";
import { Result, Task } from "@ollierelph/result4t";

export type FilterApply<SuccessIn, FailureIn, SuccessOut, FailureOut> = (
  next: HttpHandler<SuccessIn, FailureIn>,
) => HttpHandler<SuccessOut, FailureOut>;

export type HttpHandler<Success, Failure> = (
  request: ImmutableRequest,
) => Promise<Result<Success, Failure>>;

export class Filter<SuccessIn, FailureIn, SuccessOut, FailureOut> {
  #task: Task<
    [input: HttpHandler<SuccessIn, FailureIn>],
    HttpHandler<SuccessOut, FailureOut>
  >;
  protected constructor(
    fn: FilterApply<SuccessIn, FailureIn, SuccessOut, FailureOut>,
  ) {
    this.#task = Task.of(fn);
  }
  static from<
    Fn extends FilterApply<any, any, any, any>,
    SuccessIn = Fn extends FilterApply<infer R, any, any, any> ? R : never,
    FailureIn = Fn extends FilterApply<any, infer R, any, any> ? R : never,
    SuccessOut = Fn extends FilterApply<any, any, infer R, any> ? R : never,
    FailureOut = Fn extends FilterApply<any, any, any, infer R> ? R : never,
  >(fn: Fn) {
    return new Filter<SuccessIn, FailureIn, SuccessOut, FailureOut>(fn);
  }

  then<
    Other extends Filter<any, any, SuccessIn, FailureIn>,
    SuccessIn2 = Other extends Filter<infer R, any, SuccessIn, FailureIn>
      ? R
      : never,
    FailureIn2 = Other extends Filter<any, infer R, SuccessIn, FailureIn>
      ? R
      : never,
  >(filter: Other) {
    return new Filter<SuccessIn2, FailureIn2, SuccessOut, FailureOut>((other) =>
      this.#task.call(filter.apply(other)),
    );
  }

  apply(
    filter: HttpHandler<SuccessIn, FailureIn>,
  ): HttpHandler<SuccessOut, FailureOut> {
    return this.#task.call(filter);
  }
}
