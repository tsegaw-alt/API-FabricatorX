import { IProduct } from './interfaces/IProduct';
import BaseRepository from '../../../../repositories/BaseRepository';
import { IProductRepository } from './interfaces/IProductRepository';
import { ProductModel } from './schema/products.schema';

class ProductRepository extends BaseRepository<IProduct> implements IProductRepository {

  constructor() {
    super(ProductModel);
  }

  async getBySKU(sku: string): Promise<IProduct | null> {
    return await this.model.findOne({ sku });
  }
}

export default ProductRepository;
