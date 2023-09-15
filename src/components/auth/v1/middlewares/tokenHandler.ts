import jwt from "jsonwebtoken";
import { IUser, IUserPayload } from "../data/interfaces/IUser";
import { Response } from "express";
import jwtConfig from "../../../../config/jwt/jwtConfig";

interface TokenPayload {
  id: string;
  role: string;
}

export function generateAccessToken(user: IUserPayload, res: Response): string {
  if (!user._id || !user.role) {
    throw new Error('Invalid user data for generating access token');
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const options = {
    expiresIn: jwtConfig.accessToken.expiresIn,
  };

  return jwt.sign(payload, jwtConfig.accessToken.secret, options);
}

export function generateRefreshToken(user: IUserPayload, res: Response): string {
  if (!user._id || !user.role) {
    throw new Error('Invalid user data for generating refresh token');
  }
  
  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const options = {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  };

  return jwt.sign(payload, jwtConfig.refreshToken.secret, options);
}

export function generateResetToken(user: IUserPayload): string {
  if (!user._id || !user.role) {
    throw new Error('Invalid user data for generating reset token');
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const options = {
    expiresIn: jwtConfig.resetToken.expiresIn,
  };

  return jwt.sign(payload, jwtConfig.resetToken.secret, options);
}