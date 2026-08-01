import React from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from '@/components/home/HeroCarousel';
import SafetyBanner from '@/components/home/SafetyBanner';
import SafetyGuidelines from '@/components/home/SafetyGuidelines';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-rally-accent/20 overflow-x-hidden w-full">
      <Header />
      
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-rally-nav">
          <div className="absolute inset-0 z-0">
            {/* Si tienes una imagen del evento, la puedes poner aquí: */}
            <div className="absolute inset-0 bg-gradient-to-t from-rally-nav via-rally-nav/80 to-transparent z-10" />
            <HeroCarousel />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-rally-accent font-bold tracking-widest uppercase text-sm mb-4 bg-rally-accent/10 px-3 py-1 rounded-full border border-rally-accent/20 shadow-[0_0_15px_rgba(255,100,0,0.3)]">
              FEDAK 2025
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg leading-tight">
              VUELTA A LA <br />
              <span className="text-rally-accent">REPÚBLICA</span>
            </h1>
            <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-medium drop-shadow-md">
              El evento automovilístico más grande del país. Sigue los tiempos, 
              resultados y noticias minuto a minuto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link 
                href="/en-vivo" 
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-rally-accent hover:bg-rally-accent/90 rounded-lg shadow-[0_0_20px_rgba(255,100,0,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Tiempos en Vivo
              </Link>
              <Link 
                href="/itinerario" 
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-black/40 hover:bg-black/60 border border-white/20 rounded-lg transition-all backdrop-blur-md"
              >
                Ver Itinerario
              </Link>
            </div>
          </div>
        </section>

        {/* Grid de Accesos Rápidos */}
        <section className="py-16 px-4 bg-rally-surface relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Link href="/en-vivo" className="group bg-rally-surface2 border border-rally-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-rally-accent/50 flex flex-col">
                <div className="w-12 h-12 bg-rally-accent/10 rounded-xl flex items-center justify-center text-rally-accent mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-rally-txt mb-2">Tiempos en Vivo</h3>
                <p className="text-rally-muted text-sm flex-1">Sigue el cronometraje en tiempo real de cada tramo y etapa.</p>
                <div className="mt-4 text-rally-accent text-sm font-bold flex items-center">
                  Ir al Dashboard <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>

              <Link href="/inscritos" className="group bg-rally-surface2 border border-rally-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-rally-gold/50 flex flex-col cursor-pointer">
                <div className="w-12 h-12 bg-rally-gold/10 rounded-xl flex items-center justify-center text-rally-gold mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-rally-txt mb-2">Lista de Inscritos</h3>
                <p className="text-rally-muted text-sm flex-1">Conoce a todos los pilotos, navegantes y sus vehículos.</p>
                <div className="mt-4 text-rally-gold text-sm font-bold flex items-center">
                  Ver Inscritos <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>

              <Link href="/itinerario" className="group bg-rally-surface2 border border-rally-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-blue-500/50 flex flex-col cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-rally-txt mb-2">Itinerario y Mapas</h3>
                <p className="text-rally-muted text-sm flex-1">Consulta los horarios oficiales, súper primes y mapas de etapa.</p>
                <div className="mt-4 text-blue-500 text-sm font-bold flex items-center">
                  Ver Itinerario <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* Recomendaciones y Advertencias de Seguridad */}
        <SafetyGuidelines />

      </main>
      <Footer />
    </div>
  );
}
