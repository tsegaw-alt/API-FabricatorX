import { IProduct } from './IProduct';
import IBaseRepository from '../../../../../repositories/interfaces/IBaseRepository';

export interface IProductRepository extends IBaseRepository<IProduct> {
  getBySKU(sku: string): Promise<IProduct | null>;
}
