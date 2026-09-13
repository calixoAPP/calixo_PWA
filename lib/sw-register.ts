// Service Worker Registration Helper
// Handles SW registration, updates, and lifecycle

export interface SWRegistrationResult {
  success: boolean;
  registration?: ServiceWorkerRegistration;
  error?: Error;
}

/**
 * Register the Service Worker
 * Call this from the client-side only
 */
export async function registerServiceWorker(): Promise<SWRegistrationResult> {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return { success: false, error: new Error('Service workers not supported') };
  }

  try {
    console.log('[SW] Registering service worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered successfully');

    // Check for updates on page load
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] New service worker found, installing...');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, show update notification
            console.log('[SW] New service worker installed, ready to activate');
            notifyUserOfUpdate();
          }
        });
      }
    });

    // Check for updates every hour
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return { success: true, registration };
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return { success: false, error: error as Error };
  }
}

/**
 * Unregister all service workers
 * Useful for debugging or cleanup
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[SW] Service worker unregistered');
    }
    
    return true;
  } catch (error) {
    console.error('[SW] Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive(): boolean {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  return !!navigator.serviceWorker.controller;
}

/**
 * Skip waiting and activate new service worker immediately
 */
export async function skipWaitingAndActivate(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload page when new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

/**
 * Request background sync
 * Call when user performs actions that should be synced
 */
export async function requestBackgroundSync(tag: string = 'sync-calixo-actions'): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if ('sync' in registration) {
      await (registration as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> };
      }).sync.register(tag);
      console.log('[SW] Background sync requested:', tag);
      return true;
    } else {
      console.warn('[SW] Background sync not supported');
      return false;
    }
  } catch (error) {
    console.error('[SW] Background sync request failed:', error);
    return false;
  }
}

/**
 * Add failed request to sync queue
 * Call when API requests fail offline
 */
export async function addToSyncQueue(request: {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}): Promise<boolean> {
  try {
    const db = await openSyncDatabase();
    await addRequestToQueue(db, request);
    
    // Request background sync
    await requestBackgroundSync();
    
    console.log('[SW] Added request to sync queue:', request.url);
    return true;
  } catch (error) {
    console.error('[SW] Failed to add to sync queue:', error);
    return false;
  }
}

/**
 * Clear sync queue
 */
export async function clearSyncQueue(): Promise<boolean> {
  try {
    const db = await openSyncDatabase();
    const transaction = db.transaction(['pending-requests'], 'readwrite');
    const store = transaction.objectStore('pending-requests');
    await store.clear();
    console.log('[SW] Sync queue cleared');
    return true;
  } catch (error) {
    console.error('[SW] Failed to clear sync queue:', error);
    return false;
  }
}

// Private helpers

function notifyUserOfUpdate(): void {
  // Show a toast or notification that an update is available
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('sw-update-available');
    window.dispatchEvent(event);
  }
}

function openSyncDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('calixo-sync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function addRequestToQueue(db: IDBDatabase, request: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readwrite');
    const store = transaction.objectStore('pending-requests');
    const addRequest = store.add(request);
    
    addRequest.onerror = () => reject(addRequest.error);
    addRequest.onsuccess = () => resolve();
  });
}



