import { Body, Controller, Post } from '@nestjs/common';
import {
  IdentifierValidationDto,
  UserRegistrationRequestDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Public()
  public async registerUser(
    @Body() userRegistrationRequest: UserRegistrationRequestDto
  ) {
    return this.authService.registerUser(userRegistrationRequest);
  }

  @Post('/validate-identifier')
  @Public() // TODO: Rate limit
  public async validateUserIdentifier(
    @Body() identifierValidationRequest: IdentifierValidationDto
  ) {
    return this.authService.validateUserIdentifier(identifierValidationRequest);
  }
}
