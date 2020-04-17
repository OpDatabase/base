import { AnyNodeOrAttribute, ConvertibleToString } from '../../interfaces/node-types.interface';
import { nodeTestCase } from '../../tests/node-test-case.func';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import { AvgNode, ExistsNode, FunctionNode, MaxNode, MinNode, SumNode } from './function.node';

function buildTestCase(
  klass: new <T extends AnyNodeOrAttribute>(expression: T, alias?: ConvertibleToString, distinct?: boolean) => FunctionNode<T>,
  operator: string,
  nodeName: string,
  skipDistinctTests: boolean = false,
) {
  nodeTestCase(klass.name, visit => {
    it('should return the given value on visit - default', async () => {
      const node = new klass(
        new SqlLiteralNode('ATTRIBUTE'),
      );
      const collector = visit(node);
      expect(collector.value).toBe(`${operator}(ATTRIBUTE)`);
      expect(collector.bindIndex).toBe(0);
      expect(collector.boundValues).toStrictEqual([]);
    });

    it('should return the given value on visit - with alias', async () => {
      const node = new klass(
        new SqlLiteralNode('ATTRIBUTE'),
        'ALIAS',
      );
      const collector = visit(node);
      expect(collector.value).toBe(`${operator}(ATTRIBUTE) AS "ALIAS"`);
      expect(collector.bindIndex).toBe(0);
      expect(collector.boundValues).toStrictEqual([]);
    });

    if (!skipDistinctTests) {
      it('should return the given value on visit - with distinct', async () => {
        const node = new klass(
          new SqlLiteralNode('ATTRIBUTE'),
          undefined,
          true,
        );
        const collector = visit(node);
        expect(collector.value).toBe(`${operator}(DISTINCT ATTRIBUTE)`);
        expect(collector.bindIndex).toBe(0);
        expect(collector.boundValues).toStrictEqual([]);
      });
    }

    it('should be accessible using register', async () => {
      expect(node(nodeName)).toStrictEqual(klass);
    });
  });
}

buildTestCase(SumNode, 'SUM', 'sum');
buildTestCase(ExistsNode, 'EXISTS ', 'exists', true);
buildTestCase(MaxNode, 'MAX', 'max');
buildTestCase(MinNode, 'MIN', 'min');
buildTestCase(AvgNode, 'AVG', 'avg');
