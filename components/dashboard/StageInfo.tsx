import React from 'react';
import { getStageById, getStageStatus } from '@/lib/schedule';

interface StageInfoProps {
  stageId: string;
  isAutoFinished?: boolean;
}

export default function StageInfo({ stageId, isAutoFinished }: StageInfoProps) {
  if (stageId === "General") {
    return (
      <div className="border-b border-rally-border px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 flex-wrap mb-6 max-w-5xl mx-auto">
        <span className="text-xs sm:text-sm font-bold text-rally-accent tracking-wider uppercase">
          ACUMULADO
        </span>
        <span className="text-xs text-rally-muted">·</span>
        <span className="text-xs sm:text-sm font-bold text-rally-txt">Clasificación acumulada</span>
        <span className="ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm tracking-wide uppercase bg-rally-accent text-white shadow-sm">
          FINALIZADO
        </span>
      </div>
    );
  }

  const stage = getStageById(stageId);
  if (!stage) return null;

  const rawStatus = getStageStatus(stage);
  const displayStatus = isAutoFinished && rawStatus !== 'Cancelado' ? 'FINALIZADO' : rawStatus;
  
  const STATUS_STYLES: Record<string, string> = {
    'Siguiente': 'bg-rally-surface text-rally-muted border border-rally-border',
    'Cancelado': 'bg-rally-accent text-white shadow-sm',
    'FINALIZADO': 'bg-rally-accent text-white shadow-sm',
  };

  const statusStyle = STATUS_STYLES[displayStatus] || STATUS_STYLES['Siguiente'];

  return (
    <div className="border-b border-rally-border px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 flex-wrap mb-6 max-w-5xl mx-auto">
      <span className="text-xs sm:text-sm font-bold text-rally-accent tracking-wider uppercase">
        {stage.id}
      </span>
      <span className="text-xs text-rally-muted">·</span>
      <span className="text-xs sm:text-sm font-bold text-rally-txt">{stage.name}</span>
      <span className="text-[10px] sm:text-xs text-rally-muted">{stage.distanceKm.toFixed(2)} km</span>

      <span className={`ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm tracking-wide uppercase ${statusStyle}`}>
        {displayStatus === 'Cancelado' ? `CANCELADO${stage.cancelReason ? ` (${stage.cancelReason})` : ''}` : displayStatus}
      </span>
    </div>
  );
}
