import { URL } from "node:url";
import { ImmutableURLSearchParams } from "~/src/ImmutableURLSearchParams";

export class ImmutableURL implements Readonly<URL> {
  readonly searchParams: ImmutableURLSearchParams;
  private readonly _url: URL;

  constructor(url: URL);
  constructor(url: string, base?: string | URL);
  constructor(url: string | URL, base?: string | URL) {
    this._url = typeof url === "object" ? url : new URL(url, base);
    this.searchParams = new ImmutableURLSearchParams(this._url.searchParams);
  }

  get hash() {
    return this._url.hash;
  }

  get host() {
    return this._url.host;
  }

  get hostname() {
    return this._url.hostname;
  }

  get href() {
    return this._url.href;
  }

  get origin() {
    return this._url.origin;
  }

  get password() {
    return this._url.password;
  }

  get pathname() {
    return this._url.pathname;
  }

  get port() {
    return this._url.port;
  }

  get protocol() {
    return this._url.protocol;
  }

  get search() {
    return this._url.search;
  }

  get username() {
    return this._url.username;
  }

  toJSON() {
    return this._url.toJSON();
  }

  toString() {
    return this._url.toString();
  }
}
