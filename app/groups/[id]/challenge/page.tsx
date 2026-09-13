import { MobileOnlyGate } from '@/components/layout/mobile-only-gate';

export default async function GroupChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <MobileOnlyGate
      feature="group-challenge"
      backHref={`/groups/${id}/chat`}
      backLabel="Volver al grupo"
    />
  );
}
