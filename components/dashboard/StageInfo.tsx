import React from 'react';
import { getStageById, getStageStatus } from '@/lib/schedule';

interface StageInfoProps {
  stageId: string;
}

export default function StageInfo({ stageId }: StageInfoProps) {
  if (stageId === "General") {
    return (
      <div className="bg-transparent border-b border-gray-200 dark:border-rally-nav px-4 py-3 flex items-center gap-3 flex-wrap mb-6 max-w-5xl mx-auto">
        <span className="text-sm font-bold text-[#f03a17] tracking-wider uppercase dark:text-rally-accent">
          GENERAL
        </span>
        <span className="text-xs text-gray-500 dark:text-rally-muted">·</span>
        <span className="text-sm font-bold text-gray-800 dark:text-rally-txt">Clasificación acumulada</span>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase bg-[#f03a17] text-white dark:bg-rally-accent">
          EN CURSO
        </span>
      </div>
    );
  }

  const stage = getStageById(stageId);
  if (!stage) return null;

  const status = getStageStatus(stage);
  
  const STATUS_STYLES: Record<string, string> = {
    'Próximo':    'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-rally-surface2 dark:text-rally-muted dark:border-rally-surface',
    'En Curso':   'bg-[#f03a17] text-white dark:bg-rally-accent',
    'Finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['Próximo'];

  return (
    <div className="bg-transparent border-b border-gray-200 dark:border-rally-nav px-4 py-3 flex items-center gap-3 flex-wrap mb-6 max-w-5xl mx-auto">
      <span className="text-sm font-bold text-[#f03a17] tracking-wider uppercase dark:text-rally-accent">
        {stage.id}
      </span>
      <span className="text-xs text-gray-500 dark:text-rally-muted">·</span>
      <span className="text-sm font-bold text-gray-800 dark:text-rally-txt">{stage.name}</span>
      <span className="text-xs text-gray-500 dark:text-rally-muted">{stage.distanceKm.toFixed(2)} km</span>

      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase ${statusStyle}`}>
        {status}
      </span>
    </div>
  );
}
