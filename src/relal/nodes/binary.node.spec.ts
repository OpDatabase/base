import { nodeTestCase } from '../tests/node-test-case.func';
import {
  AsNode,
  BetweenNode,
  ExceptNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  IntersectNode,
  LessThanNode,
  LessThanOrEqualNode,
  NotEqualNode,
  NotInNode,
  OrNode,
  UnionAllNode,
  UnionNode,
} from './binary.node';
import { InValuesNode } from './binary/equality/in.node';
import { SelectStatementNode } from './expressions/select-statement.node';
import { node } from './nodes.register';
import { SqlLiteralNode } from './sql-literal.node';

nodeTestCase('BetweenNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new BetweenNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT BETWEEN RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('between')).toStrictEqual(BetweenNode);
  });
});

nodeTestCase('NotInNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new NotInNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT NOT IN (RIGHT)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - null values', async () => {
    const node = new NotInNode(
      new SqlLiteralNode('LEFT'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe(' 1=1 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - in values - empty', async () => {
    const node = new NotInNode(
      new SqlLiteralNode('LEFT'),
      new InValuesNode([]),
    );
    const collector = visit(node);
    expect(collector.value).toBe(' 1=1 ');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - in values - not empty', async () => {
    const node = new NotInNode(
      new SqlLiteralNode('LEFT'),
      new InValuesNode([
        new SqlLiteralNode('RIGHT1'),
        new SqlLiteralNode('RIGHT2'),
      ]),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT NOT IN (RIGHT1, RIGHT2)');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('not-in')).toStrictEqual(NotInNode);
  });
});

nodeTestCase('GreaterThanNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new GreaterThanNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT > RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('greater-than')).toStrictEqual(GreaterThanNode);
  });
});

nodeTestCase('GreaterThanOrEqualNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new GreaterThanOrEqualNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT >= RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('greater-than-or-equal')).toStrictEqual(GreaterThanOrEqualNode);
  });
});

nodeTestCase('NotEqualNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new NotEqualNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT != RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - null value', async () => {
    const node = new NotEqualNode(
      new SqlLiteralNode('LEFT'),
      null,
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT IS NOT NULL');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('not-equal')).toStrictEqual(NotEqualNode);
  });
});

nodeTestCase('LessThanNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new LessThanNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT < RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('less-than')).toStrictEqual(LessThanNode);
  });
});

nodeTestCase('LessThanOrEqualNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new LessThanOrEqualNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT <= RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('less-than-or-equal')).toStrictEqual(LessThanOrEqualNode);
  });
});

nodeTestCase('OrNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new OrNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT OR RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('or')).toStrictEqual(OrNode);
  });
});

nodeTestCase('AsNode', visit => {
  it('should return the given value on visit - default', async () => {
    const node = new AsNode(
      new SqlLiteralNode('LEFT'),
      new SqlLiteralNode('RIGHT'),
    );
    const collector = visit(node);
    expect(collector.value).toBe('LEFT AS RIGHT');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('as')).toStrictEqual(AsNode);
  });
});

nodeTestCase('UnionNode', visit => {
  it('should return the given value on visit - default', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const node = new UnionNode(statement1, statement2);
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 UNION SELECT 2 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - inner union statements', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const statement3 = new SelectStatementNode();
    statement3.core.projections.push(new SqlLiteralNode('3'));
    const statement4 = new SelectStatementNode();
    statement4.core.projections.push(new SqlLiteralNode('4'));
    const node = new UnionNode(
      new UnionNode(statement1, statement2),
      new UnionNode(statement3, statement4),
    );
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('union')).toStrictEqual(UnionNode);
  });
});

nodeTestCase('UnionAllNode', visit => {
  it('should return the given value on visit - default', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const node = new UnionAllNode(statement1, statement2);
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 UNION ALL SELECT 2 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should return the given value on visit - inner union statements', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const statement3 = new SelectStatementNode();
    statement3.core.projections.push(new SqlLiteralNode('3'));
    const statement4 = new SelectStatementNode();
    statement4.core.projections.push(new SqlLiteralNode('4'));
    const node = new UnionAllNode(
      new UnionAllNode(statement1, statement2),
      new UnionAllNode(statement3, statement4),
    );
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('union-all')).toStrictEqual(UnionAllNode);
  });
});

nodeTestCase('IntersectNode', visit => {
  it('should return the given value on visit - default', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const node = new IntersectNode(statement1, statement2);
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 INTERSECT SELECT 2 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('intersect')).toStrictEqual(IntersectNode);
  });
});

nodeTestCase('ExceptNode', visit => {
  it('should return the given value on visit - default', async () => {
    const statement1 = new SelectStatementNode();
    statement1.core.projections.push(new SqlLiteralNode('1'));
    const statement2 = new SelectStatementNode();
    statement2.core.projections.push(new SqlLiteralNode('2'));
    const node = new ExceptNode(statement1, statement2);
    const collector = visit(node);
    expect(collector.value).toBe('( SELECT 1 EXCEPT SELECT 2 )');
    expect(collector.bindIndex).toBe(0);
    expect(collector.boundValues).toStrictEqual([]);
  });

  it('should be accessible using register', async () => {
    expect(node('except')).toStrictEqual(ExceptNode);
  });
});
