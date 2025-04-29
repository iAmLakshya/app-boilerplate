import {
  IdentifierType,
  IdentifierValidationRequest,
  UserRegistrationRequest,
} from '@/types';
import { Type } from '@nestjs/class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  ValidateNested,
} from '@nestjs/class-validator';
import { UserNameDto } from '../users/users.dto';

export class UserRegistrationRequestDto implements UserRegistrationRequest {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;

  @ValidateNested()
  @Type(() => UserNameDto)
  name: UserNameDto;
}

export class IdentifierValidationDto implements IdentifierValidationRequest {
  @IsString()
  identifier: string;

  @IsEnum(IdentifierType)
  type: IdentifierType;
}
