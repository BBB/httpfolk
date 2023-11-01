import EventEmitter from "@foxify/events";

interface EventListenerOptions {
  capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}

type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface EventListenerObject {
  handleEvent(object: Event): void;
}

interface EventListener {
  (evt: Event): void;
}

interface Event {
  type: string;
}

export class HttpAbortSignal implements Readonly<AbortSignal> {
  #eventEmitter = new EventEmitter();
  readonly #signals: Set<AbortSignal>;
  readonly aborted: boolean;
  readonly reason: any;

  constructor(signals: Array<AbortSignal>) {
    this.#signals = new Set(signals);
    const aborted = signals.find((it) => it.aborted);
    this.aborted = signals.length > 0 ? !!aborted : false;
    this.reason = signals.length > 0 && aborted ? aborted.reason : undefined;
  }
  dispatchEvent(event: Event): boolean {
    this.#eventEmitter.emit(event.type);
    return true;
  }

  set onabort(
    listener: (
      this: AbortSignal,
      listener: EventListenerOrEventListenerObject,
    ) => any,
  ) {
    this.addEventListener("abort", listener);
  }
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    this.#eventEmitter.addListener(type, listener, options);
  }
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    this.#eventEmitter.removeListener(type, listener);
  }
}
