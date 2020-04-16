import { Collector } from '../collectors/collector.class';
import { toString } from '../helper/helper';
import { ConvertibleToString } from '../interfaces/node-types.interface';
import { Node } from './node.class';
import { register } from './nodes.register';

/**
 * This node is converted "as is" into an SQL string.
 * There is no escaping / quoting whatsoever.
 * Therefore: Use with caution.
 */
@register('sql-literal')
export class SqlLiteralNode extends Node {
  constructor(
    public readonly value: ConvertibleToString,
  ) {
    super();
  }

  public visit(collector: Collector<unknown>): void {
    collector.add(toString(this.value));
  }
}
