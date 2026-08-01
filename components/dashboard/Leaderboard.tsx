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

  return (
    <div className="w-full overflow-x-auto">
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
                <td className="py-2 sm:py-3 px-2 text-center text-xs sm:text-sm font-bold w-10 sm:w-12">
                  {position === 1 ? (
                    <div className="flex justify-center items-center h-full w-full">
                      <svg className="w-5 h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
                      </svg>
                    </div>
                  ) : position === 2 ? (
                    <div className="flex justify-center items-center h-full w-full">
                      <svg className="w-4 h-4 text-[#C0C0C0]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
                      </svg>
                    </div>
                  ) : position === 3 ? (
                    <div className="flex justify-center items-center h-full w-full">
                      <svg className="w-4 h-4 text-[#CD7F32]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15l-4.2 2.7.8-5L5 8.2l5.1-.7L12 3l1.9 4.5 5.1.7-3.6 4.5.8 5z"/>
                      </svg>
                    </div>
                  ) : (
                    <span className="text-rally-hint">{position}</span>
                  )}
                </td>
                <td className="py-2 sm:py-3 px-2 text-[10px] sm:text-[11px] text-rally-muted font-mono">
                  #{result.numero}
                </td>
                <td className="py-2 sm:py-3 px-2">
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-rally-txt leading-tight">{result.piloto}</span>
                      <span className="text-[10px] sm:text-xs text-rally-muted">/ {result.copiloto}</span>
                    </div>
                    <CategoryBadge cat={result.categoria} />
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 text-right text-xs sm:text-sm text-rally-txt font-mono tabular-nums whitespace-nowrap">
                  {result.tiempo}
                </td>
                <td className={`py-2 sm:py-3 px-2 text-right text-[10px] sm:text-xs font-mono font-bold tabular-nums whitespace-nowrap ${
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
  );
}
