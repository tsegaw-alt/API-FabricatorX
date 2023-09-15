import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";
import ResponseHandler from "../helpers/httpResponse.helper";

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  switch (status) {
    case 400:
      ResponseHandler.sendBadRequest(res, message);
      break;
    case 401:
      ResponseHandler.sendUnauthorized(res, message);
      break;
    case 403:
      ResponseHandler.sendForbidden(res, message);
      break;
    case 404:
      ResponseHandler.sendNotFound(res, message);
      break;
    case 500:
    default:
      ResponseHandler.sendInternalServerError(res, message);
      break;
  }
};

export default errorMiddleware;
