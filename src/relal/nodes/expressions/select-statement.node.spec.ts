import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { LimitNode, LockNode, OffsetNode } from '../unary.node';
import { AscendingNode } from '../unary/ordering.node';
import { QuotedNode } from '../unary/quoted.node';
import { WithNode } from '../unary/with.node';
import { SelectStatementNode } from './select-statement.node';

const blankSelectStatement = () => {
  const select = new SelectStatementNode();
  select.core.projections.push(new SqlLiteralNode('1'));

  return select;
};

nodeTestCase('SelectStatementNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = blankSelectStatement();
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with WITH', async () => {
    const node = blankSelectStatement();
    node.with = new WithNode([
      new SqlLiteralNode('STATEMENT'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('WITH STATEMENT SELECT 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - order - single column', async () => {
    const node = blankSelectStatement();
    node.orders.push(
      new AscendingNode(new SqlLiteralNode('COLUMN1')),
    );
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 ORDER BY COLUMN1 ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - order - multiple columns', async () => {
    const node = blankSelectStatement();
    node.orders.push(
      new AscendingNode(new SqlLiteralNode('COLUMN1')),
      new AscendingNode(new SqlLiteralNode('COLUMN2')),
    );
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 ORDER BY COLUMN1 ASC, COLUMN2 ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - limit', async () => {
    const node = blankSelectStatement();
    node.limit = new LimitNode(new QuotedNode(1));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 LIMIT \'1\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - offset', async () => {
    const node = blankSelectStatement();
    node.offset = new OffsetNode(new QuotedNode(1));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 OFFSET \'1\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - lock', async () => {
    const node = blankSelectStatement();
    node.lock = new LockNode(new SqlLiteralNode('FOR UPDATE'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 FOR UPDATE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('select-statement')).toStrictEqual(SelectStatementNode);
  });
});
