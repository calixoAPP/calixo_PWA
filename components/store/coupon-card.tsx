'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CoinIcon } from '@/components/ui/coin';
import { cn } from '@/lib/utils';

interface CouponCardProps {
  coupon: {
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
    owned?: boolean;
    canPurchase?: boolean;
    isOutOfStock?: boolean;
  };
  /** Saldo del usuario, para decir cuántas monedas faltan. */
  userCoins?: number;
  onPurchase: (couponId: number) => void;
  isPurchasing: boolean;
}

export function formatCouponDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Un cupón de la tienda como fila de lista: marca a la izquierda y precio a la derecha. */
export function CouponCard({ coupon, userCoins, onPurchase, isPurchasing }: CouponCardProps) {
  const isOutOfStock = coupon.isOutOfStock ?? false;
  const remaining = coupon.maxUses ? Math.max(0, coupon.maxUses - coupon.currentUses) : null;
  const missing = userCoins === undefined ? 0 : Math.max(0, coupon.price - userCoins);
  const isAvailable = (coupon.canPurchase ?? true) && missing === 0;

  return (
    <li className="flex items-start gap-3 py-4">
      <BrandLogo src={coupon.brandImage} name={coupon.partnerName} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text-dark">{coupon.partnerName}</p>
        <p className="text-sm font-medium text-brand-gold">{coupon.discountPercent}% de descuento</p>
        {coupon.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-neutral">{coupon.description}</p>
        )}
        <p className="mt-1 text-xs text-neutral-light">
          Hasta {formatCouponDate(coupon.validUntil)}
          {remaining !== null && ` · ${remaining === 1 ? 'Queda' : 'Quedan'} ${remaining}`}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {coupon.owned ? (
          <Link href="/store/purchased" className="text-sm text-neutral hover:text-text-dark">
            ✓ Tuyo
          </Link>
        ) : isOutOfStock ? (
          <span className="text-sm text-neutral">Agotado</span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onPurchase(coupon.id)}
              disabled={isPurchasing || !isAvailable}
              aria-label={`Canjear por ${coupon.price} monedas`}
              className={cn(
                'inline-flex h-9 min-w-[4rem] items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-semibold tabular-nums transition-colors',
                // Sin saldo suficiente el precio se sigue leyendo, pero sin pinta de botón.
                isAvailable
                  ? 'bg-primary text-primary-foreground hover:bg-primary-dark'
                  : 'cursor-not-allowed bg-neutral/10 text-neutral'
              )}
            >
              {isPurchasing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <CoinIcon size={16} />
                  {coupon.price}
                </>
              )}
            </button>
            {missing > 0 ? (
              <span className="text-xs text-neutral">
                Te {missing === 1 ? 'falta' : 'faltan'} {missing}
              </span>
            ) : (
              !coupon.canPurchase && <span className="text-xs text-neutral">No disponible</span>
            )}
          </>
        )}
      </div>
    </li>
  );
}

/** Logo de la marca o, si no tiene, su inicial. */
export function BrandLogo({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral/10">
      <span className="text-lg font-semibold text-neutral">{name.charAt(0).toUpperCase()}</span>
      {src && <Image src={src} alt={name} fill sizes="52px" className="object-cover" />}
    </div>
  );
}

/** Código de un cupón canjeado, en una "entrada" de borde discontinuo que se copia al tocarla. */
export function CouponCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles el código sigue a la vista para copiarlo a mano.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar código ${code}`}
      className="mt-3 flex h-11 w-full items-center justify-between rounded-xl border border-dashed border-neutral/40 px-3.5 text-left transition-colors hover:bg-neutral/5"
    >
      <span className="font-mono text-base font-semibold tracking-wider text-text-dark">{code}</span>
      <span className={cn('text-sm', copied ? 'text-brand-gold' : 'text-neutral')}>
        {copied ? 'Copiado' : 'Copiar'}
      </span>
    </button>
  );
}
