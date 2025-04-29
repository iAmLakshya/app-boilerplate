import Link from 'next/link';

export const AuthLegalFooter = () => {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
      By clicking continue, you agree to our{' '}
      <Link href="/terms-of-service">Terms of Service</Link> and{' '}
      <Link href="/privacy-policy">Privacy Policy</Link>.
    </div>
  );
};
