import { URL } from "node:url";
import { ImmutableURLSearchParams } from "~/src/ImmutableURLSearchParams";

const mutableUrlField = [
  "hash",
  "host",
  "hostname",
  "href",
  "password",
  "pathname",
  "port",
  "protocol",
  "search",
  "username",
] as const;
type MutableURLFields = (typeof mutableUrlField)[number];
const isMutableUrlField = (it: any): it is MutableURLFields =>
  mutableUrlField.includes(it);

export class ImmutableURL implements Readonly<URL> {
  readonly #searchParams: ImmutableURLSearchParams;
  readonly #url: URL;

  constructor(url: URL);
  constructor(url: string, base?: string | URL);
  constructor(url: string | URL, base?: string | URL) {
    this.#url = typeof url === "object" ? url : new URL(url, base);
    this.#searchParams = new ImmutableURLSearchParams(this.#url.searchParams);
  }

  copy(
    update?: Partial<Pick<ImmutableURL, MutableURLFields | "searchParams">>,
  ) {
    const next = new URL(this.#url.toString());
    if (update) {
      Object.entries(update).forEach(([key, value]) => {
        if (key === "searchParams") {
          next.search = value.toString();
        } else if (isMutableUrlField(key) && typeof value === "string") {
          next[key] = value;
        }
      });
    }
    return new ImmutableURL(next);
  }

  get searchParams() {
    return this.#searchParams;
  }

  get hash() {
    return this.#url.hash;
  }

  get host() {
    return this.#url.host;
  }

  get hostname() {
    return this.#url.hostname;
  }

  get href() {
    return this.#url.href;
  }

  get origin() {
    return this.#url.origin;
  }

  get password() {
    return this.#url.password;
  }

  get pathname() {
    return this.#url.pathname;
  }

  get port() {
    return this.#url.port;
  }

  get protocol() {
    return this.#url.protocol;
  }

  get search() {
    return this.#url.search;
  }

  get username() {
    return this.#url.username;
  }

  toJSON() {
    return this.#url.toJSON();
  }

  toString() {
    return this.#url.toString();
  }
}
