export interface IAuthProvider {
  validateToken(token: string): Promise<any>;
  createUser(userDetails: {
    id?: string;
    displayName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
  }): Promise<any>;
  findUserByEmail(email: string): Promise<any>;
  findUserById(uid: string): Promise<any>;
  setUserClaims(uid: string, claims: any): Promise<void>;
  generateSignInWithEmailLink(
    email: string,
    redirectUrl: string
  ): Promise<string>;
  generateEmailSignInToken(
    email: string
  ): Promise<{ token: string; link: string }>;
  generateCustomToken(uid: string): Promise<string>;
  revokeRefreshTokens(uid: string): Promise<void>;
}
