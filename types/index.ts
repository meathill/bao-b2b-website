declare global {
  const __VERSION__: String;
  const __R2_DOMAIN__: string;
}

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

export type PreSignedUrl = {
  preSignedUrl: string;
  objectKey: string;
};

export type IdRequest = {
  id: number;
};
