'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export function VerifyEmailPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setIsChecking(true);
      const checkStatus = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email_confirmed_at) {
          setIsVerified(true);
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 2000);
        }
        setIsChecking(false);
      };
      checkStatus();
    } else {
      const checkSession = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setEmail(user.email);
          checkVerificationStatus(user.email);
        } else {
          setIsChecking(false);
        }
      };
      checkSession();
    }

    const intervalId = setInterval(async () => {
      if (!isVerified && email) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email_confirmed_at) {
          setIsVerified(true);
          clearInterval(intervalId);
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 2000);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [searchParams, router, email, isVerified]);

  const checkVerificationStatus = async (_userEmail: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email_confirmed_at) {
      setIsVerified(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    }
    setIsChecking(false);
  };

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('Error resending email:', error);
      } else {
        setResendSuccess(true);
      }
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckAgain = async () => {
    if (!email) return;
    setIsChecking(true);
    setIsVerified(false);
    await checkVerificationStatus(email);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/icons/icon.svg"
              alt="Calixo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <CardTitle className="text-3xl font-bold text-text-dark font-sans uppercase tracking-wide" style={{ fontFamily: 'Questrial, sans-serif' }}>
              CALIXO
            </CardTitle>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Verifica tu correo electrónico
          </CardTitle>
          <CardDescription className="text-base">
            {isVerified
              ? '¡Email verificado! Redirigiendo...'
              : 'Te hemos enviado un enlace de verificación a tu correo'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isChecking ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando estado...</p>
            </div>
          ) : isVerified ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-complementary-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-complementary-emerald"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                ¡Email verificado exitosamente!
              </p>
              <p className="text-gray-600">Redirigiendo a Calixo...</p>
            </div>
          ) : (
            <>
              {email && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Correo:</span> {email}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={handleCheckAgain} className="w-full h-12 font-semibold">
                  Verificar de nuevo
                </Button>

                <Button
                  onClick={handleResendEmail}
                  disabled={isResending || !email}
                  variant="outline"
                  className="w-full h-12"
                >
                  {isResending ? 'Enviando...' : 'Reenviar correo de verificación'}
                </Button>

                {resendSuccess && (
                  <div className="bg-complementary-emerald/10 border border-complementary-emerald/20 rounded-lg p-3">
                    <p className="text-sm text-complementary-emerald text-center">
                      Correo de verificación reenviado. Revisa tu bandeja de entrada.
                    </p>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-gray-200">
                  <Link href="/auth/login" className="text-sm text-brand-gold hover:underline font-medium">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
