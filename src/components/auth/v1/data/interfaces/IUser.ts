import { Document, ObjectId } from 'mongoose';
import BaseModel from '../../../../../interfaces/BaseModel';

interface IUser extends Document, BaseModel {
  _id: ObjectId;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  permissions: string[];
  verifyPassword(password: string): Promise<boolean>;
  suspended: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserPayload extends Partial<IUser> {}

enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export { IUser, IUserPayload, UserRole }
