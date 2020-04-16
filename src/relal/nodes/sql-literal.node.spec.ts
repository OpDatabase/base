import { nodeTestCase } from '../tests/node-test-case.func';
import { node } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';

nodeTestCase('SqlLiteralNode', visit => {
  it('should return the given value on visit - string', async () => {
    const node = new SqlLiteralNode('EXAMPLE SQL STRING');
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - toString()', async () => {
    const node = new SqlLiteralNode({ toString: () => 'EXAMPLE SQL STRING' });
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('sql-literal')).toStrictEqual(SqlLiteralNode);
  });
});
