import { Response } from 'express';

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  errors?: any;
}

class ResponseHandler {
  private static prepareResponse<T>(statusCode: number, data?: T, message?: string, ...errors: any[]): ApiResponse<T> {
    const status = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
  
    const response: ApiResponse<T> = {
      status,
      message: message || '',
      errors: errors.length ? errors : undefined,
    };
  
    if (data) {
      response.data = data;
    }
  
    return response;
  }
  


  public static sendSuccess<T>(res: Response, data: T, message?: string): Response {
    const response = this.prepareResponse<T>(200, data, message);
    return res.status(200).json(response);
  }

  public static sendCreated<T>(res: Response, data: T, message?: string): Response {
    const response = this.prepareResponse<T>(201, data, message);
    return res.status(201).json(response);
  }

  public static sendNoContent(res: Response, message?: string): Response {
    const response = this.prepareResponse<null>(204, null, message);
    return res.status(204).json(response);
  }

  public static sendBadRequest(res: Response, message: string, errors?: any): Response {
    const response = this.prepareResponse<null>(400, null, message);
    if (errors) {
      response.errors = errors;
    }
    return res.status(400).json(response);
  }

  public static sendUnauthorized(res: Response, message: string): Response {
    const response = this.prepareResponse<null>(401, null, message);
    return res.status(401).json(response);
  }

  public static sendForbidden(res: Response, message: string): Response {
    const response = this.prepareResponse<null>(403, null, message);
    return res.status(403).json(response);
  }

  public static sendNotFound(res: Response, message: string): Response {
    const response = this.prepareResponse<null>(404, null, message);
    return res.status(404).json(response);
  }

  public static sendInternalServerError(res: Response, errorMessage: string, errorDetails?: string): Response {
    const error = new Error(errorMessage);
    error.stack = errorDetails;
    const response = this.prepareResponse<null>(500, null, errorMessage, errorDetails);
    return res.status(500).json(response);
  }
  
}

export default ResponseHandler;
