export class SensibleSet<T> {
  protected constructor(private set: Set<T>) {}

  static of<T>(...args: T[]) {
    return new SensibleSet(new Set(args));
  }

  map<Out>(predicate: (it: T) => Out) {
    return SensibleSet.of(...[...this.set].map(predicate));
  }

  contains(predicate: (it: T) => boolean) {
    return [...this.set].reduce((agg, it) => {
      if (agg) {
        return agg;
      }
      return predicate(it);
    }, false);
  }

  has(it: T) {
    return this.set.has(it);
  }
}
