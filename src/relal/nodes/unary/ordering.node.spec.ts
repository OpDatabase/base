import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { AscendingNode, DescendingNode, NullsFirstNode, NullsLastNode } from './ordering.node';

nodeTestCase('AscendingNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new AscendingNode(
      new SqlLiteralNode('FIELD'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('FIELD ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - reversed', async () => {
    const node = new AscendingNode(
      new SqlLiteralNode('FIELD'),
    ).reverse();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD DESC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - nulls first', async () => {
    const node = new AscendingNode(
      new SqlLiteralNode('FIELD'),
    ).nullsFirst();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - nulls last', async () => {
    const node = new AscendingNode(
      new SqlLiteralNode('FIELD'),
    ).nullsLast();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('ascending')).toStrictEqual(AscendingNode);
  });
});

nodeTestCase('DescendingNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new DescendingNode(
      new SqlLiteralNode('FIELD'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('FIELD DESC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - reversed', async () => {
    const node = new DescendingNode(
      new SqlLiteralNode('FIELD'),
    ).reverse();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD ASC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - nulls first', async () => {
    const node = new DescendingNode(
      new SqlLiteralNode('FIELD'),
    ).nullsFirst();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD DESC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - nulls last', async () => {
    const node = new DescendingNode(
      new SqlLiteralNode('FIELD'),
    ).nullsLast();
    const collector = visit(node);
    expect(collector.value).toBe('FIELD DESC');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('descending')).toStrictEqual(DescendingNode);
  });
});

nodeTestCase('NullsFirstNode', () => {
  it('should be accessible using register', async () => {
    expect(node('nulls-first')).toStrictEqual(NullsFirstNode);
  });
});

nodeTestCase('NullsLastNode', () => {
  it('should be accessible using register', async () => {
    expect(node('nulls-last')).toStrictEqual(NullsLastNode);
  });
});
