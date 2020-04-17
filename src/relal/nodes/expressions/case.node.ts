// tslint:disable:max-classes-per-file
import { Collector } from '../../collectors/collector.class';
import { buildQuoted, isNodeOrAttribute } from '../../helper/helper';
import { AnyNodeOrAttribute, UnknownNativeType } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

// IMPORTANT: ElseNode must be loaded before CaseNode to have it initialized once the @register decorator of CaseNode is loaded

/**
 * Renders a `WHEN ... THEN ...` statement within a `CASE` statement.
 */
@register('when')
export class WhenNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('WHEN ');
    visitChild(this.left);
    collector.add(' THEN ');
    visitChild(this.right);
  }
}

/**
 * Renders an `ELSE` statement within a `CASE` statement.
 */
@register('else')
export class ElseNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    collector.add('ELSE ');
    visitChild(this.value);
  }
}

/**
 * Renders a `CASE` statement containing multiple `WHEN ... THEN ...` conditions and an `ELSE` value.
 */
@register('case')
export class CaseNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends ExpressionsNode {
  public conditions: Array<WhenNode<AnyNodeOrAttribute, RhsType | AnyNodeOrAttribute>> = [];

  constructor(
    public readonly caseValue: LhsType,
    public elseValue: ElseNode<RhsType | AnyNodeOrAttribute> | null = null,
  ) {
    super();
  }

  public when(condition: AnyNodeOrAttribute | UnknownNativeType, expression?: RhsType): this {
    this.conditions.push(new WhenNode(
      isNodeOrAttribute(condition) ? condition : buildQuoted(condition),
      expression === undefined ? buildQuoted(null) : expression,
    ));

    return this;
  }

  public then(expression: RhsType): this {
    // todo: buildQuoted for expression
    const lastCondition = this.conditions[this.conditions.length - 1];
    lastCondition.right = expression;

    return this;
  }

  public default(expression: RhsType): this {
    // todo: buildQuoted for expression
    this.elseValue = new ElseNode(expression);

    return this;
  }

  public visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Check if this has at least 1 condition -> cancel otherwise
    if (this.conditions.length === 0) {
      console.warn('Cannot create CASE statement without conditions, block is ignored.');

      return;
    }

    collector.add('CASE ');

    // Add case
    visitChild(this.caseValue);
    collector.add(' ');

    // Add all conditions
    this.conditions.forEach(condition => {
      visitChild(condition);
      collector.add(' ');
    });

    // Add default value
    if (this.elseValue != null) {
      visitChild(this.elseValue);
      collector.add(' ');
    }

    collector.add('END');
  }
}
