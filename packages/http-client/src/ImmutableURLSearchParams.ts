import { URLSearchParams } from "url";

export class ImmutableURLSearchParams implements Readonly<URLSearchParams> {
  readonly #params: URLSearchParams;

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.#params[Symbol.iterator]();
  }

  constructor(init?: Record<string, string> | string | URLSearchParams) {
    this.#params = new URLSearchParams(init);
  }

  get size() {
    return [...this.keys()].length;
  }

  append(name: string, value: string) {
    const next = new URLSearchParams(this.#params);
    next.append(name, value);
    return new ImmutableURLSearchParams(next);
  }

  delete(name: string) {
    const next = new URLSearchParams(this.#params);
    next.delete(name);
    return new ImmutableURLSearchParams(next);
  }

  set(name: string, value: string) {
    const next = new URLSearchParams(this.#params);
    next.set(name, value);
    return new ImmutableURLSearchParams(next);
  }

  sort() {
    const next = new URLSearchParams(this.#params);
    next.sort();
    return new ImmutableURLSearchParams(next);
  }

  entries(): IterableIterator<[string, string]> {
    return this.#params.entries();
  }

  forEach<TThis>(
    callback: (
      this: TThis,
      value: string,
      name: string,
      searchParams: this,
    ) => void,
    thisArg: TThis | undefined,
  ) {
    this.#params.forEach(
      (value, name) =>
        thisArg
          ? callback.call(thisArg, value, name, this)
          : callback.call(this as unknown as TThis, value, name, this),
      thisArg,
    );
  }

  get(name: string): string | null {
    return this.#params.get(name);
  }

  getAll(name: string): string[] {
    return this.#params.getAll(name);
  }

  has(name: string): boolean {
    return this.#params.has(name);
  }

  keys(): IterableIterator<string> {
    return this.#params.keys();
  }

  values(): IterableIterator<string> {
    return this.#params.values();
  }

  toString() {
    return this.#params.toString();
  }
}
