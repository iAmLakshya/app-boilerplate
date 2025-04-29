import { IdentifierType } from './auth.interface';
import { BaseEntity } from './base.interface';

export enum VerificationPurpose {
  REGISTRATION = 'registration',
  LOGIN = 'login',
  RESET_PASSWORD = 'reset-password',
  UPDATE_EMAIL = 'update-email',
  UPDATE_PHONE = 'update-phone',
}

export enum VerificationRequestStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  FAILED = 'failed',
}
export interface VerificationRequestEntity extends BaseEntity {
  userId?: string; // Optional, if the request is for a specific user
  purpose: VerificationPurpose;
  identifierType: IdentifierType;
  identifier: string;
  verificationCode: string; // The verification code sent to the user
  totalAttempts: number; // Number of attempts made by the user
  expiresAt: Date; // When the verification code expires
  verifiedAt?: Date; // When the user verified the code
  totalResends: number; // Number of times the code was resent
  nextResendAt: Date; // When the next resend is available
  status: VerificationRequestStatus; // The current status of the verification
}

export interface VerificationAttemptResponse {
  id?: string;
  status: VerificationRequestStatus;
  nextResendAt: Date;
  purpose: VerificationPurpose;
}
