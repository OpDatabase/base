import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { CaseNode, ElseNode, WhenNode } from './case.node';

nodeTestCase('CaseNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default with else value', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
      new ElseNode(new SqlLiteralNode('ELSEVALUE')),
    );
    const collector = visit(node);
    expect(collector.value).toBe('');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default with condition - style 1', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    ).when(new SqlLiteralNode('COND1')).then(new SqlLiteralNode('THEN1'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN COND1 THEN THEN1 END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default with condition - style 2', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    ).when(new SqlLiteralNode('COND1'), new SqlLiteralNode('THEN1'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN COND1 THEN THEN1 END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - with condition - native type condition', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    ).when('condition 1').then(new SqlLiteralNode('THEN1'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN \'condition 1\' THEN THEN1 END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default with else value - style 1', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
      new ElseNode(new SqlLiteralNode('ELSEVALUE')),
    ).when(new SqlLiteralNode('COND1'), new SqlLiteralNode('THEN1'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN COND1 THEN THEN1 ELSE ELSEVALUE END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - default with else value - style 2', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    ).when(new SqlLiteralNode('COND1'), new SqlLiteralNode('THEN1'))
      .default(new SqlLiteralNode('ELSEVALUE'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN COND1 THEN THEN1 ELSE ELSEVALUE END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - mutliple conditions', async () => {
    const node = new CaseNode(
      new SqlLiteralNode('ATTRIBUTE'),
    )
      .when(new SqlLiteralNode('COND1')).then(new SqlLiteralNode('THEN1'))
      .when(new SqlLiteralNode('COND2')).then(new SqlLiteralNode('THEN2'));
    const collector = visit(node);
    expect(collector.value).toBe('CASE ATTRIBUTE WHEN COND1 THEN THEN1 WHEN COND2 THEN THEN2 END');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('case')).toStrictEqual(CaseNode);
  });
});

nodeTestCase('WhenNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new WhenNode(
      new SqlLiteralNode('COND'),
      new SqlLiteralNode('THENVAL'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('WHEN COND THEN THENVAL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('when')).toStrictEqual(WhenNode);
  });
});

nodeTestCase('ElseNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new ElseNode(
      new SqlLiteralNode('ELSEVAL'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('ELSE ELSEVAL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('else')).toStrictEqual(ElseNode);
  });
});
