import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { EqualityNode, IsDistinctFromNode, IsNotDistinctFromNode } from './equality.node';

nodeTestCase('EqualityNode', visit => {
  it('should return the given value on visit - null value', async () => {
    const node = new EqualityNode(
      new SqlLiteralNode('TABLE'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - not null value', async () => {
    const node = new EqualityNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('TABLE = VALUE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the equality statement - null value', async () => {
    const node = new EqualityNode(
      new SqlLiteralNode('TABLE'),
      null,
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NOT NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the equality statement - not null value', async () => {
    const node = new EqualityNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('TABLE != VALUE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('equality')).toStrictEqual(EqualityNode);
  });
});

nodeTestCase('IsDistinctFromNode', visit => {
  it('should return the given value on visit - null value', async () => {
    const node = new IsDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NOT NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - other value value', async () => {
    const node = new IsDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('CASE WHEN TABLE = VALUE OR (TABLE IS NULL AND VALUE IS NULL) THEN 0 ELSE 1 END = 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the statement - null value', async () => {
    const node = new IsDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      null,
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the statement - other value value', async () => {
    const node = new IsDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('CASE WHEN TABLE = VALUE OR (TABLE IS NULL AND VALUE IS NULL) THEN 0 ELSE 1 END = 0');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('is-distinct-from')).toStrictEqual(IsDistinctFromNode);
  });
});

nodeTestCase('IsNotDistinctFromNode', visit => {
  it('should return the given value on visit - null value', async () => {
    const node = new IsNotDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - other value value', async () => {
    const node = new IsNotDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('CASE WHEN TABLE = VALUE OR (TABLE IS NULL AND VALUE IS NULL) THEN 0 ELSE 1 END = 0');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the statement - null value', async () => {
    const node = new IsNotDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      null,
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('TABLE IS NOT NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should invert the statement - other value value', async () => {
    const node = new IsNotDistinctFromNode(
      new SqlLiteralNode('TABLE'),
      new SqlLiteralNode('VALUE'),
    ).invert();
    const collector = visit(node);
    expect(collector.value).toBe('CASE WHEN TABLE = VALUE OR (TABLE IS NULL AND VALUE IS NULL) THEN 0 ELSE 1 END = 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('is-not-distinct-from')).toStrictEqual(IsNotDistinctFromNode);
  });
});
