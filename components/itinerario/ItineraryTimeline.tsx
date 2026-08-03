"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import itinerarioData from '@/data/itenerariovuelta2026.json';

interface Actividad {
  actividad?: string;
  tipo?: string;
  lugar?: string;
  horario?: string;
  tramo?: string;
  numero?: number;
}

export default function ItineraryTimeline() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate().toString();
    const searchString = ` ${currentDay} de `;

    for (let i = 0; i < itinerarioData.cronograma.length; i++) {
       const section: any = itinerarioData.cronograma[i];
       
       if (section.fecha && section.fecha.includes(searchString)) {
           setExpandedSection(i);
           return;
       }
       
       if (section.dias) {
           for (const dia of section.dias) {
               if (dia.fecha && dia.fecha.includes(searchString)) {
                   setExpandedSection(i);
                   return;
               }
           }
       }
    }
  }, []);

  const toggleSection = (index: number) => {
    setExpandedSection(prev => prev === index ? null : index);
  };

  const getIcon = (tipo?: string, actividad?: string) => {
    if (tipo === "TC" || actividad === "SUPER PRIME") {
      return (
        <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    if (tipo === "Asistencia") {
      return (
        <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getStyle = (tipo?: string, actividad?: string) => {
    if (tipo === "TC" || actividad === "SUPER PRIME") return "border-red-500 bg-red-100 dark:bg-red-500/10";
    if (tipo === "Asistencia") return "border-blue-500 bg-blue-100 dark:bg-blue-500/10";
    if (tipo === "Reagrupamiento") return "border-yellow-500 bg-yellow-100 dark:bg-yellow-500/10";
    return "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50";
  };

  const getDotStyle = (tipo?: string, actividad?: string) => {
    if (tipo === "TC" || actividad === "SUPER PRIME") return "bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]";
    if (tipo === "Asistencia") return "bg-blue-500 border-blue-500";
    if (tipo === "Reagrupamiento") return "bg-yellow-500 border-yellow-500";
    return "bg-slate-400 border-slate-400 dark:bg-slate-500 dark:border-slate-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 animate-in fade-in duration-700">
      {itinerarioData.cronograma.map((section: any, sectionIdx: number) => {
        
        const title = section.etapa ? `${section.etapa}: ${section.ruta}` : section.seccion;
        const date = section.fecha || "";
        const isExpanded = expandedSection === sectionIdx;

        return (
          <div key={sectionIdx} className="bg-white dark:bg-rally-surface/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
            
            {/* Header Accordion */}
            <button 
              onClick={() => toggleSection(sectionIdx)}
              className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
            >
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-rally-accent transition-colors">
                  {title}
                </h2>
                {date && <p className="text-slate-500 dark:text-rally-muted text-sm mt-1">{date}</p>}
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-rally-accent text-white dark:bg-rally-accent' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Content (Timeline) */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-slate-50 dark:bg-transparent"
                >
                  <div className="px-6 pb-8 pt-2 relative">
                    {/* Línea central */}
                    <div className="absolute left-11 top-6 bottom-8 w-[2px] bg-slate-200 dark:bg-white/10 rounded-full transition-colors"></div>

                    <div className="space-y-6">
                      
                      {/* Caso 1: Tiene "dias" (Super Prime / Revisiones) */}
                      {section.dias && section.dias.map((dia: any, diaIdx: number) => (
                        <div key={diaIdx} className="mb-6">
                          <h4 className="text-rally-accent font-bold text-sm tracking-widest uppercase ml-14 mb-4">{dia.fecha}</h4>
                          <div className="space-y-4">
                            {dia.actividades.map((act: Actividad, actIdx: number) => (
                              <div key={actIdx} className="relative flex items-start ml-2 group">
                                <div className={`absolute left-0 mt-1.5 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center ${getDotStyle(act.tipo, act.actividad)}`}></div>
                                <div className={`ml-12 p-4 w-full rounded-xl border-l-4 transition-colors ${getStyle(act.tipo, act.actividad)}`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h5 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">{act.actividad}</h5>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-white dark:bg-black/40 rounded-lg text-slate-900 dark:text-white shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent whitespace-nowrap">
                                      {getIcon(act.tipo, act.actividad)}
                                      {act.horario}
                                    </span>
                                  </div>
                                  {act.lugar && <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{act.lugar}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Caso 2: Tiene "cronograma" directo (Etapas) */}
                      {section.cronograma && section.cronograma.map((act: Actividad, actIdx: number) => (
                        <div key={actIdx} className="relative flex items-start ml-2 group">
                          <div className={`absolute left-0 mt-1.5 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center ${getDotStyle(act.tipo, act.tramo)}`}></div>
                          <div className={`ml-12 p-4 w-full rounded-xl border-l-4 transition-colors ${getStyle(act.tipo, act.tramo)}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                                  {act.tipo === "TC" ? `TC ${act.numero}: ${act.tramo}` : (act.tipo || "Enlace")}
                                </h5>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-white dark:bg-black/40 rounded-lg text-slate-900 dark:text-white shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent whitespace-nowrap">
                                {getIcon(act.tipo, act.tramo)}
                                {act.horario}
                              </span>
                            </div>
                            {act.lugar && <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{act.lugar}</p>}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
