"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

interface HeaderProps {
  status?: string;
  lastUpdated?: Date | string | null;
}

export default function Header({ status, lastUpdated = null }: HeaderProps) {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Tiempos en Vivo', path: '/en-vivo' },
    { name: 'Inscritos', path: '/inscritos' },
    { name: 'Itinerario', path: '/itinerario' }
  ];

  // Formatear lastUpdated si es un Date
  const formattedLastUpdated = lastUpdated instanceof Date 
    ? lastUpdated.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    : lastUpdated;

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-rally-nav/70 backdrop-blur-xl shadow-lg border-b border-white/10 py-3' 
          : 'bg-rally-nav py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 w-full flex flex-wrap items-center justify-between">
        
        {/* Logo / Título */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-rally-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-md"></div>
            <img 
              src="/logovuelta2025.webp" 
              alt="Logo Vuelta a la República" 
              className="w-16 sm:w-20 h-auto object-contain relative z-10 transition-transform hover:scale-105"
            />
          </div>
          <div className="flex flex-col pt-1 sm:pt-0">
            <h1 className="text-[15px] sm:text-2xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-sm flex items-center">
              Vuelta a la <span className="text-rally-accent ml-1 sm:ml-1.5">República</span>
            </h1>
            <p className="text-[9px] sm:text-xs text-white/60 font-medium tracking-widest uppercase mt-0.5">
              RallyPulse
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-2 lg:gap-4 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path}
                href={link.path} 
                className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-0 bg-white/10 border-b-2 border-rally-accent rounded-t-md z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Status */}
        <div className="flex items-center ml-auto sm:ml-0 gap-3">
          {formattedLastUpdated && (
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[9px] text-white/50 uppercase tracking-wider">Última act.</span>
              <span className="text-xs font-mono text-rally-accent">{formattedLastUpdated}</span>
            </div>
          )}

          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95"
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

        {/* Mobile Nav */}
        <nav className="sm:hidden w-full flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs font-medium relative pb-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const isLive = link.path === '/en-vivo';
            return (
              <Link 
                key={link.path}
                href={link.path} 
                className={`relative py-1.5 px-3 flex-1 text-center transition-colors ${
                  isActive 
                    ? (isLive ? 'text-rally-accent' : 'text-white') 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 bg-white/5 rounded-md border-b-2 border-rally-accent z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1">
                  {isLive && isActive && <span className="w-1.5 h-1.5 rounded-full bg-rally-accent animate-pulse"></span>}
                  {link.name === 'Tiempos en Vivo' ? 'Tiempos' : link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
