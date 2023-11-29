import { ImmutableResponse } from "~/src/ImmutableResponse";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { Result, Task } from "@ollierelph/result4t";

type FilterApply = <SuccessIn, FailureIn, SuccessOut, FailureOut>(
  next: HttpHandler<SuccessIn, FailureIn>,
) => HttpHandler<SuccessOut, FailureOut>;

export type HttpHandler<Success, Failure> = (
  request: ImmutableRequest,
) => Promise<Result<Success, Failure>>;

export class Filter<SuccessOut, FailureOut> {
  #task: Task<[input: ImmutableRequest], Result<SuccessOut, FailureOut>>;
  protected constructor(
    fn: (input: ImmutableRequest) => Promise<Result<SuccessOut, FailureOut>>,
  ) {
    this.#task = Task.of(fn);
  }
  static of<
    Fn extends HttpHandler<any, any>,
    Output extends Result<any, any> = Fn extends (
      ...args: any[]
    ) => Promise<infer R>
      ? R
      : never,
    SuccessOut = Output extends Result<infer R, any> ? R : never,
    FailureOut = Output extends Result<any, infer R> ? R : never,
  >(fn: Fn) {
    return new Filter<SuccessOut, FailureOut>(fn);
  }

  static fromTask<
    Task2 extends Task<[request: ImmutableRequest], Result<any, any>>,
    SuccessOut = Task2 extends Task<
      [request: ImmutableRequest],
      Result<infer R, any>
    >
      ? R
      : never,
    FailureOut = Task2 extends Task<
      [request: ImmutableRequest],
      Result<any, infer R>
    >
      ? R
      : never,
  >(task2: Task2) {
    return new Filter<SuccessOut, FailureOut>(task2.call.bind(task2));
  }

  static alwaysRespondWith(response: ImmutableResponse) {
    return Filter.of(async (request: ImmutableRequest) =>
      Result.success<ImmutableResponse, Error>(response),
    );
  }

  map<Output extends Result<any, any>>(
    predicate: (
      value: (
        input: ImmutableRequest,
      ) => Promise<Result<SuccessOut, FailureOut>>,
    ) => (input: ImmutableRequest) => Promise<Output>,
  ) {
    return Filter.of(predicate(this.#task.call.bind(this.#task)));
  }

  mapRequest(
    predicate: (input: ImmutableRequest) => ImmutableRequest,
  ): Filter<SuccessOut, FailureOut> {
    return Filter.fromTask(
      this.#task.map((next) => (req: ImmutableRequest) => next(predicate(req))),
    );
  }

  mapResponse<
    Output extends Result<any, any>,
    Success2 = Output extends Result<infer R, any> ? R : never,
    Failure2 = Output extends Result<any, infer R> ? R : never,
  >(
    predicate: (result: Result<SuccessOut, FailureOut>) => Promise<Output>,
  ): Filter<Success2, Failure2> {
    const task2 = this.#task.map((next) => {
      const newVar: (req: ImmutableRequest) => Promise<Output> = (
        req: ImmutableRequest,
      ) => next(req).then(predicate);
      return newVar;
    });
    return Filter.fromTask(task2);
  }
  call(request: ImmutableRequest): Promise<Result<SuccessOut, FailureOut>> {
    return this.#task.call(request);
  }
}
