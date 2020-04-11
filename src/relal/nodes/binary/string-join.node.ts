import { JoinNode } from '../binary.node';
import { register } from '../nodes.register';
import { SqlLiteralNode } from '../sql-literal-node';

/**
 * Performs a string using just a user-specified join statement.
 */
@register('string-join')
export class StringJoinNode extends JoinNode<SqlLiteralNode, null> {
}
