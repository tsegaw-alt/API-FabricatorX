import { UserRole } from "../components/auth/v1/data/interfaces/IUser";

export enum Permission {
    CREATE_PRODUCT = 'create_product',
    UPDATE_PRODUCT = 'update_product',
    DELETE_PRODUCT = 'delete_product',
    VIEW_PRODUCT = 'view_product',
    SUSPEND_USER = 'suspend_user'
  }
  
  export const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.User]: [Permission.VIEW_PRODUCT],
    [UserRole.Admin]: [
      Permission.CREATE_PRODUCT,
      Permission.UPDATE_PRODUCT,
      Permission.DELETE_PRODUCT,
      Permission.VIEW_PRODUCT,
      Permission.SUSPEND_USER
    ],
  };
  