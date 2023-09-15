export const authSwaggerDefinitions = {
  User: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        description: "The auto-generated id of the user",
      },
      userName: {
        type: "string",
        description: "The username of the user",
      },
      email: {
        type: "string",
        description: "The email of the user",
      },
      role: {
        type: "string",
        description: "The role of the user",
      },
      firstName: {
        type: "string",
        description: "The first name of the user",
      },
      lastName: {
        type: "string",
        description: "The last name of the user",
      },
      phoneNumber: {
        type: "string",
        description: "The phone number of the user",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "The date and time when the user was created",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "The date and time when the user was last updated",
      },
      suspended: {
        type: "boolean",
        description: "Whether the user account is suspended",
      },
    },
  },
};

export const authSwaggerPaths = {
  "/v1/auth/register": {
    post: {
      summary: "Registers a new user to the system. The user needs to provide a unique username and email, along with their personal details.",
      tags: ["Auth"],
      description: "This endpoint allows a new user to register to the system. It checks for the uniqueness of the username and email, and if valid, creates a new user in the system.",
      requestBody: {
        description: "The user object to register. It includes the username, email, password, and personal details of the user.",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
            examples: {
              NewUser: {
                summary: "New User",
                value: {
                  userName: "newUser",
                  email: "newUser@email.com",
                  password: "password123",
                  firstName: "John",
                  lastName: "Doe",
                  phoneNumber: "1234567890",
                  role: "user"
                }
              }
            }
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully. Returns the user object along with the auto-generated ID.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              examples: {
                SuccessfulRegistration: {
                  summary: "Successful Registration",
                  value: {
                    _id: "60d7213a4f8b9c2e6c8b4567",
                    userName: "newUser",
                    email: "newUser@email.com",
                    role: "user",
                    firstName: "John",
                    lastName: "Doe",
                    phoneNumber: "1234567890",
                    createdAt: "2023-05-09T10:30:20Z",
                    updatedAt: "2023-05-09T10:30:20Z",
                    suspended: false
                  }
                }
              }
            },
          },
        },
        400: {
          description: "Bad Request. This usually happens if the username or email is already taken, or if the provided input doesn't meet the validation criteria.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message explaining what went wrong",
                  },
                },
              },
              examples: {
                AlreadyTaken: {
                  summary: "Username or Email Already Taken",
                  value: {
                    message: "Username or email is already taken."
                  }
                },
                ValidationError: {
                  summary: "Validation Error",
                  value: {
                    message: "Email is not a valid email address."
                  }
                }
              }
            },
          },
        },
      },
    },
  },
  
  "/v1/auth/login": {
    post: {
      summary: "Authenticates a user and provides access and refresh tokens.",
      tags: ["Auth"],
      description: "This endpoint allows users to log in by providing their email and password. If the authentication is successful, it returns access and refresh tokens for the session.",
      requestBody: {
        description: "User's login details including email and password.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "The email of the user",
                },
                password: {
                  type: "string",
                  description: "The password of the user",
                },
              },
            },
            examples: {
              LoginDetails: {
                summary: "Login Details",
                value: {
                  email: "newUser@email.com",
                  password: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User logged in successfully. Returns the user object and the access and refresh tokens for the session.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    $ref: "#/components/schemas/User",
                  },
                  accessToken: {
                    type: "string",
                    description: "Access token for the session",
                  },
                  refreshToken: {
                    type: "string",
                    description: "Refresh token for the session",
                  },
                },
              },
              examples: {
                SuccessfulLogin: {
                  summary: "Successful Login",
                  value: {
                    user: {
                      _id: "60d7213a4f8b9c2e6c8b4567",
                      userName: "newUser",
                      email: "newUser@email.com",
                      role: "user",
                      firstName: "John",
                      lastName: "Doe",
                      phoneNumber: "1234567890",
                      createdAt: "2023-05-09T10:30:20Z",
                      updatedAt: "2023-05-09T10:30:20Z",
                      suspended: false
                    },
                    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized. This usually happens if the email or password is incorrect.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message explaining what went wrong",
                  },
                },
              },
              examples: {
                InvalidCredentials: {
                  summary: "Invalid Credentials",
                  value: {
                    message: "Invalid email or password.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request. This usually happens if the provided input doesn't meet the validation criteria.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message explaining what went wrong",
                  },
                },
              },
              examples: {
                ValidationError: {
                  summary: "Validation Error",
                  value: {
                    message: "Invalid email format provided.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error. This is usually a server-side issue.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message explaining what went wrong",
                  },
                },
              },
              examples: {
                ServerError: {
                  summary: "Server Error",
                  value: {
                    message: "Unexpected error occurred on the server. Please try again later.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/v1/auth/refresh-token": {
    post: {
      summary: "Refresh the access token",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "Authorization",
          schema: {
            type: "string",
          },
          required: true,
          description: "Refresh token",
        },
      ],
      responses: {
        200: {
          description: "Access token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    description: "New access token",
                  },
                },
              },
            },
            examples: {
              SuccessfulTokenRefresh: {
                summary: "Successful Token Refresh",
                value: {
                  accessToken: "new_access_token_value",
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - Invalid or expired refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              InvalidToken: {
                summary: "Invalid Token",
                value: {
                  message: "The provided refresh token is invalid or expired.",
                },
              },
            },
          },
        },
      },
    },
  },

  "/v1/auth/suspend-user/{userId}": {
    patch: {
      summary: "Suspend or unsuspend a user",
      tags: ["Authentication"],
      parameters: [
        {
          in: "path",
          name: "userId",
          schema: {
            type: "string",
          },
          required: true,
          description: "User ID",
        },
      ],
      requestBody: {
        description: "Suspend status",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                suspend: {
                  type: "boolean",
                  description: "Suspend status to set",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User suspension status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Success message",
                  },
                },
              },
            },
            examples: {
              UserSuspended: {
                summary: "User Suspended",
                value: {
                  message: "User has been successfully suspended.",
                },
              },
              UserUnsuspended: {
                summary: "User Unsuspended",
                value: {
                  message: "User has been successfully unsuspended.",
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Invalid user ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              InvalidUserId: {
                summary: "Invalid User ID",
                value: {
                  message: "The provided user ID is invalid.",
                },
              },
            },
          },
        },
        404: {
          description: "Not Found - User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              UserNotFound: {
                summary: "User Not Found",
                value: {
                  message: "The specified user could not be found.",
                },
              },
            },
          },
        },
      },
    },
  },

  "/v1/auth/reset-password": {
    post: {
      summary: "Reset the password",
      tags: ["Authentication"],
      requestBody: {
        description: "User's email",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "User's email",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Reset password email sent successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Success message",
                  },
                },
              },
            },
            examples: {
              PasswordResetMailSent: {
                summary: "Password Reset Mail Sent",
                value: {
                  message: "Reset password email has been sent successfully to the user's email.",
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Invalid email",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              InvalidEmail: {
                summary: "Invalid Email",
                value: {
                  message: "The provided email is invalid.",
                },
              },
            },
          },
        },
        404: {
          description: "Not Found - User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              UserNotFound: {
                summary: "User Not Found",
                value: {
                  message: "The specified user could not be found.",
                },
              },
            },
          },
        },
      },
    },
  },

  "/v1/auth/change-password": {
    post: {
      summary: "Change the password",
      tags: ["Authentication"],
      requestBody: {
        description: "User's old and new password",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                oldPassword: {
                  type: "string",
                  description: "User's old password",
                },
                newPassword: {
                  type: "string",
                  description: "User's new password",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password changed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Success message",
                  },
                },
              },
            },
            examples: {
              PasswordChanged: {
                summary: "Password Changed",
                value: {
                  message: "Password has been changed successfully.",
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Invalid old or new password",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              InvalidPassword: {
                summary: "Invalid Password",
                value: {
                  message: "The provided old or new password is invalid.",
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - Old password is incorrect",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
            examples: {
              IncorrectOldPassword: {
                summary: "Incorrect Old Password",
                value: {
                  message: "The provided old password is incorrect.",
                },
              },
            },
          },
        },
      },
    },
  },

};
