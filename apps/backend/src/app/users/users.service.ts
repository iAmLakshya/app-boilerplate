import { IdentifierType, PaginationRequest, PaginationResult } from '@/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAuthProvider } from '../external/firebase/firebase-auth.provider';
import { CreateUserDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: FirebaseAuthProvider
  ) {}

  public getUserById = async (userId: string): Promise<User> => {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  };

  public createUser = async (createUserDto: CreateUserDto): Promise<User> => {
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      isEmailVerified: false,
      linkedAccounts: [],
    });

    // Create user in Firebase Auth
    await this.authService.createUser({
      id: newUser.id,
      email: newUser.email,
      password: Math.random().toString(36),
      phoneNumber: newUser.phoneNumber,
      displayName: [
        `${newUser.name.first || ''}`,
        `${newUser.name?.middle || ''}`,
        `${newUser.name.last || ''}`,
      ]
        .filter((item) => item)
        .join(' '),
    });

    return newUser;
  };

  public listUsers = async ({
    limit,
    page,
  }: PaginationRequest): Promise<PaginationResult<User>> => {
    return this.usersRepository.paginate({}, { limit, page });
  };

  public validateUserIdentifier = async (
    identifier: string,
    type: IdentifierType
  ): Promise<User | null> => {
    const user = await this.usersRepository.findUserByEmailOrPhoneNumber(
      identifier
    );
    if (!user) {
      return null;
    }
    return user;
  };
}
