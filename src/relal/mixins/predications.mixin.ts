import {
  AndNode,
  AnyNodeOrAttribute,
  Attribute,
  BetweenNode,
  buildQuoted,
  CaseNode,
  CastedNode,
  ConcatNode,
  ConvertibleToString,
  DoesNotMatchNode,
  ElseNode,
  EqualityNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  groupingAll,
  groupingAny,
  GroupingNode,
  InNode,
  InValuesNode,
  IsDistinctFromNode,
  isNodeOrAttribute,
  IsNotDistinctFromNode,
  LessThanNode,
  LessThanOrEqualNode,
  MatchesNode,
  Node,
  NotEqualNode,
  NotInNode,
  NotRegexNode,
  OrNode,
  PredicationsInterface,
  QuotedNode,
  RegexNode,
  SelectManager,
  toString,
  UnknownNativeType,
} from '..';

function quote<InputType extends UnknownNativeType>(
  other: InputType,
  maybeAttribute: AnyNodeOrAttribute,
): QuotedNode<InputType> | CastedNode<InputType> {
  return maybeAttribute instanceof Attribute ? buildQuoted(other, maybeAttribute) : buildQuoted(other);
}

export class Predications<Target extends AnyNodeOrAttribute> implements PredicationsInterface<Target> {
  public between(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): BetweenNode<Target, AndNode<AnyNodeOrAttribute[]>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : quote(lowerBoundary, this as unknown as Target);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : quote(upperBoundary, this as unknown as Target);

    return new BetweenNode(this as unknown as Target, lowerBoundaryNode.and(upperBoundaryNode));
  }

  public concat(other: AnyNodeOrAttribute | UnknownNativeType): ConcatNode<Target, AnyNodeOrAttribute> {
    return new ConcatNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public doesNotMatch(
    other: ConvertibleToString,
    escape?: ConvertibleToString,
    caseSensitive?: boolean,
  ): DoesNotMatchNode<Target, QuotedNode<string>> {
    return new DoesNotMatchNode(this as unknown as Target, buildQuoted(toString(other)), escape, caseSensitive);
  }

  public doesNotMatchAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchRegex(other: RegExp, caseSensitive?: boolean): NotRegexNode<Target> {
    return new NotRegexNode(this as unknown as Target, other, caseSensitive);
  }

  public equal(other: UnknownNativeType | AnyNodeOrAttribute): EqualityNode<Target, AnyNodeOrAttribute> {
    return new EqualityNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public equalAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.equal(other)));
  }

  public equalAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.equal(other)));
  }

  public greaterThan(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanNode<Target, AnyNodeOrAttribute> {
    return new GreaterThanNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public greaterThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThan(other)));
  }

  public greaterThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThan(other)));
  }

  public greaterThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanOrEqualNode<Target, AnyNodeOrAttribute> {
    return new GreaterThanOrEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public greaterThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThanOrEqual(other)));
  }

  public greaterThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThanOrEqual(other)));
  }

  public lessThan(other: UnknownNativeType | AnyNodeOrAttribute): LessThanNode<Target, AnyNodeOrAttribute> {
    return new LessThanNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public lessThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThan(other)));
  }

  public lessThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThan(other)));
  }

  public lessThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): LessThanOrEqualNode<Target, AnyNodeOrAttribute> {
    return new LessThanOrEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public lessThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThanOrEqual(other)));
  }

  public lessThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThanOrEqual(other)));
  }

  public notEqual(other: UnknownNativeType | AnyNodeOrAttribute): NotEqualNode<Target, AnyNodeOrAttribute> {
    return new NotEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public notEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notEqual(other)));
  }

  public notEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notEqual(other)));
  }

  public in(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): InNode<Target, AnyNodeOrAttribute> {
    if (other instanceof SelectManager) {
      return new InNode(this as unknown as Target, other.ast);
    } else if (other instanceof Array) {
      return new InNode(this as unknown as Target, new InValuesNode(other.map(o => quote(o, this as unknown as Target))));
    } else if (isNodeOrAttribute(other)) {
      return new InNode(this as unknown as Target, other);
    } else {
      return new InNode(this as unknown as Target, buildQuoted(other));
    }
  }

  public inAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.in(other)));
  }

  public inAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.in(other)));
  }

  public isDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsDistinctFromNode<Target, AnyNodeOrAttribute> {
    return new IsDistinctFromNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public isNotDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsNotDistinctFromNode<Target, AnyNodeOrAttribute> {
    return new IsNotDistinctFromNode(this as unknown as Target, isNodeOrAttribute(other) ? other : quote(other, this as unknown as Target));
  }

  public matches(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): MatchesNode<Target, QuotedNode<string>> {
    return new MatchesNode(this as unknown as Target, buildQuoted(toString(other)), escape, caseSensitive);
  }

  public matchesAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesRegex(other: RegExp, caseSensitive?: boolean): RegexNode<Target> {
    return new RegexNode(this as unknown as Target, other, caseSensitive);
  }

  public notBetween(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): OrNode<LessThanNode<Target, AnyNodeOrAttribute>, GreaterThanNode<Target, AnyNodeOrAttribute>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : quote(lowerBoundary, this as unknown as Target);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : quote(upperBoundary, this as unknown as Target);

    return this.lessThan(lowerBoundaryNode).or(this.greaterThan(upperBoundaryNode));
  }

  public notIn(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): NotInNode<Target, AnyNodeOrAttribute> {
    if (other instanceof SelectManager) {
      return new NotInNode(this as unknown as Target, other.ast);
    } else if (other instanceof Array) {
      return new NotInNode(this as unknown as Target, new InValuesNode(other.map(o => quote(o, this as unknown as Target))));
    } else if (isNodeOrAttribute(other)) {
      return new NotInNode(this as unknown as Target, other);
    } else {
      return new NotInNode(this as unknown as Target, buildQuoted(other));
    }
  }

  public notInAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notIn(other)));
  }

  public notInAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notIn(other)));
  }

  public switchCase<ReturnType extends AnyNodeOrAttribute>(defaultValue: ReturnType): CaseNode<Target, ReturnType>;
  public switchCase<ReturnType extends UnknownNativeType>(defaultValue: ReturnType): CaseNode<Target, QuotedNode<ReturnType>>;
  public switchCase(defaultValue?: AnyNodeOrAttribute | UnknownNativeType): CaseNode<Target, AnyNodeOrAttribute> {
    if (defaultValue === undefined) {
      return new CaseNode(this as unknown as Target);
    } else if (isNodeOrAttribute(defaultValue)) {
      return new CaseNode(this as unknown as Target, new ElseNode(defaultValue));
    } else {
      return new CaseNode(this as unknown as Target, new ElseNode(buildQuoted(defaultValue)));
    }
  }
}
