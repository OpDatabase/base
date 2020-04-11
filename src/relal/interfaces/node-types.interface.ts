import { Attribute, CastedNode, Node, QuotedNode } from '..';

export type AnyNodeOrAttribute = Node | Attribute;

export type ConvertibleToString = string | { toString(): string };

export type UnknownNativeType = string | number | boolean | null;

export type CastedOrQuotedNode<T extends UnknownNativeType> = CastedNode<T> | QuotedNode<T>;
