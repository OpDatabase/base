import { Base } from '@opdb/base';
import { provideMysqlConnection } from '@opdb/mysql';
import { MigrationException } from '..';
import { DataType } from '../interfaces/data-type.enum';
import { MysqlMigration } from './mysql-migration.class';

describe('MysqlMigration', () => {
  let migrator: MysqlMigration;

  const getSchemaName = async () => {
    const records = await migrator.execute<{ databaseName: string }>(
      `SELECT DATABASE() AS \`databaseName\``,
    );
    return records[0].databaseName;
  };

  const getTables = async () => {
    const schema = await getSchemaName();
    const records = await migrator.execute<{ TABLE_NAME: string }>(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = $schema`,
      { schema },
    );
    return records.map(r => r.TABLE_NAME);
  };

  const getColumns = async (tableName: string) => {
    const schema = await getSchemaName();
    const columns = await migrator.execute<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName`,
      { schema, tableName },
    );
    return columns.map(c => c.COLUMN_NAME);
  };

  const getIndices = async (tableName: string) => {
    const schema = await getSchemaName();
    const records = await migrator.execute<{ INDEX_NAME: string }>(
      `SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName`,
      { schema, tableName },
    );
    return records.map(r => r.INDEX_NAME);
  };

  const getDefaultValue = async (tableName: string, columnName: string) => {
    const records = await migrator.execute<{ COLUMN_DEFAULT: string }>(
      'SELECT COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName AND COLUMN_NAME = $columnName',
      { schema: await getSchemaName(), tableName, columnName },
    );
    return records[0] == null ? undefined : records[0].COLUMN_DEFAULT;
  };

  // Remove all database tables before each test
  beforeEach(async () => {
    provideMysqlConnection({
      url: process.env.TEST_MYSQL_DB_URL,
    });
    migrator = new MysqlMigration();

    const tables = await getTables();
    await Promise.all(
      tables.map(tableName => Base.execute(`DROP TABLE \`${tableName}\``)),
    );
  });

  // Remove connection, reset adapter
  afterEach(async () => {
    Base.connectionPool.reset();
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

      it('should not accept default values for data type text', async () => {
        // MySQL does not accept default values for data type text -> it should ignore the default value
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });

        // Add column
        await migrator.addColumn('example_table', 'field_2', DataType.text, { default: 'Hello World' });

        // Check if column has been created
        const columns = await getColumns('example_table');
        expect(columns).toContainEqual('field_1');
        expect(columns).toContainEqual('field_2');

        // Check if column does not have a default value
        expect(await getDefaultValue('example_table', 'field_2')).toBeNull();
      });
    });

    describe('addIndex', () => {
      const getIndex = async (tableName: string, indexName: string) => {
        return await migrator.execute<{ NON_UNIQUE: 1 | 0, COLUMN_NAME: string }>(
          `SELECT NON_UNIQUE, COLUMN_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName AND INDEX_NAME = $indexName ORDER BY SEQ_IN_INDEX ASC`,
          { schema: await getSchemaName(), tableName, indexName },
        );
      };

      it('should create a new index for a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], {});

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_index');
        expect(index.length).toBe(1);
        expect(index[0].COLUMN_NAME).toBe('field_1');
        expect(index[0].NON_UNIQUE).toBe(1);
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
        expect(index.length).toBe(2);
        expect(index[0].COLUMN_NAME).toBe('field_1');
        expect(index[0].NON_UNIQUE).toBe(1);
        expect(index[1].COLUMN_NAME).toBe('field_2');
        expect(index[1].NON_UNIQUE).toBe(1);
      });

      it('should create a new unique index for a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], { unique: true });

        // Check if index has been created
        const index = await getIndex('example_table', 'example_table_field_1_index');
        expect(index.length).toBe(1);
        expect(index[0].COLUMN_NAME).toBe('field_1');
        expect(index[0].NON_UNIQUE).toBe(0);
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
        expect(index.length).toBe(2);
        expect(index[0].COLUMN_NAME).toBe('field_1');
        expect(index[0].NON_UNIQUE).toBe(0);
        expect(index[1].COLUMN_NAME).toBe('field_2');
        expect(index[1].NON_UNIQUE).toBe(0);
      });

      it('should create a new index with a user-defined name', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1');
        });
        await migrator.addIndex('example_table', ['field_1'], { name: 'my_index' });

        // Check if index has been created
        const index = await getIndex('example_table', 'my_index');
        expect(index.length).toBe(1);
        expect(index[0].COLUMN_NAME).toBe('field_1');
        expect(index[0].NON_UNIQUE).toBe(1);
      });
    });

    describe('changeColumnDefault', () => {
      it('should remove the default value of a column', async () => {
        // Create table first
        await migrator.createTable('example_table', {}, table => {
          table.string('field_1', { default: 'Hello World' });
        });

        // Check for default value
        expect(await getDefaultValue('example_table', 'field_1')).toBe('Hello World');

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
        expect(await getDefaultValue('example_table', 'field_1')).toBe('Hello World');
      });
    });

    describe('changeColumnNull', () => {
      const getAllowNull = async (tableName: string, columnName: string) => {
        const records = await migrator.execute<{ IS_NULLABLE: string }>(
          'SELECT IS_NULLABLE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName AND COLUMN_NAME = $columnName',
          { schema: await getSchemaName(), tableName, columnName },
        );
        if (records[0] == null) {
          return undefined;
        }
        return records[0].IS_NULLABLE === 'YES';
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

      it('should not change correctly set up columns', async () => {
        // Create table first
        await migrator.createTable('example_table', { id: false }, table => {
          table.string('field_1');
          table.string('field_2', { null: false });
        });

        // Check for isNullable value
        expect(await getAllowNull('example_table', 'field_1')).toBe(true);
        expect(await getAllowNull('example_table', 'field_2')).toBe(false);

        // Update isNullable value
        await migrator.changeColumnNull('example_table', 'field_1', true);
        await migrator.changeColumnNull('example_table', 'field_2', false);
        expect(await getAllowNull('example_table', 'field_1')).toBe(true);
        expect(await getAllowNull('example_table', 'field_2')).toBe(false);

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

      it('should create a join table with default config and async configBlock', async () => {
        // Create join table
        await migrator.createJoinTable('a_objects', 'b_objects', {}, async () => void 0);

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

      it('should create a new empty table with an async configBlock', async () => {
        // Create table
        await migrator.createTable('new_table', {}, async () => void 0);

        // Check for table
        const tables = await getTables();
        expect(tables).toContainEqual('new_table');

        // Check for columns
        const columns = await getColumns('new_table');
        expect(columns).toContainEqual('id');
      });

      it('should not create a new empty table without primary key', async () => {
        // Create table
        await expect(
          migrator.createTable('new_table', { id: false }, () => void 0),
        ).rejects.toThrowError(MigrationException);
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

        // Check indices (id + index + PRIMARY)
        expect((await getIndices('new_table')).length).toBe(3);

        // Drop index
        await migrator.removeIndex('new_table', ['additional_column'], {});
        expect((await getIndices('new_table')).length).toBe(2);
      });

      it('should remove an index with a user-specific name', async () => {
        // Create table
        await migrator.createTable('new_table', {}, table => {
          table.string('additional_column');
          table.index('additional_column', { name: 'my_index' });
        });

        // Check indices (id + index + PRIMARY)
        expect((await getIndices('new_table')).length).toBe(3);

        // Drop index
        await migrator.removeIndex('new_table', ['additional_column'], { name: 'my_index' });
        expect((await getIndices('new_table')).length).toBe(2);
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

      it('should ignore default values for data type text', async () => {
        // MySQL does not accept default values for data type text -> it should ignore the default value
        await migrator.createTable('example_table', {}, table => {
          table.text('field_1', { default: 'Hello World' });
        });

        // Check if column does not have a default value
        expect(await getDefaultValue('example_table', 'field_1')).toBeNull();

        // Check if default value is ignored in selector statement
        expect(await migrator.columnExists('example_table', 'field_1', DataType.text, { default: 'Hello World' })).toBe(true);
      });

      it('should convert default values for data type boolean', async () => {
        // MySQL does not accept default values for data type text -> it should ignore the default value
        await migrator.createTable('example_table', {}, table => {
          table.boolean('field_1', { default: true });
          table.boolean('field_2', { default: false });
        });

        // Check if default value is ignored in selector statement
        expect(await migrator.columnExists('example_table', 'field_1', DataType.boolean, { default: true })).toBe(true);
        expect(await migrator.columnExists('example_table', 'field_2', DataType.boolean, { default: false })).toBe(true);
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
        expect(indices.length).toBe(3); // user-specific index + id + PRIMARY
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
