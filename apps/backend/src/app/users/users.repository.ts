import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { DatabaseModel } from '../database/database.models';
import { User } from './users.schema';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @Inject(DatabaseModel.users)
    selectedModel: Model<User>
  ) {
    super(selectedModel);
  }

  public async findUserByEmailOrPhoneNumber(identifier: string): Promise<User> {
    return this.model.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });
  }
}
