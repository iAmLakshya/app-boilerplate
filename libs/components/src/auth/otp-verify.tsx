import { useAuthFormContext } from '@/contexts/auth-form.context';
import { AuthFormView } from '@/types';
import { Button } from '@/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const OtpSchema = z.object({
  inputType: z.literal('email'),
  code: z.string().min(6, { message: 'Please enter a valid OTP code' }),
});

type OtpFormData = z.infer<typeof OtpSchema>;

export const AuthVerifyOtp = () => {
  const { isSubmitting, setIsSubmitting, setActiveView } = useAuthFormContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSubmitting?.(loading);
    return () => {
      setIsSubmitting?.(false);
    };
  }, [loading, setIsSubmitting]);

  const form = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: OtpFormData) => {
    try {
      //  Validate OTP
      setLoading(true);
    } catch (err) {
      console.error(err);
      toast.error('Login Failed, please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-6 " onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl className="text-center">
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={1} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} className="h-12 w-12" />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={5} className="h-12 w-12" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-center text-sm text-foreground">
          Didn't Receive a code?{' '}
          <Button
            variant="link"
            className="p-0 text-sm text-blue-900 font-semibold "
          >
            Resend
          </Button>
        </p>
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
          loading={loading}
        >
          Continue
        </Button>
        <Button
          variant="link"
          className="text-blue-900"
          onClick={() => setActiveView?.(AuthFormView.LOGIN)}
        >
          Try another way
        </Button>
      </form>
    </Form>
  );
};
