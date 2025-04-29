import { ILinkedAccount, UserEntity, UserEntityName, Role } from '@/types';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchema } from '../database/base.schema';
import { BaseEntity } from '../database/base.entity';

@Schema({ _id: false })
class UserLinkedAccount implements ILinkedAccount {
  @Prop({ required: true, trim: true })
  providerId: string;
  @Prop({ required: true })
  provider: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
}

@Schema({ _id: false })
class UserName implements UserEntityName {
  @Prop({ trim: true })
  first?: string;
  @Prop({ trim: true })
  middle?: string;
  @Prop({ required: true, trim: true })
  last: string;
}

@Schema({ timestamps: true })
export class User extends BaseEntity implements UserEntity {
  @Prop({ enum: Role, type: String })
  role?: Role;

  @Prop({ required: true, type: UserName })
  name: UserName;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
  })
  email: string;

  @Prop({ unique: true, lowercase: true, trim: true, sparse: true })
  phoneNumber?: string;

  @Prop({ default: false, type: Boolean })
  isEmailVerified: boolean;

  @Prop({ default: [], type: [UserLinkedAccount] })
  linkedAccounts: UserLinkedAccount[];
}

export type UserDocument = User & Document;

export const UserSchema = createSchema(User);
