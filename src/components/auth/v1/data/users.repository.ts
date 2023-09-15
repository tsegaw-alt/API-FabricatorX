import { IUser } from './interfaces/IUser';
import BaseRepository from '../../../../repositories/BaseRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import { UserModel } from './schemas/userSchema';
import { ObjectId, Types } from 'mongoose';

class UserRepository extends BaseRepository<IUser> implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  public async getByEmailOrUsername(email: string, username: string): Promise<IUser | null> {
    return await UserModel.findOne({ $or: [{ email }, { username }] });
  }

  public async getByResetToken(resetToken: string): Promise<IUser | null> {
    return await UserModel.findOne({ resetToken });
  }

  async updateResetToken(id: Types.ObjectId, resetToken: string | null): Promise<IUser | null> {
    return await this.model.findOneAndUpdate(
      { _id: id },
      { $set: { resetToken } },
      { new: true }
    );
}

}

export default UserRepository;
