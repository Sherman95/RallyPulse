import React from 'react';
import { getStageById, getStageStatus } from '@/lib/schedule';

interface StageInfoProps {
  stageId: string;
}

export default function StageInfo({ stageId }: StageInfoProps) {
  if (stageId === "General") return null;

  const stage = getStageById(stageId);
  if (!stage) return null;

  const status = getStageStatus(stage);
  
  const STATUS_STYLES: Record<string, string> = {
    'Próximo':    'bg-rally-surface2 text-rally-muted border border-rally-bg',
    'En Curso':   'bg-rally-accent text-rally-nav',
    'Finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['Próximo'];

  return (
    <div className="bg-rally-surface border-b border-rally-bg px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm mb-6 max-w-5xl mx-auto">
      <span className="text-xs font-bold text-rally-accent tracking-wider uppercase">
        {stage.id}
      </span>
      <span className="text-xs text-rally-muted">·</span>
      <span className="text-sm font-medium text-rally-txt">{stage.name}</span>
      <span className="text-xs text-rally-muted">{stage.distanceKm.toFixed(2)} km</span>

      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase ${statusStyle}`}>
        {status}
      </span>
    </div>
  );
}
