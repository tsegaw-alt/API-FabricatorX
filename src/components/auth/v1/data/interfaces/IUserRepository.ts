import {IUser} from './IUser';
import IBaseRepository from '../../../../../repositories/interfaces/IBaseRepository';

export interface IUserRepository extends IBaseRepository<IUser> {
    getByEmail(email: string): Promise<IUser | null>;
}
