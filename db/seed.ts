import {
  TABLE_CATEGORY,
  TABLE_PRODUCT,
  TABLE_PRODUCT_SPEC,
  TABLE_QUOTATION,
  TABLE_SPEC,
} from './types';
import {
  db,
  sql,
} from './kysely';

export async function createCategory(): Promise<void> {
  await db.schema
    .createTable(TABLE_CATEGORY)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn('name', 'varchar(255)', cb => cb.notNull())
    .addColumn('slug', 'varchar(255)', cb => cb.notNull().unique())
    .addColumn('parent', 'int8')
    .addColumn('description', 'varchar(255)')
    .addColumn('image', 'varchar(255)')
    .addColumn('isHomepage', 'boolean')
    .addColumn('file', 'varchar(255)')
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
    .addColumn('description', 'text')
    .addColumn('digest', 'text')
    .addColumn('specification', 'json')
    .addColumn('images', 'varchar[]')
    .addColumn('file', 'varchar(255)')
    .addColumn('model', 'varchar(255)')
    .addColumn(
      'category',
      'integer',
      cb => cb.references(TABLE_CATEGORY + '.id').onDelete('no action'),
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
      cb => cb.references(TABLE_CATEGORY + '.id').onDelete('no action'),
    )
    .addColumn('options', 'varchar[]')
    .addColumn('defaultValue', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('image', 'varchar')
    .execute();
  console.log('Created `specification` table');
}

export async function createProductSpec(): Promise<void> {
  await db.schema
    .createTable(TABLE_PRODUCT_SPEC)
    .ifNotExists()
    .addColumn('id', 'serial', cb => cb.primaryKey())
    .addColumn(
      'productId',
      'int8',
      cb => cb.references(TABLE_PRODUCT + '.id').onDelete('no action'),
    )
    .addColumn(
      'specId',
      'int8',
      cb => cb.references(TABLE_SPEC + '.id').onDelete('no action'),
    )
    .addColumn('value', 'varchar(255)')
    .execute();
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
    .addColumn('country', 'varchar(100)', cb => cb.notNull())
    .addColumn('comment', 'text')
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
