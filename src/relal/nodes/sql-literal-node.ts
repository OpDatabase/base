import { Collector } from '../collectors/collector.class';
import { toString } from '../helper/helper';
import { include } from '../helper/mixin';
import { ConvertibleToString } from '../interfaces/node-types.interface';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';
import { Node } from './node.class';
import { register } from './nodes.register';

/**
 * This node is converted "as is" into an SQL string.
 * There is no escaping / quoting whatsoever.
 * Therefore: Use with caution.
 */
@register('sql-literal')
@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export class SqlLiteralNode extends Node {
  constructor(
    public readonly value: ConvertibleToString,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(toString(this.value));
  }
}

export interface SqlLiteralNode
  extends Node, AliasPredications<SqlLiteralNode>,
    Expressions<SqlLiteralNode>, MathMethods<SqlLiteralNode>,
    OrderPredications<SqlLiteralNode>, Predications<SqlLiteralNode> {
}

