import { MobileOnlyGate } from '@/components/layout/mobile-only-gate';

export default function SocialChallengesPage() {
  return (
    <MobileOnlyGate
      feature="social-challenges"
      backHref="/challenges"
      backLabel="Volver a retos"
    />
  );
}
