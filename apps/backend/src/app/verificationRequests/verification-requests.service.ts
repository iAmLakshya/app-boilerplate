import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AttemptVerificationDto,
  CreateVerificationRequestDto,
} from './verification-requests.dto';
import {
  VerificationAttemptResponse,
  VerificationRequestEntity,
  VerificationRequestStatus,
} from '@/types';
import { VerificationRequestRepository } from './verification-requests.repository';
import { VerificationRequest } from './verification-requests.schema';

export const EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutes
export const RESEND_GAP = 1000 * 60; // 1 minute
export const MAX_ATTEMPTS = 5;
export const MAX_SEND_REQUESTS = 3;

@Injectable()
export class VerificationRequestsService {
  constructor(
    private readonly verificationRequestsRepository: VerificationRequestRepository
  ) {}
  public async createVerificationRequest(
    requestBody: CreateVerificationRequestDto
  ) {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationRequest =
      await this.verificationRequestsRepository.create({
        purpose: requestBody.purpose,
        verificationCode: verificationCode,
        identifier: requestBody.identifier,
        identifierType: requestBody.identifierType,
        userId: requestBody.userId,
        totalResends: -1,
        totalAttempts: 0,
        nextResendAt: new Date(),
        expiresAt: new Date(Date.now() + EXPIRATION_TIME),
        status: VerificationRequestStatus.PENDING,
      });

    return this.sendVerificationCode(verificationRequest.id);
  }

  public async sendVerificationCode(verificationRequestId: string) {
    const verificationRequest =
      await this.verificationRequestsRepository.findById(verificationRequestId);

    //   Check for early resend
    if (verificationRequest.nextResendAt < new Date()) {
      throw new BadRequestException(
        `Verification request can be resent in ${Math.floor(
          (verificationRequest.nextResendAt.getTime() - Date.now()) / 1000
        )} seconds`
      );
    }
    await this.validateVerificationRequest(verificationRequest);

    // TODO: Implement logic to send verification code

    // Update verification request
    await this.verificationRequestsRepository.update(verificationRequestId, {
      $inc: {
        totalResends: 1,
      },
      $set: {
        nextResendAt: new Date(Date.now() + RESEND_GAP),
      },
    });
    return;
  }

  public async attemptVerification(
    verificationId,
    requestBody: AttemptVerificationDto
  ): Promise<VerificationAttemptResponse> {
    const verificationRequest =
      await this.verificationRequestsRepository.findById(verificationId);
    await this.validateVerificationRequest(verificationRequest);
    //   Check for correct verification code
    if (verificationRequest.verificationCode !== requestBody.verificationCode) {
      return await this.verificationRequestsRepository.update(
        verificationRequest.id,
        {
          $inc: {
            totalAttempts: 1,
          },
        },
        { purpose: 1, id: 1, totalAttempts: 1, status: 1, nextResendAt: 1 }
      );
    }

    // TODO: Implement logic to execute purpose
    return await this.verificationRequestsRepository.update(
      verificationRequest.id,
      {
        $inc: {
          totalAttempts: 1,
        },
        $set: {
          status: VerificationRequestStatus.VERIFIED,
        },
      },
      { purpose: 1, id: 1, totalAttempts: 1, status: 1, nextResendAt: 1 }
    );
  }

  public async getVerificationRequestById(): Promise<VerificationRequestEntity> {
    return;
  }

  private async validateVerificationRequest(
    verificationRequest: VerificationRequest
  ): Promise<void> {
    //   Check for max attempts
    if (
      verificationRequest.totalResends === MAX_SEND_REQUESTS ||
      verificationRequest.totalAttempts === MAX_ATTEMPTS ||
      verificationRequest.expiresAt >= new Date()
    ) {
      await this.verificationRequestsRepository.update(verificationRequest.id, {
        status: VerificationRequestStatus.EXPIRED,
      });
      throw new BadRequestException('Verification request expired, start over');
    }

    // Check for status
    if (verificationRequest.status !== VerificationRequestStatus.PENDING) {
      throw new BadRequestException(
        'Verification request already processed/expired'
      );
    }
  }
}
