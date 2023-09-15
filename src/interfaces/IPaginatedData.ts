export interface IPaginatedData<T> {
    data: T[];
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }
  