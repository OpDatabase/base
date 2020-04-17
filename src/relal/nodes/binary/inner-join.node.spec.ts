import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { OnNode } from '../unary.node';
import { InnerJoinNode } from './inner-join.node';

nodeTestCase('InnerJoinNode', visit => {
  it('should return the given value on visit - null value', async () => {
    const node = new InnerJoinNode(
      new SqlLiteralNode('TABLE'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe('INNER JOIN TABLE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - null value', async () => {
    const node = new InnerJoinNode(
      new SqlLiteralNode('TABLE'),
      new OnNode(new SqlLiteralNode('RIGHT SIDE')),
    );
    const collector = visit(node);
    expect(collector.value).toBe('INNER JOIN TABLE ON RIGHT SIDE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('inner-join')).toStrictEqual(InnerJoinNode);
  });
});
