export type ApiResponseDetails = Array<{ field?: string; issue: string }>;

export type ApiResponseMeta = Record<string, unknown>;

export type SuccessApiResponse<T = unknown> = {
  success: true;
  data: T;
  meta?: ApiResponseMeta;
};

export type ErrorApiResponse = {
  success: false;
  error: {
    id: number;
    code: string;
    message: string; // user-friendly
    details?: ApiResponseDetails; // dev/debug info
    meta?: ApiResponseMeta; // contextual info
  };
};

export type ApiResponse<T = unknown> = SuccessApiResponse<T> | ErrorApiResponse;
