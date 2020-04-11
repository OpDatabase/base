import { include } from '../helper/mixin';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';
import { Node } from './node.class';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class ExpressionsNode extends Node {
}

export interface ExpressionsNode
  extends Node, AliasPredications<ExpressionsNode>,
    Expressions<ExpressionsNode>, MathMethods<ExpressionsNode>,
    OrderPredications<ExpressionsNode>, Predications<ExpressionsNode> {
}
