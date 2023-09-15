import { Request } from 'express';
import { IUser, IUserPayload } from '../components/auth/v1/data/interfaces/IUser';

export interface CustomRequest extends Request {
  user?: IUserPayload;
}
