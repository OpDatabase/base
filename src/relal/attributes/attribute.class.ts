import { AliasPredications } from '../interfaces/alias-predications.interface';
import { Expressions } from '../interfaces/expressions.interface';
import { MathMethods } from '../interfaces/math-methods.interface';
import { OrderPredications } from '../interfaces/order-predications.interface';
import { Predications } from '../interfaces/predications.interface';

export abstract class Attribute implements AliasPredications, Expressions, MathMethods, OrderPredications, Predications {

}
