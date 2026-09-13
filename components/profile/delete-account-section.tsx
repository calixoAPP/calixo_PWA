'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api/client';
import { signOut } from '@/app/auth/actions';

const CONFIRMATION_WORD = 'ELIMINAR';

/**
 * Eliminar la cuenta. Se pide escribir ELIMINAR para que no se haga de un clic por despiste: no se
 * puede deshacer.
 */
export function DeleteAccountSection({ disabled = false }: { disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const canDelete = typed.trim().toUpperCase() === CONFIRMATION_WORD && !isDeleting;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const response = await apiFetch('/api/profile', { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se ha podido eliminar la cuenta');
      }
      // Cierra la sesión y lleva a la pantalla de entrada.
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  return (
    <section className="mt-6 border-t border-neutral/10 pt-5">
      <h3 className="text-sm font-semibold text-text-dark">Eliminar cuenta</h3>
      <p className="mt-1 text-sm text-neutral">
        Se borran tu perfil, tus publicaciones, mensajes, monedas y cupones. No se puede deshacer.
      </p>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="mt-3 h-10 rounded-control border border-accent-red/50 px-4 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/5 disabled:opacity-50"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <label htmlFor="delete-confirmation" className="block text-sm text-text">
            Escribe <span className="font-semibold">{CONFIRMATION_WORD}</span> para confirmar
          </label>
          <input
            id="delete-confirmation"
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            disabled={isDeleting}
            className="h-11 w-full rounded-control border border-neutral/20 bg-white px-3 text-text focus:border-accent-red focus:outline-none focus:ring-2 focus:ring-accent-red/40"
          />
          {error && <p className="text-sm text-accent-red">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete}
              className="h-10 flex-1 rounded-control bg-accent-red px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-red-dark disabled:opacity-40"
            >
              {isDeleting ? 'Eliminando…' : 'Eliminar definitivamente'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setTyped('');
                setError('');
              }}
              disabled={isDeleting}
              className="h-10 rounded-control px-4 text-sm font-medium text-neutral hover:bg-neutral/10"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
