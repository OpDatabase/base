import { include } from '../helper/mixin';
import { InternalConstants } from '../internal-constants';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';
import { TableAliasNode } from '../nodes/binary/table-alias.node';
import { SelectStatementNode } from '../nodes/expressions/select-statement.node';
import { Table } from '../table.class';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class Attribute {
  constructor(
    public readonly table: Table<unknown> | TableAliasNode<Table<unknown> | SelectStatementNode>,
    public readonly name: string,
  ) {
  }
}

export interface Attribute extends AliasPredications<Attribute>, Expressions<Attribute>, MathMethods<Attribute>, OrderPredications<Attribute>, Predications<Attribute> {
}

InternalConstants.attributeClass = Attribute;
