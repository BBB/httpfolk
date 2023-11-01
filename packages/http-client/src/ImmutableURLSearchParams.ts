import { URLSearchParams } from "url";

export class ImmutableURLSearchParams implements Readonly<URLSearchParams> {
  private readonly _params: URLSearchParams;

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this._params[Symbol.iterator]();
  }

  constructor(init?: Record<string, string> | string | URLSearchParams) {
    this._params = new URLSearchParams(init);
  }

  append(name: string, value: string) {
    const next = new URLSearchParams(this._params);
    next.append(name, value);
    return new ImmutableURLSearchParams(next);
  }

  delete(name: string) {
    const next = new URLSearchParams(this._params);
    next.delete(name);
    return new ImmutableURLSearchParams(next);
  }

  set(name: string, value: string) {
    const next = new URLSearchParams(this._params);
    next.set(name, value);
    return new ImmutableURLSearchParams(next);
  }

  sort() {
    const next = new URLSearchParams(this._params);
    next.sort();
    return new ImmutableURLSearchParams(next);
  }

  entries(): IterableIterator<[string, string]> {
    return this._params.entries();
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
    this._params.forEach(
      (value, name) =>
        thisArg
          ? callback.call(thisArg, value, name, this)
          : callback.call(this as unknown as TThis, value, name, this),
      thisArg,
    );
  }

  get(name: string): string | null {
    return this._params.get(name);
  }

  getAll(name: string): string[] {
    return this._params.getAll(name);
  }

  has(name: string): boolean {
    return this._params.has(name);
  }

  keys(): IterableIterator<string> {
    return this._params.keys();
  }

  values(): IterableIterator<string> {
    return this._params.values();
  }
}
