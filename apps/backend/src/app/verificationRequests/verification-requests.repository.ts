import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { DatabaseModel } from '../database/database.models';
import { VerificationRequest } from './verification-requests.schema';

@Injectable()
export class VerificationRequestRepository extends BaseRepository<VerificationRequest> {
  constructor(
    @Inject(DatabaseModel.verificationRequests)
    selectedModel: Model<VerificationRequest>
  ) {
    super(selectedModel);
  }
}
