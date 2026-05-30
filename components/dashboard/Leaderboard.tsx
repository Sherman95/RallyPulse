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
      <div className="p-8 text-center text-rally-muted border border-dashed border-rally-surface rounded-xl bg-rally-bg shadow-sm">
        Los resultados aún no están disponibles o el tramo no ha comenzado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {!hideHeader && (
          <thead>
            <tr className="border-b border-rally-bg text-[10px] font-bold text-rally-muted uppercase tracking-widest bg-rally-surface2/50">
              <th className="py-3 px-2 w-8 text-center">Pos</th>
              <th className="py-3 px-2 w-12">#</th>
              <th className="py-3 px-2">Piloto</th>
              <th className="py-3 px-2 hidden md:table-cell">Copiloto</th>
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
                className={`border-b border-rally-bg transition-colors ${onPilotClick ? 'cursor-pointer' : ''} ${
                  position === 1
                    ? 'bg-amber-50 dark:bg-amber-900/[0.06]' 
                    : 'bg-rally-surface2 hover:bg-rally-surface'
                }`}
              >
                <td className={`py-3 px-2 text-center text-sm font-medium w-8 ${
                  position === 1 ? 'text-rally-gold' :
                  position === 2 ? 'text-rally-silver' :
                  position === 3 ? 'text-rally-bronze' :
                  'text-rally-hint'
                }`}>
                  {position}
                </td>
                <td className="py-3 px-2 text-[11px] text-rally-muted font-mono">
                  {result.numero}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-rally-txt leading-tight">{result.piloto}</span>
                    <CategoryBadge cat={result.categoria} />
                  </div>
                </td>
                <td className="py-3 px-2 hidden md:table-cell text-xs text-rally-muted">
                  {result.copiloto}
                </td>
                <td className="py-3 px-2 text-right text-sm text-rally-txt font-mono tabular-nums whitespace-nowrap">
                  {result.tiempo}
                </td>
                <td className={`py-3 px-2 text-right text-xs font-mono tabular-nums whitespace-nowrap ${
                  position === 1 ? 'text-rally-hint' : 'text-rally-gap'
                }`}>
                  {position === 1 ? '—' : result.diferenciaPrimero}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
