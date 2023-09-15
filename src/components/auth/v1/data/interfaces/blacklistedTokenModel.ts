import { model } from 'mongoose';
import { blacklistedTokenSchema } from '../schemas/blacklistedTokenSchema';

export const BlacklistedTokenModel = model('BlacklistedToken', blacklistedTokenSchema);
