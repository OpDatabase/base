import { nodeTestCase } from '../../../tests/node-test-case.func';
import { node } from '../../nodes.register';
import { SqlLiteralNode } from '../../sql-literal.node';
import { InNode, InValuesNode } from './in.node';

nodeTestCase('InNode', visit => {
  it('should return the given value on visit - null value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), null);
    const collector = visit(node);
    expect(collector.value).toBe(' 1=0 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - empty array value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new InValuesNode([]));
    const collector = visit(node);
    expect(collector.value).toBe(' 1=0 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - example array value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new InValuesNode([
      new SqlLiteralNode('TEST 1'),
      new SqlLiteralNode('TEST 2'),
    ]));
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING IN (TEST 1, TEST 2)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - example other value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new SqlLiteralNode('OTHER VALUE'));
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING IN (OTHER VALUE)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should correctly invert the value - null value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), null).invert();
    const collector = visit(node);
    expect(collector.value).toBe(' 1=1 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should correctly invert the value - empty array value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new InValuesNode([])).invert();
    const collector = visit(node);
    expect(collector.value).toBe(' 1=1 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should correctly invert the value - example array value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new InValuesNode([
      new SqlLiteralNode('TEST 1'),
      new SqlLiteralNode('TEST 2'),
    ])).invert();
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING NOT IN (TEST 1, TEST 2)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should correctly invert the value - example other value', async () => {
    const node = new InNode(new SqlLiteralNode('EXAMPLE SQL STRING'), new SqlLiteralNode('OTHER VALUE')).invert();
    const collector = visit(node);
    expect(collector.value).toBe('EXAMPLE SQL STRING NOT IN (OTHER VALUE)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('in')).toStrictEqual(InNode);
  });
});

nodeTestCase('InValuesNode', visit => {
  it('should return the given value on visit - empty value', async () => {
    const node = new InValuesNode([]);
    const collector = visit(node);
    expect(collector.value).toBe('');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - singular value', async () => {
    const node = new InValuesNode([
      new SqlLiteralNode('VALUE 1'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('VALUE 1');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - multiple values', async () => {
    const node = new InValuesNode([
      new SqlLiteralNode('VALUE 1'),
      new SqlLiteralNode('VALUE 2'),
    ]);
    const collector = visit(node);
    expect(collector.value).toBe('VALUE 1, VALUE 2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('in-values')).toStrictEqual(InValuesNode);
  });
});
