"use client";

import React, { useEffect } from 'react';
import { EnrichedRallyResult, EnrichedProcessedResults } from '@/lib/mergeDrivers';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface PilotDetailModalProps {
  pilot: EnrichedRallyResult | null;
  allData: EnrichedProcessedResults | null;
  onClose: () => void;
}

export default function PilotDetailModal({ pilot, allData, onClose }: PilotDetailModalProps) {
  // Evitar scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (pilot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pilot]);

  if (!pilot || !allData) return null;

  // Extraer los tiempos del piloto en cada TC
  const stageTimes: { tcId: string; tiempo: string; posicion: number }[] = [];
  
  for (const tcId of Object.keys(allData.stages)) {
    const stageResults = allData.stages[tcId];
    const pilotInStage = stageResults.find(r => r.numero === pilot.numero);
    if (pilotInStage) {
      stageTimes.push({
        tcId,
        tiempo: pilotInStage.tiempo,
        posicion: pilotInStage.posicion
      });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop oscuro */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-rally-surface rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-rally-surface">
        
        {/* Botón Cerrar (Flotante) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-rally-bg border border-rally-surface text-rally-muted hover:text-rally-txt transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header del Piloto */}
        <div className="bg-rally-bg px-6 pt-8 pb-6 border-b border-rally-surface flex flex-col items-center text-center relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl font-black text-2xl mb-4 bg-rally-accent text-white shadow-lg shadow-rally-accent/20">
            #{pilot.numero}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge cat={pilot.categoria} />
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest px-2.5 py-1">
              Pos. General: {pilot.posicion}
            </span>
          </div>

          <h3 className="text-xl font-bold text-rally-txt leading-tight">
            {pilot.piloto}
          </h3>
          <p className="text-sm font-medium text-rally-muted mt-1">
            Copiloto: {pilot.copiloto || "N/A"}
          </p>
          <p className="text-xs font-semibold text-rally-muted mt-2">
            🚗 {pilot.vehiculo}
          </p>
        </div>

        {/* Tiempos por Tramo (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-rally-surface p-6">
          <h4 className="text-xs font-bold text-rally-muted uppercase tracking-widest mb-4 ml-1">
            Tiempos por Tramo (TC)
          </h4>
          
          {stageTimes.length === 0 ? (
            <div className="text-center py-8 text-sm text-rally-muted bg-rally-bg rounded-xl border border-rally-surface">
              Este vehículo aún no registra tiempos en ningún tramo.
            </div>
          ) : (
            <div className="space-y-3">
              {stageTimes.map(st => (
                <div key={st.tcId} className="flex items-center justify-between bg-rally-surface border border-rally-surface rounded-xl p-4 shadow-sm hover:border-rally-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rally-bg border border-rally-surface flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-rally-muted leading-none mb-0.5">POS</span>
                      <span className="text-sm font-black text-rally-txt leading-none tabular-nums">{st.posicion}</span>
                    </div>
                    <span className="font-bold text-rally-txt">{st.tcId}</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-rally-txt tabular-nums">
                    {st.tiempo}
                  </span>
                </div>
              ))}
              
              <div className="flex items-center justify-between bg-rally-bg border border-rally-surface rounded-xl p-4 shadow-sm mt-6">
                <span className="font-bold text-rally-txt">Tiempo General Total</span>
                <span className="font-mono text-lg font-bold text-rally-accent tabular-nums">
                  {pilot.tiempo}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
