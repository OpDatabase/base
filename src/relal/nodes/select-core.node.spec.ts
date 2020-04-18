import { Table } from '../table.class';
import { nodeTestCase } from '../tests/node-test-case.func';
import { CommentNode } from './comment.node';
import { DistinctNode } from './expressions/distinct.node';
import { node } from './nodes.register';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal.node';
import { GroupNode, OptimizerHintsNode } from './unary.node';

nodeTestCase('SelectCoreNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new SelectCoreNode();
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with optimizer hints', async () => {
    const node = new SelectCoreNode();
    node.optimizerHints = new OptimizerHintsNode(['Hint']);
    const collector = visit(node);
    expect(collector.value).toBe('SELECT /*+ Hint */ 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with set quantifier', async () => {
    const node = new SelectCoreNode();
    node.setQuantifier = new DistinctNode();
    const collector = visit(node);
    expect(collector.value).toBe('SELECT DISTINCT 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with projections - singular', async () => {
    const node = new SelectCoreNode();
    node.projections.push(new SqlLiteralNode('column_1'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT column_1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with projections - multiple', async () => {
    const node = new SelectCoreNode();
    node.projections.push(new SqlLiteralNode('column_1'));
    node.projections.push(new SqlLiteralNode('column_2'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT column_1, column_2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with non-empty source', async () => {
    const node = new SelectCoreNode();
    node.source.left = new Table('table');
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 FROM "table"');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with wheres - singular', async () => {
    const node = new SelectCoreNode();
    node.wheres.push(new SqlLiteralNode('condition1'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 WHERE condition1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with wheres - multiple', async () => {
    const node = new SelectCoreNode();
    node.wheres.push(new SqlLiteralNode('condition1'));
    node.wheres.push(new SqlLiteralNode('condition2'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 WHERE condition1 AND condition2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with groups - singular', async () => {
    const node = new SelectCoreNode();
    node.groups.push(new GroupNode(new SqlLiteralNode('grouping1')));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 GROUP BY grouping1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with groups - multiple', async () => {
    const node = new SelectCoreNode();
    node.groups.push(new GroupNode(new SqlLiteralNode('grouping1')));
    node.groups.push(new GroupNode(new SqlLiteralNode('grouping2')));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 GROUP BY grouping1, grouping2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - havings - singular', async () => {
    const node = new SelectCoreNode();
    node.havings.push(new SqlLiteralNode('having1'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 HAVING having1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - havings - multiple', async () => {
    const node = new SelectCoreNode();
    node.havings.push(new SqlLiteralNode('having1'));
    node.havings.push(new SqlLiteralNode('having2'));
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 HAVING having1 AND having2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - comment', async () => {
    const node = new SelectCoreNode();
    node.comment = new CommentNode(['Comment']);
    const collector = visit(node);
    expect(collector.value).toBe('SELECT 1 /* Comment */');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('select-core')).toStrictEqual(SelectCoreNode);
  });
});
