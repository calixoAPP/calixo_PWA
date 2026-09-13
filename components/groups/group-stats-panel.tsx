'use client';

import { CoinAmount } from '@/components/ui/coin';
import type { GroupStats } from '@/types';

interface GroupStatsPanelProps {
  stats: GroupStats;
}

/** Estadísticas del grupo: las cifras en una franja y el ranking en lista, sin tarjetas. */
export function GroupStatsPanel({ stats }: GroupStatsPanelProps) {
  return (
    <div className="space-y-6 p-4">
      <dl className="grid grid-cols-3 divide-x divide-neutral/10 rounded-card border border-neutral/10 bg-white py-4 text-center">
        <div className="flex flex-col-reverse">
          <dt className="text-xs text-neutral">Retos</dt>
          <dd className="text-2xl font-bold tabular-nums text-text-dark">{stats.totalChallenges}</dd>
        </div>
        <div className="flex flex-col-reverse">
          <dt className="text-xs text-neutral">Completados</dt>
          <dd className="text-2xl font-bold tabular-nums text-text-dark">{stats.completedChallenges}</dd>
        </div>
        <div className="flex flex-col-reverse">
          <dt className="text-xs text-neutral">Repartidas</dt>
          <dd className="flex justify-center">
            <CoinAmount amount={stats.totalCoinsDistributed} size={20} textClassName="text-2xl font-bold text-text-dark" />
          </dd>
        </div>
      </dl>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-text-dark">Ranking de victorias</h3>
        {stats.ranking.length === 0 ? (
          <p className="py-4 text-center text-sm text-neutral">Sin datos aún</p>
        ) : (
          <ol className="divide-y divide-neutral/10 rounded-card border border-neutral/10 bg-white px-4">
            {stats.ranking.map((member, i) => (
              <li key={member.userId} className="flex items-center justify-between py-3 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-5 tabular-nums text-neutral">{i + 1}</span>
                  <span className="truncate text-text-dark">{member.displayName}</span>
                </span>
                <span className="shrink-0 tabular-nums text-neutral">
                  {member.wins} {member.wins === 1 ? 'victoria' : 'victorias'} · {member.successRate}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
