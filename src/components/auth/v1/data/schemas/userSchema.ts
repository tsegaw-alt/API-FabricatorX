import { Schema, model, Types } from "mongoose";
import Joi from "joi";
import { PhoneNumberUtil } from "google-libphonenumber";
import { IUser } from "../interfaces/IUser";
const { ObjectId } = Types;
const phoneUtil = PhoneNumberUtil.getInstance();

const generateUsername = (parent: IUser) => {
  return parent.firstName.toLowerCase() + "-" + parent.lastName.toLowerCase();
};

generateUsername.description = "generated username";

const userSchema = new Schema<IUser>({
  userName: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: String,
  role: String,
  createdAt: Date,
  updatedAt: Date,
  deleted: Boolean,
});

const userValidationSchema = Joi.object({
  _id: Joi.custom((value, helpers) => {
    if (!(value instanceof ObjectId)) {
      return helpers.message({ custom: 'Invalid Id' });
    }
    return value;
  }).optional(),
  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .default(generateUsername)
    .custom(async (value, helpers) => {
      const userWithSameUsername = await UserModel.findOne({ userName: value });
      if (userWithSameUsername) {
        return helpers.message({ custom: 'user name already in use'});
      }
      return value;
    })
    .messages({
      "string.empty": "User name cannot be empty",
      "string.alphanum": "User name must only contain alpha-numeric characters",
      "string.min": "User name must be at least {#limit} characters long",
      "string.max": "User name cannot be longer than {#limit} characters",
      "any.required": "User name is required",
    }),
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name cannot be empty",
    "string.min": "First name must be at least {#limit} characters long",
    "string.max": "First name cannot be longer than {#limit} characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name must be at least {#limit} characters long",
    "string.max": "Last name cannot be longer than {#limit} characters",
    "any.required": "Last name is required",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .custom(async (value, helpers) => {
      const userWithSameEmail = await UserModel.findOne({ email: value });
      if (userWithSameEmail) {
        return helpers.message({ custom: 'Email already in use'});
      }
      return value;
    })
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
    }),
    phoneNumber: Joi.string()
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 17 digits and can contain numbers, spaces, parentheses, +, and -",
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
      "any.custom": "{{#custom}}",
    }),

  role: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": 'Role must be either "user" or "admin"',
  }),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  deleted: Joi.boolean().optional(),
});

userSchema.pre("save", async function (next) {
  try {
    await userValidationSchema.validateAsync(this.toObject(), {
      abortEarly: false,
    });
    this.updatedAt = new Date();
    next();
  } catch (error: any) {
    next(error);
  }
});

export const UserModel = model<IUser>("User", userSchema);
