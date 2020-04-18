import '../';
import { UnknownAttribute } from '../attributes/unknown-attribute.class';
import { OrNode } from '../nodes/binary.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CastedNode } from '../nodes/expressions/casted.node';
import { SqlLiteralNode } from '../nodes/sql-literal.node';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { Table } from '../table.class';
import { buildQuoted, castOrQuote, collapse, grouping, groupingAll, groupingAny, isNodeOrAttribute, toString } from './helper';

describe('helper', () => {
  describe('grouping', () => {
    it('should return the correct value', async () => {
      const inner = new SqlLiteralNode('INNER');
      const result = grouping(inner);
      expect(result).toBeInstanceOf(GroupingNode);
      expect(result.expression).toStrictEqual(inner);
    });
  });

  describe('groupingAny', () => {
    it('should return the correct value', async () => {
      const inner1 = new SqlLiteralNode('INNER1');
      const inner2 = new SqlLiteralNode('INNER2');
      const inner3 = new SqlLiteralNode('INNER3');
      const result = groupingAny([inner1, inner2, inner3]);
      expect(result).toBeInstanceOf(GroupingNode);
      expect(result.expression).toBeInstanceOf(OrNode);
      const firstOr = result.expression as unknown as OrNode<OrNode<SqlLiteralNode, SqlLiteralNode>, SqlLiteralNode>;
      expect(firstOr.left).toBeInstanceOf(OrNode);
      expect(firstOr.left.left).toStrictEqual(inner1);
      expect(firstOr.left.right).toStrictEqual(inner2);
      expect(firstOr.right).toStrictEqual(inner3);
    });
  });

  describe('groupingAnd', () => {
    it('should return the correct value', async () => {
      const inner1 = new SqlLiteralNode('INNER1');
      const inner2 = new SqlLiteralNode('INNER2');
      const inner3 = new SqlLiteralNode('INNER3');
      const result = groupingAll([inner1, inner2, inner3]);
      expect(result).toBeInstanceOf(GroupingNode);
      expect(result.expression).toBeInstanceOf(AndNode);
      expect(result.expression.children).toStrictEqual([inner1, inner2, inner3]);
    });
  });

  describe('collapse', () => {
    it('should return the correct value - singular', async () => {
      const inner = new SqlLiteralNode('INNER');
      const result = collapse(inner);
      expect(result).toBeInstanceOf(SqlLiteralNode);
      expect(result).toStrictEqual(inner);
    });

    it('should return the correct value - multiple', async () => {
      const inner1 = new SqlLiteralNode('INNER1');
      const inner2 = 'INNER2';
      const result = collapse(inner1, inner2);
      expect(result).toBeInstanceOf(AndNode);
      expect((result as AndNode<SqlLiteralNode[]>).children[0].value).toStrictEqual('INNER1');
      expect((result as AndNode<SqlLiteralNode[]>).children[1].value).toStrictEqual('INNER2');
    });
  });

  describe('toString', () => {
    it('should return the correct value', async () => {
      expect(toString('input')).toStrictEqual('input');
      expect(toString({ toString: () => 'input' })).toStrictEqual('input');
    });
  });

  describe('isNodeOrAttribute', () => {
    it('should return the correct value', async () => {
      const node = new SqlLiteralNode('Test');
      const attribute = new UnknownAttribute(new Table('test'), 'attribute');
      const other = 123;

      expect(isNodeOrAttribute(node)).toBe(true);
      expect(isNodeOrAttribute(attribute)).toBe(true);
      expect(isNodeOrAttribute(other)).toBe(false);
    });
  });

  describe('buildQuoted', () => {
    it('should return the correct value for non-attribute', async () => {
      const result = buildQuoted(123);
      expect(result).toBeInstanceOf(QuotedNode);
      expect(result.value).toStrictEqual(123);
    });

    it('should return the correct value for attribute', async () => {
      const attribute = new UnknownAttribute(new Table('test'), 'attribute');
      const result = buildQuoted(123, attribute);
      expect(result).toBeInstanceOf(CastedNode);
      expect(result.attribute).toStrictEqual(attribute);
      expect(result.value).toStrictEqual(123);
    });
  });

  describe('castOrQuote', () => {
    it('should return the correct value for non-attribute', async () => {
      const node = new SqlLiteralNode('TEST');
      const result = castOrQuote(123, node);
      expect(result).toBeInstanceOf(QuotedNode);
      expect(result.value).toStrictEqual(123);
    });

    it('should return the correct value for attribute', async () => {
      const attribute = new UnknownAttribute(new Table('test'), 'attribute');
      const result = castOrQuote(123, attribute);
      expect(result).toBeInstanceOf(CastedNode);
      expect((result as CastedNode<123>).attribute).toStrictEqual(attribute);
      expect(result.value).toStrictEqual(123);
    });
  });
});
