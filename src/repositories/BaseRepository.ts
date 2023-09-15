import { FilterQuery, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'bson';
import IBaseRepository from './interfaces/IBaseRepository';

class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  protected get model(): Model<T> {
    return this._model;
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = new this.model({
      ...entity,
      _id: new Types.ObjectId(),
    });
    return await newEntity.save();
  }
  

  async updateById(id: ObjectId, entity: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true });
  }

  async getById(id: ObjectId): Promise<T | null> {
    return await this.model.findById(id);
  }

  async deleteById(id: ObjectId): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async getAll(): Promise<T[]> {
    return await this.model.find();
  }

  async search(query: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(query);
  }

}

export default BaseRepository;

