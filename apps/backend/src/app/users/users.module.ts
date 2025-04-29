import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersProvider } from './users.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersProvider],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
