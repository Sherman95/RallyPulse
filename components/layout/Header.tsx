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
      <div className="flex items-center gap-2 h-14 px-4 max-w-5xl mx-auto">
        {/* Logo Imbabura */}
        <div className="flex items-center justify-center bg-white rounded-md p-0.5 shadow-sm">
          <Image 
            src="/logoRallyImbabura.webp" 
            alt="Rally Imbabura" 
            width={28} 
            height={28} 
            className="object-contain" 
          />
        </div>

        {/* Nombre — texto invertido siempre claro */}
        <div className="flex flex-col justify-center ml-1">
          <span className="text-rally-nav-txt text-[15px] font-bold tracking-wide leading-tight">
            Rally<span className="text-rally-accent">Pulse</span>
          </span>
          <span className="text-white/50 text-[10px] font-medium leading-none tracking-wider">FEDAK 2025</span>
        </div>

        {/* Chip EN VIVO */}
        <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide ${
          status === 'ACTUALIZANDO' ? 'bg-yellow-500 text-rally-nav' :
          status === 'ERROR TEMPORAL' ? 'bg-orange-500 text-rally-nav' :
          'bg-rally-accent text-rally-nav'
        }`}>
          {visuals.label}
        </span>

        {/* Pulso animado (solo si no hay error) */}
        {status !== 'ERROR TEMPORAL' && (
          <span className="relative flex h-2 w-2 ml-1.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
              status === 'ACTUALIZANDO' ? 'animate-spin bg-yellow-400' : 'animate-ping bg-rally-accent'
            }`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${
              status === 'ACTUALIZANDO' ? 'bg-yellow-500' : 'bg-rally-accent'
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
    </header>
  );
}
