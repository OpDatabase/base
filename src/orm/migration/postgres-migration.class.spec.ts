import { Base } from '@opdb/base';
import { providePostgresConnection } from '@opdb/postgres';
import flushPromises from 'flush-promises';
import { DataType } from '../interfaces/data-type.enum';
import { PostgresMigration } from './postgres-migration.class';

describe('PostgresMigration', () => {
  let migrator: PostgresMigration;

  const getTables = async () => {
    const records = await migrator.execute<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $schema`,
      { schema: 'public' },
    );
    return records.map(r => r.table_name);
  };

  const getColumns = async (tableName: string) => {
    const columns = await migrator.execute<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = $schema AND table_name = $tableName`,
      { schema: 'public', tableName },
    );
    return columns.map(c => c.column_name);
  };

  const getIndices = async (tableName: string) => {
    const records = await migrator.execute<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE schemaname = $schema AND tablename = $tableName`,
      { schema: 'public', tableName },
    );
    return records.map(r => r.indexname);
  };

  // Remove all database tables before each test
  beforeEach(async () => {
    providePostgresConnection({
      connectionString: process.env.TEST_PG_DB_URL,
    });

    const records = await Base.execute<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $schema`,
      { schema: 'public' },
    );
    await Promise.all(
      records.map(record => Base.execute(`DROP TABLE "${record.table_name}"`)),
    );

    migrator = new PostgresMigration();
  });

  // Remove connection, reset adapter
  afterEach(async () => {
    Base.connectionPool.reset();
  });

  afterAll(async () => {
    await flushPromises();
  });

  describe('schema statements', () => {
    describe('addColumn', () => {
      it('should add a new column to an existing table', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });

        // Add column
        await migrator.addColumn('example_table', 'field_2', DataType.string, {});

        // Check if column has been created
        const columns = await getColumns('example_table');
        expect(columns).toContainEqual('field_1');
        expect(columns).toContainEqual('field_2');
      });
    });

    describe('addIndex', () => {
      const getIndex = async (tableName: string, indexName: string) => {
        const records = await migrator.execute<{ tablename: string, indexname: string, indexdef: string }>(
          `SElECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = $schema AND tablename = $tableName AND indexname = $indexName`,
          { schema: 'public', tableName, indexName },
        );
        return records[0] == null ? undefined : records[0];
      };

      it('should create a new index for a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], {});

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_index');
        expect(index?.indexdef).toStrictEqual(
          `CREATE INDEX example_table_field_1_index ON public.example_table USING btree (field_1)`,
        );
      });

      it('should create a new index for multiple columns', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
          table.string('field_2');
        });
        await migrator.addIndex('example_table', ['field_1', 'field_2'], {});

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_field_2_index');
        expect(index?.indexdef).toStrictEqual(
          `CREATE INDEX example_table_field_1_field_2_index ON public.example_table USING btree (field_1, field_2)`,
        );
      });

      it('should create a new unique index for a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], { unique: true });

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_index');
        expect(index?.indexdef).toStrictEqual(
          `CREATE UNIQUE INDEX example_table_field_1_index ON public.example_table USING btree (field_1)`,
        );
      });

      it('should create a new unique index for multiple columns', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
          table.string('field_2');
        });
        await migrator.addIndex('example_table', ['field_1', 'field_2'], { unique: true });

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_field_2_index');
        expect(index?.indexdef).toStrictEqual(
          `CREATE UNIQUE INDEX example_table_field_1_field_2_index ON public.example_table USING btree (field_1, field_2)`,
        );
      });

      it('should create a new index with a user-defined name', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], { name: 'my_index' });

        // Check if index has been created
        const index = await getIndex('example_table', 'my_index');
        expect(index?.indexdef).toStrictEqual(
          `CREATE INDEX my_index ON public.example_table USING btree (field_1)`,
        );
      });
    });

    describe('changeColumnDefault', () => {
      const getDefaultValue = async (tableName: string, columnName: string) => {
        const records = await migrator.execute<{ column_default: string }>(
          'SELECT column_default FROM information_schema.columns WHERE table_schema = $schema AND table_name = $tableName AND column_name = $columnName',
          { schema: 'public', tableName, columnName },
        );
        return records[0] == null ? undefined : records[0].column_default;
      };

      it('should remove the default value of a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1', { default: 'Hello World' });
        });

        // Check for default value
        expect(await getDefaultValue('example_table', 'field_1')).toBe('\'Hello World\'::character varying');

        // Remove default value
        await migrator.changeColumnDefault('example_table', 'field_1', null);
        expect(await getDefaultValue('example_table', 'field_1')).toBeNull();
      });

      it('should set the default value of a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });

        // Check for default value
        expect(await getDefaultValue('example_table', 'field_1')).toBeNull();

        // Remove default value
        await migrator.changeColumnDefault('example_table', 'field_1', 'Hello World');
        expect(await getDefaultValue('example_table', 'field_1')).toBe('\'Hello World\'::character varying');
      });
    });

    describe('changeColumnNull', () => {
      const getAllowNull = async (tableName: string, columnName: string) => {
        const records = await migrator.execute<{ is_nullable: string }>(
          'SELECT is_nullable FROM information_schema.columns WHERE table_schema = $schema AND table_name = $tableName AND column_name = $columnName',
          { schema: 'public', tableName, columnName },
        );
        if (records[0] == null) {
          return undefined;
        }
        return records[0].is_nullable === 'YES';
      };

      it('should set a column to be nullable', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1', { null: false });
        });

        // Check for isNullable value
        expect(await getAllowNull('example_table', 'field_1')).toBe(false);

        // Update isNullable value
        await migrator.changeColumnNull('example_table', 'field_1', true);
        expect(await getAllowNull('example_table', 'field_1')).toBe(true);

      });

      it('should set a column to not be nullable', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });

        // Check for isNullable value
        expect(await getAllowNull('example_table', 'field_1')).toBe(true);

        // Update isNullable value
        await migrator.changeColumnNull('example_table', 'field_1', false);
        expect(await getAllowNull('example_table', 'field_1')).toBe(false);

      });

      it('should update null values with a given value', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });

        // Create some records
        await migrator.execute('INSERT INTO example_table (field_1) VALUES ($field1)', { field1: null });
        await migrator.execute('INSERT INTO example_table (field_1) VALUES ($field1)', { field1: 'test' });

        const getField1Value = async (id: number) => {
          return (await migrator.execute<{ field_1: string | null }>('SELECT field_1 FROM example_table WHERE id = $id', { id }))
            .map(c => c.field_1)[0];
        };

        // Check current values
        expect(await getField1Value(1)).toBeNull();
        expect(await getField1Value(2)).toBe('test');

        // Run update
        await migrator.changeColumnNull('example_table', 'field_1', false, 'test2');

        // Check new values
        expect(await getField1Value(1)).toBe('test2');
        expect(await getField1Value(2)).toBe('test');
      });
    });

    describe('createJoinTable', () => {
      it('should create a join table with default config', async () => {
        // Create join table
        await migrator.createJoinTable('a_objects', 'b_objects', {}, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('a_objects_b_objects');

        // Check for columns
        const columns = await getColumns('a_objects_b_objects');
        expect(columns).toContainEqual('a_object_id');
        expect(columns).toContainEqual('b_object_id');
      });

      it('should create a join table with default config + sort table names', async () => {
        // Create join table
        await migrator.createJoinTable('b_objects', 'a_objects', {}, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('a_objects_b_objects');

        // Check for columns
        const columns = await getColumns('a_objects_b_objects');
        expect(columns).toContainEqual('a_object_id');
        expect(columns).toContainEqual('b_object_id');
      });

      it('should create a join table with a user-specific name', async () => {
        // Create join table
        await migrator.createJoinTable('b_objects', 'a_objects', { tableName: 'my_join_table' }, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('my_join_table');

        // Check for columns
        const columns = await getColumns('my_join_table');
        expect(columns).toContainEqual('a_object_id');
        expect(columns).toContainEqual('b_object_id');
      });

      it('should create a join table with additional fields', async () => {
        // Create join table
        await migrator.createJoinTable('b_objects', 'a_objects', {}, table => {
          table.string('additional_column');
        });

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('a_objects_b_objects');

        // Check for columns
        const columns = await getColumns('a_objects_b_objects');
        expect(columns).toContainEqual('a_object_id');
        expect(columns).toContainEqual('b_object_id');
        expect(columns).toContainEqual('additional_column');
      });
    });

    describe('createTable', () => {
      it('should create a new empty table', async () => {
        // Create table
        await migrator.createTable('new_table', {}, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns).toContainEqual('id');
      });

      it('should create a new empty table without primary key', async () => {
        // Create table
        await migrator.createTable('new_table', { id: false }, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns.length).toBe(0);
      });

      it('should create a new empty table with user-specific primary key name', async () => {
        // Create table
        await migrator.createTable('new_table', { primaryKey: 'unique_number' }, () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns).toContainEqual('unique_number');
        expect(columns).not.toContainEqual('id');
      });

      it('should create a new table with any possible additional field', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('string_column1');
          table.text('text_column1');
          table.integer('integer_column1');
          table.float('float_column1');
          table.decimal('decimal_column1');
          table.datetime('datetime_column1');
          table.timestamp('timestamp_column1');
          table.time('time_column1');
          table.date('date_column1');
          table.boolean('boolean_column1');
          table.column('custom_column1', DataType.string);
          table.timestamps();
          table.string('string_column2', {});
          table.text('text_column2', {});
          table.integer('integer_column2', {});
          table.float('float_column2', {});
          table.decimal('decimal_column2', {});
          table.datetime('datetime_column2', {});
          table.timestamp('timestamp_column2', {});
          table.time('time_column2', {});
          table.date('date_column2', {});
          table.boolean('boolean_column2', {});
          table.column('custom_column2', DataType.string, {});
        });

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns).toContainEqual('id');
        [
          'string_column1',
          'text_column1',
          'integer_column1',
          'float_column1',
          'decimal_column1',
          'datetime_column1',
          'timestamp_column1',
          'time_column1',
          'date_column1',
          'boolean_column1',
          'custom_column1',
          'string_column2',
          'text_column2',
          'integer_column2',
          'float_column2',
          'decimal_column2',
          'datetime_column2',
          'timestamp_column2',
          'time_column2',
          'date_column2',
          'boolean_column2',
          'custom_column2',
        ].forEach(name => expect(columns).toContainEqual(name));
      });

      it('should create a new table with custom index definitions', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.string('additional_column2');
          table.index('additional_column');
          table.index(['additional_column', 'additional_column2']);
        });

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns).toContainEqual('id');
        expect(columns).toContainEqual('additional_column');

        // Check for indices
        const indices = await getIndices('new_table');
        expect(indices).toContainEqual('new_table_additional_column_index');
        expect(indices).toContainEqual('new_table_additional_column_additional_column2_index');
      });

      it('should create a new table with custom index definitions + sort index table names', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.string('additional_column2');
          table.index(['additional_column2', 'additional_column']);
        });

        // Check for indices
        const indices = await getIndices('new_table');
        expect(indices).toContainEqual('new_table_additional_column_additional_column2_index');
      });
    });

    describe('dropJoinTable', () => {
      it('should drop a join table', async () => {
        // Create join table
        await migrator.createJoinTable('b_objects', 'a_objects', {}, () => void 0);

        // Check tables
        expect((await getTables()).length).toBe(1);

        // Drop join table
        await migrator.dropJoinTable('b_objects', 'a_objects', {});
        expect((await getTables()).length).toBe(0);
      });

      it('should drop a join table with a user-specific name', async () => {
        // Create join table
        await migrator.createJoinTable('b_objects', 'a_objects', { tableName: 'my_join_table' }, () => void 0);

        // Check tables
        expect((await getTables()).length).toBe(1);

        // Drop join table
        await migrator.dropJoinTable('b_objects', 'a_objects', { tableName: 'my_join_table' });
        expect((await getTables()).length).toBe(0);
      });
    });

    describe('dropTable', () => {
      it('should drop a table', async () => {
        // Create table
        await migrator.createTable('example_table', {}, () => void 0);

        // Check tables
        expect((await getTables()).length).toBe(1);

        // Drop table
        await migrator.dropTable('example_table', {});
        expect((await getTables()).length).toBe(0);
      });

      it('should not throw when removing a non-existing table if ifExists is given', async () => {
        // Should fail
        await expect(migrator.dropTable('non_existing_table', {})).rejects.toThrowError();

        // Should not fail
        await expect(migrator.dropTable('non_existing_table', { ifExists: true })).resolves.toBeUndefined();
      });
    });

    describe('removeColumns', () => {
      it('should drop a single column', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
        });

        // Check columns
        expect((await getColumns('new_table')).length).toBe(2);

        // Drop column
        await migrator.removeColumns('new_table', 'additional_column');
        expect((await getColumns('new_table')).length).toBe(1);
      });

      it('should drop multiple columns', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column1');
          table.string('additional_column2');
        });

        // Check columns
        expect((await getColumns('new_table')).length).toBe(3);

        // Drop column
        await migrator.removeColumns('new_table', 'additional_column1', 'additional_column2');
        expect((await getColumns('new_table')).length).toBe(1);
      });
    });

    describe('removeIndex', () => {
      it('should remove an index', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.index('additional_column');
        });

        // Check indices (id + index)
        expect((await getIndices('new_table')).length).toBe(2);

        // Drop index
        await migrator.removeIndex('new_table', ['additional_column'], {});
        expect((await getIndices('new_table')).length).toBe(1);
      });

      it('should remove an index with a user-specific name', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.index('additional_column', { name: 'my_index' });
        });

        // Check indices (id + index)
        expect((await getIndices('new_table')).length).toBe(2);

        // Drop index
        await migrator.removeIndex('new_table', ['additional_column'], { name: 'my_index' });
        expect((await getIndices('new_table')).length).toBe(1);
      });
    });

    describe('renameColumn', () => {
      it('should rename a column', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
        });

        // Check columns
        expect(await getColumns('new_table')).toContainEqual('additional_column');

        // Rename column
        await migrator.renameColumn('new_table', 'additional_column', 'renamed_column');
        expect(await getColumns('new_table')).toContainEqual('renamed_column');
      });
    });
  });

  describe('find schema', () => {
    describe('renameIndex', () => {
      it('should rename an index', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.index('additional_column', { name: 'my_index' });
        });

        // Check indices
        expect(await getIndices('new_table')).toContainEqual('my_index');

        // Rename index
        await migrator.renameIndex('new_table', 'my_index', 'renamed_index');
        expect(await getIndices('new_table')).toContainEqual('renamed_index');
      });
    });

    describe('renameTable', () => {
      it('should rename a table', async () => {
        await migrator.createTable('new_table', {}, () => void 0);

        // Check tables
        expect(await getTables()).toContainEqual('new_table');

        // Rename table
        await migrator.renameTable('new_table', 'renamed_table');
        expect(await getTables()).toContainEqual('renamed_table');
      });
    });

    describe('columnExists', () => {
      it('should return if a column exists by table name + column name', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
        });

        expect(await migrator.columnExists('new_table', 'my_column', undefined, undefined)).toBe(true);
        expect(await migrator.columnExists('new_table', 'other_column', undefined, undefined)).toBe(false);
      });

      it('should return if a column exists by table name + column name + data type', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
        });

        expect(await migrator.columnExists('new_table', 'my_column', DataType.string, undefined)).toBe(true);
        expect(await migrator.columnExists('new_table', 'my_column', DataType.text, undefined)).toBe(false);
      });

      it('should return if a column exists by table name + column name + data type + is nullable', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column', { null: false });
        });

        expect(await migrator.columnExists('new_table', 'my_column', DataType.string, { null: false })).toBe(true);
        expect(await migrator.columnExists('new_table', 'my_column', DataType.string, { null: true })).toBe(false);
      });

      it('should return if a column exists by table name + column name + data type + default value', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column', { default: 'Hello World' });
        });

        expect(await migrator.columnExists('new_table', 'my_column', DataType.string, { default: 'Hello World' })).toBe(true);
        expect(await migrator.columnExists('new_table', 'my_column', DataType.string, { default: 'Bye World' })).toBe(false);
      });
    });

    describe('columns', () => {
      it('should return all columns', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
        });

        const columns = await migrator.columns('new_table');
        expect(columns.length).toBe(2);
        expect(columns).toContainEqual('id');
        expect(columns).toContainEqual('my_column');
      });
    });

    describe('indexExists', () => {
      it('should return true if an index exists', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
          table.index('my_column');
        });

        expect(await migrator.indexExists('new_table', ['my_column'], {})).toBe(true);
        expect(await migrator.indexExists('new_table', ['non_existing_column'], {})).toBe(false);
      });

      it('should return true if an index with a user-specific name exists', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
          table.index('my_column', { name: 'my_index' });
        });

        expect(await migrator.indexExists('new_table', ['my_column'], { name: 'my_index' })).toBe(true);
        expect(await migrator.indexExists('new_table', ['my_column'], { name: 'non_existing_index' })).toBe(false);
      });
    });

    describe('indexes', () => {
      it('should return all indexes of a table', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('my_column');
          table.index('my_column');
        });

        // Check for indexes
        const indices = await migrator.indexes('new_table');
        expect(indices.length).toBe(2); // user-specific index + id
        expect(indices).toContainEqual('new_table_my_column_index');
      });
    });

    describe('tableExists', () => {
      it('should return true if a table exists', async () => {
        await migrator.createTable('new_table', {}, () => void 0);

        // Check for table
        expect(await migrator.tableExists('new_table')).toBe(true);
        expect(await migrator.tableExists('non_existing_table')).toBe(false);
      });
    });

    describe('tables', () => {
      it('should return all tables', async () => {
        await migrator.createTable('new_table', {}, () => void 0);

        // Check for tables
        const tables = await migrator.tables();
        expect(tables.length).toBe(1);
        expect(tables).toContainEqual('new_table');
      });
    });
  });
});
