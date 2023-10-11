import { SensibleSet } from "~/src/SensibleSet";
import { Pair } from "~/src/Pair";
import { Result } from "@ollierelph/result4t";
import { Invalid } from "~/src/Invalid";

const valid = SensibleSet.of(
  Pair.of("Failed to fetch", "Chrome / Edge"),
  Pair.of("NetworkError when attempting to fetch resource.", "Firefox"),
  Pair.of("The Internet connection appears to be offline.", "Safari"),
  Pair.of("Load failed", "Safari"),
);

export class NetworkErrorMessage {
  protected constructor(public value: string) {}

  static of(value: string): Result<NetworkErrorMessage, Invalid<string>> {
    if (valid.contains((it) => it.first === value)) {
      return Result.success(new NetworkErrorMessage(value));
    }
    return Result.failure(Invalid.of(value));
  }

  toString() {
    return this.value;
  }

  equals(other: NetworkErrorMessage) {
    return this.value === other.value;
  }
}
