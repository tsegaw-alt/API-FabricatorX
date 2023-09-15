import { Request } from "express";
import { IPaginationOptions } from "../interfaces/IPaginationOptions";
import BaseModel from "../interfaces/BaseModel";
import ResponseHandler from "./httpResponse.helper";
export function getPaginationOptions<T extends BaseModel>(req: Request): IPaginationOptions<T> {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const sortBy = req.query.sortBy as keyof T;
  const sortOrder = req.query.sortOrder as "asc" | "desc";
  const filterBy = req.query.filterBy as Partial<T>;

  // if (pageSize <= 0 || page <= 0) {
  //   ResponseHandler.sendBadRequest(, 'Invalid pagination options')
  // }

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    filterBy,
  };
}

export function getPaginationData<T extends BaseModel>(
  options: IPaginationOptions<T>,
  totalCount: number
) {
  return {
    totalPages: Math.ceil(totalCount / options.pageSize),
    currentPage: options.page,
    nextPage:
      options.page * options.pageSize < totalCount ? options.page + 1 : false,
    previousPage: options.page > 1 ? options.page - 1 : false,
    pageSize: options.pageSize,
  };
}
