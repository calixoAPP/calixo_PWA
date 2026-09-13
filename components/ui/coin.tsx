import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Moneda de Calixo: un disco dorado con canto. Es el único icono de monedas de la web, igual que en
 * las apps (CoinIcon en iOS y Android), para que saldo, precios y premios se reconozcan siempre.
 */
export function CoinIcon({ size = 16, className }: { size?: number; className?: string }) {
  // useId trae dos puntos, que no valen dentro de url(#...).
  const gradientId = `coin-${useId().replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD84D" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="12" r="8.6" fill="none" stroke="#8A6E14" strokeOpacity="0.35" strokeWidth="1.6" />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill="#8A6E14"
        fillOpacity="0.75"
        fontFamily="system-ui, sans-serif"
      >
        C
      </text>
    </svg>
  );
}

interface CoinAmountProps {
  amount: number;
  /** Tamaño del icono en px. */
  size?: number;
  /** Antepone "+" a las cantidades positivas (premios). */
  showPlus?: boolean;
  className?: string;
  textClassName?: string;
}

/** Cantidad de monedas con su icono. Sin fondo: se coloca tal cual sobre la superficie que toque. */
export function CoinAmount({ amount, size = 16, showPlus = false, className, textClassName }: CoinAmountProps) {
  const label = `${amount} ${Math.abs(amount) === 1 ? 'moneda' : 'monedas'}`;

  return (
    <span className={cn('inline-flex items-center gap-1.5 tabular-nums', className)} aria-label={label}>
      <CoinIcon size={size} />
      <span className={cn('font-semibold', textClassName)} aria-hidden="true">
        {showPlus && amount > 0 ? `+${amount}` : amount}
      </span>
    </span>
  );
}
