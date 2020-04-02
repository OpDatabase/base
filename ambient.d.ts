declare module 'mock-argv' {
  const mockArgv: (args: string[], callback: () => unknown) => Promise<void>;
  export = mockArgv;
}
