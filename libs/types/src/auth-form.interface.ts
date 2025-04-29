export enum AuthFormView {
  LOGIN = 'login',
  REGISTER = 'register',
  PASSWORD_INPUT = 'email-password',
  EMAIL_VERIFY = 'email-verify',
  PHONE_VERIFY = 'phone-verify',
}

export interface IAuthFormContext {
  activeView: AuthFormView;
  state?: { email?: string; phone?: string };
  setState?: (state: { email?: string; phone?: string }) => void;
  setActiveView?: (view: AuthFormView) => void;
  isSubmitting: boolean;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  createSession?: (cb?: () => any) => Promise<void>;
}
