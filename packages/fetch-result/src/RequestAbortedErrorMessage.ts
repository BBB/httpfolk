import { SensibleSet } from "~/src/SensibleSet";
import { Pair } from "~/src/Pair";
import { Result } from "@ollierelph/result4t";
import { Invalid } from "~/src/Invalid";

const valid = SensibleSet.of("The user aborted a request");

export class RequestAbortedErrorMessage {
  protected constructor(public value: string) {}

  static of(
    value: string,
  ): Result<RequestAbortedErrorMessage, Invalid<string>> {
    if (valid.has(value)) {
      return Result.success(new RequestAbortedErrorMessage(value));
    }
    return Result.failure(Invalid.of(value));
  }

  toString() {
    return this.value;
  }

  equals(other: RequestAbortedErrorMessage) {
    return this.value === other.value;
  }
}
