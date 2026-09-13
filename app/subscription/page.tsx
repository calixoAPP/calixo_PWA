import { MobileOnlyGate } from '@/components/layout/mobile-only-gate';

export default function SubscriptionPage() {
  return <MobileOnlyGate feature="premium" backHref="/profile" backLabel="Volver al perfil" />;
}
