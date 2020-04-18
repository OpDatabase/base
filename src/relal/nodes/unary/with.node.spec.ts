import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { WithNode, WithRecursiveNode } from './with.node';

nodeTestCase('WithNode', visit => {
  it('should return the given value on visit - singular value', async () => {
    const node = new WithNode([
      new SqlLiteralNode('STATEMENT1'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('WITH STATEMENT1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - multiple values', async () => {
    const node = new WithNode([
      new SqlLiteralNode('STATEMENT1'),
      new SqlLiteralNode('STATEMENT2'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('WITH STATEMENT1, STATEMENT2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('with')).toStrictEqual(WithNode);
  });
});

nodeTestCase('WithRecursiveNode', visit => {
  it('should return the given value on visit - singular value', async () => {
    const node = new WithRecursiveNode([
      new SqlLiteralNode('STATEMENT1'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('WITH RECURSIVE STATEMENT1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - multiple values', async () => {
    const node = new WithRecursiveNode([
      new SqlLiteralNode('STATEMENT1'),
      new SqlLiteralNode('STATEMENT2'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('WITH RECURSIVE STATEMENT1, STATEMENT2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('with-recursive')).toStrictEqual(WithRecursiveNode);
  });
});
