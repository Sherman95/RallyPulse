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
                <td className={`py-3 px-2 text-center text-sm font-bold w-8 ${
                  position === 1 ? 'text-rally-gold' :
                  position === 2 ? 'text-rally-silver' :
                  position === 3 ? 'text-rally-bronze' :
                  'text-rally-hint'
                }`}>
                  {position}
                </td>
                <td className="py-3 px-2 text-[11px] text-rally-muted font-mono">
                  #{result.numero}
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-bold text-rally-txt leading-tight">{result.piloto}</span>
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
  );
}
