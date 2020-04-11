import { buildQuoted, isNodeOrAttribute } from '../../helper/helper';
import { AnyNodeOrAttribute, UnknownNativeType } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';
import { UnaryNode } from '../unary.node';

@register('case')
export class CaseNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends ExpressionsNode {
  public conditions: Array<WhenNode<AnyNodeOrAttribute, RhsType | AnyNodeOrAttribute>> = [];

  constructor(
    public readonly caseValue: LhsType,
    public elseValue: ElseNode<RhsType | AnyNodeOrAttribute> = new ElseNode(buildQuoted(null)),
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
}

// tslint:disable-next-line:max-classes-per-file
export class WhenNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
}

// tslint:disable-next-line:max-classes-per-file
export class ElseNode<Type extends AnyNodeOrAttribute> extends UnaryNode<Type> {
}
