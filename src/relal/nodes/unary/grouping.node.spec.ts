import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { GroupingNode } from './grouping.node';

nodeTestCase('GroupingNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new GroupingNode(
      new SqlLiteralNode('STATEMENT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('(STATEMENT)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with child grouping node', async () => {
    const node = new GroupingNode(
      new GroupingNode(
        new SqlLiteralNode('STATEMENT'),
      ),
    );
    const collector = visit(node);
    expect(collector.value).toBe('(STATEMENT)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('grouping')).toStrictEqual(GroupingNode);
  });
});
