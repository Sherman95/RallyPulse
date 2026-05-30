import React from 'react';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface LeaderboardProps {
  results: EnrichedRallyResult[];
  hideHeader?: boolean;
  onPilotClick?: (pilot: EnrichedRallyResult) => void;
}

export default function Leaderboard({ results, hideHeader = false, onPilotClick }: LeaderboardProps) {
  if (!results || results.length === 0) {
    return (
      <div className="p-8 text-center text-rally-muted border border-dashed border-rally-border rounded-xl bg-rally-bg shadow-sm">
        Los resultados aún no están disponibles o el tramo no ha comenzado.
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* Cabecera de la Tabla (Visible en desktop) */}
      {!hideHeader && (
        <div className="hidden md:flex items-center px-4 py-3 text-[10px] font-bold text-rally-muted uppercase tracking-widest border-b border-rally-border bg-rally-bg rounded-t-lg">
          <div className="w-16 text-center">Pos</div>
          <div className="flex-1">Tripulación</div>
          <div className="hidden lg:block w-40">Vehículo</div>
          <div className="w-24 text-right">Tiempo</div>
          <div className="w-24 text-right">Diferencia</div>
        </div>
      )}

      {/* Contenedor principal de filas/tarjetas */}
      <div className="flex flex-col gap-2.5 md:gap-0 mt-4 md:mt-0 pb-10">
        {results.map((result) => (
          <div 
            key={result.numero} 
            onClick={() => onPilotClick && onPilotClick(result)}
            className={`flex flex-col md:flex-row md:items-center bg-rally-surface border border-rally-border md:border-x-0 md:border-t-0 md:border-b md:border-b-rally-bg rounded-lg md:rounded-none p-3 sm:p-4 md:px-4 md:py-3 transition-colors ${onPilotClick ? 'cursor-pointer hover:bg-rally-bg' : 'hover:bg-rally-bg/50'}`}
          >
            
            {/* Móvil: Barra Superior (Pos + Categoría) | Desktop: Columna Pos */}
            <div className="flex justify-between items-center mb-3 md:mb-0 md:w-16">
              <div className="flex items-center justify-center bg-rally-accent text-white font-black rounded-xl h-8 w-8 md:bg-transparent md:text-rally-muted md:font-semibold md:text-base md:h-auto md:w-full md:justify-center">
                {result.posicion}
              </div>
              <div className="md:hidden">
                <CategoryBadge cat={result.categoria} />
              </div>
            </div>

            {/* Centro: Piloto & Número */}
            <div className="flex-1 mb-3 md:mb-0 pl-1 md:pl-2">
              <h4 className="font-bold text-rally-text leading-tight text-lg md:text-base">
                {result.piloto}
              </h4>
              <div className="flex items-center gap-2 mt-1 md:mt-0.5">
                <span className="text-xs font-medium text-rally-muted">
                  Auto #{result.numero}
                </span>
                {/* Ocultamos copiloto en móvil */}
                {result.copiloto && (
                  <span className="hidden md:inline text-xs text-rally-muted ml-2">
                    <span className="opacity-50">/</span> {result.copiloto}
                  </span>
                )}
                <div className="hidden md:block">
                  <CategoryBadge cat={result.categoria} />
                </div>
              </div>
            </div>

            {/* Vehículo (Solo en pantallas muy grandes) */}
            <div className="hidden lg:block w-40 pr-4 text-xs text-rally-muted truncate">
              {result.vehiculo}
            </div>

            {/* Derecha/Abajo: Tiempos */}
            <div className="flex justify-between items-end pt-3 border-t border-rally-border md:pt-0 md:border-0 md:w-48 md:flex-row md:items-center">
              <div className="md:hidden text-[10px] font-bold text-rally-muted uppercase tracking-widest">
                Tiempo Total
              </div>
              
              <div className="flex flex-col items-end md:flex-row md:w-full md:justify-between md:items-center gap-1 md:gap-0">
                <span className="font-mono tabular-nums text-lg md:text-sm font-bold text-rally-text md:w-24 md:text-right">
                  {result.tiempo}
                </span>
                <span className="font-mono tabular-nums text-sm text-rally-accent md:w-24 md:text-right font-medium">
                  {result.diferencia}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
