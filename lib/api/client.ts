import { createClient } from '@/lib/supabase/client';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }
  return base;
}

async function getAccessToken(forceRefresh = false): Promise<string | null> {
  const supabase = createClient();
  if (forceRefresh) {
    const { data } = await supabase.auth.refreshSession();
    return data.session?.access_token ?? null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<Response> {
  const url = buildUrl(path);
  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const token = await getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && requiresAuth) {
    const refreshedToken = await getAccessToken(true);
    if (refreshedToken) {
      headers.set('Authorization', `Bearer ${refreshedToken}`);
      response = await fetch(url, { ...options, headers });
    }
    if (response.status === 401 && typeof window !== 'undefined') {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    }
  }

  return response;
}

export async function apiJson<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const response = await apiFetch(path, options, requiresAuth);
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      message = (data as { error?: string; message?: string }).error
        || (data as { error?: string; message?: string }).message
        || message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
  const response = await apiFetch(path, { method, body: formData });
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      message = (data as { error?: string }).error || message;
    } catch {
      // ignore
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}
