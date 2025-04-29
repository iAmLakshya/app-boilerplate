// src/users/providers/user.providers.ts
import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModel } from '../database/database.models';
import { DatabaseProvider } from '../database/database.provider';
import { VerificationRequestSchema } from './verification-requests.schema';

export const VerificationRequestsProvider: Provider = {
  provide: DatabaseModel.verificationRequests,
  useFactory: (connection: Connection) =>
    connection.model(
      DatabaseModel.verificationRequests,
      VerificationRequestSchema
    ),
  inject: [DatabaseProvider.mongoDb],
};
