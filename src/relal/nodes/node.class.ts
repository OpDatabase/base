import { Collector } from '../collectors/collector.class';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { VisitInterface } from '../interfaces/visit.interface';
import { InternalConstants } from '../internal-constants';
import { OrNode } from './binary.node';
import { AndNode } from './expressions/and.node';
import { node } from './nodes.register';
import { NotNode } from './unary.node';

export abstract class Node implements VisitInterface {
  public fetchAttribute(): void {
    // Intentionally blank
  }

  public not(): NotNode<this> {
    const notNode: typeof NotNode = node('not');

    return new notNode(this);
  }

  public or<OtherType extends AnyNodeOrAttribute>(other: OtherType): OrNode<this, OtherType> {
    const orNode: typeof OrNode = node('or');

    return new orNode(this, other);
  }

  public and(...others: AnyNodeOrAttribute[]): AndNode<AnyNodeOrAttribute[]> {
    const andNode: typeof AndNode = node('and');

    return new andNode([this, ...others]);
  }

  public abstract visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void;

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
      if (index < elements.length - 2) {
        collector.add(joinString);
      }
    });
  }
}

InternalConstants.nodeClass = Node;
