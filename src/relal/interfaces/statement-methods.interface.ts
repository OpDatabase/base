export interface StatementMethodsInterface {
  take(limit: number): unknown;

  offset(limit: number): unknown;

  order(...expressions: unknown[]): unknown;

  getKey(): unknown; // todo

  setKey(key: unknown): unknown; // todo

  wheres(...expressions: unknown[]): unknown;

  where(expression: unknown): unknown;
}
