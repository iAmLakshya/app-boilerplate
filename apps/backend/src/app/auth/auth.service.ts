import {
  IdentifierValidationResponse,
  IdentifierValidationStatus,
  SuccessfulRegistrationResponse,
} from '@/types';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAuthProvider } from '../external/firebase/firebase-auth.provider';
import { UsersService } from '../users/users.service';
import {
  IdentifierValidationDto,
  UserRegistrationRequestDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authProvider: FirebaseAuthProvider,
    private readonly usersService: UsersService
  ) {}

  async validateToken(token: string): Promise<any> {
    return this.authProvider.validateToken(token);
  }

  async login(credentials: { email: string; password: string }) {
    if (process.env.NODE_ENV !== 'development') {
      // Note: In a real application, you would use Firebase client SDK for this
      // This is a placeholder for how the client would handle authentication
      throw new Error(
        'Authentication should be handled on the client side using Firebase SDK'
      );
    }
    const user = await this.authProvider.findUserByEmail(credentials.email);
    if (!user) throw new NotFoundException(`Invalid credentials`);
    return await this.createCustomToken(user.id);
  }

  async registerUser(
    userRegistrationRequest: UserRegistrationRequestDto
  ): Promise<SuccessfulRegistrationResponse> {
    // TODO: Validate google recapcha token

    // Create new user
    const user = await this.usersService.createUser({
      email: userRegistrationRequest.email,
      password: userRegistrationRequest.password,
      name: userRegistrationRequest.name,
    });

    // Create custom token
    const customToken = await this.authProvider.generateCustomToken(user.id);

    return {
      user,
      customToken,
    };
  }

  async createCustomToken(id: string) {
    const user = await this.authProvider.findUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate a custom token for client authentication
    const customToken = await this.authProvider.generateCustomToken(id);

    return { customToken };
  }

  async revokeUserSessions(id: string) {
    await this.authProvider.revokeRefreshTokens(id);
    return { success: true };
  }

  async setUserRoles(id: string, roles: string[]) {
    const user = await this.authProvider.findUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Merge with existing permissions
    await this.authProvider.setUserClaims(id, {
      roles,
      permissions: user.permissions || [],
    });

    return { success: true };
  }

  async setUserPermissions(id: string, permissions: string[]) {
    const user = await this.authProvider.findUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Merge with existing roles
    await this.authProvider.setUserClaims(id, {
      roles: user.roles || [],
      permissions,
    });

    return { success: true };
  }

  async verifyUserHasRole(user: any, requiredRole: string): Promise<boolean> {
    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Refresh user data from auth provider
    const userRecord = await this.authProvider.findUserById(user.id);
    if (!userRecord) {
      throw new ForbiddenException('User not found');
    }

    return userRecord.roles && userRecord.roles.includes(requiredRole);
  }

  async verifyUserHasPermission(
    user: any,
    requiredPermission: string
  ): Promise<boolean> {
    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Refresh user data from auth provider
    const userRecord = await this.authProvider.findUserById(user.id);
    if (!userRecord) {
      throw new ForbiddenException('User not found');
    }

    return (
      userRecord.permissions &&
      userRecord.permissions.includes(requiredPermission)
    );
  }

  public validateUserIdentifier = async (
    identifierValidationRequest: IdentifierValidationDto
  ): Promise<IdentifierValidationResponse> => {
    const user = await this.usersService.validateUserIdentifier(
      identifierValidationRequest.identifier,
      identifierValidationRequest.type
    );

    return {
      status: user
        ? IdentifierValidationStatus.VALID
        : IdentifierValidationStatus.INVALID,
      timestamp: Date.now(),
    };
  };
}
