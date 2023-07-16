export type RowItem = {
  id: number;
  isSaving: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  code: number;
  message?: string;
  data?: T;
  meta?: {
    total: number;
  },
};

export type ProductSpecification = {
  name: string;
  value: string;
};
