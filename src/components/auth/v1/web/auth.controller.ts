import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import {
  comparePasswords,
  hashPassword,
} from "../../../../helpers/passwordHash";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../middlewares/tokenHandler";
import { IUser, IUserPayload } from "../data/interfaces/IUser";
import { CustomRequest } from "../../../../utils/customRequest";
import ResponseHandler from "../../../../helpers/httpResponse.helper";
import { requestValidation } from "./validators/requestValidation";
import { isValidObjectId } from "mongoose";

export class AuthController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  public async login(req: CustomRequest, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await this.usersService.getUserByEmail(email);

    if (user && (await comparePasswords(password, user.password))) {
      const userPayload: IUserPayload = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(userPayload, res);
      const refreshToken = generateRefreshToken(userPayload, res);

      return ResponseHandler.sendSuccess(
        res,
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.userName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
        "Login successful!"
      );
    } else {
      return ResponseHandler.sendUnauthorized(
        res,
        "Invalid email or password."
      );
    }
  }

  public async register(req: CustomRequest, res: Response): Promise<Response> {
    const { error } = requestValidation.validate(req.body);
    if (error) {
      return ResponseHandler.sendBadRequest(
        res,
        "Invalid request data.",
        error.details
      );
    }

    try {
      const {
        email,
        userName,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
      } = req.body;

      const existingUser = await this.usersService.getUserByEmailOrUsername(
        email,
        userName
      );
      if (existingUser) {
        return ResponseHandler.sendBadRequest(
          res,
          "A user with the provided email or username already exists."
        );
      }

      const newUser: Partial<IUser> = {
        email,
        userName,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
        permissions: ["view"],
        createdAt: new Date(),
        updatedAt: new Date(),
        suspended: false,
      };

      const createdUser = await this.usersService.createUser(newUser as IUser);

      const accessToken = generateAccessToken(createdUser, res);
      const refreshToken = generateRefreshToken(createdUser, res);

      return ResponseHandler.sendSuccess(
        res,
        {
          user: {
            id: createdUser.id,
            userName: createdUser.userName,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            phoneNumber: createdUser.phoneNumber,
            role: createdUser.role,
          },
          accessToken,
          refreshToken,
        },
        "User registered successfully!"
      );
    } catch (error: any) {
      console.error(`Error while registering user: ${error}`);
      return ResponseHandler.sendInternalServerError(
        res,
        error.message,
        error.stack
      );
    }
  }

  public async refreshToken(
    req: CustomRequest,
    res: Response
  ): Promise<Response> {
    if (!req.user) {
      return ResponseHandler.sendUnauthorized(
        res,
        "Invalid or expired refresh token."
      );
    }

    const user: IUserPayload = req.user;

    const accessToken = generateAccessToken(user, res);

    return ResponseHandler.sendSuccess(res, { accessToken });
  }

  public async suspendUser(
    req: CustomRequest,
    res: Response
  ): Promise<Response> {
    const userId = req.params.userId;
    const { suspend } = req.body;

    if (!isValidObjectId(userId)) {
      return ResponseHandler.sendBadRequest(res, "Invalid user ID.");
    }

    try {
      const updated = await this.usersService.updateUserSuspension(
        userId,
        suspend
      );

      if (updated) {
        const message = suspend
          ? "User has been suspended."
          : "User has been unsuspended.";
        return ResponseHandler.sendSuccess(res, { message });
      } else {
        return ResponseHandler.sendNotFound(res, "User not found.");
      }
    } catch (error) {
      console.error(`Error while suspending user: ${error}`);
      return ResponseHandler.sendInternalServerError(
        res,
        "An error occurred while processing your request."
      );
    }
  }

  //   public async forgotPassword(req: Request, res: Response): Promise<Response> {
  //     const { email } = req.body;
  //     const user = await this.usersService.getUserByEmail(email);

  //     if (!user) {
  //       return ResponseHandler.sendNotFound(res, 'User not found.');
  //     }

  //     const resetToken = generateResetToken(); // Implement this function according to your needs

  //     await this.usersService.updateUserResetToken(user._id, resetToken);

  //     await sendResetEmail(email, resetToken); // Implement this function according to your needs

  //     return ResponseHandler.sendSuccess(res, 'Reset password email has been sent.');
  //   }

  public async resetPassword(
    req: CustomRequest,
    res: Response
  ): Promise<Response> {
    const { resetToken, newPassword } = req.body;
    const user = await this.usersService.getUserByResetToken(resetToken);

    if (!user || !user._id) {
      return ResponseHandler.sendNotFound(
        res,
        "Invalid or expired reset token."
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    // Invalidate the reset token by setting it to null
    await this.usersService.updateUserResetToken(user._id.toString(), null);

    // Update user password
    await this.usersService.updateUserPassword(
      user._id.toString(),
      hashedPassword
    );

    return ResponseHandler.sendSuccess(res, {}, "Password has been reset.");
  }

  public async changePassword(
    req: CustomRequest,
    res: Response
  ): Promise<Response> {
    if (!req.user) {
      return ResponseHandler.sendUnauthorized(res, "Unauthorized.");
    }

    const user: IUserPayload = req.user;
    const { currentPassword, newPassword } = req.body;

    if (
      !user.password ||
      !(await comparePasswords(currentPassword, user.password))
    ) {
      return ResponseHandler.sendUnauthorized(
        res,
        "Current password is incorrect."
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    if (!user._id) {
      return ResponseHandler.sendBadRequest(res, "User Id is missing");
    }

    await this.usersService.updateUserPassword(
      user._id.toString(),
      hashedPassword
    );

    return ResponseHandler.sendSuccess(res, {}, "Password has been changed."); // Passing an empty object as data
  }
}
