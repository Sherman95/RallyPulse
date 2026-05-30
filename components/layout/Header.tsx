"use client";

import React from 'react';
import { LiveStatus } from '@/hooks/useLiveResults';
import { useTheme } from '@/hooks/useTheme';

import Image from 'next/image';

interface HeaderProps {
  status?: LiveStatus;
  lastUpdated?: Date | null;
}

export default function Header({ status = 'LIVE', lastUpdated = null }: HeaderProps) {
  const { dark, toggle } = useTheme();

  // Determinamos colores y texto según el estado de la conexión
  const getStatusVisuals = () => {
    switch (status) {
      case 'ACTUALIZANDO':
        return {
          bg: 'bg-yellow-500/10 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          ring: 'ring-yellow-500/20',
          dot: 'bg-yellow-500',
          ping: 'bg-yellow-400',
          label: 'ACTUALIZANDO'
        };
      case 'ERROR TEMPORAL':
        return {
          bg: 'bg-orange-500/10 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          ring: 'ring-orange-500/20',
          dot: 'bg-orange-500',
          ping: 'hidden', // Sin parpadeo si hay error
          label: 'OFFLINE'
        };
      case 'LIVE':
      default:
        return {
          bg: 'bg-red-500/10 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          ring: 'ring-red-500/20',
          dot: 'bg-red-500',
          ping: 'bg-red-400',
          label: 'LIVE'
        };
    }
  };

  const visuals = getStatusVisuals();

  // Formatear la hora HH:MM:SS
  const formatTime = (date: Date | null) => {
    if (!date) return 'Esperando...';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-50 bg-rally-nav border-b border-white/[0.08]">
      <div className="flex items-center gap-2 px-3 sm:px-4 max-w-5xl mx-auto py-2 sm:py-3">
        {/* Logo Imbabura — sin fondo, tamaño completo */}
        <Image 
          src="/logoRallyImbabura.webp" 
          alt="Rally Imbabura" 
          width={220} 
          height={80} 
          sizes="(min-width: 768px) 220px, (min-width: 640px) 200px, 170px"
          className="shrink-0 w-[170px] h-12 sm:w-[200px] sm:h-14 md:w-[220px] md:h-16 object-contain" 
        />

        {/* Nombre — texto invertido siempre claro */}
        <div className="min-w-0 flex flex-col justify-center ml-1">
          <span className="text-rally-nav-txt text-[13px] sm:text-[15px] font-bold tracking-wide leading-tight">
            Rally<span className="text-rally-accent">Pulse</span>
          </span>
        </div>

        <div className="ml-auto flex items-center">
          {/* Chip EN VIVO */}
          <span className={`text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-sm tracking-wide ${
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
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                'bg-rally-accent'
              }`} />
            </span>
          )}

          {/* Toggle tema */}
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="ml-2 w-7 h-7 flex items-center justify-center rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
          {dark ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          </button>
        </div>
      </div>
    </header>
  );
}
