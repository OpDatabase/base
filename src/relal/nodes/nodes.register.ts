import { RelalException } from '../exceptions/relal.exception';

export type NodeClass = new (...args: any[]) => any;

export abstract class NodesRegister {
  private static registeredNodeClasses: { [key: string]: NodeClass } = {};

  public static registerNode(identifier: string, klass: NodeClass): void {
    this.registeredNodeClasses[identifier] = klass;
  }

  public static getNode(identifier: string): NodeClass {
    const klass = this.registeredNodeClasses[identifier];
    if (klass === undefined) {
      throw new RelalException(`Cannot find node for identifier "${identifier}"`);
    }

    return klass;
  }
}

export function node(identifier: string): NodeClass {
  return NodesRegister.getNode(identifier);
}

export function register(identifier: string): (target: NodeClass) => void {
  return (target: NodeClass) => {
    NodesRegister.registerNode(identifier, target);
  };
}
