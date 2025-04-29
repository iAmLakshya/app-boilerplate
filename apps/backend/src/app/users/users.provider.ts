// src/users/providers/user.providers.ts
import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UserSchema } from './users.schema';
import { DatabaseModel } from '../database/database.models';
import { DatabaseProvider } from '../database/database.provider';

export const UsersProvider: Provider = {
  provide: DatabaseModel.users,
  useFactory: (connection: Connection) =>
    connection.model(DatabaseModel.users, UserSchema),
  inject: [DatabaseProvider.mongoDb],
};
