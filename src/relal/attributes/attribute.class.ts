import { include } from '../helper/mixin';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { VisitInterface } from '../interfaces/visit.interface';
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
export abstract class Attribute implements VisitInterface {
  constructor(
    public readonly table: Table<unknown> | TableAliasNode<Table<unknown> | SelectStatementNode>,
    public readonly name: string,
  ) {
  }

  public visit(collector: unknown, visitChild: (element: AnyNodeOrAttribute) => void): void {
    // Intentionally blank
    console.log(collector, visitChild);
    console.log(`Attribute.visit ${this.table.name}, ${this.name}`);
  }
}

export interface Attribute extends VisitInterface, AliasPredications<Attribute>, Expressions<Attribute>, MathMethods<Attribute>, OrderPredications<Attribute>, Predications<Attribute> {
}

InternalConstants.attributeClass = Attribute;
