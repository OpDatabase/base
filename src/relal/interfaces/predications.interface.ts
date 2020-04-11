import {
  AndNode,
  AnyNodeOrAttribute,
  BetweenNode,
  CaseNode,
  ConcatNode,
  ConvertibleToString,
  DoesNotMatchNode,
  EqualityNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  GroupingNode,
  InNode,
  IsDistinctFromNode,
  IsNotDistinctFromNode,
  LessThanNode,
  LessThanOrEqualNode,
  MatchesNode,
  Node,
  NotEqualNode,
  NotInNode,
  NotRegexNode,
  OrNode,
  QuotedNode,
  RegexNode,
  SelectManager,
  UnknownNativeType,
} from '..';

export interface PredicationsInterface<BaseType extends AnyNodeOrAttribute> {
  notEqual(other: UnknownNativeType | AnyNodeOrAttribute): NotEqualNode<BaseType, AnyNodeOrAttribute>;

  notEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  notEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  /*
  notEqualAll<
    Input extends UnknownNativeType[] | [],
    Output extends {
    [Key in keyof Input]: NotEqualNode<BaseType, CastedOrQuotedNode<Input[Key] extends UnknownNativeType ? Input[Key] : never>>
  }>(others: Input): GroupingNode<AndNode<Output extends Node[] ? Output : Node[]>>;
  notEqualAll<
    Input extends AnyNodeOrAttribute[] | [],
    Output extends {
      [Key in keyof Input]: NotEqualNode<BaseType, Input[Key] extends AnyNodeOrAttribute ? Input[Key] : never>
    }>(others: Input): GroupingNode<AndNode<Output extends Node[] ? Output : Node[]>>;
   */

  equal(other: UnknownNativeType | AnyNodeOrAttribute): EqualityNode<BaseType, AnyNodeOrAttribute>;

  equalAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  equalAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  isNotDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsNotDistinctFromNode<BaseType, AnyNodeOrAttribute>;

  isDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsDistinctFromNode<BaseType, AnyNodeOrAttribute>;

  between(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): BetweenNode<BaseType, AndNode<AnyNodeOrAttribute[]>>;

  notBetween(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): OrNode<LessThanNode<BaseType, AnyNodeOrAttribute>, GreaterThanNode<BaseType, AnyNodeOrAttribute>>;

  in(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): InNode<BaseType, AnyNodeOrAttribute>;

  inAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>>;

  inAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>>;

  notIn(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): NotInNode<BaseType, AnyNodeOrAttribute>;

  notInAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>>;

  notInAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>>;

  matches(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): MatchesNode<BaseType, QuotedNode<string>>;

  matchesRegex(other: RegExp, caseSensitive?: boolean): RegexNode<BaseType>;

  matchesAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>>;

  matchesAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>>;

  doesNotMatch(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): DoesNotMatchNode<BaseType, QuotedNode<string>>;

  doesNotMatchRegex(other: RegExp, caseSensitive?: boolean): NotRegexNode<BaseType>;

  doesNotMatchAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>>;

  doesNotMatchAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>>;

  greaterThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanOrEqualNode<BaseType, AnyNodeOrAttribute>;

  greaterThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  greaterThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  greaterThan(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanNode<BaseType, AnyNodeOrAttribute>;

  greaterThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  greaterThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  lessThan(other: UnknownNativeType | AnyNodeOrAttribute): LessThanNode<BaseType, AnyNodeOrAttribute>;

  lessThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  lessThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  lessThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): LessThanOrEqualNode<BaseType, AnyNodeOrAttribute>;

  lessThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>>;

  lessThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>>;

  switchCase<ReturnType extends AnyNodeOrAttribute>(defaultValue: ReturnType): CaseNode<BaseType, ReturnType>;

  switchCase<ReturnType extends UnknownNativeType>(defaultValue: ReturnType): CaseNode<BaseType, QuotedNode<ReturnType>>;

  concat(other: AnyNodeOrAttribute | UnknownNativeType): ConcatNode<BaseType, AnyNodeOrAttribute>;
}
