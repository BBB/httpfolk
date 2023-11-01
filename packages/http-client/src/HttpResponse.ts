import { ImmutableHeaders } from "~/src/ImmutableHeaders";

export class HttpResponse {
  constructor(
    public status: number,
    private body: unknown,
    public headers: ImmutableHeaders = new ImmutableHeaders(),
  ) {}

  json(): Promise<unknown> {
    return Promise.resolve(this.body);
  }
}
