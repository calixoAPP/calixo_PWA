'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updatePassword } from '@/app/auth/actions';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';

/** Elegir la contraseña nueva, de vuelta del correo de recuperación. */
export default function NewPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, {});

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
            <div className="space-y-4 text-center">
              <h1 className="text-xl font-semibold text-text-dark">Contraseña cambiada</h1>
              <p className="text-sm text-neutral">Ya está. La próxima vez entra con tu nueva contraseña.</p>
              <Link href="/" className="block">
                <Button className="w-full h-12 font-semibold text-base">Ir a Calixo</Button>
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-1 text-center">
                <h1 className="text-xl font-semibold text-text-dark">Nueva contraseña</h1>
                <p className="text-sm text-neutral">Al menos 8 caracteres, con mayúscula, minúscula y número.</p>
              </div>

              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Nueva contraseña"
                className="bg-neutral/5 border-neutral/20 h-12"
              />
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                className="bg-neutral/5 border-neutral/20 h-12"
              />

              {state.error && (
                <div
                  className="p-3 text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-xl"
                  role="alert"
                >
                  {state.error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 font-semibold text-base" disabled={pending}>
                {pending ? 'Guardando...' : 'Guardar contraseña'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
