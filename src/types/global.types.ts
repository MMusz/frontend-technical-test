export type Nullable<T> = null | T;
export type Nullifined<T> = undefined | null | T;
export type Opt<T> = undefined | T;

export type PaginatedResult<T> = {
  total: number;
  pageSize: number;
  results: T[];
};

export type DataQueryPages<T> = { 
  pages: T[];
  pageParams: number[];
};