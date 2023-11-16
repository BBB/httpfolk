import { ImmutableResponse } from "~/src/ImmutableResponse";
import { ImmutableRequest } from "~/src/ImmutableRequest";
import { TaskResult } from "@ollierelph/result4t";
import { StatusCode } from "~/src/StatusCode";
import { ImmutableURL } from "~/src/ImmutableURL";

type FilterApply = (other: HttpHandler) => HttpHandler;

type ResponseResult<
  Response extends ImmutableResponse<any>,
  Failure,
> = TaskResult<Response, Failure>;

type HttpHandler = (request: ImmutableRequest) => Promise<ImmutableResponse>;

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

class Status5xx {}
const map500Errors = Filter.from(
  (other) => async (request: ImmutableRequest) => {
    const response = await other(request);
    const status = response.status;
    if (status.is5xx()) {
      throw new Status5xx();
    }
    return response;
  },
);

const alwaysStatus =
  (status: StatusCode): HttpHandler =>
  async (_) =>
    ImmutableResponse.of(null, {
      status,
    });

const myClient = map500Errors
  .then(map500Errors)
  .then(map500Errors)
  .apply(alwaysStatus(StatusCode.OK));

async function main() {
  const a = await myClient(ImmutableRequest.get(new ImmutableURL("")));
}
