import { Body, Controller, Param, Post } from '@nestjs/common';
import { VerificationRequestsService } from './verification-requests.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '@/types';
import {
  AttemptVerificationDto,
  CreateVerificationRequestDto,
} from './verification-requests.dto';

@Controller('/verification-requests')
export class VerificationRequestsController {
  constructor(
    private readonly verificationRequestsService: VerificationRequestsService
  ) {}

  //   TODO: Validate Google recaptcha token
  //   TODO: Enforce rate limiting
  @Post()
  @Public()
  public async createVerificationRequest(
    @CurrentUser() user: UserEntity,
    @Body() createVerificationRequestBody: CreateVerificationRequestDto
  ) {
    return this.verificationRequestsService.createVerificationRequest({
      ...createVerificationRequestBody,
      userId: user?.id,
    });
  }

  //   TODO: Validate Google recaptcha token
  //   TODO: Enforce rate limiting
  @Post('/:verificationId/resend')
  @Public()
  public async resendVerificationCode(
    @Param('verificationId') verificationId: string
  ) {
    return this.verificationRequestsService.sendVerificationCode(
      verificationId
    );
  }

  // Attempt is invoked by service that required verification
  //   @Post('/:verificationId/attempt')
  //   @Public()
  //   public async attemptVerification(
  //     @CurrentUser() user: UserEntity,
  //     @Param('verificationId') verificationId: string,
  //     @Body() attemptVerificationBody: AttemptVerificationDto
  //   ) {
  //     return this.verificationRequestsService.attemptVerification(
  //       verificationId,
  //       {
  //         ...attemptVerificationBody,
  //         userId: user?.id,
  //       }
  //     );
  //   }
}
