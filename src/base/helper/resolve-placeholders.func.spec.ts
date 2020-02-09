import { MissingPlaceholderException } from '..';
import { resolvePlaceholders } from './resolve-placeholders.func';

describe('resolvePlaceholders', () => {
  it('should resolve a statement without placeholders', async () => {
    const result = resolvePlaceholders('SELECT * FROM test');
    expect(result).toEqual({
      statement: 'SELECT * FROM test',
      inputPlaceholders: {},
      transposedPlaceholders: [],
      usedPlaceholders: [],
    });
  });
  it('should resolve a statement with placeholders', async () => {
    const result = resolvePlaceholders('SELECT * FROM test WHERE a = $a AND b = $b', { a: 1, b: 2 });
    expect(result).toEqual({
      statement: 'SELECT * FROM test WHERE a = $1 AND b = $2',
      inputPlaceholders: { a: 1, b: 2 },
      // tslint:disable-next-line:no-magic-numbers
      transposedPlaceholders: [1, 2],
      usedPlaceholders: ['a', 'b'],
    });
  });
  it('should properly match placeholders without special chars', async () => {
    const result = resolvePlaceholders('INSERT INTO test (a, b) VALUES ($a, $b)', { a: 1, b: 2 });
    expect(result).toEqual({
      statement: 'INSERT INTO test (a, b) VALUES ($1, $2)',
      inputPlaceholders: { a: 1, b: 2 },
      // tslint:disable-next-line:no-magic-numbers
      transposedPlaceholders: [1, 2],
      usedPlaceholders: ['a', 'b'],
    });
  });
  it('should resolve a statement with multiple of the same placeholders', async () => {
    const result = resolvePlaceholders('SELECT * FROM test WHERE a = $a AND b = $b AND c = $b', { a: 1, b: 2 });
    expect(result).toEqual({
      statement: 'SELECT * FROM test WHERE a = $1 AND b = $2 AND c = $3',
      inputPlaceholders: { a: 1, b: 2 },
      // tslint:disable-next-line:no-magic-numbers
      transposedPlaceholders: [1, 2, 2],
      usedPlaceholders: ['a', 'b', 'b'],
    });
  });
  it('should throw an exception if a used placeholder was not provided', async () => {
    expect(() => {
      resolvePlaceholders('SELECT * FROM test WHERE a = $a AND b = $b', { a: 1 }); // b is not defined
    }).toThrow(MissingPlaceholderException);
  });
  it('should resolve a statement without placeholders with other replacement handler', async () => {
    const result = resolvePlaceholders('SELECT * FROM test', {}, alternativeReplacementHandler);
    expect(result).toEqual({
      statement: 'SELECT * FROM test',
      inputPlaceholders: {},
      transposedPlaceholders: [],
      usedPlaceholders: [],
    });
  });
  it('should resolve a statement with placeholders with other replacement handler', async () => {
    const result = resolvePlaceholders('SELECT * FROM test WHERE a = $a AND b = $b', { a: 1, b: 2 }, alternativeReplacementHandler);
    expect(result).toEqual({
      statement: 'SELECT * FROM test WHERE a = @1 AND b = @2',
      inputPlaceholders: { a: 1, b: 2 },
      // tslint:disable-next-line:no-magic-numbers
      transposedPlaceholders: [1, 2],
      usedPlaceholders: ['a', 'b'],
    });
  });
  it('should resolve a statement with multiple of the same placeholders with other replacement handler', async () => {
    const result = resolvePlaceholders('SELECT * FROM test WHERE a = $a AND b = $b AND c = $b', { a: 1, b: 2 }, alternativeReplacementHandler);
    expect(result).toEqual({
      statement: 'SELECT * FROM test WHERE a = @1 AND b = @2 AND c = @3',
      inputPlaceholders: { a: 1, b: 2 },
      // tslint:disable-next-line:no-magic-numbers
      transposedPlaceholders: [1, 2, 2],
      usedPlaceholders: ['a', 'b', 'b'],
    });
  });
});

function alternativeReplacementHandler(mark: number) {
  return `@${mark}`;
}
