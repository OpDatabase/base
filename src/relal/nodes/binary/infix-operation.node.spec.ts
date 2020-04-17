import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { nodeTestCase } from '../../tests/node-test-case.func';
import { Node } from '../node.class';
import { node } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal.node';
import {
  AdditionNode,
  BitwiseAndNode,
  BitwiseOrNode,
  BitwiseShiftLeftNode,
  BitwiseShiftRightNode,
  BitwiseXorNode,
  ConcatNode,
  DivisionNode,
  MultiplicationNode,
  SubtractionNode,
} from './infix-operation.node';

function buildInfixOperationTest(
  klass: new (a: AnyNodeOrAttribute, b: AnyNodeOrAttribute) => Node,
  operator: string,
  nodeName: string,
): void {
  nodeTestCase(klass.name, visit => {
    it('should return the given value on visit - any value', async () => {
      const n = new klass(
        new SqlLiteralNode('TABLE'),
        new SqlLiteralNode('VALUE'),
      );
      const collector = visit(n);
      expect(collector.value).toBe(`TABLE ${operator} VALUE`);
      expect(collector.bindIndex).toBe(0);
      expect(collector.boundValues).toStrictEqual([]);
    });

    it('should be accessible using register', async () => {
      expect(node(nodeName)).toStrictEqual(klass);
    });
  });
}

buildInfixOperationTest(MultiplicationNode, '*', 'multiplication');
buildInfixOperationTest(DivisionNode, '/', 'division');
buildInfixOperationTest(AdditionNode, '+', 'addition');
buildInfixOperationTest(SubtractionNode, '-', 'subtraction');
buildInfixOperationTest(ConcatNode, '||', 'concat');
buildInfixOperationTest(BitwiseAndNode, '&', 'bitwise-and');
buildInfixOperationTest(BitwiseOrNode, '|', 'bitwise-or');
buildInfixOperationTest(BitwiseXorNode, '^', 'bitwise-xor');
buildInfixOperationTest(BitwiseShiftLeftNode, '<<', 'bitwise-shift-left');
buildInfixOperationTest(BitwiseShiftRightNode, '>>', 'bitwise-shift-right');
