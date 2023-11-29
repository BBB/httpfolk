import { ImmutableRequest } from "~/src/ImmutableRequest";
import { Task } from "@ollierelph/result4t";

export type FilterApply<ReturnIn, ReturnOut> = (
  next: HttpHandler<ReturnIn>,
) => HttpHandler<ReturnOut>;

export type HttpHandler<Return> = (request: ImmutableRequest) => Return;

export class Filter<
  Fn extends FilterApply<any, any>,
  ReturnIn = Fn extends FilterApply<infer R, any> ? R : never,
  ReturnOut = Fn extends FilterApply<any, infer R> ? R : never,
> {
  #task: Task<[input: HttpHandler<ReturnIn>], HttpHandler<ReturnOut>>;
  protected constructor(fn: FilterApply<ReturnIn, ReturnOut>) {
    this.#task = Task.of(fn);
  }
  static from<Fn extends FilterApply<any, any>>(fn: Fn) {
    return new Filter<Fn>(fn);
  }

  then<
    Other extends Filter<FilterApply<any, ReturnIn>>,
    ReturnIn2 = Other extends Filter<
      FilterApply<any, ReturnIn>,
      infer R,
      ReturnIn
    >
      ? R
      : never,
  >(otherFilter: Other) {
    return new Filter((next: HttpHandler<ReturnIn2>) =>
      this.#task.call(otherFilter.apply(next)),
    );
  }

  apply(filter: HttpHandler<ReturnIn>): HttpHandler<ReturnOut> {
    return this.#task.call(filter);
  }
}
