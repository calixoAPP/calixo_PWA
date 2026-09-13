'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type MobileOnlyFeature = 'challenges' | 'social-challenges' | 'group-challenge' | 'premium';

const COPY: Record<MobileOnlyFeature, { title: string; description: string; benefits?: string[] }> = {
  challenges: {
    title: 'Los retos están disponibles en la app móvil',
    description:
      'Para completar retos diarios, ganar monedas y usar el modo focus, descarga la app de Calixo en tu móvil.',
    benefits: ['Retos diarios y modo focus', 'Gana monedas completando retos', 'Comparte tu progreso en el feed'],
  },
  'social-challenges': {
    title: 'Los retos sociales están en la app móvil',
    description:
      'Invita a un amigo a desconectarse contigo y completa retos sociales desde la app de Calixo.',
  },
  'group-challenge': {
    title: 'Los retos grupales están en la app móvil',
    description:
      'Crea y participa en retos grupales con tus amigos desde la app. Aquí puedes gestionar el chat y los miembros del grupo.',
  },
  premium: {
    title: 'Premium está disponible en la app móvil',
    description:
      'Suscríbete a Calixo Premium desde la app para desbloquear modo focus extendido, más retos al día y cupones exclusivos.',
    benefits: ['Modo Focus hasta 5 horas', 'Más retos al día', 'Retos de grupo sin límite', 'Cupones exclusivos'],
  },
};

const IOS_APP_URL = process.env.NEXT_PUBLIC_IOS_APP_URL || '';
const ANDROID_APP_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL || '';

interface MobileOnlyGateProps {
  feature: MobileOnlyFeature;
  backHref?: string;
  backLabel?: string;
}

export function MobileOnlyGate({ feature, backHref, backLabel }: MobileOnlyGateProps) {
  const content = COPY[feature];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/icons/icon.svg"
              alt="Calixo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-xl md:text-2xl">{content.title}</CardTitle>
          <CardDescription className="text-base">{content.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.benefits && content.benefits.length > 0 && (
            <ul className="space-y-2 text-sm text-neutral-dark">
              {content.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {IOS_APP_URL ? (
              <Button asChild className="flex-1">
                <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
                  App Store
                </a>
              </Button>
            ) : null}
            {ANDROID_APP_URL ? (
              <Button asChild variant="secondary" className="flex-1">
                <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                  Google Play
                </a>
              </Button>
            ) : null}
            {!IOS_APP_URL && !ANDROID_APP_URL && (
              <p className="text-sm text-neutral text-center w-full">
                Descarga Calixo desde App Store o Google Play en tu móvil.
              </p>
            )}
          </div>

          {backHref && (
            <div className="text-center">
              <Link href={backHref} className="text-sm text-brand-gold hover:underline">
                {backLabel || 'Volver'}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
