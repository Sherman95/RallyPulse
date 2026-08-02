"use client";

import React, { useState, useEffect } from 'react';
import { useLiveResults } from '@/hooks/useLiveResults';
import CategoryTabs from './CategoryTabs';
import Leaderboard from './Leaderboard';
import StageNav from './StageNav';
import StageInfo from './StageInfo';
import PilotDetailModal from './PilotDetailModal';
import { CategoryTabsSkeleton } from '@/components/ui/Skeletons';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';
import { getCurrentEvent, ActiveEvent, groupStageKeysByEtapa, getEventForStageKey, getAllEtapaNames } from '@/lib/itineraryHelper';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveDashboardProps {
  onStatusChange: (status: any, lastUpdated: Date | null) => void;
}

export default function LiveDashboard({ onStatusChange }: LiveDashboardProps) {
  const { data, status, lastUpdated, isFirstLoad } = useLiveResults();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEtapa, setSelectedEtapa] = useState<string>("Absoluta");
  const [selectedStage, setSelectedStage] = useState<string>("General");
  const [selectedPilot, setSelectedPilot] = useState<EnrichedRallyResult | null>(null);
  
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);

  useEffect(() => {
    onStatusChange(status, lastUpdated);
  }, [status, lastUpdated, onStatusChange]);

  useEffect(() => {
    // Calculamos el evento actual (solo en el cliente)
    const currentEvent = getCurrentEvent();
    setActiveEvent(currentEvent);
    
    // Auto-seleccionar la etapa del día (solo en la carga inicial)
    if (isFirstLoad && currentEvent && currentEvent.etapa) {
      setSelectedEtapa(currentEvent.etapa);
    }
    
    // Recalcular cada minuto
    const interval = setInterval(() => {
      setActiveEvent(getCurrentEvent());
    }, 60000);
    return () => clearInterval(interval);
  }, [isFirstLoad]);

  if (isFirstLoad) {
    return (
      <div className="w-full">
        <CategoryTabsSkeleton />
      </div>
    );
  }

  if (!data || (!data.general && Object.keys(data.stages).length === 0)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-rally-surface bg-rally-surface p-8 sm:py-24 text-center shadow-sm">
        <div className="rounded-full bg-rally-bg p-4 ring-1 ring-inset ring-rally-surface mb-6">
          <svg className="w-8 h-8 text-rally-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium tracking-tight text-rally-txt">Sin Resultados</h2>
        <p className="mt-3 text-sm text-rally-muted max-w-md">No pudimos obtener información válida del Rally. Asegúrate de que el documento tenga información válida.</p>
      </div>
    );
  }

  // 1. Determinar los datos del tramo seleccionado
  const groupedEtapas = data.stages ? groupStageKeysByEtapa(Object.keys(data.stages)) : [];
  
  // Extraemos todos los nombres de etapas desde el JSON para que siempre existan las pestañas
  const baseEtapaNames = getAllEtapaNames();
  // Si en la data agrupada resulta un "EXTRA" que no estaba en el JSON, lo agregamos
  if (groupedEtapas.some(g => g.etapa === "EXTRA") && !baseEtapaNames.includes("EXTRA")) {
    baseEtapaNames.push("EXTRA");
  }
  const allEtapaNames = ["Absoluta", ...baseEtapaNames];
  
  // Si la etapa seleccionada no existe (por si se cambió el URL o datos), fallback a Absoluta
  const currentEtapaId = allEtapaNames.includes(selectedEtapa) ? selectedEtapa : "Absoluta";
  
  // Obtener los stages disponibles para la etapa actual
  let availableStagesForEtapa: string[] = [];
  if (currentEtapaId !== "Absoluta") {
    const group = groupedEtapas.find(g => g.etapa === currentEtapaId);
    if (group) availableStagesForEtapa = group.keys;
  }

  // Fallback de selectedStage
  const currentStageId = currentEtapaId === "Absoluta" 
    ? "General" 
    : (selectedStage !== "General" && !availableStagesForEtapa.includes(selectedStage) 
        ? "General" 
        : selectedStage);

  // Obtener datos del array correcto
  let currentStageData: any[] = [];
  if (currentEtapaId === "Absoluta") {
    currentStageData = data.general || [];
  } else {
    if (currentStageId === "General") {
      // General de la etapa
      currentStageData = data.etapas?.[currentEtapaId] || [];
    } else {
      // TC específico
      currentStageData = data.stages?.[currentStageId] || [];
    }
  }

  // 2. Lógica de Búsqueda Global
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching 
    ? currentStageData.filter(r => {
        const query = searchQuery.toLowerCase();
        return (
          r.piloto.toLowerCase().includes(query) ||
          r.numero.toString().includes(query) ||
          r.copiloto.toLowerCase().includes(query) ||
          r.vehiculo.toLowerCase().includes(query) ||
          r.categoria.toLowerCase().includes(query)
        );
      })
    : [];

  // Determinar el evento a mostrar en el banner
  let displayedEvent: ActiveEvent | null = null;

  if (currentEtapaId === "SUPER PRIME") {
    // Si estamos en cualquier pestaña del Super Prime, siempre mostramos la info del SUPER PRIME
    const matchedEvent = getEventForStageKey("SP");
    if (matchedEvent) {
      const isActuallyNow = activeEvent?.actividad === matchedEvent.actividad;
      displayedEvent = { ...matchedEvent, isNow: isActuallyNow };
    }
  } else if (currentStageId !== "General") {
    // Para TCs específicos de una etapa normal, mostramos la info de ese TC
    const matchedEvent = getEventForStageKey(currentStageId);
    if (matchedEvent) {
      const isActuallyNow = activeEvent?.actividad === matchedEvent.actividad;
      displayedEvent = { ...matchedEvent, isNow: isActuallyNow };
    }
  } else {
    // Para la vista Absoluta o el Acumulado de una Etapa regular, mostramos el evento que está "Corriendo Ahora" globalmente
    displayedEvent = activeEvent;
  }

  // Determinar si el evento a mostrar ya terminó según los tiempos
  let displayedEventFinished = false;
  if (displayedEvent && data?.general && data.general.length > 0) {
    if (currentStageId !== "General") {
      const tcData = data.stages[currentStageId];
      if (tcData && tcData.length >= data.general.length) {
        displayedEventFinished = true;
      }
    } else {
      // Si estamos en la vista General, dependemos del evento global
      let tcKey = "";
      if (displayedEvent.actividad.startsWith("TC")) {
        tcKey = displayedEvent.actividad.split(":")[0];
      } else {
        const actUpper = displayedEvent.actividad.toUpperCase();
        const possibleKey = Object.keys(data.stages).find(k => k.includes(actUpper) || actUpper.includes(k));
        if (possibleKey) tcKey = possibleKey;
      }
  
      if (tcKey && data.stages[tcKey]) {
        const tcData = data.stages[tcKey];
        if (tcData.length >= data.general.length) {
          displayedEventFinished = true;
        }
      }
    }
  }

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      
      {/* Banner de Evento Activo / Próximo / Seleccionado */}
      {displayedEvent && (
        <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 mb-4">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border ${(displayedEvent.isNow && !displayedEventFinished) ? 'bg-rally-accent/10 border-rally-accent/30' : 'bg-rally-surface2 border-rally-border'}`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {displayedEvent.isNow && !displayedEventFinished && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rally-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rally-accent"></span>
                  </span>
                )}
                <span className={`text-xs font-bold uppercase tracking-wider ${(displayedEvent.isNow && !displayedEventFinished) ? 'text-rally-accent' : 'text-rally-muted'}`}>
                  {displayedEventFinished ? 'Culminado' : displayedEvent.isNow ? 'Corriendo Ahora' : 'Programado'}
                </span>
                <span className="text-[10px] text-rally-muted px-2 py-0.5 rounded-full bg-black/20 border border-white/5">
                  {displayedEvent.startTime.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-rally-txt mt-1">
                {displayedEvent.etapa} <span className="text-rally-muted mx-1">•</span> {displayedEvent.actividad}
              </div>
              {displayedEvent.lugar && (
                <div className="text-xs text-rally-muted flex items-center gap-1 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {displayedEvent.lugar}
                </div>
              )}
            </div>
            <div className="mt-3 sm:mt-0 flex flex-col sm:items-end bg-black/20 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
              <span className="text-xs text-rally-muted mb-0.5 hidden sm:block">Horario</span>
              <span className="text-sm font-mono font-bold text-rally-txt">
                {displayedEvent.startTime.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })} 
                {displayedEvent.endTime && ` - ${displayedEvent.endTime.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Etapas (Navegación Primaria) */}
      {!isSearching && (
        <div className="w-full overflow-x-auto no-scrollbar border-b border-rally-surface mb-4">
          <div className="flex gap-2 p-2 max-w-5xl mx-auto">
            {allEtapaNames.map(etapa => (
              <button
                key={etapa}
                onClick={() => {
                  setSelectedEtapa(etapa);
                  setSelectedStage("General");
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  currentEtapaId === etapa 
                    ? "bg-rally-accent text-white shadow-md" 
                    : "bg-rally-surface2 text-rally-muted hover:text-rally-txt hover:bg-rally-surface"
                }`}
              >
                {etapa === "Absoluta" ? "Vuelta (General)" : etapa}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navegación por Tramos (Independiente de la búsqueda) solo si no es Absoluta */}
      {currentEtapaId !== "Absoluta" && (
        <StageNav 
          stages={availableStagesForEtapa} 
          selectedStage={currentStageId} 
          onSelectStage={setSelectedStage} 
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStageId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full flex flex-col"
        >
          <StageInfo 
            stageId={currentStageId} 
            isAutoFinished={
              currentStageId !== "General" && 
              data.general && 
              data.general.length > 0 && 
              currentStageData.length >= data.general.length
            }
          />

          {/* Buscador Global (Light Mode) */}
          <div className="w-full mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-rally-muted" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Buscar en ${currentStageId}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-rally-surface rounded-xl leading-5 bg-rally-surface placeholder-rally-muted text-rally-txt focus:outline-none focus:ring-2 focus:ring-rally-accent focus:border-rally-accent text-sm shadow-sm transition-all"
            />
            {isSearching && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-rally-muted hover:text-rally-txt"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {isSearching ? (
            <div className="flex flex-col bg-rally-surface rounded-xl shadow-sm border border-rally-surface p-3 sm:p-6 min-h-[50vh]">
              <h2 className="text-lg font-bold text-rally-txt mb-6 flex items-center gap-2">
                Resultados de búsqueda
                <span className="bg-rally-bg text-rally-muted px-2 py-0.5 rounded-full text-xs font-semibold border border-rally-surface">
                  {searchResults.length}
                </span>
              </h2>
              {searchResults.length > 0 ? (
                <Leaderboard results={searchResults} hideHeader onPilotClick={setSelectedPilot} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-rally-muted">
                  <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>No se encontraron resultados para "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
            <CategoryTabs results={currentStageData} onPilotClick={setSelectedPilot} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal de Detalle de Piloto */}
      <PilotDetailModal 
        pilot={selectedPilot} 
        allData={data} 
        onClose={() => setSelectedPilot(null)} 
      />
    </div>
  );
}
