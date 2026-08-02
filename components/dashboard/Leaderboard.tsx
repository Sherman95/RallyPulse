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
      <div className="p-8 text-center text-rally-muted border border-dashed border-rally-border rounded-xl bg-rally-surface shadow-sm">
        Los resultados aún no están disponibles o el tramo no ha comenzado.
      </div>
    );
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) {
      return (
        <svg className="w-5 h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
        </svg>
      );
    }
    if (position === 2) {
      return (
        <svg className="w-4 h-4 text-[#C0C0C0]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
        </svg>
      );
    }
    if (position === 3) {
      return (
        <svg className="w-4 h-4 text-[#CD7F32]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
        </svg>
      );
    }
    return <span className="text-rally-hint text-sm font-bold">{position}</span>;
  };

  return (
    <div className="w-full">
      {/* Vista Desktop (Tabla Clásica) */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {!hideHeader && (
            <thead>
              <tr className="border-b border-rally-border text-[10px] font-bold text-rally-hint uppercase tracking-widest bg-rally-surface">
                <th className="py-3 px-2 w-8 text-center">#</th>
                <th className="py-3 px-2 w-12">No.</th>
                <th className="py-3 px-2">Piloto</th>
                <th className="py-3 px-2 text-right">Tiempo</th>
                <th className="py-3 px-2 text-right">Dif.</th>
              </tr>
            </thead>
          )}
          <tbody>
            {results.map((result, index) => {
              const position = index + 1;
              return (
                <tr 
                  key={result.numero}
                  onClick={() => onPilotClick && onPilotClick(result)}
                  className={`border-b border-rally-border transition-colors ${onPilotClick ? 'cursor-pointer' : ''} ${
                    position === 1
                      ? 'bg-rally-gold/10' 
                      : 'bg-rally-surface2 hover:bg-rally-surface'
                  }`}
                >
                  <td className="py-3 px-2 text-center w-12">
                    <div className="flex justify-center items-center h-full w-full">
                      {getPositionIcon(position)}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[11px] text-rally-muted font-mono">
                    #{result.numero}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col items-start gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-rally-txt leading-tight">{result.piloto}</span>
                        <span className="text-xs text-rally-muted">/ {result.copiloto}</span>
                      </div>
                      <CategoryBadge cat={result.categoria} />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-rally-txt font-mono tabular-nums whitespace-nowrap">
                    {result.tiempo}
                  </td>
                  <td className={`py-3 px-2 text-right text-xs font-mono font-bold tabular-nums whitespace-nowrap ${
                    position === 1 ? 'text-rally-hint' : 'text-rally-gap'
                  }`}>
                    {position === 1 ? '—' : result.diferencia}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista Móvil (Tarjetas) */}
      <div className="md:hidden flex flex-col gap-3 pb-4">
        {results.map((result, index) => {
          const position = index + 1;
          const isFirst = position === 1;

          return (
            <div 
              key={result.numero}
              onClick={() => onPilotClick && onPilotClick(result)}
              className={`flex items-center gap-3 p-3 rounded-xl border ${onPilotClick ? 'cursor-pointer active:scale-[0.98]' : ''} transition-all ${
                isFirst 
                  ? 'bg-gradient-to-r from-rally-gold/10 to-rally-surface border-rally-gold/30' 
                  : 'bg-rally-surface border-rally-border shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center justify-center min-w-[32px] gap-1">
                {getPositionIcon(position)}
                <span className="text-[10px] text-rally-muted font-mono bg-rally-bg px-1.5 rounded-sm">
                  #{result.numero}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-rally-txt truncate leading-tight">
                    {result.piloto}
                  </span>
                  <span className="text-[10px] text-rally-muted truncate leading-tight mb-1.5">
                    / {result.copiloto}
                  </span>
                  <CategoryBadge cat={result.categoria} />
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-mono font-bold text-rally-txt bg-rally-bg px-2 py-0.5 rounded border border-rally-surface2">
                  {result.tiempo}
                </span>
                <span className={`text-[10px] font-mono font-bold tabular-nums ${isFirst ? 'text-rally-hint' : 'text-rally-gap'}`}>
                  {isFirst ? 'GANADOR' : result.diferencia}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
