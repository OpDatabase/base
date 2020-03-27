export interface CliModule {
  handler(argv: string[]): Promise<unknown> | unknown;
}
