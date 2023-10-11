export class Invalid<T> {
  protected constructor(public value: T) {}

  static of<T>(value: T) {
    return new Invalid(value);
  }
}
