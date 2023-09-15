import { Types } from "mongoose";
import { UsersService } from "../../../../../src/components/auth/v1/services/users.service";
import UserRepository from "../../../../../src/components/auth/v1/data/users.repository";
import { hashPassword } from "../../../../../src/helpers/passwordHash";
import {
  IUser,
  IUserPayload,
  UserRole,
} from "../../../../../src/components/auth/v1/data/interfaces/IUser";

jest.mock("../../../../../src/components/auth/v1/data/users.repository");
jest.mock("../../../../../src/helpers/passwordHash");

interface IUserWithResetToken extends IUser {
  resetToken: string;
}

describe("UsersService", () => {
  let service: UsersService;

  // Test constants
  const TEST_USER_ID = "60f5b1ea4a30f12d88f6109a";
  const TEST_USERS = [
    {
      _id: new Types.ObjectId(TEST_USER_ID),
      userName: "testUser1",
      email: "test1@test.com",
      firstName: "Test1",
      lastName: "User1",
      password: "hashed_password1",
      phoneNumber: "123456789",
      role: "Admin",
      permissions: ["view"],
      suspended: false,
    },
    {
      _id: new Types.ObjectId("60f5b1ea4a30f12d88f6109b"),
      userName: "testUser2",
      email: "test2@test.com",
      firstName: "Test2",
      lastName: "User2",
      password: "hashed_password2",
      phoneNumber: "987654321",
      role: "User",
      permissions: ["view"],
      suspended: false,
    },
  ];

  beforeEach(() => {
    (UserRepository as jest.Mock).mockClear();
    service = new UsersService();
  });

  it("calls UserRepository.getAll when getting all users", async () => {
    // Arrange
    (UserRepository.prototype.getAll as jest.Mock).mockResolvedValue(
      TEST_USERS
    );

    // Act
    const users = await service.getAllUsers({
      pageSize: 10,
      page: 1,
      sortOrder: "asc",
    });

    // Assert
    expect(UserRepository.prototype.getAll).toHaveBeenCalled();
  });

  it("returns all users when getting all users", async () => {
    // Arrange
    (UserRepository.prototype.getAll as jest.Mock).mockResolvedValue(
      TEST_USERS
    );

    // Act
    const users = await service.getAllUsers({
      pageSize: 10,
      page: 1,
      sortOrder: "asc",
    });

    // Assert
    expect(users.data).toEqual(TEST_USERS);
  });

  it("calls UserRepository.getById with correct ID when getting a user by ID", async () => {
    // Arrange
    const mockUser = TEST_USERS[0];
    (UserRepository.prototype.getById as jest.Mock).mockResolvedValue(mockUser);

    // Act
    await service.getUserById(TEST_USER_ID);

    // Assert
    expect(UserRepository.prototype.getById).toHaveBeenCalledWith(
      new Types.ObjectId(TEST_USER_ID)
    );
  });

  it("returns correct user when getting a user by ID", async () => {
    // Arrange
    const mockUser = TEST_USERS[0];
    (UserRepository.prototype.getById as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const user = await service.getUserById(TEST_USER_ID);

    // Assert
    expect(user).toEqual(mockUser);
  });

  it("returns deleted user when deleting a user", async () => {
    // Arrange
    const mockUser: Partial<IUser> = {
      id: new Types.ObjectId(TEST_USER_ID).toHexString(),
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      verifyPassword: undefined,
    };

    (UserRepository.prototype.getById as jest.Mock).mockResolvedValue(mockUser);
    (UserRepository.prototype.deleteById as jest.Mock).mockResolvedValue(true);

    // Act
    const deletedUser = await service.deleteUser(TEST_USER_ID);

    // Assert
    expect(deletedUser).toEqual(mockUser);
  });

  it("calls UserRepository.create with correct user data when creating a user", async () => {
    // Arrange
    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    const hashedMockUser = {
      ...mockUser,
      password: await hashPassword(mockUser.password!),
    };

    (UserRepository.prototype.create as jest.Mock).mockResolvedValue(
      hashedMockUser
    );

    // Act
    await service.createUser(mockUser);

    // Assert
    expect(UserRepository.prototype.create).toHaveBeenCalledWith(
      hashedMockUser
    );
  });

  it("returns correct user when creating a user", async () => {
    // Arrange
    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    const hashedMockUser = {
      ...mockUser,
      password: await hashPassword(mockUser.password!),
    };
    (UserRepository.prototype.create as jest.Mock).mockResolvedValue(
      hashedMockUser
    );

    // Act
    const createdUser = await service.createUser(mockUser);

    // Assert
    expect(createdUser).toEqual({
      userName: mockUser.userName,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phoneNumber: mockUser.phoneNumber,
      role: mockUser.role,
      permissions: mockUser.permissions,
      suspended: mockUser.suspended,
    });
  });

  it("calls UserRepository.updateById with correct ID and user payload when updating a user", async () => {
    // Arrange
    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    const updatedMockUser = { ...mockUser, userName: "UpdatedUser" };
    (UserRepository.prototype.updateById as jest.Mock).mockResolvedValue(
      updatedMockUser
    );

    // Act
    await service.updateUser(TEST_USER_ID, updatedMockUser);

    // Assert
    expect(UserRepository.prototype.updateById).toHaveBeenCalledWith(
      new Types.ObjectId(TEST_USER_ID),
      updatedMockUser
    );
  });

  it("returns updated user when updating a user", async () => {
    // Arrange
    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    const updatedMockUser = { ...mockUser, userName: "UpdatedUser" };
    (UserRepository.prototype.updateById as jest.Mock).mockResolvedValue(
      updatedMockUser
    );

    // Act
    const updatedUser = await service.updateUser(TEST_USER_ID, updatedMockUser);

    // Assert
    expect(updatedUser).toEqual(updatedMockUser);
  });

  it("returns the user with the given reset token", async () => {
    // Arrange
    const resetToken = "testResetToken";

    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    (UserRepository.prototype.getByResetToken as jest.Mock).mockResolvedValue(
      mockUser
    );

    // Act
    const user = await service.getUserByResetToken(resetToken);

    // Assert
    expect(user).toEqual(mockUser);
  });

  it("returns true when updating a user's password", async () => {
    // Arrange
    const newPassword = "new_hashed_password";
    const hashedNewPassword = await hashPassword(newPassword);

    const mockUser: IUserPayload = {
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: hashedNewPassword,
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
    };

    (UserRepository.prototype.updateById as jest.Mock).mockResolvedValue(
      mockUser
    );

    // Act
    const result = await service.updateUserPassword(TEST_USER_ID, newPassword);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when fails to update a user's password", async () => {
    // Arrange
    const newPassword = "new_hashed_password";

    (UserRepository.prototype.updateById as jest.Mock).mockResolvedValue(null);

    // Act
    const result = await service.updateUserPassword(TEST_USER_ID, newPassword);

    // Assert
    expect(result).toBe(false);
  });

  it("returns updated user when updating a user reset token", async () => {
    // Arrange
    const newResetToken = "new_reset_token";
    const mockUser: Partial<IUserWithResetToken> = {
      id: new Types.ObjectId(TEST_USER_ID),
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashed_password",
      phoneNumber: "123456789",
      role: UserRole.Admin,
      permissions: ["view"],
      suspended: false,
      resetToken: newResetToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      verifyPassword: async (password: string) => true,
    };

    (UserRepository.prototype.updateResetToken as jest.Mock).mockResolvedValue(
      mockUser
    );

    // Act
    const updatedUser = await service.updateUserResetToken(
      TEST_USER_ID,
      newResetToken
    );

    // Assert
    expect(updatedUser).toEqual(mockUser);
  });

  it("returns null when fails to update a user's reset token", async () => {
    // Arrange
    const newResetToken = "newResetToken";

    (UserRepository.prototype.updateResetToken as jest.Mock).mockResolvedValue(
      null
    );

    // Act
    const updatedUser = await service.updateUserResetToken(
      TEST_USER_ID,
      newResetToken
    );

    // Assert
    expect(updatedUser).toBeNull();
  });
});
