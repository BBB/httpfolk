import { URL } from "node:url";
import { TaskResult } from "@ollierelph/result4t";
import { NetworkErrorMessage } from "~/src/NetworkErrorMessage";
import { RequestAbortedErrorMessage } from "~/src/RequestAbortedErrorMessage";
import { OutgoingHttpRequestFailed } from "~/src/OutgoingHttpRequestFailed";
import { IncomingHttpResponseUnknownIssue } from "~/src/IncomingHttpResponseUnknownIssue";
import { OutgoingHttpRequestAborted } from "~/src/OutgoingHttpRequestAborted";
import { UnexpectedIssueThrown } from "~/src/UnexpectedIssueThrown";

interface OutgoingHttpInit {
  method?: string;
  url?: string;
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

interface ReadableStream<R = any> {}

declare var Blob: {
  prototype: Blob;
  new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};

/**
 * The Blob object represents a blob, which is a file-like object of immutable, raw data;
 * they can be read as text or binary data, or converted into a ReadableStream so its methods
 * can be used for processing the data.
 */
interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
}
/**
 * Represents a raw buffer of binary data, which is used to store data for the
 * different typed arrays. ArrayBuffers cannot be read from or written to directly,
 * but can be passed to a typed array or DataView Object to interpret the raw
 * buffer as needed.
 */
interface ArrayBuffer {
  /**
   * Read-only. The length of the ArrayBuffer (in bytes).
   */
  readonly byteLength: number;

  /**
   * Returns a section of an ArrayBuffer.
   */
  slice(begin: number, end?: number): ArrayBuffer;
}

/**
 * Allowed ArrayBuffer types for the buffer of an ArrayBufferView and related Typed Arrays.
 */
interface ArrayBufferTypes {
  ArrayBuffer: ArrayBuffer;
}
type ArrayBufferLike = ArrayBufferTypes[keyof ArrayBufferTypes];

type EndingType = "native" | "transparent";
interface BlobPropertyBag {
  endings?: EndingType;
  type?: string;
}
interface ArrayBufferConstructor {
  readonly prototype: ArrayBuffer;
  new (byteLength: number): ArrayBuffer;
  isView(arg: any): arg is ArrayBufferView;
}
declare var ArrayBuffer: ArrayBufferConstructor;

interface ArrayBufferView {
  /**
   * The ArrayBuffer instance referenced by the array.
   */
  buffer: ArrayBufferLike;

  /**
   * The length in bytes of the array.
   */
  byteLength: number;

  /**
   * The offset in bytes of the array.
   */
  byteOffset: number;
}
type BufferSource = ArrayBufferView | ArrayBuffer;
type BlobPart = BufferSource | Blob | string;
interface FilePropertyBag extends BlobPropertyBag {
  lastModified?: number;
}
declare var File: {
  prototype: File;
  new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
};
interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

interface HttpURLSearchParams {
  readonly size: number;
  append(name: string, value: string): void;
  delete(name: string, value?: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string, value?: string): boolean;
  set(name: string, value: string): void;
  sort(): void;
  toString(): string;
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: any,
  ): void;
  readonly keys: () => SpecIterableIterator<string>;
  readonly values: () => SpecIterableIterator<string>;
  readonly entries: () => SpecIterableIterator<[string, string]>;
  readonly [Symbol.iterator]: () => any;
}

export interface HttpFormData {
  // don't really exist, are copied from HttpURLSearchParams
  readonly size: number;
  sort(): void;
  // resume
  append(name: string, value: string | Blob): void;
  append(name: string, value: string): void;
  append(name: string, blobValue: Blob, filename?: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string): boolean;
  set(name: string, value: string | Blob): void;
  set(name: string, value: string): void;
  set(name: string, blobValue: Blob, filename?: string): void;
  forEach(
    callbackfn: (value: string, key: string, parent: HttpFormData) => void,
    thisArg?: any,
  ): void;
  readonly keys: () => SpecIterableIterator<string>;
  readonly values: () => SpecIterableIterator<string>;
  readonly entries: () => SpecIterableIterator<[string, string]>;
  readonly [Symbol.iterator]: () => SpecIterator<[string, string]>;
}

export interface IncomingHttpResponse {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly type:
    | "default"
    | "basic"
    | "cors"
    | "error"
    | "opaque"
    | "opaqueredirect";
  readonly body: ReadableStream | null;
  readonly headers: Headers | null;
  clone(): IncomingHttpResponse;
  json(): Promise<unknown>;
  text(): Promise<string>;
  blob(): Promise<Blob>;
}
export type OutgoingHttpLocation = string | URL;

export type HeadersInit = [string, string][] | Record<string, string> | Headers;

interface SpecIterator<T, TReturn = any, TNext = undefined> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  [Symbol.iterator]?(): SpecIterableIterator<T>;
}

interface SpecIterableIterator<T> extends SpecIterator<T> {
  [Symbol.iterator](): SpecIterableIterator<T>;
}

export declare class Headers {
  constructor(init?: HeadersInit);
  readonly append: (name: string, value: string) => void;
  readonly delete: (name: string) => void;
  readonly get: (name: string) => string | null;
  readonly has: (name: string) => boolean;
  readonly set: (name: string, value: string) => void;
  readonly getSetCookie: () => string[];
  readonly forEach: (
    callbackfn: (value: string, key: string, iterable: Headers) => void,
    thisArg?: unknown,
  ) => void;
  readonly keys: () => SpecIterableIterator<string>;
  readonly values: () => SpecIterableIterator<string>;
  readonly entries: () => SpecIterableIterator<[string, string]>;
  readonly [Symbol.iterator]: () => SpecIterator<[string, string]>;
}

export type OutgoingHttpHeaders =
  | [string, string][]
  | Record<string, string>
  | Headers;
type OutgoingBody = string | HttpFormData | HttpURLSearchParams;

export interface OutgoingHttpConfig {
  method?: string;
  headers?: OutgoingHttpHeaders;
  body?: OutgoingBody | null;
}

export type Fetch<Res extends IncomingHttpResponse = IncomingHttpResponse> = (
  input: OutgoingHttpLocation | OutgoingHttpInit,
  init?: OutgoingHttpConfig | undefined,
) => Promise<Res>;

type FetchFailure =
  | OutgoingHttpRequestAborted
  | IncomingHttpResponseUnknownIssue
  | OutgoingHttpRequestFailed
  | UnexpectedIssueThrown;

export const fetchResult =
  (fetch: Fetch) =>
  (
    input: OutgoingHttpLocation | OutgoingHttpInit,
    init?: OutgoingHttpConfig | undefined,
  ): TaskResult<IncomingHttpResponse, FetchFailure> => {
    return TaskResult.fromPromise(
      () => fetch(input, init),
      (err) => {
        if (!(err instanceof Error)) {
          return new UnexpectedIssueThrown(err);
        }
        if (RequestAbortedErrorMessage.of(err.message).isSuccess()) {
          return new OutgoingHttpRequestAborted();
        }
        if (NetworkErrorMessage.of(err.message).isSuccess()) {
          return new OutgoingHttpRequestFailed(
            init?.method || "GET",
            input.toString(),
            err,
          );
        }
        return new IncomingHttpResponseUnknownIssue(
          init?.method || "GET",
          input.toString(),
          err,
        );
      },
    );
  };
