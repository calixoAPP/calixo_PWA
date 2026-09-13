'use client';

import { apiFetch } from '@/lib/api/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CoinAmount, CoinIcon } from '@/components/ui/coin';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface Transaction {
  transaction: {
    id: number;
    userId: string;
    type: string;
    amount: number;
    description: string | null;
    createdAt: Date;
  };
  item: {
    id: number;
    name: string;
    category: string;
  } | null;
  challenge: {
    id: number;
    title: string;
    type: string;
  } | null;
}

interface TransactionsData {
  transactions: Transaction[];
  totals: {
    earned: number;
    spent: number;
    net: number;
  };
  count: number;
}

type Filter = 'all' | 'earn' | 'spend';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'earn', label: 'Ganadas' },
  { value: 'spend', label: 'Gastadas' },
];

export default function TransactionsPage() {
  const router = useRouter();
  const [data, setData] = useState<TransactionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);

      const response = await apiFetch(`/api/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Error al cargar transacciones');
      }
      const transactionsData = await response.json();
      setData(transactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent-red">{error || 'Error al cargar datos'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-text-dark">Historial de monedas</h1>

        {error && (
          <div className="mt-4 rounded-xl border border-accent-red/30 bg-accent-red/10 p-4 text-accent-red-dark">
            {error}
          </div>
        )}

        {/* Resumen: el saldo neto en grande y, debajo, lo ganado y lo gastado */}
        <section className="my-8 flex flex-col items-center text-center">
          <CoinAmount amount={data.totals.net} size={36} className="gap-2.5" textClassName="text-4xl font-bold text-text-dark" />
          <p className="mt-1 text-sm text-neutral">Saldo neto</p>
          <p className="mt-2 flex gap-4 text-sm font-medium tabular-nums">
            <span className="text-accent-green">+{data.totals.earned} ganadas</span>
            <span className="text-accent-red">−{data.totals.spent} gastadas</span>
          </p>
        </section>

        <div className="mb-4 flex gap-2" role="tablist" aria-label="Filtrar movimientos">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                'h-9 rounded-full px-4 text-sm font-medium transition-colors',
                filter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-neutral/10 text-text hover:bg-neutral/15'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {data.transactions.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-text-dark">No hay movimientos todavía</h2>
            <p className="mb-4 text-neutral">Completa retos para ganar monedas y canjéalas en la tienda.</p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => router.push('/challenges')}>Hacer retos</Button>
              <Button variant="outline" onClick={() => router.push('/store')}>
                Ir a la tienda
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral/10 rounded-card border border-neutral/10 bg-white px-4">
            {data.transactions.map(({ transaction, item, challenge }) => {
              const isEarn = transaction.type === 'earn';
              const title =
                transaction.description ||
                (item ? `Comprado: ${item.name}` : challenge ? `Reto: ${challenge.title}` : 'Movimiento');

              return (
                <li key={transaction.id} className="flex items-center gap-3 py-3.5">
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      isEarn ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
                    )}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      {isEarn ? <path d="M17 7 7 17M7 17h8M7 17V9" /> : <path d="M7 17 17 7M17 7H9M17 7v8" />}
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-text-dark">{title}</p>
                    <p className="text-xs text-neutral">{formatDate(transaction.createdAt)}</p>
                  </div>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1 font-semibold tabular-nums',
                      isEarn ? 'text-accent-green' : 'text-accent-red'
                    )}
                    aria-label={`${isEarn ? 'Ganadas' : 'Gastadas'} ${Math.abs(transaction.amount)} monedas`}
                  >
                    {isEarn ? '+' : '−'}
                    {Math.abs(transaction.amount)}
                    <CoinIcon size={14} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
