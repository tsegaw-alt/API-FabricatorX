import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../data/schemas/userSchema";
import ResponseHandler from "../../../../helpers/httpResponse.helper";
import { UserRole } from "../data/interfaces/IUser";
import { CustomRequest } from "../../../../utils/customRequest";
import { BlacklistedTokenModel } from "../data/interfaces/blacklistedTokenModel";
import jwtConfig from "../../../../config/jwt/jwtConfig";

interface TokenPayload {
  id: string;
  role: UserRole;
}

async function checkIfTokenIsBlacklisted(token: string): Promise<boolean> {
  const tokenEntry = await BlacklistedTokenModel.findOne({ token });
  return !!tokenEntry;
}

export async function authenticate(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    ResponseHandler.sendUnauthorized(res, "No authorization header provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    ResponseHandler.sendUnauthorized(res, "No token provided");
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || jwtConfig.accessToken.secret || "secret";
    if (!jwtSecret) {
      ResponseHandler.sendBadRequest(res, "JWT_SECRET is not set");
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as unknown as TokenPayload;

    const isTokenBlacklisted = await checkIfTokenIsBlacklisted(token);
    if (isTokenBlacklisted) {
      ResponseHandler.sendUnauthorized(res, "Token is blacklisted");
      return;
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      ResponseHandler.sendUnauthorized(res, "User not found");
      return;
    }

    // Add user suspension check here
    if (user.suspended) {
      ResponseHandler.sendForbidden(res, "User account is suspended");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      ResponseHandler.sendUnauthorized(res, "Invalid token");
    } else {
      next(error);
    }
  }
}
