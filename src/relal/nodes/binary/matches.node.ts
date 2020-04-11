import { AnyNodeOrAttribute } from '../../interfaces/node-types.interface';
import { BinaryNode } from '../binary.node';
import { register } from '../nodes.register';

@register('matches')
export class MatchesNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends BinaryNode<LhsType, RhsType> {
  constructor(
    left: LhsType,
    right: RhsType,
    public readonly escape: unknown | null = null,
    public readonly caseSensitive: boolean = false,
  ) {
    super(left, right);
  }
}

// tslint:disable-next-line:max-classes-per-file
@register('does-not-match')
export class DoesNotMatchNode<LhsType extends AnyNodeOrAttribute, RhsType extends AnyNodeOrAttribute> extends MatchesNode<LhsType, RhsType> {
}
