import React from 'react';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatPenalty } from '@/lib/time';

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
              const hasPendingPenalty = result.penalizacionStatus === 'pending' && result.penalizacionMs && result.penalizacionMs > 0;
              return (
                <tr 
                  key={result.numero}
                  onClick={() => onPilotClick && onPilotClick(result)}
                  className={`border-b transition-colors ${onPilotClick ? 'cursor-pointer' : ''} ${
                    hasPendingPenalty 
                      ? 'bg-yellow-50/10 border-l-4 border-yellow-400 hover:bg-yellow-100/10'
                      : position === 1
                        ? 'bg-rally-gold/10 border-rally-border' 
                        : 'bg-rally-surface2 border-rally-border hover:bg-rally-surface'
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
                      <div className="flex items-center gap-2">
                        <CategoryBadge cat={result.categoria} />
                        {result.penalizacionMs && result.penalizacionMs > 0 ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950/30 px-1.5 py-0.5 rounded">
                            {formatPenalty(result.penalizacionMs)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {hasPendingPenalty && (
                        <span className="text-yellow-500" title={`Tiempo neto. Penalización de ${formatPenalty(result.penalizacionMs || 0)} no sumada al total.`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className={`text-sm font-mono tabular-nums whitespace-nowrap ${hasPendingPenalty ? 'text-yellow-600 dark:text-yellow-500 font-bold' : 'text-rally-txt'}`}>
                        {result.tiempo}
                      </span>
                    </div>
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
          const hasPendingPenalty = result.penalizacionStatus === 'pending' && result.penalizacionMs && result.penalizacionMs > 0;

          return (
            <div 
              key={result.numero}
              onClick={() => onPilotClick && onPilotClick(result)}
              className={`flex items-center gap-3 p-3 rounded-xl border ${onPilotClick ? 'cursor-pointer active:scale-[0.98]' : ''} transition-all ${
                hasPendingPenalty
                  ? 'bg-yellow-50/10 border-yellow-400'
                  : isFirst 
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
                  <div className="flex items-center gap-2">
                    <CategoryBadge cat={result.categoria} />
                    {result.penalizacionMs && result.penalizacionMs > 0 ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950/30 px-1.5 py-0.5 rounded">
                        {formatPenalty(result.penalizacionMs)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  {hasPendingPenalty && (
                    <span className="text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <span className={`text-base font-mono tabular-nums leading-none ${hasPendingPenalty ? 'text-yellow-600 dark:text-yellow-500 font-bold' : 'text-rally-txt font-bold'}`}>
                    {result.tiempo}
                  </span>
                </div>
                <span className={`text-[11px] font-mono tabular-nums ${
                  isFirst ? 'text-rally-hint' : 'text-rally-gap font-bold'
                }`}>
                  {isFirst ? '—' : result.diferencia}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
