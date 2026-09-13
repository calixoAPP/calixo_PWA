'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/sw-register';
import { useToast } from '@/components/ui/toast';

export function ServiceWorkerRegister() {
  const toast = useToast();

  useEffect(() => {
    // Register service worker on mount
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker().then((result) => {
        if (result.success) {
          console.log('PWA ready - Service Worker registered');
        } else {
          console.warn('⚠️ PWA not available:', result.error?.message);
        }
      });
    }

    // Listen for SW updates
    const handleSWUpdate = () => {
      // Hay una versión nueva descargada: se avisa sin cortar lo que esté haciendo el usuario.
      toast.info('Hay una versión nueva de Calixo. Recarga la página para verla.', 8000);
    };

    window.addEventListener('sw-update-available', handleSWUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleSWUpdate);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}



