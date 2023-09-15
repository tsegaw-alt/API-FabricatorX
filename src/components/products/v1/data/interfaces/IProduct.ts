import { Document, ObjectId } from 'mongoose';
import BaseModel from '../../../../../interfaces/BaseModel';

export interface IProduct extends Document, BaseModel {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  images?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  tags?: string[];
  brand: string;
}

export interface ICreateProduct {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  images?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  rating?: number;
  totalReviews?: number;
  tags?: string[];
  brand: string;
}

export interface IProductResponse {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  images?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  tags?: string[];
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}
