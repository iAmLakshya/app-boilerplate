'use client';
import {
  AuthFormProvider,
  useAuthFormContext,
} from '@/contexts/auth-form.context';
import { AuthFormView } from '@/types';
import { AuthLegalFooter } from '@/ui/auth-legal-footer';
import { DividerWithLabel } from '@/ui/divider';
import { cn } from '@/utils';
import { AuthFormHeader } from './auth-form-header';
import { ContinueWithGoogle } from './continue-with-google';
import { ContinueWithLinkedIn } from './continue-with-linkedin';
import { LoginWithEmailPassword } from './login-email-password';
import { LoginWithEmailOrPhoneNumber } from './login-email-phone';
import { AuthVerifyOtp } from './otp-verify';
import { UserRegistrationForm } from './user-registration-form';

export const UserAuthForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <AuthFormProvider>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <AuthFormHeader />
        <RenderAuthView />
        <AuthLegalFooter />
      </div>
    </AuthFormProvider>
  );
};

export const RenderAuthView = () => {
  const { activeView } = useAuthFormContext();

  if (activeView === AuthFormView.LOGIN) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <ContinueWithLinkedIn />
          <ContinueWithGoogle />
        </div>
        <DividerWithLabel label="Or" />
        <LoginWithEmailOrPhoneNumber />
      </div>
    );
  }
  if (activeView === AuthFormView.REGISTER) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <ContinueWithLinkedIn />
          <ContinueWithGoogle />
        </div>
        <DividerWithLabel label="Or" />
        <UserRegistrationForm />
      </div>
    );
  }

  if (activeView === AuthFormView.PASSWORD_INPUT) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <ContinueWithLinkedIn />
          <ContinueWithGoogle />
        </div>
        <DividerWithLabel label="Or" />
        <LoginWithEmailPassword />
      </div>
    );
  }

  if (activeView === AuthFormView.EMAIL_VERIFY) {
    return <AuthVerifyOtp />;
  }

  if (activeView === AuthFormView.PHONE_VERIFY) {
    return <AuthVerifyOtp />;
  }

  return null;
};
