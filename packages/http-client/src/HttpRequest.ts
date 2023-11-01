import { ImmutableURL } from "~/src/ImmutableURL";
import { Method } from "~/src/Method";
import { Headers } from "undici";

export type Credentials = "omit" | "include" | "same-origin";

export class HttpRequest {
  constructor(
    private readonly _headers: Record<string, string>,
    private readonly _url: ImmutableURL,
    private readonly _method: Method,
    private readonly _abortSignal: AbortSignal | undefined,
    private readonly _credentials: Credentials | undefined,
    private readonly _body: unknown | undefined,
  ) {}

  url() {
    return this._url;
  }

  headers() {
    return new Headers(this._headers);
  }

  addHeader(name: string, value: string) {
    return new HttpRequest(
      {
        ...this._headers,
        [name]: value,
      },
      this._url,
      this._method,
      this._abortSignal,
      this._credentials,
      this._body,
    );
  }

  abortSignal(): AbortSignal | undefined {
    return this._abortSignal;
  }

  addAbortSignal(signal: AbortSignal): HttpRequest {
    return new HttpRequest(
      this._headers,
      this._url,
      this._method,
      signal,
      this._credentials,
      this._body,
    );
  }

  credentials(): Credentials | undefined {
    return undefined;
  }

  method(): Method {
    return this._method;
  }

  setCredentials(credentials: Credentials): HttpRequest {
    return new HttpRequest(
      this._headers,
      this._url,
      this._method,
      this._abortSignal,
      credentials,
      this._body,
    );
  }

  setMethod(method: Method): HttpRequest {
    return new HttpRequest(
      this._headers,
      this._url,
      method,
      this._abortSignal,
      this._credentials,
      this._body,
    );
  }

  setURL(url: ImmutableURL): HttpRequest {
    return new HttpRequest(
      this._headers,
      url,
      this._method,
      this._abortSignal,
      this._credentials,
      this._body,
    );
  }
}
