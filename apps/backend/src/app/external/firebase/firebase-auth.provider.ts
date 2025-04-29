import { Injectable, NotImplementedException, Provider } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { IAuthProvider } from '@/types';

@Injectable()
export class FirebaseAuthProvider implements IAuthProvider {
  constructor(private readonly firebaseService: FirebaseService) {}

  async validateToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);

      return {
        id: decodedToken.uid,
        email: decodedToken.email,
        roles: decodedToken.roles || [],
        permissions: decodedToken.permissions || [],
      };
    } catch (error) {
      return null;
    }
  }

  async createUser({
    id,
    email,
    password,
    displayName,
    phoneNumber,
  }: {
    id?: string;
    email: string;
    password: string;
    displayName: string;
    phoneNumber?: string;
  }): Promise<any> {
    const userRecord = await this.firebaseService.getAuth().createUser({
      uid: id,
      email,
      password,
      displayName,
      phoneNumber,
      providerToLink: {
        email: email,
        providerId: 'password',
      },
    });

    return {
      id: userRecord.uid,
      email: userRecord.email,
    };
  }

  async findUserByEmail(email: string): Promise<any> {
    try {
      const userRecord = await this.firebaseService
        .getAuth()
        .getUserByEmail(email);

      return this.mapFirebaseUserToAppUser(userRecord);
    } catch (error) {
      return null;
    }
  }

  async findUserById(id: string): Promise<any> {
    try {
      const userRecord = await this.firebaseService.getAuth().getUser(id);

      return this.mapFirebaseUserToAppUser(userRecord);
    } catch (error) {
      return null;
    }
  }

  async setUserClaims(id: string, claims: any): Promise<void> {
    await this.firebaseService.getAuth().setCustomUserClaims(id, claims);
  }

  async generateSignInWithEmailLink(
    email: string,
    redirectUrl: string
  ): Promise<string> {
    // Note: This would typically be done on the client side using Firebase client SDK
    // This is a placeholder for server-side implementation
    throw new NotImplementedException(
      'Method not implemented in server context. Use Firebase client SDK.'
    );
  }

  async generateEmailSignInToken(
    email: string
  ): Promise<{ token: string; link: string }> {
    // Note: This would typically be done on the client side using Firebase client SDK
    // This is a placeholder for server-side implementation
    throw new NotImplementedException(
      'Method not implemented in server context. Use Firebase client SDK.'
    );
  }

  async generateCustomToken(id: string): Promise<string> {
    return this.firebaseService.getAuth().createCustomToken(id);
  }

  async revokeRefreshTokens(id: string): Promise<void> {
    await this.firebaseService.getAuth().revokeRefreshTokens(id);
  }

  private mapFirebaseUserToAppUser(userRecord: any): any {
    return {
      id: userRecord.uid,
      email: userRecord.email,
      roles: userRecord.customClaims?.roles || [],
      permissions: userRecord.customClaims?.permissions || [],
      metadata: {
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
      },
    };
  }
}
