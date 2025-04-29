import { UserEntity, UserEntityName } from './users.interface';

export enum IdentifierType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum IdentifierValidationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
}

export interface IdentifierValidationRequest {
  identifier: string;
  type: IdentifierType;
}

export interface IdentifierValidationResponse {
  status: IdentifierValidationStatus;
  timestamp: number;
}

export interface UserRegistrationRequest {
  email: string;
  name: UserEntityName;
  password: string;
}
export interface SuccessfulRegistrationResponse {
  user: UserEntity;

  // Token to allow client to request a JWT
  customToken: string;
}
