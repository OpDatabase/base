import { Table } from '../table.class';
import { nodeTestCase } from '../tests/node-test-case.func';
import { InnerJoinNode } from './binary/inner-join.node';
import { JoinSourceNode } from './join-source.node';
import { node } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
import { OnNode } from './unary.node';

nodeTestCase('JoinSourceNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new JoinSourceNode();
    const collector = visit(node);
    expect(collector.value).toBe('');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - left source not null', async () => {
    const node = new JoinSourceNode();
    node.left = new Table('table');
    const collector = visit(node);
    expect(collector.value).toBe('"table"');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - left source not null, right single join', async () => {
    const node = new JoinSourceNode();
    node.left = new Table('table');
    node.right.push(new InnerJoinNode(
      new Table('joined_table'),
      new OnNode(
        new SqlLiteralNode('ON_STATEMENT'),
      ),
    ));
    const collector = visit(node);
    expect(collector.value).toBe('"table" INNER JOIN "joined_table" ON ON_STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - left source not null, right multiple joins', async () => {
    const node = new JoinSourceNode();
    node.left = new Table('table');
    node.right.push(new InnerJoinNode(
      new Table('joined_table1'),
      new OnNode(
        new SqlLiteralNode('ON_STATEMENT1'),
      ),
    ));
    node.right.push(new InnerJoinNode(
      new Table('joined_table2'),
      new OnNode(
        new SqlLiteralNode('ON_STATEMENT2'),
      ),
    ));
    const collector = visit(node);
    expect(collector.value).toBe('"table" INNER JOIN "joined_table1" ON ON_STATEMENT1 INNER JOIN "joined_table2" ON ON_STATEMENT2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - left source null, right single join', async () => {
    const node = new JoinSourceNode();
    node.right.push(new InnerJoinNode(
      new Table('joined_table'),
      new OnNode(
        new SqlLiteralNode('ON_STATEMENT'),
      ),
    ));
    const collector = visit(node);
    expect(collector.value).toBe('INNER JOIN "joined_table" ON ON_STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('join-source')).toStrictEqual(JoinSourceNode);
  });
});
