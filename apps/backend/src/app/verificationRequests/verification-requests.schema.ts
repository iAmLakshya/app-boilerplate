import {
  IdentifierType,
  VerificationPurpose,
  VerificationRequestEntity,
  VerificationRequestStatus,
} from '@/types';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../database/base.entity';
import { createSchema } from '../database/base.schema';

@Schema({ timestamps: true })
export class VerificationRequest
  extends BaseEntity
  implements VerificationRequestEntity
{
  @Prop({})
  userId?: string;

  @Prop({ required: true, enum: VerificationPurpose, type: String })
  purpose: VerificationPurpose;

  @Prop({ required: true, enum: IdentifierType, type: String })
  identifierType: IdentifierType;

  @Prop({ required: true, trim: true, lowercase: true })
  identifier: string;

  @Prop({ required: true })
  verificationCode: string;

  @Prop({ default: 0 })
  totalAttempts: number;

  @Prop({ required: true, type: Date })
  expiresAt: Date;
  @Prop({ type: Date })
  verifiedAt?: Date;

  @Prop({ default: -1 }) // increments  to 0 when code is sent for the first time
  totalResends: number;

  @Prop({ type: Date })
  nextResendAt: Date;

  @Prop({ required: true, enum: VerificationRequestStatus, type: String })
  status: VerificationRequestStatus;
}

export type VerificationRequestDocument = VerificationRequest & Document;

export const VerificationRequestSchema = createSchema(VerificationRequest);
