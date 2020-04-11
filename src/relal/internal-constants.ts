import { Attribute } from './attributes/attribute.class';
import { Node } from './nodes/node.class';
import { SelectManager } from './select-manager.class';
import { Table } from './table.class';

export abstract class InternalConstants {
  public static tableClass: typeof Table;
  public static attributeClass: typeof Attribute;
  public static nodeClass: typeof Node;
  public static selectManagerClass: typeof SelectManager;
}
