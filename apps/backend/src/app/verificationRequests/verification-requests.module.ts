import { Module } from '@nestjs/common';
import { VerificationRequestsController } from './verification-requests.controller';
import { VerificationRequestsService } from './verification-requests.service';
import { VerificationRequestsProvider } from './verification-requests.provider';
import { VerificationRequestRepository } from './verification-requests.repository';

@Module({
  controllers: [VerificationRequestsController],
  providers: [
    VerificationRequestsService,
    VerificationRequestsProvider,
    VerificationRequestRepository,
  ],
  exports: [VerificationRequestsService, VerificationRequestRepository],
})
export class VerificationRequestsModule {}
