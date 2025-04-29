/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form';

import { Button } from '@/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { PhoneInput } from '@/ui/phone-input';
import { IdentifierType } from '@/types';

// Define the component props using generics
interface EmailPhoneInputProps<
  TFormValues extends FieldValues,
  TInputFieldName extends Path<TFormValues> = Path<TFormValues>,
  TTypeFieldName extends Path<TFormValues> = Path<TFormValues>
> {
  form: Pick<
    UseFormReturn<TFormValues>,
    'control' | 'setValue' | 'clearErrors'
  >;
  inputFieldName: TInputFieldName;
  typeFieldName: TTypeFieldName;
  initialType?: IdentifierType;
  defaultCountry?: React.ComponentProps<typeof PhoneInput>['defaultCountry'];
}

export function EmailPhoneInput<
  TFormValues extends FieldValues,
  TInputFieldName extends Path<TFormValues>,
  TTypeFieldName extends Path<TFormValues>
>({
  form,
  inputFieldName,
  typeFieldName,
  initialType = IdentifierType.EMAIL,
  defaultCountry = 'GB', // Default country can be set here or passed as prop
}: EmailPhoneInputProps<TFormValues, TInputFieldName, TTypeFieldName>) {
  const [inputType, setInputType] = useState<IdentifierType>(initialType);

  useEffect(() => {
    // Set the type field value when the component mounts or inputType changes
    form.setValue(
      typeFieldName,
      inputType as PathValue<TFormValues, TTypeFieldName>,
      { shouldValidate: false, shouldDirty: false }
    );
  }, [inputType, form.setValue, typeFieldName]);

  const toggleInputType = () => {
    const newType =
      inputType === IdentifierType.EMAIL
        ? IdentifierType.PHONE
        : IdentifierType.EMAIL;
    setInputType(newType);

    // Update the type field in the form
    form.setValue(
      typeFieldName,
      newType as PathValue<TFormValues, TTypeFieldName>,
      { shouldValidate: true } // Validate type if needed
    );

    // Reset the input field value and validate it
    form.setValue(
      inputFieldName,
      // Reset to empty string. Adjust if your form expects null/undefined
      '' as PathValue<TFormValues, TInputFieldName>,
      { shouldValidate: true } // Trigger validation on the now empty field
    );

    // Clear any previous errors specific to the input field
    form.clearErrors(inputFieldName);

    // Focus is handled implicitly by react-hook-form's ref now
  };

  return (
    <FormField
      control={form.control}
      name={inputFieldName}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center mb-1">
            <FormLabel htmlFor={inputFieldName}>
              {' '}
              {/* Add htmlFor for accessibility */}
              {inputType === IdentifierType.EMAIL
                ? 'Email address'
                : 'Phone number'}
            </FormLabel>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm text-muted-foreground hover:text-accent-foreground cursor-pointer"
              onClick={toggleInputType}
              aria-label={
                inputType === IdentifierType.EMAIL
                  ? 'Switch to phone number input'
                  : 'Switch to email address input'
              }
            >
              {inputType === IdentifierType.EMAIL
                ? 'Use phone number'
                : 'Use email address'}
            </Button>
          </div>
          <FormControl>
            {/* Conditionally render Input or PhoneInput */}
            {inputType === IdentifierType.EMAIL ? (
              <Input
                id={inputFieldName} // Use inputFieldName for ID
                type={IdentifierType.EMAIL}
                placeholder="Enter your email address"
                {...field} // Spread field props (value, onChange, onBlur, name, ref)
                value={field.value ?? ''} // Ensure value is controlled
              />
            ) : (
              <PhoneInput
                id={inputFieldName} // Use inputFieldName for ID
                placeholder="Enter your phone number"
                international
                type={IdentifierType.PHONE}
                defaultCountry={defaultCountry} // Use the default country
                {...field} // Spread field props (value, onChange, onBlur, name, ref)
                // The 'onChange' from 'field' is passed directly.
                // PhoneInput's internal onChange handles potential undefined values.
                value={field.value ?? ''} // Ensure value is controlled
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
