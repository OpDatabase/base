import { RelalException } from '../exceptions/relal.exception';

// tslint:disable-next-line:no-any
export type NodeClass = any;

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
