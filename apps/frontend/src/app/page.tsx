import { HelloWordTailwindCss } from '@/components/twTest';
import { Button } from '@/ui/button';

export default function Index() {
  return (
    <div className="bg-amber-400">
      <h1 className="text-4xl bg-green-200 p-3 text-gray-400">Hello World</h1>
      <HelloWordTailwindCss />
      <Button>Test Button</Button>
    </div>
  );
}
