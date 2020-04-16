// tslint:disable:max-classes-per-file
import { Collector } from '../collectors/collector.class';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { InValuesNode } from './binary/equality/in.node';
import { SelectStatementNode } from './expressions/select-statement.node';
import { Node } from './node.class';
import { node, register } from './nodes.register';
import { SelectCoreNode } from './select-core.node';
import { SqlLiteralNode } from './sql-literal.node';
import { OnNode } from './unary.node';

export abstract class BinaryNode<LhsType, RhsType> extends Node {
  constructor(
    public left: LhsType,
    public right: RhsType,
  ) {
    super();
  }

  // todo FetchAttribute
}

/**
 * Renders a `BETWEEN` statement
 */
@register('between')
export class BetweenNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' BETWEEN ');
    visitChild(this.right);
  }
}

/**
 * Renders an `NOT IN (...)` statement.
 * If the right-hand side is InValuesNode, all values will be rendered within as comma separated values.
 * If the right-hand side is empty or null, 1=1 will be added to the SQL statement.
 */
@register('not-in')
export class NotInNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType | null> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    const inValuesNode: typeof InValuesNode = node('in-values');
    if ((this.right instanceof inValuesNode && this.right.value.length === 0) || this.right === null) {
      collector.add(' 1=1 ');
    } else {
      visitChild(this.left);
      collector.add(' NOT IN (');
      visitChild(this.right);
      collector.add(')');
    }
  }
}

/**
 * Renders a `>` statement
 */
@register('greater-than')
export class GreaterThanNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' > ');
    visitChild(this.right);
  }
}

/**
 * Renders a `>=` statement
 */
@register('greater-than-or-equal')
export class GreaterThanOrEqualNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' >= ');
    visitChild(this.right);
  }
}

/**
 * Renders a `!=` OR `IS NOT NULL` statement
 */
@register('not-equal')
export class NotEqualNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType | null> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    if (this.right == null) {
      collector.add(' IS NOT NULL');
    } else {
      collector.add(' != ');
      visitChild(this.right);
    }
  }
}

/**
 * Renders a `<` statement
 */
@register('less-than')
export class LessThanNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' < ');
    visitChild(this.right);
  }
}

/**
 * Renders a `<=` statement
 */
@register('less-than-or-equal')
export class LessThanOrEqualNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' <= ');
    visitChild(this.right);
  }
}

/**
 * Renders an `OR` statement
 */
@register('or')
export class OrNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' OR ');
    visitChild(this.right);
  }
}

/**
 * Renders an `AS` statement
 */
@register('as')
export class AsNode<LhsType extends AnyNodeOrAttribute, RhsType extends SqlLiteralNode> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    visitChild(this.left);
    collector.add(' AS ');
    visitChild(this.right);
  }
}

// todo check purpose
// @register('assignment')
// export class AssignmentNode<LhsType, RhsType> extends BinaryNode<LhsType, RhsType> {
// }

// todo: OnNode<Node>
@register('join')
export abstract class JoinNode<LhsType extends SelectCoreNode | SqlLiteralNode, RhsType extends OnNode<Node> | null> extends BinaryNode<LhsType, RhsType | null> {
}

export type SetNode = UnionNode | UnionAllNode;

/**
 * Renders an `UNION` statement
 */
@register('union')
export class UnionNode extends BinaryNode<SelectStatementNode | SetNode, SelectStatementNode | SetNode> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    infixValueWithParenthesis(this, this.left, this.right, 'UNION', collector, visitChild);
  }
}

/**
 * Renders an `UNION ALL` statement
 */
@register('union-all')
export class UnionAllNode extends BinaryNode<SelectStatementNode | SetNode, SelectStatementNode | SetNode> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    infixValueWithParenthesis(this, this.left, this.right, 'UNION ALL', collector, visitChild);
  }
}

/**
 * Renders an `INTERSECT` statement
 */
@register('intersect')
export class IntersectNode extends BinaryNode<SelectStatementNode | SetNode, SelectStatementNode | SetNode> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('( ');
    visitChild(this.left);
    collector.add(' INTERSECT ');
    visitChild(this.right);
    collector.add(' )');
  }
}

/**
 * Renders an `EXCEPT` statement
 */
@register('except')
export class ExceptNode extends BinaryNode<SelectStatementNode | SetNode, SelectStatementNode | SetNode> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('( ');
    visitChild(this.left);
    collector.add(' EXCEPT ');
    visitChild(this.right);
    collector.add(' )');
  }
}

// Helper functions
function isSetNode(value: AnyNodeOrAttribute): value is SetNode {
  return value instanceof UnionNode || value instanceof UnionAllNode || value instanceof IntersectNode || value instanceof ExceptNode;
}

function infixValueWithParenthesis(
  object: AnyNodeOrAttribute,
  left: SelectStatementNode | SetNode,
  right: SelectStatementNode | SetNode,
  method: string,
  collector: Collector<unknown>,
  visitChild: (element: AnyNodeOrAttribute) => void,
  suppressParenthesis: boolean = false,
): void {
  // Add initial parenthesis
  if (!suppressParenthesis) {
    collector.add('( ');
  }

  // Left side
  if (isSetNode(left) && left instanceof object.constructor) {
    infixValueWithParenthesis(
      left,
      left.left,
      left.right,
      method,
      collector,
      visitChild,
      true,
    );
  } else {
    visitChild(left);
  }

  // Method statement
  collector.add(` ${method} `);

  // Right side
  if (isSetNode(right) && right instanceof object.constructor) {
    infixValueWithParenthesis(
      right,
      right.left,
      right.right,
      method,
      collector,
      visitChild,
      true,
    );
  } else {
    visitChild(right);
  }

  // Add final parenthesis
  if (!suppressParenthesis) {
    collector.add(' )');
  }
}
