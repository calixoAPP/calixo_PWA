'use client';

import { apiFetch } from '@/lib/api/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CoinAmount } from '@/components/ui/coin';
import { BrandLogo, CouponCode, formatCouponDate } from '@/components/store/coupon-card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PurchasedCoupon {
  purchase: {
    id: number;
    purchasedAt: string;
  };
  coupon: {
    id: number;
    code: string;
    discountPercent: number;
    partnerName: string;
    description: string | null;
    price: number;
    validUntil: string;
    brandImage: string | null;
  } | null;
  transaction: {
    id: number;
    amount: number;
    description: string | null;
    createdAt: string;
  } | null;
}

interface PurchasedData {
  items: PurchasedCoupon[];
  total: number;
}

export default function PurchasedCouponsPage() {
  const [data, setData] = useState<PurchasedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPurchasedCoupons();
  }, []);

  const fetchPurchasedCoupons = async () => {
    try {
      const response = await apiFetch('/api/store/purchased');
      if (!response.ok) {
        throw new Error('Error al cargar cupones comprados');
      }
      const purchasedData = await response.json();
      setData(purchasedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por búsqueda
  const filteredItems = data?.items.filter(item => {
    if (!item.coupon) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.coupon.partnerName?.toLowerCase().includes(query) ||
      item.coupon.code?.toLowerCase().includes(query) ||
      item.coupon.description?.toLowerCase().includes(query)
    );
  }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-text-dark">Mis cupones</h1>
          <p className="mt-1 text-sm text-neutral">Toca un código para copiarlo</p>
        </div>

        <nav className="mb-4 flex gap-2 text-sm">
          <Link
            href="/store"
            className="inline-flex h-9 items-center rounded-full bg-neutral/10 px-4 font-medium text-text hover:bg-neutral/15"
          >
            Cupones
          </Link>
          <span className="inline-flex h-9 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground">
            Mis cupones
          </span>
          <Link
            href="/store/transactions"
            className="inline-flex h-9 items-center rounded-full bg-neutral/10 px-4 font-medium text-text hover:bg-neutral/15"
          >
            Historial
          </Link>
        </nav>

        {error && (
          <div className="mb-4 rounded-xl border border-accent-red/30 bg-accent-red/10 p-4 text-accent-red-dark">
            {error}
          </div>
        )}

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por marca, código o descripción…"
          aria-label="Buscar en mis cupones"
          className="h-12 w-full rounded-control border border-neutral/20 bg-white px-4 text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <p className="mt-2 text-sm text-neutral">
            {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
          </p>
        )}

        {paginatedItems.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-text-dark">
              {searchQuery ? 'No se encontraron resultados' : 'Todavía no has canjeado ningún cupón'}
            </h2>
            <p className="mb-6 text-neutral">
              {searchQuery
                ? 'Intenta buscar con otros términos'
                : 'Completa retos para ganar monedas y canjéalas en la tienda.'}
            </p>
            {!searchQuery && (
              <Link href="/store">
                <Button>Ir a la tienda</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-neutral/10 rounded-card border border-neutral/10 bg-white px-4">
              {paginatedItems.map(({ purchase, coupon, transaction }) => {
                if (!coupon) return null;

                const isValid = new Date(coupon.validUntil) > new Date();

                return (
                  <li key={purchase.id} className={cn('flex items-start gap-3 py-4', !isValid && 'opacity-60')}>
                    <BrandLogo src={coupon.brandImage} name={coupon.partnerName} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate font-semibold text-text-dark">{coupon.partnerName}</p>
                        {!isValid && <span className="shrink-0 text-xs text-accent-red">Expirado</span>}
                      </div>
                      <p className="text-sm font-medium text-brand-gold">{coupon.discountPercent}% de descuento</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-neutral">
                        <span>Canjeado el {formatCouponDate(purchase.purchasedAt)}</span>
                        {transaction && (
                          <>
                            <span aria-hidden="true">·</span>
                            <CoinAmount amount={Math.abs(transaction.amount)} size={12} className="gap-1" textClassName="font-medium" />
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>Válido hasta {formatCouponDate(coupon.validUntil)}</span>
                      </p>
                      <CouponCode code={coupon.code} />
                    </div>
                  </li>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-2 text-sm tabular-nums text-neutral">
                  {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
