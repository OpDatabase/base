export interface Expressions {
  count(distinct?: boolean): unknown;

  sum(): unknown;

  maximum(): unknown;

  minimum(): unknown;

  average(): unknown;

  extract(field: unknown): unknown;
}
