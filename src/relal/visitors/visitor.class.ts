import { Collector } from '../collectors/collector.class';
import { SqlStringCollector } from '../collectors/sql-string.collector';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { CustomAttributeVisitFunction, CustomVisitFunction, VisitInterface } from '../interfaces/visit.interface';
import { InternalConstants } from '../internal-constants';

// tslint:disable-next-line:no-any
type CustomVisitorsMap = Map<any, CustomVisitFunction>;

export abstract class Visitor {
  protected customAttributeVisitor: CustomAttributeVisitFunction | undefined;
  private customVisitors: CustomVisitorsMap;

  constructor() {
    // Check if already set by decorators before initializing new value
    // tslint:disable-next-line
    this.customVisitors = this['customVisitors'] == null ? new Map() : this.customVisitors;
  }

  public accept<C extends Collector<unknown>>(object: AnyNodeOrAttribute, collector?: C): C | Collector<unknown> {
    // Initialize or use collector
    const ctor: Collector<unknown> = collector || new SqlStringCollector({
      quote: inputValue => `'${inputValue}'`,
      sanitizeSqlComment: inputValue => inputValue,
      tableName: inputValue => `"${inputValue}"`,
      columnName: inputValue => `"${inputValue}"`,
    });

    // Start visiting nodes
    this.visit(object, ctor);

    return ctor;
  }

  private visit<C extends Collector<unknown>>(object: VisitInterface | AnyNodeOrAttribute, collector: C): void {
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
      if (customVisitor == null || !(object instanceof InternalConstants.attributeClass)) {
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

// tslint:disable-next-line:no-any
export function visitorFor<T extends Visitor = any>(...nodeTypes: any[]): (target: T, propertyKey: keyof T) => void {
  return (target: T, propertyKey: keyof T) => {
    const visitFunction = target[propertyKey] as unknown as CustomVisitFunction;
    const self = (target as unknown as { customVisitors: CustomVisitorsMap });
    if (self.customVisitors == null) {
      self.customVisitors = new Map();
    }

    // Register visitFunction for each given node type
    nodeTypes.forEach(type => self.customVisitors.set(type, visitFunction));
  };
}
