import { FilterQuery } from 'mongoose';
import { ObjectId } from 'bson';

 interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  updateById(id: ObjectId, entity: Partial<T>): Promise<T | null>;
  getById(id: ObjectId): Promise<T | null>;
  deleteById(id: ObjectId): Promise<T | null>;
  getAll(): Promise<T[]>;
  search(query: FilterQuery<T>): Promise<T[]>;
}

export default IBaseRepository;
