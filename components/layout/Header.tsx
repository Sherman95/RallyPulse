"use client";

import React from 'react';
import { LiveStatus } from '@/hooks/useLiveResults';
import { useTheme } from '@/hooks/useTheme';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';

interface HeaderProps {
  status?: LiveStatus;
  lastUpdated?: Date | null;
}

export default function Header({ status, lastUpdated = null }: HeaderProps) {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();

  // Determinamos colores y texto según el estado de la conexión
  const getStatusVisuals = () => {
    switch (status) {
      case 'ACTUALIZANDO':
        return { label: 'ACTUALIZANDO' };
      case 'ERROR TEMPORAL':
        return { label: 'OFFLINE' };
      case 'CULMINADO':
        return { label: 'CULMINADO' };
      case 'LIVE':
      default:
        return { label: 'LIVE' };
    }
  };

  const visuals = getStatusVisuals();

  return (
    <header className="sticky top-0 z-50 bg-rally-nav border-b border-white/[0.08]">
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 max-w-5xl mx-auto py-2 sm:py-3 gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            {/* Logo Vuelta a la República (Usando el logo de imbabura por ahora) */}
            <Image 
              src="/logovuelta2025.webp" 
              alt="Vuelta a la República" 
              width={150} 
              height={50} 
              className="shrink-0 h-10 w-auto object-contain rounded-md" 
            />

            {/* Nombre — texto invertido siempre claro */}
            <div className="min-w-0 flex flex-col justify-center ml-1">
              <span className="text-rally-nav-txt text-[13px] sm:text-[15px] font-bold tracking-wide leading-tight">
                Rally<span className="text-rally-accent">Pulse</span>
              </span>
            </div>
          </Link>

          {/* Menú móvil y acciones */}
          <div className="flex items-center sm:hidden">
             <button onClick={toggle} aria-label="Cambiar tema" className="w-8 h-8 flex items-center justify-center rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
              {dark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Inicio</Link>
          <Link href="/en-vivo" className={`transition-colors ${pathname === '/en-vivo' ? 'text-rally-accent font-bold' : 'text-white/60 hover:text-white'}`}>Tiempos en Vivo</Link>
          <Link href="/inscritos" className={`transition-colors ${pathname === '/inscritos' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Inscritos</Link>
          <Link href="/itinerario" className={`transition-colors ${pathname === '/itinerario' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Itinerario</Link>
        </nav>

        <div className="hidden sm:flex items-center ml-auto lg:ml-0">
          {/* Chip EN VIVO - Solo se muestra si el status fue proporcionado explícitamente */}
          {status && (
            <div className="flex items-center mr-4">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide ${
                status === 'ACTUALIZANDO' ? 'bg-yellow-500 text-rally-nav' :
                status === 'ERROR TEMPORAL' ? 'bg-orange-500 text-rally-nav' :
                'bg-rally-accent text-rally-nav'
              }`}>
                {status === 'ACTUALIZANDO' ? (
                  <span className="inline-flex items-center gap-1" aria-label="Actualizando">
                    <span className="inline-block w-1 h-1 rounded-full bg-rally-nav animate-bounce [animation-delay:-0.2s]" />
                    <span className="inline-block w-1 h-1 rounded-full bg-rally-nav animate-bounce [animation-delay:-0.1s]" />
                    <span className="inline-block w-1 h-1 rounded-full bg-rally-nav animate-bounce" />
                  </span>
                ) : (
                  visuals.label
                )}
              </span>

              {/* Pulso animado (solo en LIVE) */}
              {status === 'LIVE' && (
                <span className="relative flex h-2 w-2 ml-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-rally-accent" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rally-accent" />
                </span>
              )}
            </div>
          )}

          {/* Toggle tema Desktop */}
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="w-8 h-8 flex items-center justify-center rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
          {dark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          </button>
        </div>

        {/* Menú móvil (Debajo del header principal) */}
        <nav className="sm:hidden w-full flex items-center justify-around mt-2 pt-2 border-t border-white/10 text-xs font-medium pb-1">
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Inicio</Link>
          <Link href="/en-vivo" className={`transition-colors flex items-center gap-1 ${pathname === '/en-vivo' ? 'text-rally-accent font-bold' : 'text-white/60 hover:text-white'}`}>
            Tiempos
            {status && status === 'LIVE' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rally-accent animate-pulse" />}
          </Link>
          <Link href="/inscritos" className={`transition-colors ${pathname === '/inscritos' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Inscritos</Link>
          <Link href="/itinerario" className={`transition-colors ${pathname === '/itinerario' ? 'text-white' : 'text-white/60 hover:text-white'}`}>Itinerario</Link>
        </nav>
      </div>
    </header>
  );
}
