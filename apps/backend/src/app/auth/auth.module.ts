import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { FirebaseModule } from '../external/firebase/firebase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [FirebaseModule.register(), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Global JWT authentication guard
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    // Global role-based guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global permissions guard
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
