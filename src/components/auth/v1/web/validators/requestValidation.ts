import Joi from "joi";

export const requestValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "User name cannot be empty",
      "string.alphanum": "User name must only contain alpha-numeric characters",
      "string.min": "User name must be at least {#limit} characters long",
      "string.max": "User name cannot be longer than {#limit} characters",
      "any.required": "User name is required",
    }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9@]{8,30}$/)
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must be 8-30 characters long and contain only letters, numbers, and @",
      "any.required": "Password is required",
    }),
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.empty": "First name cannot be empty",
      "string.min": "First name must be at least {#limit} characters long",
      "string.max": "First name cannot be longer than {#limit} characters",
      "any.required": "First name is required",
    }),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.empty": "Last name cannot be empty",
      "string.min": "Last name must be at least {#limit} characters long",
      "string.max": "Last name cannot be longer than {#limit} characters",
      "any.required": "Last name is required",
    }),
  phoneNumber: Joi.string()
    .required()
    .messages({
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
    }),
  role: Joi.string()
    .valid("user", "admin")
    .default("user")
    .messages({
      "any.only": 'Role must be either "user" or "admin"',
    }),
  suspended: Joi.boolean().optional(),
  permissions: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  verifyPassword: Joi.function().optional(),
});
