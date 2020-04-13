import { Collector } from '../collectors/collector.class';
import { include } from '../helper/mixin';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { VisitInterface } from '../interfaces/visit.interface';
import { InternalConstants } from '../internal-constants';
import { AliasPredications } from '../mixins/alias-predications.mixin';
import { Expressions } from '../mixins/expressions.mixin';
import { MathMethods } from '../mixins/math-methods.mixin';
import { OrderPredications } from '../mixins/order-predications.mixin';
import { Predications } from '../mixins/predications.mixin';
import { OrNode } from './binary.node';
import { AndNode } from './expressions/and.node';
import { node } from './nodes.register';
import { NotNode } from './unary.node';
import { GroupingNode } from './unary/grouping.node';

@include(AliasPredications, Expressions, MathMethods, OrderPredications, Predications)
export abstract class Node implements VisitInterface {
  public fetchAttribute(): void {
    // Intentionally blank
  }

  public not(): NotNode<this> {
    const notNode: typeof NotNode = node('not');

    return new notNode(this);
  }

  public or<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<OrNode<this, OtherType>> {
    const groupingNode: typeof GroupingNode = node('grouping');
    const orNode: typeof OrNode = node('or');

    return new groupingNode(new orNode(this, other));
  }

  public and(...others: AnyNodeOrAttribute[]): AndNode<AnyNodeOrAttribute[]> {
    const andNode: typeof AndNode = node('and');

    return new andNode([this, ...others]);
  }

  public abstract visit(collector: Collector<unknown>, visitChild: (element: VisitInterface) => void): void;

  /**
   * Visits each element given, collecting a string joined by joinString.
   * @param elements
   * @param joinString
   * @param collector
   * @param visitChild
   */
  protected visitEach(
    elements: AnyNodeOrAttribute[],
    joinString: string,
    collector: Collector<unknown>,
    visitChild: (element: AnyNodeOrAttribute) => void,
  ): void {
    elements.forEach((value, index) => {
      visitChild(value);

      // Omit the last element to add ","
      // tslint:disable-next-line:no-magic-numbers
      if (index < elements.length - 1) {
        collector.add(joinString);
      }
    });
  }
}

export interface Node extends VisitInterface, AliasPredications<Node>, Expressions<Node>, MathMethods<Node>, OrderPredications<Node>, Predications<Node> {
}

InternalConstants.nodeClass = Node;
