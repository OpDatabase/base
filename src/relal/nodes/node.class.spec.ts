import { Collector } from '../collectors/collector.class';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { VisitInterface } from '../interfaces/visit.interface';
import { nodeTestCase } from '../tests/node-test-case.func';
import { TestCollector } from '../tests/test.collector';
import { SqlLiteralNode } from './sql-literal.node';

// Since Node is abstract, we use SqlLiteralNode extends Node instead
nodeTestCase('Node', visit => {
  it('should return the given value on visit - not method', async () => {
    const node = new SqlLiteralNode('LITERAL').not();
    const collector = visit(node);
    expect(collector.value).toBe('NOT (LITERAL)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - or method', async () => {
    const node = new SqlLiteralNode('LITERAL1').or(new SqlLiteralNode('LITERAL2'));
    const collector = visit(node);
    expect(collector.value).toBe('(LITERAL1 OR LITERAL2)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - and method - singular value', async () => {
    const node = new SqlLiteralNode('LITERAL1').and(new SqlLiteralNode('LITERAL2'));
    const collector = visit(node);
    expect(collector.value).toBe('LITERAL1 AND LITERAL2');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - and method - multiple values', async () => {
    const node = new SqlLiteralNode('LITERAL1').and(
      new SqlLiteralNode('LITERAL2'),
      new SqlLiteralNode('LITERAL3'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LITERAL1 AND LITERAL2 AND LITERAL3');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should collect the correct values - visitEach method', async () => {
    const node = new SqlLiteralNode('LITERAL1') as unknown as {
      visitEach(
        elements: AnyNodeOrAttribute[],
        joinString: string,
        collector: Collector<unknown>,
        visitChild: (element: AnyNodeOrAttribute) => void,
      ): void;
    };
    const collector = new TestCollector();
    node.visitEach(
      [
        new SqlLiteralNode('LITERAL1'),
        new SqlLiteralNode('LITERAL2'),
        new SqlLiteralNode('LITERAL3'),
      ],
      ',JSTRING,',
      collector,
      (element: VisitInterface) => element.visit(collector, () => void 0),
    );

    expect(collector.value).toBe('LITERAL1,JSTRING,LITERAL2,JSTRING,LITERAL3');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });
});
