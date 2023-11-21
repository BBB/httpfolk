import { ImmutableResponse } from "~/src/ImmutableResponse";
import { ImmutableRequest } from "~/src/ImmutableRequest";

type FilterApply = (next: HttpHandler) => HttpHandler;

export type HttpHandler = (
  request: ImmutableRequest,
) => Promise<ImmutableResponse>;

export class Filter {
  constructor(protected base: FilterApply) {}

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
