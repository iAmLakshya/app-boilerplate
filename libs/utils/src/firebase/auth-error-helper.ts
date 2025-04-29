export enum FirebaseAuthErrorDescription {
  // Sign Up / General Email Errors
  INVALID_EMAIL = 'Invalid email address',
  EMAIL_ALREADY_IN_USE = 'This email address is already in use.',
  OPERATION_NOT_ALLOWED = 'Sign-in via selected method is not enabled', // Or other operations
  WEAK_PASSWORD = 'Password is too weak. Please choose a stronger password (usually needs 6+ characters).',

  // Sign In Errors
  USER_DISABLED = 'Account has been disabled.',
  USER_NOT_FOUND = 'No account found with this email address.',
  WRONG_PASSWORD = 'Incorrect password. Please try again.',
  INVALID_LOGIN_CREDENTIALS = 'Invalid email or password. Please check your credentials.',
  // Other Common Errors
  TOO_MANY_REQUESTS = 'Access temporarily disabled due to too many failed login attempts or other requests. Please try again later or reset your password.',
  NETWORK_REQUEST_FAILED = 'Network error. Please check your internet connection and try again.',
  REQUIRES_RECENT_LOGIN = 'This sensitive action requires you to have signed in recently. Please sign in again.',
  POPUP_CLOSED_BY_USER = 'The sign-in window was closed before completing the process.',
  POPUP_BLOCKED_BY_BROWSER = 'The sign-in popup was blocked by the browser. Please enable popups for this site.',
  INTERNAL_ERROR = 'An unexpected internal error occurred. Please try again.', // Generic catch-all from Firebase

  // Add other specific errors as needed
  // e.g., phone auth errors, provider errors (Google, Facebook, etc.)
}

/**
 * Mapping from Firebase Auth error codes (strings) to user-friendly descriptions.
 */
export const firebaseAuthErrorCodeMap: { [key: string]: string } = {
  // --- Standard Email/Password Errors ---
  'auth/invalid-email': FirebaseAuthErrorDescription.INVALID_EMAIL,
  'auth/email-already-in-use':
    FirebaseAuthErrorDescription.EMAIL_ALREADY_IN_USE,
  'auth/operation-not-allowed':
    FirebaseAuthErrorDescription.OPERATION_NOT_ALLOWED,
  'auth/weak-password': FirebaseAuthErrorDescription.WEAK_PASSWORD,

  'auth/user-disabled': FirebaseAuthErrorDescription.USER_DISABLED,
  'auth/user-not-found': FirebaseAuthErrorDescription.USER_NOT_FOUND,
  'auth/wrong-password': FirebaseAuthErrorDescription.WRONG_PASSWORD,

  // --- Newer / Combined Error Codes ---
  // Note: Newer Firebase SDK versions might use 'auth/invalid-credential' more often
  // than specific 'user-not-found' or 'wrong-password'. Adjust based on observed errors.
  'auth/invalid-credential':
    FirebaseAuthErrorDescription.INVALID_LOGIN_CREDENTIALS,

  // --- Other Common Errors ---
  'auth/too-many-requests': FirebaseAuthErrorDescription.TOO_MANY_REQUESTS,
  'auth/network-request-failed':
    FirebaseAuthErrorDescription.NETWORK_REQUEST_FAILED,
  'auth/requires-recent-login':
    FirebaseAuthErrorDescription.REQUIRES_RECENT_LOGIN,
  'auth/popup-closed-by-user':
    FirebaseAuthErrorDescription.POPUP_CLOSED_BY_USER,
  'auth/popup-blocked': FirebaseAuthErrorDescription.POPUP_BLOCKED_BY_BROWSER,
  'auth/internal-error': FirebaseAuthErrorDescription.INTERNAL_ERROR,

  // --- Add Mappings for Other Providers or Scenarios as Needed ---
  // e.g., 'auth/credential-already-in-use', 'auth/account-exists-with-different-credential'
  // e.g., Phone Auth: 'auth/invalid-phone-number', 'auth/missing-verification-code', 'auth/quota-exceeded'
};

/**
 * Helper function to get a user-friendly error message for a Firebase Auth error code.
 * @param errorCode The error code string received from a Firebase Auth error (e.g., error.code).
 * @param defaultMessage An optional message to return if the code is not found in the map.
 * @returns A user-friendly error string.
 */
export function getFirebaseAuthErrorMessage(
  errorCode: string | undefined | null,
  defaultMessage = 'An unexpected error occurred. Please try again.'
): string {
  if (!errorCode) {
    return defaultMessage;
  }
  return firebaseAuthErrorCodeMap[errorCode] || defaultMessage;
}
