import { ImmutableResponse } from "~/src/ImmutableResponse";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { Result, Task } from "@ollierelph/result4t";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableURL } from "~/src/ImmutableURL";

export class Filter<Success, Failure> {
  #task: Task<[input: ImmutableRequest], Result<Success, Failure>>;
  protected constructor(
    fn: (input: ImmutableRequest) => Promise<Result<Success, Failure>>,
  ) {
    this.#task = Task.of(fn);
  }
  static of<
    Fn extends (request: ImmutableRequest) => Promise<Result<any, any>>,
    Output extends Result<any, any> = Fn extends (
      ...args: any[]
    ) => Promise<infer R>
      ? R
      : never,
    Success = Output extends Result<infer R, any> ? R : never,
    Failure = Output extends Result<any, infer R> ? R : never,
  >(fn: Fn) {
    return new Filter<Success, Failure>(fn);
  }

  static fromTask<
    Task2 extends Task<[request: ImmutableRequest], Result<any, any>>,
    Success = Task2 extends Task<
      [request: ImmutableRequest],
      Result<infer R, any>
    >
      ? R
      : never,
    Failure = Task2 extends Task<
      [request: ImmutableRequest],
      Result<any, infer R>
    >
      ? R
      : never,
  >(task2: Task2) {
    return new Filter<Success, Failure>(task2.call.bind(task2));
  }

  static alwaysRespondWith(response: ImmutableResponse) {
    return Filter.of(async (request: ImmutableRequest) =>
      Result.success<ImmutableResponse, Error>(response),
    );
  }

  map<Output extends Result<any, any>>(
    predicate: (
      value: (input: ImmutableRequest) => Promise<Result<Success, Failure>>,
    ) => (input: ImmutableRequest) => Promise<Output>,
  ) {
    return Filter.of(predicate(this.#task.call.bind(this.#task)));
  }

  mapRequest(
    predicate: (input: ImmutableRequest) => ImmutableRequest,
  ): Filter<Success, Failure> {
    return Filter.fromTask(
      this.#task.map((next) => (req: ImmutableRequest) => next(predicate(req))),
    );
  }

  mapResponse<
    Output extends Result<any, any>,
    Success2 = Output extends Result<infer R, any> ? R : never,
    Failure2 = Output extends Result<any, infer R> ? R : never,
  >(
    predicate: (result: Result<Success, Failure>) => Promise<Output>,
  ): Filter<Success2, Failure2> {
    const task2 = this.#task.map((next) => {
      const newVar: (req: ImmutableRequest) => Promise<Output> = (
        req: ImmutableRequest,
      ) => next(req).then(predicate);
      return newVar;
    });
    return Filter.fromTask(task2);
  }
  call(request: ImmutableRequest): Promise<Result<Success, Failure>> {
    return this.#task.call(request);
  }
}

const f = Filter.alwaysRespondWith(
  ImmutableResponse.of(null, {
    status: StatusCode.OK,
  }),
)
  .mapRequest((req) => req.copy({ headers: req.headers.append("woo", "hoo") }))
  .mapResponse(async (res): Promise<Result<boolean, Error>> => {
    return res.map((res) => false);
  })
  .map((next) => (request: ImmutableRequest) => next(request))
  .call(ImmutableRequest.get(ImmutableURL.fromPathname(`/}`)))
  .then((result) =>
    result.getOrElse((err) => {
      throw err;
    }),
  );

class Boo {}

const result = Task.of(
  async (
    request: ImmutableRequest,
  ): Promise<Result<ImmutableResponse, Error>> =>
    Result.success(ImmutableResponse.of(null, { status: StatusCode.OK })),
)
  .map(
    (next) =>
      (request: ImmutableRequest): Promise<Result<Boo, Error>> =>
        next(request).then((result) => result.map(() => new Boo())),
  )
  .flatMap((next) =>
    Task.of(async (input: number) =>
      next(ImmutableRequest.get(ImmutableURL.fromPathname(`/${input}`))),
    ),
  );

const a = result.call(5);
