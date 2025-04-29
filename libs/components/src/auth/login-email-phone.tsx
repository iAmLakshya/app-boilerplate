import { useAuthFormContext } from '@/contexts/auth-form.context';
import {
  AuthFormView,
  IdentifierType,
  IdentifierValidationRequest,
  IdentifierValidationResponse,
  IdentifierValidationStatus,
} from '@/types';
import { Button } from '@/ui/button';
import { EmailPhoneInput } from '@/ui/email-phone-input';
import { Form } from '@/ui/form';
import { api } from '@/utils/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { toast } from 'sonner';
import { z } from 'zod';

export const LoginSchema = z.discriminatedUnion('inputType', [
  z.object({
    inputType: z.literal(IdentifierType.EMAIL),
    emailOrPhoneNumber: z
      .string()
      .email({ message: 'Please enter a valid email address.' })
      .or(z.literal('')),
  }),
  z.object({
    inputType: z.literal(IdentifierType.PHONE),
    emailOrPhoneNumber: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' })
      .or(z.literal('')),
  }),
]);

type LoginFormData = z.infer<typeof LoginSchema>;

export const LoginWithEmailOrPhoneNumber = () => {
  const { isSubmitting, setIsSubmitting, setActiveView, setState, state } =
    useAuthFormContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setIsSubmitting?.(loading);
    return () => {
      setIsSubmitting?.(false);
    };
  }, [loading, setIsSubmitting]);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailOrPhoneNumber: '',
    },
  });

  const validateLoginIdentifier = async ({
    identifier,
    type,
  }: IdentifierValidationRequest): Promise<IdentifierValidationResponse> => {
    // return { status: IdentifierValidationStatus.INVALID };
    return api.post<IdentifierValidationResponse>(
      `/api/v1/auth/validate-identifier`,
      {
        identifier,
        type,
      }
    );
  };

  const checkForNullValues = (values: LoginFormData) => {
    if (!values?.emailOrPhoneNumber) {
      form.setError('emailOrPhoneNumber', {
        message: `Please enter a valid ${
          values?.inputType === IdentifierType.EMAIL ? 'email' : 'phone number'
        }.`,
      });
      return true;
    }
    return false;
  };

  const onSubmit = async (values: LoginFormData) => {
    try {
      if (checkForNullValues(values)) return;
      setLoading(true);

      // Check if the identifier exists in the database
      const { status: validationStatus } = await validateLoginIdentifier({
        identifier: values.emailOrPhoneNumber,
        type: values.inputType,
      });
      setState?.({
        [values.inputType]: values.emailOrPhoneNumber,
      });
      // If the identifier is invalid, redirect to the registration form
      if (validationStatus === IdentifierValidationStatus.INVALID) {
        setLoading(false);
        if (values.inputType === IdentifierType.PHONE) {
          toast.warning(
            'Phone number not found, use email or register to continue'
          );
          form.setError('emailOrPhoneNumber', {
            message: 'Phone number not registered',
          });
        } else if (values.inputType === IdentifierType.EMAIL) {
          toast.info('Account not found, register to continue');
          setActiveView?.(AuthFormView.REGISTER);
        }
        return;
      }

      if (values.inputType === IdentifierType.EMAIL)
        setActiveView?.(AuthFormView.PASSWORD_INPUT);
      else if (values.inputType === IdentifierType.PHONE)
        setActiveView?.(AuthFormView.PHONE_VERIFY);
      //  TODO: Implement login logic
      // If email, given option for password or otp
      // if phone number, ask for otp
    } catch (err) {
      console.error(err);
      setState?.({
        [values.inputType]: undefined,
      });
      toast.error('Login Failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currValue = form.getValues('emailOrPhoneNumber');
    if (state?.email && currValue !== state?.email) {
      form.setValue('emailOrPhoneNumber', state?.email, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [state?.email, form]);
  return (
    <>
      <Form {...form}>
        <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <EmailPhoneInput
            form={form}
            typeFieldName={'inputType'}
            inputFieldName="emailOrPhoneNumber"
          />
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading}
            loading={loading}
          >
            Continue
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <a
          href="#register"
          onClick={() => setActiveView?.(AuthFormView.REGISTER)}
          className="underline underline-offset-4"
        >
          Sign up
        </a>
      </div>
    </>
  );
};
