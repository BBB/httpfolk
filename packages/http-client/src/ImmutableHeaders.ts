import { Headers, SpecIterableIterator, SpecIterator } from "undici";

export class ImmutableHeaders implements Readonly<Headers> {
  readonly #headers: Headers;

  constructor(nextHeaders?: Headers | Record<string, string>) {
    this.#headers =
      nextHeaders instanceof Headers
        ? nextHeaders
        : new Headers(nextHeaders) ?? new Headers();
  }

  append(name: string, value: string) {
    const nextHeaders = new Headers(this.#headers);
    nextHeaders.append(name, value);
    return new ImmutableHeaders(nextHeaders);
  }

  set(name: string, value: string) {
    const nextHeaders = new Headers(this.#headers);
    nextHeaders.set(name, value);
    return new ImmutableHeaders(nextHeaders);
  }

  has(name: string) {
    return this.#headers.has(name);
  }

  delete(name: string) {
    const nextHeaders = new Headers(this.#headers);
    nextHeaders.delete(name);
    return new ImmutableHeaders(nextHeaders);
  }

  get(name: string) {
    return this.#headers.get(name);
  }

  [Symbol.iterator](): SpecIterator<[string, string]> {
    return this.#headers[Symbol.iterator]();
  }

  entries(): SpecIterableIterator<[string, string]> {
    return this.#headers.entries();
  }

  forEach(
    callbackfn: (value: string, key: string, iterable: Headers) => void,
    thisArg: unknown | undefined,
  ): void {
    this.#headers.forEach(callbackfn, thisArg);
  }

  getSetCookie(): string[] {
    return this.#headers.getSetCookie();
  }

  keys(): SpecIterableIterator<string> {
    return this.#headers.keys();
  }

  values(): SpecIterableIterator<string> {
    return this.#headers.values();
  }
}
