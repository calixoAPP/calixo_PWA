'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resetPassword } from '@/app/auth/actions';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** "¿Olvidaste tu contraseña?": manda el enlace para elegir una nueva en calixo.es. */
export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, {});
  // /auth/callback devuelve aquí si el enlace del correo ya no sirve.
  const [linkExpired, setLinkExpired] = useState(false);
  useEffect(() => {
    setLinkExpired(new URLSearchParams(window.location.search).get('error') === 'expired');
  }, []);

  return (
    <AuthLayout>
      <div className="bg-white border border-neutral/20 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Image src="/icons/icon.svg" alt="Calixo" width={32} height={32} className="w-8 h-8" />
            <h2
              className="text-3xl font-bold text-text-dark uppercase tracking-wide"
              style={{ fontFamily: 'Questrial, sans-serif' }}
            >
              CALIXO
            </h2>
          </div>

          {state.success ? (
            <div className="space-y-3 text-center">
              <h1 className="text-xl font-semibold text-text-dark">Revisa tu correo</h1>
              <p className="text-sm text-neutral">
                Si ese correo tiene cuenta en Calixo, te hemos enviado un enlace para elegir una contraseña
                nueva. Caduca en una hora.
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-1 text-center">
                <h1 className="text-xl font-semibold text-text-dark">Recuperar contraseña</h1>
                <p className="text-sm text-neutral">Te enviaremos un enlace para elegir una contraseña nueva.</p>
              </div>

              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Correo electrónico"
                className="bg-neutral/5 border-neutral/20 h-12"
              />

              {linkExpired && !state.error && (
                <div
                  className="p-3 text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-xl"
                  role="alert"
                >
                  El enlace ha caducado o ya se usó. Pide otro correo.
                </div>
              )}

              {state.error && (
                <div
                  className="p-3 text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-xl"
                  role="alert"
                >
                  {state.error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 font-semibold text-base" disabled={pending}>
                {pending ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 pt-6 border-t border-neutral/10">
          <Link href="/auth/login" className="text-sm text-primary hover:underline font-semibold">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
