"use client";

import React, { useState, useEffect } from 'react';
import { useLiveResults } from '@/hooks/useLiveResults';
import CategoryTabs from './CategoryTabs';
import Diagnostics from './Diagnostics';
import Leaderboard from './Leaderboard';
import StageNav from './StageNav';
import StageInfo from './StageInfo';
import PilotDetailModal from './PilotDetailModal';
import { CategoryTabsSkeleton } from '@/components/ui/Skeletons';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';

interface LiveDashboardProps {
  onStatusChange: (status: any, lastUpdated: Date | null) => void;
}

export default function LiveDashboard({ onStatusChange }: LiveDashboardProps) {
  const { data, status, lastUpdated, isFirstLoad } = useLiveResults();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("General");
  const [selectedPilot, setSelectedPilot] = useState<EnrichedRallyResult | null>(null);

  useEffect(() => {
    onStatusChange(status, lastUpdated);
  }, [status, lastUpdated, onStatusChange]);

  if (isFirstLoad) {
    return (
      <div className="w-full">
        <CategoryTabsSkeleton />
      </div>
    );
  }

  if (!data || (!data.general && Object.keys(data.stages).length === 0)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-rally-border bg-rally-surface p-8 sm:py-24 text-center shadow-sm">
        <div className="rounded-full bg-rally-bg p-4 ring-1 ring-inset ring-rally-border mb-6">
          <svg className="w-8 h-8 text-rally-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium tracking-tight text-rally-text">Sin Resultados</h2>
        <p className="mt-3 text-sm text-rally-muted max-w-md">No pudimos obtener información válida del Rally. Asegúrate de que el documento tenga información válida.</p>
      </div>
    );
  }

  // 1. Determinar los datos del tramo seleccionado
  const availableStages = Object.keys(data.stages).sort();
  
  // Si el stage seleccionado no existe, hacer fallback a General
  const currentStageId = selectedStage !== "General" && !availableStages.includes(selectedStage) 
    ? "General" 
    : selectedStage;

  const currentStageData = currentStageId === "General" 
    ? data.general 
    : data.stages[currentStageId] || [];

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

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      
      {/* Navegación por Tramos (Independiente de la búsqueda) */}
      <StageNav 
        stages={availableStages} 
        selectedStage={currentStageId} 
        onSelectStage={setSelectedStage} 
      />

      <StageInfo stageId={currentStageId} />

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
          className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-rally-border rounded-xl leading-5 bg-rally-surface placeholder-rally-muted text-rally-text focus:outline-none focus:ring-2 focus:ring-rally-accent focus:border-rally-accent sm:text-sm shadow-sm transition-all"
        />
        {isSearching && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-rally-muted hover:text-rally-text"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isSearching ? (
        <div className="flex flex-col bg-rally-surface rounded-xl shadow-sm border border-rally-border p-3 sm:p-6 min-h-[50vh]">
          <h2 className="text-lg font-bold text-rally-text mb-6 flex items-center gap-2">
            Resultados de búsqueda
            <span className="bg-rally-bg text-rally-muted px-2 py-0.5 rounded-full text-xs font-semibold border border-rally-border">
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

      {/* Solo mostramos el diagnóstico con los datos Generales para evaluar cobertura total */}
      <Diagnostics results={data.general} />

      {/* Modal de Detalle de Piloto */}
      <PilotDetailModal 
        pilot={selectedPilot} 
        allData={data} 
        onClose={() => setSelectedPilot(null)} 
      />
    </div>
  );
}
