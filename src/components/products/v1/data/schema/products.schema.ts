import { Schema, model, Types } from "mongoose";
import Joi from "joi";
import { IProduct } from "../interfaces/IProduct";
const { ObjectId } = Types;

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  category: String,
  subcategory: String,
  price: Number,
  salePrice: Number,
  stock: Number,
  sku: String,
  images: [String],
  isFeatured: Boolean,
  isPublished: Boolean,
  rating: Number,
  totalReviews: Number,
  tags: [String],
  brand: String,
  createdAt: Date,
  updatedAt: Date,
});

const productValidationSchema = Joi.object({
  _id: Joi.custom((value, helpers) => {
    if (!(value instanceof ObjectId)) {
      return helpers.message({ custom: 'Invalid Id' });
    }
    return value;
  }).optional(),
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name cannot be longer than {#limit} characters",
    "any.required": "Name is required",
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least {#limit} characters long",
    "string.max": "Description cannot be longer than {#limit} characters",
    "any.required": "Description is required",
  }),
  category: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Category cannot be empty",
    "string.min": "Category must be at least {#limit} characters long",
    "string.max": "Category cannot be longer than {#limit} characters",
    "any.required": "Category is required",
  }),
  subcategory: Joi.string().min(2).max(255).optional().messages({
    "string.empty": "Subcategory cannot be empty",
    "string.min": "Subcategory must be at least {#limit} characters long",
    "string.max": "Subcategory cannot be longer than {#limit} characters",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price must be greater than or equal to {#limit}",
    "any.required": "Price is required",
  }),
  salePrice: Joi.number().min(0).optional().messages({
    "number.min": "Sale price must be greater than or equal to {#limit}",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be an integer",
    "number.min": "Stock must be greater than or equal to {#limit}",
    "any.required": "Stock is required",
  }),
  sku: Joi.string().min(2).max(255).required().messages({
    "string.empty": "SKU cannot be empty",
    "string.min": "SKU must be at least {#limit} characters long",
    "string.max": "SKU cannot be longer than {#limit} characters",
    "any.required": "SKU is required",
  }),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isFeatured: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
  rating: Joi.number().min(0).max(5).optional().messages({
    "number.min": "Rating must be greater than or equal to {#limit}",
    "number.max": "Rating must be less than or equal to {#limit}",
  }),
  totalReviews: Joi.number().integer().min(0).optional().messages({
    "number.base": "Total reviews must be an integer",
    "number.min": "Total reviews must be greater than or equal to {#limit}",
  }),
  tags: Joi.array().items(Joi.string().min(2).max(255)).optional(),
  brand: Joi.string().min(2).max(255).optional().messages({
    "string.empty": "Brand cannot be empty",
    "string.min": "Brand must be at least {#limit} characters long",
    "string.max": "Brand cannot be longer than {#limit} characters",
  }),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

productSchema.pre("save", async function (next) {
  try {
    await productValidationSchema.validateAsync(this.toObject(), {
      abortEarly: false,
    });
    this.updatedAt = new Date();
    next();
  } catch (error: any) {
    next(error);
  }
});

export const ProductModel = model<IProduct>("Product", productSchema);

