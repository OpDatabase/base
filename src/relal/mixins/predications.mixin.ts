import { buildQuoted, castOrQuote, groupingAll, groupingAny, isNodeOrAttribute, toString } from '../helper/helper';
import { AnyNodeOrAttribute, ConvertibleToString, UnknownNativeType } from '../interfaces/node-types.interface';
import { PredicationsInterface as PredicationsInterface } from '../interfaces/predications.interface';
import { InternalConstants } from '../internal-constants';
import {
  BetweenNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  LessThanNode,
  LessThanOrEqualNode,
  NotEqualNode,
  NotInNode,
  OrNode,
} from '../nodes/binary.node';
import { EqualityNode, IsDistinctFromNode, IsNotDistinctFromNode } from '../nodes/binary/equality.node';
import { InNode, InValuesNode } from '../nodes/binary/equality/in.node';
import { ConcatNode } from '../nodes/binary/infix-operation.node';
import { DoesNotMatchNode, MatchesNode } from '../nodes/binary/matches.node';
import { NotRegexNode, RegexNode } from '../nodes/binary/regex.node';
import { AndNode } from '../nodes/expressions/and.node';
import { CaseNode, ElseNode } from '../nodes/expressions/case.node';
import { Node } from '../nodes/node.class';
import { node } from '../nodes/nodes.register';
import { GroupingNode } from '../nodes/unary/grouping.node';
import { QuotedNode } from '../nodes/unary/quoted.node';
import { SelectManager } from '../select-manager.class';

export class Predications<Target extends AnyNodeOrAttribute> implements PredicationsInterface<Target> {
  public between(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): BetweenNode<Target, AndNode<AnyNodeOrAttribute[]>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : castOrQuote(lowerBoundary, this as unknown as Target);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : castOrQuote(upperBoundary, this as unknown as Target);
    const betweenNode: typeof BetweenNode = node('between');

