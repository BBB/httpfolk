export class Pair<First, Second> {
  protected constructor(
    public first: First,
    public second: Second,
  ) {}

  static of<First, Second>(first: First, second: Second) {
    return new Pair(first, second);
  }
}
