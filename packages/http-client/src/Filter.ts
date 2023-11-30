import { ImmutableRequest } from "~/src/ImmutableRequest";
import { Task } from "@ollierelph/result4t";

export type HttpHandler<Return> = (request: ImmutableRequest) => Return;

export class Filter<HttpHandlerSignature extends HttpHandler<unknown>> {
  #task: Task<[input: HttpHandlerSignature], HttpHandlerSignature>;
  protected constructor(
    fn: (next: HttpHandlerSignature) => HttpHandlerSignature,
  ) {
    this.#task = Task.of(fn);
  }
  static from<HttpHandlerSignature extends HttpHandler<unknown>>(
    fn: (next: HttpHandlerSignature) => HttpHandlerSignature,
  ) {
    return new Filter<HttpHandlerSignature>(fn);
  }
  then<Other extends Filter<HttpHandlerSignature>>(otherFilter: Other) {
    return new Filter((next: HttpHandlerSignature) =>
      this.#task.call(otherFilter.apply(next)),
    );
  }
  apply(filter: HttpHandlerSignature): HttpHandlerSignature {
    return this.#task.call(filter);
  }
}