    return new betweenNode(this as unknown as Target, lowerBoundaryNode.and(upperBoundaryNode));
  }

  public concat(other: AnyNodeOrAttribute | UnknownNativeType): ConcatNode<Target, AnyNodeOrAttribute> {
    const concatNode: typeof ConcatNode = node('concat');

    return new concatNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public doesNotMatch(
    other: ConvertibleToString,
    escape?: ConvertibleToString,
    caseSensitive?: boolean,
  ): DoesNotMatchNode<Target, QuotedNode<string>> {
    const doesNotMatchNode: typeof DoesNotMatchNode = node('does-not-match');

    return new doesNotMatchNode(this as unknown as Target, buildQuoted(toString(other)), escape == null ? null : toString(escape), caseSensitive);
  }

  public doesNotMatchAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.doesNotMatch(other, escape, caseSensitive)));
  }

  public doesNotMatchRegex(other: RegExp, caseSensitive?: boolean): NotRegexNode<Target> {
    const notRegexNode: typeof NotRegexNode = node('not-regex');

    return new notRegexNode(this as unknown as Target, other, caseSensitive);
  }

  public equal(other: UnknownNativeType | AnyNodeOrAttribute): EqualityNode<Target, AnyNodeOrAttribute> {
    const equalityNode: typeof EqualityNode = node('equality');

    return new equalityNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public equalAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.equal(other)));
  }

  public equalAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.equal(other)));
  }

  public greaterThan(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanNode<Target, AnyNodeOrAttribute> {
    const greaterThanNode: typeof GreaterThanNode = node('greater-than');

    return new greaterThanNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public greaterThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThan(other)));
  }

  public greaterThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThan(other)));
  }

  public greaterThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): GreaterThanOrEqualNode<Target, AnyNodeOrAttribute> {
    const greaterThanOrEqualNode: typeof GreaterThanOrEqualNode = node('greater-than-or-equal');

    return new greaterThanOrEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public greaterThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.greaterThanOrEqual(other)));
  }

  public greaterThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.greaterThanOrEqual(other)));
  }

  public lessThan(other: UnknownNativeType | AnyNodeOrAttribute): LessThanNode<Target, AnyNodeOrAttribute> {
    const lessThanNode: typeof LessThanNode = node('less-than');

    return new lessThanNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public lessThanAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThan(other)));
  }

  public lessThanAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThan(other)));
  }

  public lessThanOrEqual(other: UnknownNativeType | AnyNodeOrAttribute): LessThanOrEqualNode<Target, AnyNodeOrAttribute> {
    const lessThanOrEqualNode: typeof LessThanOrEqualNode = node('less-than-or-equal');

    return new lessThanOrEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public lessThanOrEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.lessThanOrEqual(other)));
  }

  public lessThanOrEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.lessThanOrEqual(other)));
  }

  public notEqual(other: UnknownNativeType | AnyNodeOrAttribute): NotEqualNode<Target, AnyNodeOrAttribute> {
    const notEqualNode: typeof NotEqualNode = node('not-equal');

    return new notEqualNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public notEqualAll(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notEqual(other)));
  }

  public notEqualAny(others: Array<UnknownNativeType | AnyNodeOrAttribute>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notEqual(other)));
  }

  public in(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]): InNode<Target, AnyNodeOrAttribute> {
    const inNode: typeof InNode = node('in');
    const inValuesNode: typeof InValuesNode = node('in-values');

    if (other instanceof InternalConstants.selectManagerClass) {
      return new inNode(this as unknown as Target, other.ast);
    } else if (other instanceof Array) {
      return new inNode(this as unknown as Target, new inValuesNode(other.map(o => castOrQuote(o, this as unknown as Target))));
    } else if (isNodeOrAttribute(other)) {
      return new inNode(this as unknown as Target, new inValuesNode([other]));
    } else {
      return new inNode(this as unknown as Target, new inValuesNode([buildQuoted(other)]));
    }
  }

  public inAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.in(other)));
  }

  public inAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.in(other)));
  }

  public isDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsDistinctFromNode<Target, AnyNodeOrAttribute> {
    const isDistinctFromNode: typeof IsDistinctFromNode = node('is-distinct-from');

    return new isDistinctFromNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public isNotDistinctFrom(other: UnknownNativeType | AnyNodeOrAttribute): IsNotDistinctFromNode<Target, AnyNodeOrAttribute> {
    const isNotDistinctFromNode: typeof IsNotDistinctFromNode = node('is-not-distinct-from');

    return new isNotDistinctFromNode(this as unknown as Target, isNodeOrAttribute(other) ? other : castOrQuote(other, this as unknown as Target));
  }

  public matches(other: ConvertibleToString, escape?: ConvertibleToString, caseSensitive?: boolean): MatchesNode<Target, QuotedNode<string>> {
    const matchesNode: typeof MatchesNode = node('matches');

    return new matchesNode(this as unknown as Target, buildQuoted(toString(other)), escape == null ? null : toString(escape), caseSensitive);
  }

  public matchesAll(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesAny(others: ConvertibleToString[], escape?: ConvertibleToString, caseSensitive?: boolean): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.matches(other, escape, caseSensitive)));
  }

  public matchesRegex(other: RegExp, caseSensitive?: boolean): RegexNode<Target> {
    const regexNode: typeof RegexNode = node('regex');

    return new regexNode(this as unknown as Target, other, caseSensitive);
  }

  public notBetween(
    lowerBoundary: UnknownNativeType | Node,
    upperBoundary: UnknownNativeType | Node,
  ): GroupingNode<OrNode<LessThanNode<Target, AnyNodeOrAttribute>, GreaterThanNode<Target, AnyNodeOrAttribute>>> {
    const lowerBoundaryNode = isNodeOrAttribute(lowerBoundary) ? lowerBoundary : castOrQuote(lowerBoundary, this as unknown as Target);
    const upperBoundaryNode = isNodeOrAttribute(upperBoundary) ? upperBoundary : castOrQuote(upperBoundary, this as unknown as Target);

    return this.lessThan(lowerBoundaryNode).or(this.greaterThan(upperBoundaryNode));
  }

  public notIn(other: UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]): NotInNode<Target, AnyNodeOrAttribute> {
    const notInNode: typeof NotInNode = node('not-in');
    const inValuesNode: typeof InValuesNode = node('in-values');

    if (other instanceof InternalConstants.selectManagerClass) {
      return new notInNode(this as unknown as Target, other.ast);
    } else if (other instanceof Array) {
      return new notInNode(this as unknown as Target, new inValuesNode(other.map(o => castOrQuote(o, this as unknown as Target))));
    } else if (isNodeOrAttribute(other)) {
      return new notInNode(this as unknown as Target, new inValuesNode([other]));
    } else {
      return new notInNode(this as unknown as Target, new inValuesNode([buildQuoted(other)]));
    }
  }

  public notInAll(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]>): GroupingNode<AndNode<Node[]>> {
    return groupingAll(others.map(other => this.notIn(other)));
  }

  public notInAny(others: Array<UnknownNativeType | AnyNodeOrAttribute | SelectManager<unknown> | UnknownNativeType[]>): GroupingNode<OrNode<Node, Node>> {
    return groupingAny(others.map(other => this.notIn(other)));
  }

  public switchCase<ReturnType extends AnyNodeOrAttribute>(defaultValue: ReturnType): CaseNode<Target, ReturnType>;
  public switchCase<ReturnType extends UnknownNativeType>(defaultValue: ReturnType): CaseNode<Target, QuotedNode<ReturnType>>;
  public switchCase(defaultValue?: AnyNodeOrAttribute | UnknownNativeType): CaseNode<Target, AnyNodeOrAttribute> {
    const caseNode: typeof CaseNode = node('case');
    const elseNode: typeof ElseNode = node('else');

    if (defaultValue === undefined) {
      return new caseNode(this as unknown as Target);
    } else if (isNodeOrAttribute(defaultValue)) {
      return new caseNode(this as unknown as Target, new elseNode(defaultValue));
    } else {
      return new caseNode(this as unknown as Target, new elseNode(buildQuoted(defaultValue)));
    }
  }
}
