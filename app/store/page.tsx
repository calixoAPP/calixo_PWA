'use client';

import { apiFetch } from '@/lib/api/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CoinAmount } from '@/components/ui/coin';
import { CouponCard } from '@/components/store/coupon-card';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';

interface Coupon {
  id: number;
  code: string;
  discountPercent: number;
  partnerName: string;
  description: string | null;
  price: number;
  validUntil: string;
  brandImage: string | null;
  maxUses: number | null;
  currentUses: number;
  owned: boolean;
  canPurchase: boolean;
  isOutOfStock?: boolean;
}

interface StoreData {
  items: Coupon[];
  userCoins: number;
  isPremium: boolean;
  totalItems: number;
  ownedCount: number;
}

export default function StorePage() {
  const router = useRouter();
  const toast = useToast();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, [searchQuery]);

  const fetchStoreData = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);

      const response = await apiFetch(`/api/store?${params}`);
      if (!response.ok) {
        throw new Error('Error al cargar la tienda');
      }
      const data = await response.json();
      setStoreData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (couponId: number) => {
    if (!storeData) return;

    setPurchasing(true);
    setError('');

    try {
      const response = await apiFetch('/api/store/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al comprar');
      }

      const data = await response.json();
      toast.success(`¡Cupón ${data.coupon.code} comprado! -${data.coupon.price} monedas`);
      
      // Refresh store data
      await fetchStoreData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al comprar');
    } finally {
      setPurchasing(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Error al cargar datos'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Cabecera: el saldo va suelto a la derecha, sin cápsula */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-text-dark">Tienda</h1>
            <p className="mt-1 text-sm text-neutral">Canjea tus monedas por cupones exclusivos</p>
          </div>
          <CoinAmount amount={storeData.userCoins} size={24} textClassName="text-xl text-text-dark" />
        </div>

        <nav className="mb-4 flex gap-2 text-sm">
          <span className="inline-flex h-9 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground">
            Cupones
          </span>
          <Link
            href="/store/purchased"
            className="inline-flex h-9 items-center rounded-full bg-neutral/10 px-4 font-medium text-text hover:bg-neutral/15"
          >
            Mis cupones
          </Link>
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
          placeholder="Buscar por marca…"
          aria-label="Buscar cupones"
          className="mb-4 h-12 w-full rounded-control border border-neutral/20 bg-white px-4 text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {storeData.items.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-text-dark">
              {searchQuery ? 'Sin resultados' : 'No hay cupones disponibles'}
            </h2>
            <p className="mb-4 text-neutral">
              {searchQuery
                ? `No hemos encontrado cupones de «${searchQuery}». Prueba con otra marca.`
                : 'Vuelve pronto: vamos añadiendo marcas nuevas.'}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-neutral/10 rounded-card border border-neutral/10 bg-white px-4">
            {storeData.items.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                userCoins={storeData.userCoins}
                onPurchase={handlePurchase}
                isPurchasing={purchasing}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
