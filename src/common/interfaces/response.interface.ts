export interface ApiResponseList<T = any> {
  status: string;
  message: string;
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
