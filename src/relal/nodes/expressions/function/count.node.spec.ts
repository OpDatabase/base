import { nodeTestCase } from '../../../tests/node-test-case.func';
import { node } from '../../nodes.register';
import { SqlLiteralNode } from '../../sql-literal.node';
import { CountNode } from './count.node';

nodeTestCase('CountNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new CountNode(
      new SqlLiteralNode('COLUMN'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('COUNT(COLUMN)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - distinct', async () => {
    const node = new CountNode(
      new SqlLiteralNode('COLUMN'),
      true,
    );
    const collector = visit(node);
    expect(collector.value).toBe('COUNT(DISTINCT COLUMN)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with alias', async () => {
    const node = new CountNode(
      new SqlLiteralNode('COLUMN'),
      false,
      'counted column',
    );
    const collector = visit(node);
    expect(collector.value).toBe('COUNT(COLUMN) AS "counted column"');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('count')).toStrictEqual(CountNode);
  });
});
