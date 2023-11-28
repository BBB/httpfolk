import { ImmutableURL } from "~/src/ImmutableURL";
import { Method } from "~/src/Method";
import { ImmutableHeaders } from "~/src/ImmutableHeaders";
import { HttpAbortSignal } from "~/src/HttpAbortSignal";

export type Credentials = "omit" | "include" | "same-origin";

export interface ReadOnlyRequest {
  readonly url: ImmutableURL;
  readonly headers: ImmutableHeaders;
  readonly body: unknown;
  readonly abortSignal: HttpAbortSignal | undefined;
  readonly credentials: Credentials | undefined;
  readonly method: Method;
}

export class ImmutableRequest implements ReadOnlyRequest {
  readonly #headers: ImmutableHeaders;
  readonly #url: ImmutableURL;
  readonly #method: Method;
  readonly #abortSignal: HttpAbortSignal | undefined;
  readonly #credentials: Credentials | undefined;
  readonly #body: unknown;

  copy(
    request: Partial<
      Pick<
        ImmutableRequest,
        "method" | "url" | "body" | "headers" | "abortSignal" | "credentials"
      >
    >,
  ) {
    return new ImmutableRequest(
      request.method ?? this.method,
      request.url?.copy() ?? this.url.copy(),
      request.body ?? this.#body,
      request.headers ?? this.headers,
      request.abortSignal ?? this.abortSignal,
      request.credentials ?? this.credentials,
    );
  }

  protected constructor(
    method: Method,
    url: ImmutableURL,
    body?: unknown | undefined,
    headers?: Record<string, string> | ImmutableHeaders,
    abortSignal?: HttpAbortSignal | undefined,
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
    abortSignal?: HttpAbortSignal | undefined,
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
    abortSignal?: HttpAbortSignal | undefined,
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
    abortSignal?: HttpAbortSignal | undefined,
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
    abortSignal?: HttpAbortSignal | undefined,
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
    abortSignal?: HttpAbortSignal | undefined,
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
  get body() {
    return this.#body;
  }
  get abortSignal(): HttpAbortSignal | undefined {
    return this.#abortSignal;
  }
  get credentials(): Credentials | undefined {
    return this.#credentials;
  }
  get method(): Method {
    return this.#method;
  }
}
