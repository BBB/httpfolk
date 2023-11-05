import { TaskResult } from "@ollierelph/result4t";
import { NetworkErrorMessage } from "~/src/NetworkErrorMessage";
import { RequestAbortedErrorMessage } from "~/src/RequestAbortedErrorMessage";
import { OutgoingHttpRequestFailed } from "~/src/OutgoingHttpRequestFailed";
import { IncomingHttpResponseUnknownIssue } from "~/src/IncomingHttpResponseUnknownIssue";
import { OutgoingHttpRequestAborted } from "~/src/OutgoingHttpRequestAborted";
import { UnexpectedIssueThrown } from "~/src/UnexpectedIssueThrown";
import {
  Fetch,
  IncomingHttpResponse,
  OutgoingHttpConfig,
  OutgoingHttpInit,
  OutgoingHttpLocation,
} from "@ollierelph/sensible-fetch";

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
