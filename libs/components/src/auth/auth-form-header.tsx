import { useAuthFormContext } from '@/contexts/auth-form.context';
import { AuthFormView } from '@/types';

const header_values: {
  [key in AuthFormView]?: {
    title: string;
    description: string;
  };
} = {
  [AuthFormView.LOGIN]: {
    title: 'Sign in',
    description: 'Please enter your email address or phone number to login.',
  },
  [AuthFormView.REGISTER]: {
    title: 'Create an account',
    description: 'Welcome! Please fill in the details to get started.',
  },
  [AuthFormView.EMAIL_VERIFY]: {
    title: 'Check your email',
    description: 'We sent you a code to your email.',
  },
  [AuthFormView.PHONE_VERIFY]: {
    title: 'Check your phone',
    description: 'We sent you a code to your phone number.',
  },
};
export const AuthFormHeader = () => {
  const { activeView } = useAuthFormContext();
  if (!header_values[activeView]) return null;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">{header_values[activeView]?.title}</h1>
      <p className="text-balance text-sm text-muted-foreground">
        {header_values[activeView]?.description}
      </p>
    </div>
  );
};
