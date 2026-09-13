'use client';

import { apiFetch } from '@/lib/api/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Por favor, introduce un email válido');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await apiFetch(
        '/api/newsletter/subscribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
        false
      );

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('¡Te has suscrito correctamente!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al suscribirse. Inténtalo de nuevo.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-neutral/60 focus:bg-white/20"
          required
          aria-label="Email para newsletter"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-primary hover:bg-primary-dark text-primary-foreground px-6"
        >
          {status === 'loading' ? '...' : 'Suscribir'}
        </Button>
      </div>
      
      {message && (
        <p
          className={`text-sm ${
            status === 'success'
              ? 'text-complementary-emerald'
              : status === 'error'
              ? 'text-accent-red'
              : 'text-neutral'
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}

