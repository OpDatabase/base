export type Constructor<T> = new (...args: unknown[]) => T;

function applyMixins(base: Constructor<unknown>, mixins: Array<Constructor<unknown>>): void {
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);
      if (descriptor == null) {
        return;
      }
      Object.defineProperty(base.prototype, name, descriptor);
    });
  });
}

// tslint:disable-next-line:no-any
export function include<T>(...mixins: Array<Constructor<unknown>>): (target: Constructor<T> | any) => void {
  // tslint:disable-next-line:no-any
  return (target: Constructor<T> | any) => {
    applyMixins(target, mixins);
  };
}
