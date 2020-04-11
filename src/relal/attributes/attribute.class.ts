import { include } from '../helper/mixin';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class Attribute {
}

export interface Attribute extends AliasPredications<Attribute>, Expressions<Attribute>, MathMethods<Attribute>, OrderPredications<Attribute>, Predications<Attribute> {
}
