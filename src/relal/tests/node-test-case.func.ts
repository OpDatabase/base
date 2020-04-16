// Import all nodes by importing index.ts
import '../';
import { AnyNodeOrAttribute } from '../interfaces/node-types.interface';
import { TestCollector } from './test.collector';
import { TestVisitor } from './test.visitor';

export function nodeTestCase(name: string, innerDescribe: InnerDescribeCallback): void {
  describe(name, () => {
    let collector: TestCollector;
    let visitor: TestVisitor;
    const innerDescribeCallbackFactory = () => {
      return (object: AnyNodeOrAttribute) => {
        return visitor.accept(object, collector) as TestCollector;
      };
    };

    beforeEach(() => {
      collector = new TestCollector();
      visitor = new TestVisitor();
    });

    innerDescribe(innerDescribeCallbackFactory());
  });
}

export type InnerDescribeCallback = (visit: (object: AnyNodeOrAttribute) => TestCollector) => void;
