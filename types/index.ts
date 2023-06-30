export type RowItem = {
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
