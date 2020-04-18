import { nodeTestCase } from '../tests/node-test-case.func';
import { node } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';
import { AscendingNode } from './unary/ordering.node';
import { NamedWindowNode, RangeNode, RowsNode, WindowNode } from './window.node';

nodeTestCase('WindowNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new WindowNode();
    const collector = visit(node);
    expect(collector.value).toBe('()');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with partitions - singular', async () => {
    const node = new WindowNode().partition('PARTITION1');
    const collector = visit(node);
    expect(collector.value).toBe('(PARTITION BY PARTITION1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with partitions - multiple', async () => {
    const node = new WindowNode().partition('PARTITION1', new SqlLiteralNode('PARTITION2'));
    const collector = visit(node);
    expect(collector.value).toBe('(PARTITION BY PARTITION1 PARTITION2)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with orders - singular', async () => {
    const node = new WindowNode().order('ORDER1');
    const collector = visit(node);
    expect(collector.value).toBe('(ORDER BY ORDER1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with orders - multiple', async () => {
    const node = new WindowNode().order('ORDER1', new AscendingNode(new SqlLiteralNode('ORDER2')));
    const collector = visit(node);
    expect(collector.value).toBe('(ORDER BY ORDER1, ORDER2 ASC)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with partition and order', async () => {
    const node = new WindowNode().partition('PARTITION1').order('ORDER1');
    const collector = visit(node);
    expect(collector.value).toBe('(PARTITION BY PARTITION1 ORDER BY ORDER1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - default', async () => {
    const node = new WindowNode();
    node.frame(new SqlLiteralNode('FRAME'));
    const collector = visit(node);
    expect(collector.value).toBe('(FRAME)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - rows - initial', async () => {
    const node = new WindowNode();
    node.rows(new SqlLiteralNode('FRAME'));
    const collector = visit(node);
    expect(collector.value).toBe('(ROWS FRAME)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - rows - secondary', async () => {
    const node = new WindowNode();
    node.rows(new SqlLiteralNode('FRAME1'));
    node.rows(new SqlLiteralNode('FRAME2'));
    const collector = visit(node);
    expect(collector.value).toBe('(ROWS FRAME1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - rows - null value', async () => {
    const node = new WindowNode();
    node.rows(null);
    const collector = visit(node);
    expect(collector.value).toBe('(ROWS)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - range - initial', async () => {
    const node = new WindowNode();
    node.range(new SqlLiteralNode('FRAME'));
    const collector = visit(node);
    expect(collector.value).toBe('(RANGE FRAME)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - range - secondary', async () => {
    const node = new WindowNode();
    node.range(new SqlLiteralNode('FRAME1'));
    node.range(new SqlLiteralNode('FRAME2'));
    const collector = visit(node);
    expect(collector.value).toBe('(RANGE FRAME1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with framing - range - null value', async () => {
    const node = new WindowNode();
    node.range(null);
    const collector = visit(node);
    expect(collector.value).toBe('(RANGE)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with order and framing', async () => {
    const node = new WindowNode().order('ORDER1');
    node.frame(new SqlLiteralNode('FRAME'));
    const collector = visit(node);
    expect(collector.value).toBe('(ORDER BY ORDER1 FRAME)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with partition, order and framing', async () => {
    const node = new WindowNode().partition('PARTITION1').order('ORDER1');
    node.frame(new SqlLiteralNode('FRAME'));
    const collector = visit(node);
    expect(collector.value).toBe('(PARTITION BY PARTITION1 ORDER BY ORDER1 FRAME)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('window')).toStrictEqual(WindowNode);
  });
});

nodeTestCase('NamedWindowNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new NamedWindowNode('named_window').partition('PARTITION1').order('ORDER1');
    const collector = visit(node);
    expect(collector.value).toBe('"named_window" AS (PARTITION BY PARTITION1 ORDER BY ORDER1)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('named-window')).toStrictEqual(NamedWindowNode);
  });
});

nodeTestCase('RowsNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new RowsNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('ROWS STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - null value', async () => {
    const node = new RowsNode(null);
    const collector = visit(node);
    expect(collector.value).toBe('ROWS');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('rows')).toStrictEqual(RowsNode);
  });
});

nodeTestCase('RangeNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new RangeNode(new SqlLiteralNode('STATEMENT'));
    const collector = visit(node);
    expect(collector.value).toBe('RANGE STATEMENT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - null value', async () => {
    const node = new RangeNode(null);
    const collector = visit(node);
    expect(collector.value).toBe('RANGE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('range')).toStrictEqual(RangeNode);
  });
});
