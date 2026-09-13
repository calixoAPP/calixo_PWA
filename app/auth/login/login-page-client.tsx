'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export function LoginPageClient() {
  return (
    <AuthLayout>
      <LoginForm />

      <div className="lg:hidden text-center text-xs text-neutral/60 mt-8">
        <p>
          También puedes reportar contenido que consideres ilegal en tu país sin iniciar sesión.
        </p>
      </div>
    </AuthLayout>
  );
}
