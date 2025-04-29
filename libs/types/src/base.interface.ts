export type EntityId = string;

export enum Entity {
  User = 'user',
  UserLinkedAccount = 'userLinkedAccount',
}
export interface BaseEntity {
  id?: EntityId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationOptions {
  page?: number | string; // Default to page 1
  limit?: number | string; // Default to 10 items per page
  sort?: {
    [key: string]: 1 | -1;
  };
  select?: string[];
  populate?: string[];
}

export interface PaginationResult<T> {
  data: T[]; // Array of documents for the current page
  pagination: {
    total: number; // Total number of documents matching the filter
    limit: number; // The limit used for this page
    page: number; // The current page number
    totalPages: number; // Total number of pages available
    hasNextPage: boolean; // Boolean indicating if a next page exists
    hasPrevPage: boolean; // Boolean indicating if a previous page exists
    nextPage: number | null; // Next page number, or null
    prevPage: number | null; // Previous page number, or null
  };
}

export interface PaginationRequest {
  page?: number | string; // Default to page 1
  limit?: number | string; // Default to 10 items per page
}
