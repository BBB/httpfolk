export class IncomingHttpResponseUnknownIssue<Body = unknown> {
  name = "IncomingHttpResponseUnknownIssue" as const;

  constructor(
    public method: string,
    public body: Body,
    public inner: Error,
  ) {}
}
