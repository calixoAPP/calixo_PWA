import { Suspense } from 'react';
import { VerifyEmailPageClient } from './verify-email-client';
import { Spinner } from '@/components/ui/spinner';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <VerifyEmailPageClient />
    </Suspense>
  );
}
