import { Request, Response } from "express";
import ResponseHandler from "../../../../helpers/httpResponse.helper";
import {
  ICreateProduct,
  IProduct,
  IProductResponse,
} from "../data/interfaces/IProduct";
import { addLinks, addLinksToList } from "../../../../utils/hateoas.util";
import { ProductService } from "../services/products.service";
import {
  getPaginationData,
  getPaginationOptions,
} from "../../../../helpers/pagination.helper";

export class ProductsController {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const options = getPaginationOptions(req);
      const paginatedData = await this.productService.getAllProducts(options);
      const pagination = getPaginationData(options, paginatedData.totalCount);

      const productsWithLinks = addLinksToList(
        paginatedData.data,
        ["GET", "PUT", "DELETE"],
        (product) => `/products/${product._id}`
      );

      ResponseHandler.sendSuccess(
        res,
        {
          products: productsWithLinks,
          totalCount: paginatedData.totalCount,
          pagination,
        },
        `Retrieved ${paginatedData.data.length} products out of ${paginatedData.totalCount}`
      );
    } catch (error) {
      ResponseHandler.sendInternalServerError(res, "Internal server error");
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await this.productService.getProductById(productId);
      if (product) {
        const productWithLinks = addLinks(
          product,
          ["GET", "PUT", "DELETE"],
          (data) => `/products/${data._id}`
        );

        const message = `Retrieved product with ID ${productId}`;
        ResponseHandler.sendSuccess(res, productWithLinks, message);
      } else {
        ResponseHandler.sendNotFound(res, "Product not found");
      }
    } catch (error: any) {
      ResponseHandler.sendInternalServerError(res, error.message, error.stack);
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = req.body as IProduct;
      const newProduct = await this.productService.createProduct(product);

      const newProductWithLinks = addLinks(
        newProduct,
        ["GET", "PUT", "DELETE"],
        (data) => `/products/${data._id}`
      );

      ResponseHandler.sendCreated<ICreateProduct>(
        res,
        newProductWithLinks,
        "Product created successfully"
      );
    } catch (error: any) {
      ResponseHandler.sendBadRequest(res, error.message);
    }
  }

  public async updateProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const updatedProduct = req.body as Partial<IProduct>;
      const product = await this.productService.updateProduct(
        productId,
        updatedProduct
      );
      if (product) {
        const productWithLinks = addLinks(
          product,
          ["GET", "PUT", "DELETE"],
          (data) => `/products/${data._id}`
        );

        const message = `Product with ID ${productId} updated successfully`;
        ResponseHandler.sendSuccess<ICreateProduct>(
          res,
          productWithLinks,
          message
        );
      } else {
        ResponseHandler.sendNotFound(res, "Product not found");
      }
    } catch (error: any) {
      ResponseHandler.sendBadRequest(res, error.message);
    }
  }

  public async deleteProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const deletedProduct = await this.productService.deleteProduct(productId);
      if (deletedProduct) {
        const message = `Product with ID ${productId} deleted successfully`;
        ResponseHandler.sendSuccess<IProductResponse>(
          res,
          deletedProduct,
          message
        );
      } else {
        ResponseHandler.sendNotFound(res, "Product not found");
      }
    } catch (error: any) {
      ResponseHandler.sendBadRequest(res, error.message);
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.query as string;
      const options = getPaginationOptions(req);
      const paginatedData = await this.productService.searchProducts(
        query,
        options
      );
      const pagination = getPaginationData(options, paginatedData.totalCount);

      const productsWithLinks = addLinksToList(
        paginatedData.data,
        ["GET", "PUT", "DELETE"],
        (product) => `/products/${product._id}`
      );

      ResponseHandler.sendSuccess(
        res,
        {
          products: productsWithLinks,
          totalCount: paginatedData.totalCount,
          pagination,
        },
        `Retrieved ${paginatedData.data.length} products out of ${paginatedData.totalCount}`
      );
    } catch (error) {
      ResponseHandler.sendInternalServerError(res, "Internal server error");
    }
  }
}
