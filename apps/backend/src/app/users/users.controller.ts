import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationRequest, PaginationResult } from '@/types';
import { User } from './users.schema';
import { CreateUserDto } from './users.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @Public()
  public async listUsers(
    @Query() query: PaginationRequest
  ): Promise<PaginationResult<User>> {
    return this.usersService.listUsers(query);
  }

  @Post('/')
  @Public()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:userId')
  @Public()
  public async getUserById(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }
}
