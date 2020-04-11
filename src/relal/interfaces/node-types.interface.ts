import { Attribute } from '../attributes/attribute.class';
import { CastedNode } from '../nodes/expressions/casted.node';
import { Node } from '../nodes/node.class';
import { QuotedNode } from '../nodes/unary/quoted.node';

export type AnyNodeOrAttribute = Node | Attribute;

export type ConvertibleToString = string | { toString(): string };

export type UnknownNativeType = string | number | boolean | null;

export type CastedOrQuotedNode<T extends UnknownNativeType> = CastedNode<T> | QuotedNode<T>;
