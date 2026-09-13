'use client';

import { apiFetch } from '@/lib/api/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationItem } from '@/components/notifications/notification-item';
import { Spinner } from '@/components/ui/spinner';

interface Notification {
  id: number;
  type: string;
  title?: string;
  message?: string;
  payload: unknown;
  seen: boolean;
  createdAt: Date | string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const NOTIFICATIONS_PER_PAGE = 10;

  const fetchNotifications = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      const params = new URLSearchParams({
        limit: NOTIFICATIONS_PER_PAGE.toString(),
        offset: currentOffset.toString(),
      });

      const response = await apiFetch(`/api/notifications?${params}`);
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }

      const notificationsData = await response.json();

      if (reset) {
        setNotifications(notificationsData.notifications || []);
        setOffset(NOTIFICATIONS_PER_PAGE);
      } else {
        setNotifications((prev) => [...prev, ...(notificationsData.notifications || [])]);
        setOffset((prev) => prev + NOTIFICATIONS_PER_PAGE);
      }

      setHasMore(notificationsData.hasMore || false);
      setTotalCount(notificationsData.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchNotifications(false);
  };

  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        const response = await apiFetch('/api/notifications/read-all', {
          method: 'POST',
        });

        if (response.ok) {
          window.dispatchEvent(new CustomEvent('notifications-marked-read'));
        }
        await fetchNotifications(true);
      } catch (err) {
        console.error('Error al marcar notificaciones como leídas:', err);
        await fetchNotifications(true);
      }
    };

    markAllAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20 md:pb-0">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 md:px-6 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
            Notificaciones
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {totalCount > 0 ? `${totalCount} notificaciones` : 'No hay notificaciones'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 md:py-12 px-4 md:px-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                No tienes notificaciones
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                ¡Estás al día con todo!
              </p>
              <Button onClick={() => router.push('/feed')} className="w-full sm:w-auto">
                Ir al feed
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-2 md:space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRefresh={() => fetchNotifications(true)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {loadingMore ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Cargando...
                    </>
                  ) : (
                    'Cargar más'
                  )}
                </Button>
              </div>
            )}

            {!hasMore && notifications.length > 0 && (
              <Card className="mt-6">
                <CardContent className="py-4 px-4 md:px-6 text-center">
                  <p className="text-sm md:text-base text-gray-600">
                    Has visto todas las notificaciones
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
