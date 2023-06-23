import { Generated, ColumnType } from 'kysely';
import { createKysely } from '@vercel/postgres-kysely';

export enum SpecTypes {
  String,
  Radio,
  Multiple,
}

export enum Country {
  China = 'China',
}

export enum QuotationStatus {
  Created,
  Following,
  Done,
  Halted,
}

interface BasicRecord {
  id: Generated<number>
  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
  deletedAt: ColumnType<Date, string | undefined, never>
}

interface CategoryTable extends BasicRecord {
  name: string;
  slug: string;
  parent?: number;
  description: string;
  image?: string;
}

interface Specification {
  id: Generated<number>;
  name: string;
  type: SpecTypes;
  category: number;
  product: number;
  options?: string[];
  defaultValue?: string;
  description?: string;
  image?: string;
}

interface ProductTable extends BasicRecord {
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: number;
}

type QuotationItem = {
  productId: number;
  price: number;
  quantity: number;
  description: string;
};

interface QuotationTable {
  id: Generated<number>;
  products: QuotationItem[];
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  fax?: string;
  country: Country;
  address?: string;
  comments?: string;
  status: QuotationStatus;
}

// Keys of this interface are table names.
export interface Database {
  category: CategoryTable;
  spec: Specification;
  product: ProductTable;
  quotation: QuotationTable;
}

export const db = createKysely<Database>();
export { sql } from 'kysely';
