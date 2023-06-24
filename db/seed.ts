import { db, sql, TABLE_CATEGORY, TABLE_PRODUCT, TABLE_QUOTATION, TABLE_SPEC } from './kysely';

/* eslint disable no-console */
export async function createCategory(): Promise<void> {
  await db.schema
    .createTable(TABLE_CATEGORY)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn('name', 'varchar(255)', cb => cb.notNull())
    .addColumn('slug', 'varchar(255)', cb => cb.notNull().unique())
    .addColumn('parent', 'int8')
    .addColumn('image', 'varchar(255)')
    .addColumn(
      'createdAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .addColumn(
      'updatedAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .addColumn(
      'deletedAt',
      sql('timestamp with time zone'),
    )
    .execute();
  console.log('Created `category` table');
}

export async function createProduct(): Promise<void> {
  await db.schema
    .createTable(TABLE_PRODUCT)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn('name', 'varchar(255)', cb => cb.notNull())
    .addColumn('slug', 'varchar(255)', cb => cb.notNull().unique())
    .addColumn('description', 'varchar(255)')
    .addColumn('images', 'varchar[]')
    .addColumn(
      'category',
      'integer',
      cb => cb.references('category.id').onDelete('no action'),
    )
    .addColumn(
      'createdAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .addColumn(
      'updatedAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .addColumn(
      'deletedAt',
      sql('timestamp with time zone'),
    )
    .execute();
  console.log('Created `product` table');
}

export async function createSpecification(): Promise<void> {
  await db.schema
    .createTable(TABLE_SPEC)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn('name', 'varchar(255)', cb => cb.notNull())
    .addColumn('type', 'int2', cb => cb.notNull())
    .addColumn(
      'category',
      'int8',
      cb => cb.references('category.id').onDelete('no action'),
    )
    .addColumn(
      'product',
      'int8',
      cb => cb.references('product.id').onDelete('no action'),
    )
    .addColumn('options', 'varchar[]')
    .addColumn('defaultValue', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('image', 'varchar')
    .execute();
  console.log('Created `specification` table');
}

export async function createQuotation(): Promise<void> {
  await db.schema
    .createTable(TABLE_QUOTATION)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn('products', 'json', cb => cb.notNull())
    .addColumn('companyName', 'varchar')
    .addColumn('contactName', 'varchar', cb => cb.notNull())
    .addColumn('phone', 'varchar(20)', cb => cb.notNull())
    .addColumn('email', 'varchar(100)', cb => cb.notNull())
    .addColumn('fax', 'varchar(20)')
    .addColumn('country', 'int2')
    .addColumn('comments', 'text')
    .addColumn('status', 'int2', cb => cb.defaultTo(0))
    .addColumn(
      'createdAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .addColumn(
      'updatedAt',
      sql('timestamp with time zone'),
      cb => cb.defaultTo(sql('current_timestamp')).notNull(),
    )
    .execute();
}
