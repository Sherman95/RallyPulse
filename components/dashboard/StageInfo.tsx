import React from 'react';
import { getEventForStageKey } from '@/lib/itineraryHelper';

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
      </div>
    );
  }

  const event = getEventForStageKey(stageId);
  if (!event) return null;

  // Extraer el nombre del tramo (ej. "TC1: Tarapal - Barrio San José" -> "Tarapal - Barrio San José")
  let stageName = event.actividad;
  if (stageName.includes(':')) {
    stageName = stageName.split(':')[1].trim();
  }

  const displayStatus = isAutoFinished ? 'FINALIZADO' : 'Siguiente';
  
  const STATUS_STYLES: Record<string, string> = {
    'Siguiente': 'bg-rally-surface text-rally-muted border border-rally-border',
    'FINALIZADO': 'bg-rally-accent text-white shadow-sm',
  };

  const statusStyle = STATUS_STYLES[displayStatus] || STATUS_STYLES['Siguiente'];

  return (
    <div className="border-b border-rally-border px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 flex-wrap mb-6 max-w-5xl mx-auto">
      <span className="text-xs sm:text-sm font-bold text-rally-accent tracking-wider uppercase">
        {stageId}
      </span>
      <span className="text-xs text-rally-muted">·</span>
      <span className="text-xs sm:text-sm font-bold text-rally-txt">{stageName}</span>

      <span className={`ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm tracking-wide uppercase ${statusStyle}`}>
        {displayStatus}
      </span>
    </div>
  );
}
