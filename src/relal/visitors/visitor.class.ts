export abstract class Visitor {
  // todo class dispatchCache

  public accept(object: unknown, collector: unknown | null = null): void {
    console.log(object, collector);
    // todo
  }
}
