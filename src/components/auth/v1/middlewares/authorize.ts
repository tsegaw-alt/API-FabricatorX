import { Response, NextFunction } from 'express';
import { IUser, IUserPayload } from '../data/interfaces/IUser';
import ResponseHandler from '../../../../helpers/httpResponse.helper';
import { CustomRequest } from '../../../../utils/customRequest';
import { Permission, rolePermissions } from '../../../../config/permissions';

export function authorize(...requiredPermissions: Permission[]) {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseHandler.sendUnauthorized(res, 'Unauthorized');
      return;
    }

    const user: IUserPayload = req.user;

    // Check if the user is suspended
    if (user.suspended) {
      ResponseHandler.sendForbidden(res, 'User is suspended');
      return;
    }

    // Get permissions of the user's role
    const userPermissions = user.role ? rolePermissions[user.role] : [];

    // Check if the user has all required permissions
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      ResponseHandler.sendForbidden(res, 'Forbidden');
      return;
    }

    next();
  };
}
