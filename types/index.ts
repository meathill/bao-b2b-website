export type Specification = {
  name: string;
  description: string;
  type: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  parent: number;
  specifications: Specification[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  category: number;
  categoryRef?: Category;
  more: Specification[];
};

export type RequestQuotation = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: string;
  updated_at?: string;
};

export type RowItem = {
  isSaving: boolean;
  createdAt: string;
  updatedAt: string;
};
