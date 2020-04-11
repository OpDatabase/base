import { ExpressionsNode } from '../expressions.node';
import { register } from '../nodes.register';

@register('distinct')
export class DistinctNode extends ExpressionsNode {
}
