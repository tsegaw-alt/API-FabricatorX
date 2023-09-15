import { IUser, IUserPayload, UserRole } from "../data/interfaces/IUser";
import { Types } from "mongoose";
import { paginate } from "../../../../helpers/paginate";
import UserRepository from "../data/users.repository";
import { IPaginationOptions } from "../../../../interfaces/IPaginationOptions";
import { IPaginatedData } from "../../../../interfaces/IPaginatedData";
import { hashPassword } from "../../../../helpers/passwordHash";
import { ObjectId } from "mongoose";

interface SearchOptions {
  [key: string]: any;
}

function userExtractFn(user: IUser): IUserPayload {
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    password: user.password,
    permissions: user.permissions,
    suspended: user.suspended,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    verifyPassword: user.verifyPassword,
  };
}

export class UsersService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getAllUsers(
    options: IPaginationOptions<IUser>
  ): Promise<IPaginatedData<IUser>> {
    const users = await this.userRepository.getAll();
    return paginate(users, options, userExtractFn);
  }

  public async getUserById(id: string): Promise<IUserPayload | null> {
    const objectId = new Types.ObjectId(id);
    const user = await this.userRepository.getById(objectId);
    if (user) {
      const extractedUser = userExtractFn(user);
      return extractedUser;
    }
    return null;
  }

  public async createUser(user: IUserPayload): Promise<IUserPayload> {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }
    const createdUser = await this.userRepository.create(user as IUser);
    return userExtractFn(createdUser);
  }

  public async updateUser(
    id: string | Types.ObjectId,
    user: IUserPayload
  ): Promise<IUserPayload | null> {
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
    const updatedUser = await this.userRepository.updateById(objectId, user);

    if (updatedUser) {
      return userExtractFn(updatedUser);
    }
    return null;
  }

  public async deleteUser(id: string): Promise<IUserPayload | null> {
    const objectId = new Types.ObjectId(id);
    const user = await this.userRepository.getById(objectId);

    if (user) {
      await this.userRepository.deleteById(objectId);
      return userExtractFn(user);
    }

    return null;
  }

  public async searchUsers(
    query: string,
    options: IPaginationOptions<IUser>
  ): Promise<IPaginatedData<IUser>> {
    const searchOptions: SearchOptions = { $text: { $search: query } };
    const users = await this.userRepository.search(searchOptions);
    return paginate(users, options, userExtractFn);
  }

  public async getUserByEmailOrUsername(
    email: string,
    username: string
  ): Promise<IUser | null> {
    const userByEmail = await this.userRepository.getByEmail(email);
    if (userByEmail) {
      return userByEmail;
    }

    const userByUsername = await this.userRepository.getByEmailOrUsername(
      email,
      username
    );
    if (userByUsername) {
      return userByUsername;
    }

    return null;
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.getByEmail(email);
  }

  public async updateUserSuspension(
    userId: string,
    isSuspended: boolean
  ): Promise<boolean> {
    const objectId = new Types.ObjectId(userId);
    const updatedUser = await this.userRepository.updateById(objectId, {
      suspended: isSuspended,
    });
    return !!updatedUser;
  }

  public async getUserByResetToken(
    resetToken: string
  ): Promise<IUserPayload | null> {
    const user = await this.userRepository.getByResetToken(resetToken);
    if (user) {
      return userExtractFn(user);
    }
    return null;
  }

  public async updateUserPassword(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    const hashedPassword = await hashPassword(newPassword);
    const objectId = new Types.ObjectId(userId);
    const updatedUser = await this.userRepository.updateById(objectId, {
      password: hashedPassword,
    });
    return !!updatedUser;
  }

  async updateUserResetToken(
    id: string,
    resetToken: string | null
  ): Promise<IUserPayload | null> {
    const objectId = new Types.ObjectId(id);
    const updatedUser = await this.userRepository.updateResetToken(
      objectId,
      resetToken
    );

    if (updatedUser) {
      return userExtractFn(updatedUser);
    }

    return null;
  }
}
