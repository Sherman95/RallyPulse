"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ItineraryTimeline from '@/components/itinerario/ItineraryTimeline';
import { motion } from 'framer-motion';

export default function ItinerarioPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-rally-accent/20">
      <Header />

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 bg-rally-bg overflow-x-hidden">
        <div className="w-full max-w-5xl">
          
          <div className="mb-10 text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter uppercase transition-colors"
            >
              Itinerario <span className="text-rally-accent">Oficial</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 dark:text-rally-muted mt-2 text-lg transition-colors"
            >
              Planifica tu ruta. Conoce todos los tiempos, tramos cronometrados y enlaces de la Vuelta a la República.
            </motion.p>
          </div>

          {/* Área de Contenido: Solo Timeline */}
          <div className="w-full pb-16 min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ItineraryTimeline />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
