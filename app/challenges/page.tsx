import { MobileOnlyGate } from '@/components/layout/mobile-only-gate';

export default function ChallengesPage() {
  return <MobileOnlyGate feature="challenges" backHref="/feed" backLabel="Volver al feed" />;
}
