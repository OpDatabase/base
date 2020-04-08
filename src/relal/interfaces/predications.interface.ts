export interface Predications {
  notEqual(other: unknown): unknown;

  notEqualAny(others: unknown[]): unknown;

  notEqualAll(others: unknown[]): unknown;

  equal(other: unknown): unknown;

  equalAny(others: unknown[]): unknown;

  equalAll(others: unknown[]): unknown;

  isNotDistinctFrom(other: unknown): unknown;

  isDistinctFrom(other: unknown): unknown;

  between(other: unknown): unknown;

  notBetween(other: unknown): unknown;

  in(other: unknown): unknown;

  inAny(other: unknown): unknown;

  inAll(other: unknown): unknown;

  notIn(other: unknown): unknown;

  notInAny(other: unknown): unknown;

  notInAll(other: unknown): unknown;

  matches(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  matchesRegex(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  matchesAny(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  matchesAll(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  doesNotMatch(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  doesNotMatchRegex(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  doesNotMatchAny(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  doesNotMatchAll(other: unknown, escape: unknown, caseSensitive?: boolean): unknown;

  greaterThanOrEqual(right: unknown): unknown;

  greaterThanOrEqualAny(right: unknown): unknown;

  greaterThanOrEqualAll(right: unknown): unknown;

  greaterThan(right: unknown): unknown;

  greaterThanAny(right: unknown): unknown;

  greaterThanAll(right: unknown): unknown;

  lessThan(right: unknown): unknown;

  lessThanAny(right: unknown): unknown;

  lessThanAll(right: unknown): unknown;

  lessThanOrEqual(right: unknown): unknown;

  lessThanOrEqualAny(right: unknown): unknown;

  lessThanOrEqualAll(right: unknown): unknown;

  when(right: unknown): unknown;

  concat(other: unknown): unknown;
}
