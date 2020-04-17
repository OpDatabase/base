import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { DoesNotMatchNode, MatchesNode } from './matches.node';

nodeTestCase('MatchesNode', visit => {
  it('should return the given value on visit - default value, no escape', async () => {
    const node = new MatchesNode(
      new SqlLiteralNode('COLUMN'),
      new SqlLiteralNode('VALUE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('COLUMN LIKE VALUE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default value, with escape', async () => {
    const node = new MatchesNode(
      new SqlLiteralNode('COLUMN'),
      new SqlLiteralNode('VALUE'),
      '$',
    );
    const collector = visit(node);
    expect(collector.value).toBe('COLUMN LIKE VALUE ESCAPE \'$\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('matches')).toStrictEqual(MatchesNode);
  });
});

nodeTestCase('DoesNotMatchNode', visit => {
  it('should return the given value on visit - default value, no escape', async () => {
    const node = new DoesNotMatchNode(
      new SqlLiteralNode('COLUMN'),
      new SqlLiteralNode('VALUE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('COLUMN NOT LIKE VALUE');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default value, with escape', async () => {
    const node = new DoesNotMatchNode(
      new SqlLiteralNode('COLUMN'),
      new SqlLiteralNode('VALUE'),
      '$',
    );
    const collector = visit(node);
    expect(collector.value).toBe('COLUMN NOT LIKE VALUE ESCAPE \'$\'');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('does-not-match')).toStrictEqual(DoesNotMatchNode);
  });
});
