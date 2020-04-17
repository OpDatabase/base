import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { AndNode } from './and.node';

nodeTestCase('AndNode', visit => {
  it('should return the given value on visit - singular value', async () => {
    const node = new AndNode([
      new SqlLiteralNode('STATEMENT 1'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('STATEMENT 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - multiple values', async () => {
    const node = new AndNode([
      new SqlLiteralNode('STATEMENT 1'),
      new SqlLiteralNode('STATEMENT 2'),
      new SqlLiteralNode('STATEMENT 3'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('STATEMENT 1 AND STATEMENT 2 AND STATEMENT 3');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('and')).toStrictEqual(AndNode);
  });
});
