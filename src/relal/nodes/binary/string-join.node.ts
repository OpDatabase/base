import { JoinNode } from '../binary.node';
import { SqlLiteralNode } from '../sql-literal-node';

/**
 * Performs a string using just a user-specified join statement.
 */
export class StringJoinNode extends JoinNode<SqlLiteralNode, null> {
}
