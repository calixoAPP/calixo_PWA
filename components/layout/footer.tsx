'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsletterForm } from './newsletter-form';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-brand-yellow mb-4">Calixo</h3>
            <p className="text-neutral-light text-sm">
              Hub social de Calixo: feed, amigos, grupos y tienda. Los retos se completan en la app móvil.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-neutral hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-neutral hover:text-primary transition-colors">
                  Retos
                </Link>
              </li>
              <li>
                <Link href="/feed" className="text-neutral hover:text-primary transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-neutral hover:text-primary transition-colors">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/aviso-legal" className="text-neutral hover:text-primary transition-colors">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-privacidad" className="text-neutral hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-cookies" className="text-neutral hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos-condiciones" className="text-neutral hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-neutral text-sm mb-4">
              Suscríbete para recibir novedades y consejos sobre desconexión digital.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral text-sm text-center md:text-left">
              © {currentYear} CALIXO SL. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/legal/aviso-legal" className="text-neutral hover:text-primary transition-colors">
                Aviso Legal
              </Link>
              <Link href="/legal/politica-privacidad" className="text-neutral hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/legal/politica-cookies" className="text-neutral hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

