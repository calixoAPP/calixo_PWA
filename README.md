# Calixo PWA

Hub social web de Calixo: feed, amigos, grupos, mensajes, tienda y panel admin.

Los **retos** y **Premium** están disponibles solo en la app móvil (Android/iOS). La PWA muestra pantallas informativas con enlaces a las tiendas.

## Arquitectura

```
PWA (Next.js) ── Supabase Auth (login/sesión)
      │
      └── Bearer JWT ──► calixo_backend (https://calixo-backend-eta.vercel.app)
                                    │
                                    └── Supabase (datos)
```

La PWA **no** expone Route Handlers locales (`app/api/` eliminado). Toda la lógica de negocio pasa por el backend Express compartido con Android/iOS.

## Configuración

Copia `.env.example` a `.env.local` y rellena:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=https://calixo-backend-eta.vercel.app
NEXT_PUBLIC_IOS_APP_URL=          # enlace App Store
NEXT_PUBLIC_ANDROID_APP_URL=      # enlace Google Play
APP_ENV=PRE
```

## Scripts

```bash
npm run dev        # desarrollo en :3000
npm run build      # build producción
npm run type-check # verificar tipos
```

## Alcance funcional PWA

| En PWA | Solo móvil |
|--------|------------|
| Feed, búsqueda, seguir | Retos diarios, sociales, grupales |
| Mensajes, grupos (chat/info) | Suscripción Premium (RevenueCat) |
| Tienda, perfil, notificaciones | |
| Admin | |
