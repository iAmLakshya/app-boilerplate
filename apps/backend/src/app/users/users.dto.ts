import { Type } from '@nestjs/class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UserNameDto {
  @ApiPropertyOptional({ description: "User's first name", example: 'John' })
  @IsString()
  @IsOptional()
  first?: string;

  @ApiPropertyOptional({
    description: "User's middle name",
    example: 'Fitzgerald',
  })
  @IsString()
  @IsOptional()
  middle?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  last: string;
}

export class CreateUserDto {
  @ApiProperty({
    type: () => UserNameDto,
    description: "User's full name",
    required: true,
  })
  @ValidateNested()
  @Type(() => UserNameDto)
  @IsNotEmpty()
  name: UserNameDto;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: "User's phone number (E.164 format recommended)",
    example: '+15551234567',
  })
  @IsPhoneNumber(null) // Or specify region e.g., 'GB'
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "User's password",
    example: '+ChangeMe1234!',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
