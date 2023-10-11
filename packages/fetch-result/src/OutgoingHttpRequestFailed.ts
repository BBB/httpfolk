export class OutgoingHttpRequestFailed<Body = unknown> {
  name = "OutgoingHttpRequestFailed" as const;

  constructor(
    public method: string,
    public body: Body,
    public inner: Error,
  ) {}
}
