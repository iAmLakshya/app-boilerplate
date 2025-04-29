import { useAuthFormContext } from '@/contexts/auth-form.context';
import { AuthFormView } from '@/types';
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
import { getFirebaseClientAuth } from '@/utils/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    // Zod requires at least min(1) for non-empty check
    message: 'Password is required.', // Or use min(8, ...) for length check
  }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export const LoginWithEmailPassword = () => {
  const { isSubmitting, setActiveView, createSession, state } =
    useAuthFormContext();
  const auth = useCallback(() => getFirebaseClientAuth(), []);

  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (values: LoginFormData) => {
    console.log(values);
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth(), values.email, values.password);
      const loaderNotification = toast.loading(
        'Email & password confirmed, logging you in ...'
      );
      await createSession?.(() => toast.dismiss(loaderNotification));
    } catch (err) {
      console.error(err);
      toast.error('Login Failed, please try again.');
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
    <Form {...form}>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
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
                  disabled={isSubmitting}
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
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="#forgot-password"
                  className="ml-auto inline-block text-sm underline underline-offset-4 hover:no-underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="Your password"
                  field={field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
          loading={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <Button
        variant="link"
        className="text-blue-900"
        onClick={() => setActiveView?.(AuthFormView.LOGIN)}
      >
        Try another way
      </Button>
    </Form>
  );
};
