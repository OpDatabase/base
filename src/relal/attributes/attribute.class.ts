import { mix } from 'ts-mixer';
import { Collector } from '../collectors/collector.class';
import { UnknownNativeType } from '../interfaces/node-types.interface';
import { VisitInterface } from '../interfaces/visit.interface';
import { InternalConstants } from '../internal-constants';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';
import { TableWithAlias } from '../table-with-alias.class';
import { Table } from '../table.class';

@mix(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class Attribute implements VisitInterface {
  constructor(
    public readonly table: Table<unknown> | TableWithAlias<unknown>,
    public readonly name: string,
  ) {
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(collector.adapter.tableName(this.table.name));
    collector.add('.');
    collector.add(collector.adapter.columnName(this.name));
  }

  public abstract typeCastForDatabase(inputValue: UnknownNativeType): string;
}

export interface Attribute extends VisitInterface, AliasPredications<Attribute>, Expressions<Attribute>, MathMethods<Attribute>, OrderPredications<Attribute>, Predications<Attribute> {
}

InternalConstants.attributeClass = Attribute;
