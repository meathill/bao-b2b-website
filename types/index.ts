export type RowItem = {
  isSaving: boolean;
};

export type ApiResponse<T> = {
  code: number;
  message?: string;
  data?: T;
  meta?: {
    total: number;
  },
};
