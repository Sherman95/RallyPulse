"use client";

import React from 'react';
import { LiveStatus } from '@/hooks/useLiveResults';
import { useTheme } from '@/hooks/useTheme';

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
    <header className="sticky top-0 z-50 w-full border-b border-rally-border bg-rally-surface/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-rally-text">
            RALLY CAMINOS DE IMBABURA
          </h1>
          
          {/* Badge Desktop */}
          <div className={`hidden sm:flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1 ring-inset ${visuals.bg} ${visuals.text} ${visuals.ring}`}>
            <span className="relative flex h-2 w-2">
              <span className={`${status === 'ACTUALIZANDO' ? 'animate-spin' : 'animate-ping'} absolute inline-flex h-full w-full rounded-full opacity-75 ${visuals.ping}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${visuals.dot}`}></span>
            </span>
            {visuals.label}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end text-xs text-rally-muted">
            <span className="hidden sm:inline">Última actualización:</span>
            <span className="font-mono text-rally-text font-medium">{formatTime(lastUpdated)}</span>
          </div>

          <button
            onClick={toggle}
            className="p-2 rounded-full bg-rally-bg border border-rally-border text-rally-muted hover:text-rally-text transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {dark ? (
              // Sun icon for dark mode
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon icon for light mode
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Banner Móvil */}
      <div className={`sm:hidden flex items-center justify-center gap-2 border-t border-rally-border py-1.5 text-xs font-semibold tracking-wide ${visuals.text} ${visuals.bg.replace('/10', '/30')}`}>
        <span className="relative flex h-2 w-2">
          <span className={`${status === 'ACTUALIZANDO' ? 'animate-spin' : 'animate-ping'} absolute inline-flex h-full w-full rounded-full opacity-75 ${visuals.ping}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${visuals.dot}`}></span>
        </span>
        RESULTADOS {visuals.label}
      </div>
    </header>
  );
}
