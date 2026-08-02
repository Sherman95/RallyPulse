"use client";

import React from 'react';
import { motion } from 'framer-motion';

const etapas = [
  { id: "1", num: "1", title: "El Oro - Loja", date: "Domingo 2 de Agosto" },
  { id: "2", num: "2", title: "Loja - Azuay", date: "Lunes 3 de Agosto" },
  { id: "3", num: "3", title: "Azuay - Chimborazo", date: "Miércoles 5 de Agosto" },
  { id: "4", num: "4", title: "Chimborazo - Tungurahua", date: "Jueves 6 de Agosto" },
  { id: "5", num: "5", title: "Tungurahua - Imbabura", date: "Sábado 8 de Agosto" },
];

export default function RouteTimeline() {
  return (
    <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            La <span className="text-rally-accent">Ruta</span> 2026
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mt-4 text-lg"
          >
            Siete provincias, cinco etapas, una sola leyenda.
          </motion.p>
        </div>

        <div className="relative">
          {/* Línea central */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full transform md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {etapas.map((etapa, index) => (
              <motion.div 
                key={etapa.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Punto central */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-950 border-4 border-rally-accent transform -translate-x-[14px] md:-translate-x-1/2 shadow-[0_0_15px_rgba(255,100,0,0.5)] z-10">
                  <div className="absolute inset-0 bg-rally-accent rounded-full animate-ping opacity-20"></div>
                </div>

                {/* Tarjeta de información */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'
                }`}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                    <span className="text-rally-accent font-bold tracking-widest text-sm uppercase mb-2 block">
                      Etapa {etapa.num}
                    </span>
                    <h3 className="text-2xl font-black text-white uppercase group-hover:text-rally-accent transition-colors">
                      {etapa.title}
                    </h3>
                    <p className="text-slate-400 mt-2 font-medium">
                      {etapa.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
