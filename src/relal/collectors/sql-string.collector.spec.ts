import { SqlStringCollector } from './sql-string.collector';

describe('SqlStringCollector', () => {
  let collector: SqlStringCollector;

  beforeEach(() => {
    collector = new SqlStringCollector({
      quote: (inputValue: unknown) => `${inputValue}`,
      sanitizeSqlComment: (inputValue: string) => inputValue,
      tableName: (inputValue: string) => inputValue,
      columnName: (inputValue: string) => inputValue,
    });
  });

  it('should add values correctly', async () => {
    collector.add('PAYLOAD');
    expect((collector as unknown as { value: string }).value).toStrictEqual('PAYLOAD');
  });

  it('should bind values correctly', async () => {
    expect(collector.bind()).toStrictEqual('$placeholder1');
    expect((collector as unknown as { value: string }).value).toStrictEqual('');
    expect((collector as unknown as { bindIndex: number }).bindIndex).toStrictEqual(2);
  });

  it('should export values correctly', async () => {
    collector.add('PAYLOAD');
    expect(collector.export()).toStrictEqual('PAYLOAD');
  });
});
