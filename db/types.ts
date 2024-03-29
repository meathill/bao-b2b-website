import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely';
import { SpecificationTypes } from '~/data';
import { ProductSpecification } from '~/types';

export const TABLE_CATEGORY = 'category';
export const TABLE_PRODUCT = 'product';
export const TABLE_SPEC = 'specification';
export const TABLE_QUOTATION = 'quotation';
export const TABLE_PRODUCT_SPEC = 'productSpec';

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
  deletedAt?: ColumnType<Date, string | undefined, never>
}

export interface SpecificationTable {
  id: Generated<number>;
  name: string;
  type: SpecificationTypes;
  category: number;
  options: string[];
  defaultValue?: string;
  description: string;
  image?: string;
}
export type Specification = Selectable<SpecificationTable> & {
  value: string;
};
export type NewSpecification = Insertable<Specification>;
export type EditedSpecification = Updateable<SpecificationTable> & {
  isChanged?: boolean;
  isDeleted?: boolean;
};

export interface CategoryTable extends BasicRecord {
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: string;
  file: string;
  isHomepage: boolean;
}
export type Category = Selectable<CategoryTable> & {
  specifications: Specification[];
};
export type NewCategory = Insertable<Category>;
export type EditedCategory = Updateable<Category> & {
  specifications: EditedSpecification[];
};

interface ProductSpecTable {
  id: Generated<number>;
  productId: number;
  specId: number;
  value: string;
}
export type ProductSpec = Selectable<ProductSpecTable>;

interface ProductTable extends BasicRecord {
  name: string;
  slug: string;
  description: string;
  digest: string;
  images: string[];
  model: string;
  file: string;
  category: number;
  more: ProductSpecification[];
  specifications: ProductSpec[];
}
export type Product = Selectable<ProductTable> & {
  related?: Product[];
  quantity?: number;
};
export type NewProduct = Insertable<Product>;
export type EditedProduct = Updateable<Product>;

export type QuotationItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  comment: string;
};

export interface ClientInfo {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  country: string;
}

interface QuotationTable extends BasicRecord, ClientInfo {
  id: Generated<number>;
  products: QuotationItem[];
  comment: string;
  status: QuotationStatus;
}

export type Quotation = Selectable<QuotationTable>;
export type NewQuotation = Insertable<QuotationTable>;
export type EditedQuotation = Updateable<QuotationTable>;

// Keys of this interface are table names.
export interface Database {
  category: Category;
  specification: Specification;
  product: ProductTable;
  productSpec: ProductSpecTable;
  quotation: QuotationTable;
}
