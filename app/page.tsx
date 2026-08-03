"use client";

import React from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from '@/components/home/HeroCarousel';
import SpectatorGuide from '@/components/home/SpectatorGuide';
import Marquee from '@/components/home/Marquee';
import RouteTimeline from '@/components/home/RouteTimeline';
import TiltCard from '@/components/ui/TiltCard';
import SafetyBanner from '@/components/home/SafetyBanner';
import { motion, Variants } from 'framer-motion';


const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-rally-accent/20 overflow-x-hidden w-full bg-rally-bg">
      <Header />
      <SafetyBanner />
      
      <main className="flex-1 flex flex-col w-full overflow-hidden relative">
        {/* Background Animado de Orbes (Cyberpunk/Premium Vibe) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rally-accent/20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full min-h-[65vh] flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-0 opacity-50">
            <HeroCarousel />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10" />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-10 pb-16"
          >
            <motion.span variants={itemVariants} className="text-rally-accent font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-6 bg-rally-accent/10 px-4 py-1.5 rounded-full border border-rally-accent/30 shadow-[0_0_20px_rgba(255,100,0,0.2)] backdrop-blur-md inline-block text-white">
              FEDAK 2026
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter mb-4 sm:mb-6 leading-[1.1] drop-shadow-2xl">
              VUELTA A LA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rally-accent via-orange-400 to-yellow-500">REPÚBLICA</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-slate-300 text-base sm:text-2xl max-w-3xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed drop-shadow-md px-2">
              Vive la adrenalina del automovilismo ecuatoriano. Tiempos en vivo, 
              resultados oficiales y cobertura total minuto a minuto.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center w-full sm:w-auto mt-2 sm:mt-4 px-4 sm:px-0">
              <Link 
                href="/en-vivo" 
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-rally-accent hover:bg-orange-600 rounded-xl shadow-[0_0_30px_rgba(255,100,0,0.3)] hover:shadow-[0_0_40px_rgba(255,100,0,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Sigue los Tiempos
              </Link>
              
              <Link 
                href="/itinerario" 
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all backdrop-blur-md"
              >
                Cronograma Oficial
              </Link>
            </motion.div>

            {/* Barra de Estadísticas Pro */}
            <motion.div variants={itemVariants} className="mt-16 w-full max-w-4xl mx-auto hidden sm:grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div className="flex flex-col items-center justify-center border-r border-white/10">
                <span className="text-4xl font-black text-white drop-shadow-md mb-1">5</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Etapas</span>
              </div>
              <div className="flex flex-col items-center justify-center border-r border-white/10">
                <span className="text-4xl font-black text-white drop-shadow-md mb-1">35</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Tripulaciones</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white drop-shadow-md mb-1">+1000<span className="text-xl text-rally-accent ml-1">km</span></span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">De Recorrido</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Cinta Infinita de Categorías (Marquee) */}
        <Marquee />

        {/* Grid de Accesos Rápidos */}
        <section className="py-10 sm:py-20 px-4 relative z-20">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
            >
              
              <motion.div variants={itemVariants} className="perspective-1000">
                <TiltCard>
                  <Link href="/en-vivo" className="group h-full bg-rally-surface/80 backdrop-blur-xl border border-rally-txt/5 rounded-3xl p-6 sm:p-8 hover:shadow-[0_10px_40px_rgba(255,100,0,0.1)] transition-all flex flex-col relative overflow-hidden block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rally-accent/10 rounded-full blur-3xl group-hover:bg-rally-accent/20 transition-colors"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rally-accent to-orange-600 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-rally-txt mb-2 sm:mb-3 relative z-10">Tiempos en Vivo</h3>
                    <p className="text-rally-muted text-sm sm:text-base flex-1 leading-relaxed relative z-10">Sigue el cronometraje en tiempo real de cada tramo y etapa, con líderes y diferencias.</p>
                    <div className="mt-4 sm:mt-6 text-rally-accent text-xs sm:text-sm font-bold flex items-center tracking-wide uppercase relative z-10">
                      Ir al Dashboard <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>

              <motion.div variants={itemVariants} className="perspective-1000">
                <TiltCard>
                  <Link href="/inscritos" className="group h-full bg-rally-surface/80 backdrop-blur-xl border border-rally-txt/5 rounded-3xl p-6 sm:p-8 hover:shadow-[0_10px_40px_rgba(255,215,0,0.1)] transition-all flex flex-col relative overflow-hidden block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rally-gold/10 rounded-full blur-3xl group-hover:bg-rally-gold/20 transition-colors"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-rally-gold rounded-2xl flex items-center justify-center text-black mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-rally-txt mb-2 sm:mb-3 relative z-10">Inscritos</h3>
                    <p className="text-rally-muted text-sm sm:text-base flex-1 leading-relaxed relative z-10">Conoce a todos los pilotos, navegantes y sus imponentes vehículos por categoría.</p>
                    <div className="mt-4 sm:mt-6 text-rally-gold text-xs sm:text-sm font-bold flex items-center tracking-wide uppercase relative z-10">
                      Ver Galería <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>

              <motion.div variants={itemVariants} className="perspective-1000">
                <TiltCard>
                  <Link href="/itinerario" className="group h-full bg-rally-surface/80 backdrop-blur-xl border border-rally-txt/5 rounded-3xl p-6 sm:p-8 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] transition-all flex flex-col relative overflow-hidden block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-rally-txt mb-2 sm:mb-3 relative z-10">Itinerario y Mapas</h3>
                    <p className="text-rally-muted text-sm sm:text-base flex-1 leading-relaxed relative z-10">Consulta los horarios oficiales de parque cerrado, súper primes y mapas interactivos.</p>
                    <div className="mt-4 sm:mt-6 text-blue-400 text-xs sm:text-sm font-bold flex items-center tracking-wide uppercase relative z-10">
                      Planificar <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
              
            </motion.div>
          </div>
        </section>

        {/* La Ruta (Línea de tiempo) */}
        <RouteTimeline />

        {/* Guía del Espectador */}
        <SpectatorGuide />

      </main>

      <Footer />
    </div>
  );
}
