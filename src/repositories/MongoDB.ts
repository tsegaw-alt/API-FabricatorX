import { IDatabase } from './interfaces/IDatabase';
import mongoose, { ConnectOptions } from 'mongoose';

export class MongoDB implements IDatabase {
  private readonly connectionString: string;

  constructor(uri: string) {
    this.connectionString = uri;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
      } as ConnectOptions);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Error connecting to the database', error);
      process.exit(1);
    }
  }
  
}
