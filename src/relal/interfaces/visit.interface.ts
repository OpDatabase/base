import { Attribute } from '../attributes/attribute.class';
import { Collector } from '../collectors/collector.class';
import { Node } from '../nodes/node.class';
import { AnyNodeOrAttribute } from './node-types.interface';

export interface VisitInterface {
  visit(collector: Collector<unknown>, visitChild: (element: AnyNodeOrAttribute) => void): void;
}

export type CustomVisitFunction = (
  object: Node,
  collector: Collector<unknown>,
  visitChild: (element: AnyNodeOrAttribute) => void,
) => void;

export type CustomAttributeVisitFunction = (
  object: Attribute,
  collector: Collector<unknown>,
  visitChild: (element: AnyNodeOrAttribute) => void,
) => void;
