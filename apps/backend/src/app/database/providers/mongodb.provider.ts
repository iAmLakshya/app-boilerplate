import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { DatabaseProvider } from '../database.provider';

export const mongodbProviders: Provider[] = [
  {
    provide: DatabaseProvider.mongoDb,
    useFactory: async (): Promise<typeof mongoose> => {
      const uri = process.env.MONGODB_URI;

      return mongoose.connect(uri, {
        retryWrites: false,
        // Add any connection options here if needed
      });
    },
  },
];
