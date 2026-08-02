"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SpectatorGuide() {
  return (
    <section className="py-24 px-4 bg-rally-bg relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        {/* Patrón de franjas de peligro (Safety stripes) */}
        <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ff0000 10px, #ff0000 20px)' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4 text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-rally-txt uppercase tracking-tight">
            Guía del <span className="text-red-500">Espectador</span>
          </h2>
          <p className="mt-4 text-rally-muted text-lg max-w-2xl mx-auto">
            Para disfrutar de la Vuelta a la República de manera segura, te pedimos seguir estrictamente las siguientes normativas de convivencia y seguridad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Recomendaciones */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-rally-surface/50 border border-green-500/20 rounded-3xl p-8 hover:border-green-500/40 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
            <h3 className="text-2xl font-bold text-rally-txt mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm">✓</span>
              Recomendaciones
            </h3>
            <ul className="space-y-4">
              {[
                "Ubícate únicamente en zonas autorizadas para espectadores.",
                "Respeta las cintas de seguridad y señalización. Si un área está delimitada, no ingreses.",
                "Consulta los mapas, horarios y comunicados oficiales antes de asistir.",
                "Llega con anticipación. Las vías se cierran antes del inicio de cada tramo.",
                "Sigue las instrucciones de los oficiales, comisarios y personal de seguridad.",
                "Mantén a los menores siempre bajo supervisión y en un lugar seguro.",
                "Lleva agua, gorra, protector solar y ropa adecuada.",
                "Estaciona únicamente en lugares permitidos.",
                "Conserva limpio el entorno y deposita los residuos en lugares adecuados.",
                "Mantén tu atención en la competencia y evita distracciones."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-rally-muted">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Advertencias */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-rally-surface/50 border border-red-500/20 rounded-3xl p-8 hover:border-red-500/40 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <h3 className="text-2xl font-bold text-rally-txt mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm">✗</span>
              Advertencias Prohibidas
            </h3>
            <ul className="space-y-4">
              {[
                "No cruces la pista mientras el tramo esté habilitado para competencia.",
                "No permanezcas en zonas marcadas como peligrosas ni sobre la cinta de seguridad.",
                "No retires, muevas o pases por encima de las cintas de seguridad.",
                "No ingreses a áreas restringidas o cerradas por la organización.",
                "No estaciones en curvas, escapatorias, accesos de emergencia o zonas de evacuación.",
                "Evita el consumo excesivo de bebidas alcohólicas.",
                "No utilices parlantes con volumen alto que impidan escuchar la aproximación de vehículos.",
                "No vueles drones sin autorización de la organización.",
                "No distraigas a los pilotos con luces, láseres, banderas u otros objetos.",
                "En caso de incidente, no invadas la pista y permite el acceso de los equipos de rescate."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-rally-muted">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
