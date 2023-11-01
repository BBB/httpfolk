import { ImmutableURL } from "~/src/ImmutableURL";
import { Method } from "~/src/Method";
import { ImmutableHeaders } from "~/src/ImmutableHeaders";

export type Credentials = "omit" | "include" | "same-origin";

export class ImmutableRequest {
  readonly #headers: ImmutableHeaders;
  readonly #url: ImmutableURL;
  readonly #method: Method;
  readonly #abortSignal: AbortSignal | undefined;
  readonly #credentials: Credentials | undefined;
  readonly #body: unknown;

  protected constructor(
    method: Method,
    url: ImmutableURL,
    body?: unknown | undefined,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    this.#headers = new ImmutableHeaders(headers);
    this.#url = url;
    this.#method = method;
    this.#abortSignal = abortSignal;
    this.#credentials = credentials;
    this.#body = body;
  }

  static get(
    url: ImmutableURL,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    return new ImmutableRequest(
      "GET",
      url,
      undefined,
      headers,
      abortSignal,
      credentials,
    );
  }

  static delete(
    url: ImmutableURL,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    return new ImmutableRequest(
      "DELETE",
      url,
      undefined,
      headers,
      abortSignal,
      credentials,
    );
  }
  static put(
    url: ImmutableURL,
    body?: unknown | undefined,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    return new ImmutableRequest(
      "PUT",
      url,
      body,
      headers,
      abortSignal,
      credentials,
    );
  }

  static post(
    url: ImmutableURL,
    body?: unknown | undefined,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    return new ImmutableRequest(
      "POST",
      url,
      body,
      headers,
      abortSignal,
      credentials,
    );
  }
  static patch(
    url: ImmutableURL,
    body?: unknown | undefined,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: AbortSignal | undefined,
    credentials?: Credentials | undefined,
  ) {
    return new ImmutableRequest(
      "PATCH",
      url,
      body,
      headers,
      abortSignal,
      credentials,
    );
  }
  get url() {
    return this.#url;
  }

  get headers() {
    return this.#headers;
  }

  setHeaders(nextHeaders: ImmutableHeaders) {
    return new ImmutableRequest(
      this.#method,
      this.#url,
      this.#body,
      nextHeaders,
      this.#abortSignal,
      this.#credentials,
    );
  }

  get abortSignal(): AbortSignal | undefined {
    return this.#abortSignal;
  }

  appendAbortSignal(signal: AbortSignal): ImmutableRequest {
    return new ImmutableRequest(
      this.#method,
      this.#url,
      this.#body,
      this.#headers,
      signal,
      this.#credentials,
    );
  }

  get credentials(): Credentials | undefined {
    return this.#credentials;
  }

  get method(): Method {
    return this.#method;
  }

  setCredentials(credentials: Credentials): ImmutableRequest {
    return new ImmutableRequest(
      this.#method,
      this.#url,
      this.#body,
      this.#headers,
      this.#abortSignal,
      credentials,
    );
  }

  setMethod(method: Method): ImmutableRequest {
    return new ImmutableRequest(
      method,
      this.#url,
      this.#body,
      this.#headers,
      this.#abortSignal,
      this.#credentials,
    );
  }

  setURL(url: ImmutableURL): ImmutableRequest {
    return new ImmutableRequest(
      this.#method,
      url,
      this.#body,
      this.#headers,
      this.#abortSignal,
      this.#credentials,
    );
  }
}
