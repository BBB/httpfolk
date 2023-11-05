import { IncomingHttpResponse } from "@ollierelph/sensible-fetch";
import { ImmutableHeaders } from "~/src/ImmutableHeaders";
import { ImmutableURL } from "~/src/ImmutableURL";
import { StatusCode } from "~/src/StatusCode";

export class ImmutableResponse<Status extends StatusCode<any>>
  implements Readonly<IncomingHttpResponse<ImmutableURL, Status>>
{
  #response: IncomingHttpResponse;
  #status: Status;
  protected constructor(status: Status, response: IncomingHttpResponse) {
    this.#status = status;
    this.#response = response;
  }

  static fromResponse<Response extends IncomingHttpResponse>(
    response: Response,
  ) {
    return new ImmutableResponse(StatusCode.from(response.status), response);
  }

  get status() {
    return this.#status;
  }
  get statusText() {
    return this.#response.statusText;
  }
  get type() {
    return this.#response.type;
  }
  get url() {
    return new ImmutableURL(this.#response.url);
  }
  get body() {
    return this.#response.body;
  }
  get headers() {
    return new ImmutableHeaders(this.#response.headers);
  }

  json(): Promise<unknown> {
    return this.clone().json();
  }
  blob(): Promise<Blob> {
    return this.clone().blob();
  }
  text(): Promise<string> {
    return this.clone().text();
  }

  clone() {
    return new ImmutableResponse(this.status, this.#response);
  }
}
