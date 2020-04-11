import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { register } from '../nodes.register';

@register('regex')
export class RegexNode<LhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RegExp> {
  constructor(
    left: LhsType,
    right: RegExp,
    public readonly caseSensitive: boolean = true,
  ) {
    super(left, right);
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('not-regex')
export class NotRegexNode<LhsType extends AnyNodeOrAttribute> extends RegexNode<LhsType> {
}
