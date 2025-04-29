import { BaseEntity } from './base.interface';

export enum Role {
  ADMIN = 'admin',
  FOUNDER = 'founder',
  INVESTOR = 'investor',
}

export interface ILinkedAccount extends BaseEntity {
  provider: string;
  providerId: string;
  createdAt: Date;
}

export interface UserEntityName {
  first?: string;
  middle?: string;
  last: string;
}
export interface UserEntity extends BaseEntity {
  name: UserEntityName;
  email: string;
  phoneNumber?: string;

  isEmailVerified: boolean;

  role?: Role;
}
