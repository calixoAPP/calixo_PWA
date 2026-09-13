import { Suspense } from 'react';
import { LoginPageClient } from './login-page-client';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
