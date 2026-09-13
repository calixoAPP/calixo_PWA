'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: 40,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

interface UserAvatarProps {
  displayName?: string | null;
  profilePhotoUrl?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}

export function UserAvatar({
  displayName,
  profilePhotoUrl,
  size = 'md',
  className,
}: UserAvatarProps) {
  const px = sizeMap[size];

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-brand-gold/10 border border-neutral-lighter flex-shrink-0',
        className
      )}
      style={{ width: px, height: px }}
    >
      {profilePhotoUrl ? (
        <Image
          src={profilePhotoUrl}
          alt={displayName || 'Usuario'}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-semibold text-brand-gold"
          style={{ fontSize: px * 0.38 }}
        >
          {displayName?.[0]?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
}
