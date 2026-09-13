import { MobileOnlyGate } from '@/components/layout/mobile-only-gate';

export default function PricingPage() {
  return <MobileOnlyGate feature="premium" backHref="/profile" backLabel="Volver al perfil" />;
}
