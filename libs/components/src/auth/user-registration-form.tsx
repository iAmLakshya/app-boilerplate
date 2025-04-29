import { useAuthFormContext } from '@/contexts/auth-form.context';
import { AuthFormView, SuccessfulRegistrationResponse } from '@/types';
import { Button } from '@/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { PasswordInput } from '@/ui/password-input';
import { getFirebaseAuthErrorMessage } from '@/utils';
import api from '@/utils/api-client';
import { getFirebaseClientAuth } from '@/utils/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithCustomToken } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const RegistrationSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.',
  }),
  password: z.string().min(1, {
    // Zod requires at least min(1) for non-empty check
    message: 'Password is required.', // Or use min(8, ...) for length check
  }),
});

type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export const UserRegistrationForm = () => {
  const auth = useCallback(() => getFirebaseClientAuth(), []);
  const { isSubmitting, setActiveView, createSession, state } =
    useAuthFormContext();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    try {
      setLoading(true);
      const res = await api.post<SuccessfulRegistrationResponse>(
        `/api/v1/auth/register`,
        {
          name: {
            first: values?.firstName,
            // middle: values?.middleName,
            last: values?.lastName,
          },
          email: values?.email,
          password: values?.password,
        }
      );

      await signInWithCustomToken(auth(), res.customToken);
      const loaderNotification = toast.loading(
        'Registration successful, logging you in ...'
      );
      await createSession?.(() => toast.dismiss(loaderNotification));
    } catch (err: any) {
      console.error(err);
      toast.error(
        getFirebaseAuthErrorMessage(err.code, 'Login Failed, please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.email && form.getValues('email') !== state?.email) {
      form.setValue('email', state?.email, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [state?.email, form]);

  return (
    <>
      <Form {...form}>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:flex md:flex-row md:gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        type="text"
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        placeholder="Your Last Name"
                        type="text"
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="mail@example.com"
                    type="email"
                    {...field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    type="password"
                    placeholder="Your secure password"
                    field={field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <a
          href="#login"
          onClick={() => setActiveView?.(AuthFormView.LOGIN)}
          className="underline underline-offset-4"
        >
          Sign In
        </a>
      </div>
    </>
  );
};
