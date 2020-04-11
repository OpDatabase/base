import { Collector } from '../collectors/collector.class';
import { SqlStringCollector } from '../collectors/sql-string.collector';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { CustomAttributeVisitFunction, CustomVisitFunction } from '../interfaces/visit.interface';
import { InternalConstants } from '../internal-constants';
import { Node } from '../nodes/node.class';

// tslint:disable-next-line:no-any
type CustomVisitorsMap = Map<any, CustomVisitFunction>;

export abstract class Visitor {
  protected customAttributeVisitor: CustomAttributeVisitFunction | undefined;
  private customVisitors: CustomVisitorsMap = new Map();

  public accept<C extends Collector<unknown>>(object: AnyNodeOrAttribute, collector?: C): void {
    // Start visiting nodes
    this.visit(object, collector || new SqlStringCollector());
  }

  private visit<C extends Collector<unknown>>(object: AnyNodeOrAttribute, collector: C): void {
    if (object instanceof InternalConstants.nodeClass) {
      // Check if there has been a custom visit function defined for the given object type
      const customVisitor = this.customVisitors.get(object.constructor);
      if (customVisitor == null) {
        // Use Node's default visit function
        object.visit(collector, element => {
          this.visit(element, collector);
        });
      } else {
        // Use custom visit function instead
        customVisitor(object, collector, element => {
          this.visit(element, collector);
        });
      }
    } else {
      // Check if there has been a custom visit function defined for attributes
      const customVisitor = this.customAttributeVisitor;
      if (customVisitor == null) {
        // Use Attributes's default visit function
        object.visit(collector, element => {
          this.visit(element, collector);
        });
      } else {
        // Use custom visit function instead
        customVisitor(object, collector, element => {
          this.visit(element, collector);
        });
      }
    }

  }
}

export function visitorFor<T extends Visitor>(...nodeTypes: Node[]): (target: T, propertyKey: keyof T) => void {
  return (target: T, propertyKey: keyof T) => {
    const visitFunction = target[propertyKey] as unknown as CustomVisitFunction;
    const visitorsMap = (target as unknown as { customVisitors: CustomVisitorsMap }).customVisitors;

    // Register visitFunction for each given node type
    nodeTypes.forEach(type => visitorsMap.set(type, visitFunction));
  };
}
