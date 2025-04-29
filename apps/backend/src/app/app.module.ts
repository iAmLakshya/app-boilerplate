import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { VerificationRequestsModule } from './verificationRequests/verification-requests.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    VerificationRequestsModule,
  ],
})
export class AppModule {}
