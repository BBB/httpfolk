import { ImmutableResponse } from "~/src/ImmutableResponse.js";
import { ImmutableRequest } from "~/src/ImmutableRequest.js";

type FilterApply = (next: HttpHandler) => HttpHandler;

export type HttpHandler = (
  request: ImmutableRequest,
) => Promise<ImmutableResponse>;

export class Filter {
  protected constructor(protected base: FilterApply) {}

  static from(base: FilterApply) {
    return new Filter(base);
  }

  then(filter: Filter): Filter {
    return new Filter((other) => this.base(filter.base(other)));
  }

  apply(filter: HttpHandler): HttpHandler {
    return this.base(filter);
  }
}
