import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { RECOVERY_COOKIE } from '@/lib/auth/recovery';

/**
 * OAuth callback route
 * Handles the redirect from OAuth providers (Google, etc.)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // Vuelta del correo de "¿Olvidaste tu contraseña?": a elegir la nueva.
    if (request.cookies.get(RECOVERY_COOKIE)) {
      const destination = error ? '/auth/reset-password?error=expired' : '/auth/reset-password/nueva';
      const response = NextResponse.redirect(`${origin}${destination}`);
      response.cookies.delete(RECOVERY_COOKIE);
      return response;
    }
    
    // Check if email is verified
    const isEmailVerified = data.user?.email_confirmed_at !== null && data.user?.email_confirmed_at !== undefined;
    
    if (!isEmailVerified && data.user?.email) {
      // Redirect to verification page if email not verified
      return NextResponse.redirect(`${origin}/auth/verify-email?email=${encodeURIComponent(data.user.email)}`);
    }
  }

  // Redirect to home (feed) after successful auth
  return NextResponse.redirect(`${origin}/`);
}

