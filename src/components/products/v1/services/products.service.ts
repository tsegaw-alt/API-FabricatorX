import ProductRepository from "../data/products.repository";
import { IProduct, IProductResponse, ICreateProduct } from "../data/interfaces/IProduct";
import { ObjectId } from "bson";
import { Types } from "mongoose";
import { paginate } from "../../../../helpers/paginate";
import { IPaginationOptions } from "../../../../interfaces/IPaginationOptions";
import { IPaginatedData } from "../../../../interfaces/IPaginatedData";

function productExtractFn(product: IProduct): IProductResponse {
  return {
    _id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    sku: product.sku,
    images: product.images,
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    rating: product.rating,
    totalReviews: product.totalReviews,
    tags: product.tags,
    brand: product.brand,
    createdAt: product.createdAt || new Date(),
    updatedAt: product.updatedAt || new Date(),
  };
}

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async getAllProducts(
    options: IPaginationOptions<IProduct>
  ): Promise<IPaginatedData<IProduct>> {
    const products = await this.productRepository.getAll();
    return paginate(products, options, productExtractFn);
  }

  public async getProductById(id: string): Promise<IProductResponse | null> {
    const product = await this.productRepository.getById(new ObjectId(id));
    if (product) {
      const extractedProduct = productExtractFn(product);
      return extractedProduct;
    }
    return null;
  }

  public async createProduct(product: IProduct): Promise<ICreateProduct> {
    const createdProduct = await this.productRepository.create(product);
    return productExtractFn(createdProduct);
  }

  public async updateProduct(
    id: string | Types.ObjectId,
    product: Partial<IProduct>
  ): Promise<IProductResponse | null> {
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
    const updatedProduct = await this.productRepository.updateById(objectId, product);

    if (updatedProduct) {
      return productExtractFn(updatedProduct);
    }
    return null;
  }

  public async deleteProduct(id: string): Promise<IProductResponse | null> {
    const objectId = new Types.ObjectId(id);
    const product = await this.productRepository.getById(objectId);

    if (product) {
      await this.productRepository.deleteById(objectId);
      return productExtractFn(product);
    }

    return null;
  }

  public async searchProducts(
    query: string,
    options: IPaginationOptions<IProduct>
  ): Promise<IPaginatedData<IProduct>> {
    const searchOptions = { $text: { $search: query } };
    const products = await this.productRepository.search(searchOptions);
    return paginate(products, options, productExtractFn);
  }

  public async getProductBySKU(sku: string): Promise<IProduct | null> {
    return await this.productRepository.getBySKU(sku);
  }
}
