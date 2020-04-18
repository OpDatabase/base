import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { BitwiseNotNode } from './unary-operation.node';

nodeTestCase('BitwiseNotNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new BitwiseNotNode(
      new SqlLiteralNode('FIELD'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('~ FIELD');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('bitwise-not')).toStrictEqual(BitwiseNotNode);
  });
});
