import { AliasPredications, Expressions, include, MathMethods, Node, OrderPredications, Predications } from '..';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class ExpressionsNode extends Node {
}

export interface ExpressionsNode
  extends Node, AliasPredications<ExpressionsNode>,
    Expressions<ExpressionsNode>, MathMethods<ExpressionsNode>,
    OrderPredications<ExpressionsNode>, Predications<ExpressionsNode> {
}
