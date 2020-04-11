import {
  AdditionNode,
  AliasPredicationsInterface,
  AndNode,
  AnyNodeOrAttribute,
  AscendingNode,
  AsNode,
  AvgNode,
  BetweenNode,
  BitwiseAndNode,
  BitwiseNotNode,
  BitwiseOrNode,
  BitwiseShiftLeftNode,
  BitwiseShiftRightNode,
  BitwiseXorNode,
  buildQuoted,
  CaseNode,
  ConcatNode,
  ConvertibleToString,
  CountNode,
  DescendingNode,
  DivisionNode,
  DoesNotMatchNode,
  ElseNode,
  EqualityNode,
  ExpressionsInterface,
  ExtractNode,
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
  MathMethodsInterface,
  MaxNode,
  MinNode,
  MultiplicationNode,
  Node,
  NotEqualNode,
  NotInNode,
  NotRegexNode,
  OrderPredicationsInterface,
  OrNode,
  PredicationsInterface,
  QuotedNode,
  RegexNode,
  SelectManager,
  SqlLiteralNode,
  SubtractionNode,
  SumNode,
  toString,
  UnknownNativeType,
} from '..';

export abstract class Attribute
  implements AliasPredicationsInterface<Attribute>, ExpressionsInterface<Attribute>,
    MathMethodsInterface<Attribute>, OrderPredicationsInterface<Attribute>, PredicationsInterface<Attribute> {

  public as(other: ConvertibleToString): AsNode<this, SqlLiteralNode> {
    return new AsNode(this, new SqlLiteralNode(other));
  }

  public average(): AvgNode<this> {
    return new AvgNode(this);
  }

  public count(distinct: boolean = false): CountNode<this> {
    return new CountNode(this, distinct);
  }

  public extract(field: ConvertibleToString): ExtractNode<this> {
    return new ExtractNode(this, field);
  }

  public maximum(): MaxNode<this> {
    return new MaxNode(this);
  }

  public minimum(): MinNode<this> {
    return new MinNode(this);
  }

  public sum(): SumNode<this> {
    return new SumNode(this);
  }

  public bitwiseAnd<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseAndNode<this, OtherType>> {
    return new GroupingNode(new BitwiseAndNode(this, other));
  }

  public bitwiseNot(): BitwiseNotNode<this> {
    return new BitwiseNotNode(this);
  }

  public bitwiseOr<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseOrNode<this, OtherType>> {
    return new GroupingNode(new BitwiseOrNode(this, other));
  }

  public bitwiseShiftLeft<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftLeftNode<this, OtherType>> {
    return new GroupingNode(new BitwiseShiftLeftNode(this, other));
  }

  public bitwiseShiftRight<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseShiftRightNode<this, OtherType>> {
    return new GroupingNode(new BitwiseShiftRightNode(this, other));
  }

  public bitwiseXor<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<BitwiseXorNode<this, OtherType>> {
    return new GroupingNode(new BitwiseXorNode(this, other));
  }

  public divide<OtherType extends AnyNodeOrAttribute>(other: OtherType): DivisionNode<this, OtherType> {
    return new DivisionNode(this, other);
  }

  public minus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<SubtractionNode<this, OtherType>> {
    return new GroupingNode(new SubtractionNode(this, other));
  }

  public multiply<OtherType extends AnyNodeOrAttribute>(other: OtherType): MultiplicationNode<this, OtherType> {
    return new MultiplicationNode(this, other);
  }

  public plus<OtherType extends AnyNodeOrAttribute>(other: OtherType): GroupingNode<AdditionNode<this, OtherType>> {
    return new GroupingNode(new AdditionNode(this, other));
  }

  public asc(): AscendingNode<this> {
    return new AscendingNode(this);
  }

  public desc(): DescendingNode<this> {
    return new DescendingNode(this);
  }

  public between(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): BetweenNode<this, AndNode<AnyNodeOrAttribute[]>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : buildQuoted(lowerBoundary, this);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : buildQuoted(upperBoundary, this);

    return new BetweenNode(this, lowerBoundaryNode.and(upperBoundaryNode));
  }

  public concat(other: AnyNodeOrAttribute | UnknownNativeType): ConcatNode<this, AnyNodeOrAttribute> {
    return new ConcatNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public doesNotMatch(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): DoesNotMatchNode<this, QuotedNode<string>> {
    return new DoesNotMatchNode(this, buildQuoted(toString(other)), escape, caseSensitive);
  }

  public doesNotMatchAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchRegex(other: RegExp, caseSensitive?: boolean): NotRegexNode<this> {
    return new NotRegexNode(this, other, caseSensitive);
  }

  public equal(other: UnknownNativeType | AnyNodeOrAttribute): EqualityNode<this, AnyNodeOrAttribute> {
    return new EqualityNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public equalAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.equal(other)));
  }

  public equalAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.equal(other)));
  }

  public greaterThan(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanNode<this, AnyNodeOrAttribute> {
    return new GreaterThanNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public greaterThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThan(other)));
  }

  public greaterThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThan(other)));
  }

  public greaterThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanOrEqualNode<this, AnyNodeOrAttribute> {
    return new GreaterThanOrEqualNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public greaterThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThanOrEqual(other)));
  }

  public greaterThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThanOrEqual(other)));
  }

  public lessThan(other: UnknownNativeType | AnyNodeOrAttribute): LessThanNode<this, AnyNodeOrAttribute> {
    return new LessThanNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public lessThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThan(other)));
  }

  public lessThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThan(other)));
  }

  public lessThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): LessThanOrEqualNode<this, AnyNodeOrAttribute> {
    return new LessThanOrEqualNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public lessThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThanOrEqual(other)));
  }

  public lessThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThanOrEqual(other)));
  }

  public notEqual(other: UnknownNativeType | AnyNodeOrAttribute): NotEqualNode<this, AnyNodeOrAttribute> {
    return new NotEqualNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public notEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notEqual(other)));
  }

  public notEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notEqual(other)));
  }

  public in(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): InNode<this, AnyNodeOrAttribute> {
    if (other instanceof SelectManager) {
      return new InNode(this, other.ast);
    } else if (other instanceof Array) {
      return new InNode(this, new InValuesNode(other.map(o => buildQuoted(o, this))));
    } else if (isNodeOrAttribute(other)) {
      return new InNode(this, other);
    } else {
      return new InNode(this, buildQuoted(other));
    }
  }

  public inAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.in(other)));
  }

  public inAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.in(other)));
  }

  public isDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsDistinctFromNode<this, AnyNodeOrAttribute> {
    return new IsDistinctFromNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public isNotDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsNotDistinctFromNode<this, AnyNodeOrAttribute> {
    return new IsNotDistinctFromNode(this, isNodeOrAttribute(other) ? other : buildQuoted(other, this));
  }

  public matches(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): MatchesNode<this, QuotedNode<string>> {
    return new MatchesNode(this, buildQuoted(toString(other)), escape, caseSensitive);
  }

  public matchesAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesRegex(other: RegExp, caseSensitive?: boolean): RegexNode<this> {
    return new RegexNode(this, other, caseSensitive);
  }

  public notBetween(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): OrNode<LessThanNode<this, AnyNodeOrAttribute>, GreaterThanNode<this, AnyNodeOrAttribute>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : buildQuoted(lowerBoundary, this);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : buildQuoted(upperBoundary, this);

    return this.lessThan(lowerBoundaryNode).or(this.greaterThan(upperBoundaryNode));
  }

  public notIn(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]): NotInNode<this, AnyNodeOrAttribute> {
    if (other instanceof SelectManager) {
      return new NotInNode(this, other.ast);
    } else if (other instanceof Array) {
      return new NotInNode(this, new InValuesNode(other.map(o => buildQuoted(o, this))));
    } else if (isNodeOrAttribute(other)) {
      return new NotInNode(this, other);
    } else {
      return new NotInNode(this, buildQuoted(other));
    }
  }

  public notInAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notIn(other)));
  }

  public notInAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notIn(other)));
  }

  public switchCase<ReturnType extends AnyNodeOrAttribute>(defaultValue: ReturnType): CaseNode<this, ReturnType>;
  public switchCase<ReturnType extends UnknownNativeType>(defaultValue: ReturnType): CaseNode<this, QuotedNode<ReturnType>>;
  public switchCase(defaultValue?: AnyNodeOrAttribute | UnknownNativeType): CaseNode<this, AnyNodeOrAttribute> {
    if (defaultValue === undefined) {
      return new CaseNode(this);
    } else if (isNodeOrAttribute(defaultValue)) {
      return new CaseNode(this, new ElseNode(defaultValue));
    } else {
      return new CaseNode(this, new ElseNode(buildQuoted(defaultValue)));
    }
  }
}
