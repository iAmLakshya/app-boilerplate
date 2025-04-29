import { IdentifierType, VerificationPurpose } from '@/types';
import { IsEnum, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateVerificationRequestDto {
  @IsEnum(IdentifierType)
  purpose: VerificationPurpose;
  @IsString()
  @IsNotEmpty()
  identifier: string;
  @IsEnum(IdentifierType)
  identifierType: IdentifierType;

  userId?: string; // Injected by controller
}

export class AttemptVerificationDto {
  @IsString()
  verificationCode: string;

  userId?: string; // Injected by controller
}
