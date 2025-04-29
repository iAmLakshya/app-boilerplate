import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils'; // Import your utility for merging classNames

import { Button } from './button'; // Adjust path
import { Input } from './input'; // Adjust path

// Using React.forwardRef allows parent components (like FormField)
// to get a ref to the underlying Input element if needed,
// although react-hook-form's field.ref handles the primary use case here.
const PasswordInput = forwardRef(
  (
    {
      className,
      field,
      disabled,
      type,
      ...props
    }: React.ComponentProps<'input'> & { field: any },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className={cn('relative', className)}>
        <Input
          className="pr-10" // Keep padding internal to the component
          ref={ref} // Forward the ref to the actual input element
          disabled={disabled}
          {...field} // Spread field props (value, onChange, onBlur, name, ref from RHF)
          {...props} // Spread other props like placeholder, id, etc.
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={togglePasswordVisibility}
          disabled={disabled || field?.disabled} // Also respect disabled state from RHF field
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput'; // Helpful for React DevTools

export { PasswordInput };
