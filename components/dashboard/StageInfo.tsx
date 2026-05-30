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
  
  let statusColor = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  if (status === "En Curso") statusColor = "bg-green-100 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400";
  if (status === "Próximo") statusColor = "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400";
  if (status === "Finalizado") statusColor = "bg-gray-100 text-gray-600 ring-1 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400";

  // Formato HH:MM
  const timeStr = new Date(stage.firstCarTime).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full bg-rally-surface rounded-xl shadow-sm border border-rally-border p-4 sm:p-6 mb-8 mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-black text-rally-text tracking-tight">{stage.id}</h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}>
              {status}
            </span>
          </div>
          <p className="text-sm font-medium text-rally-muted">{stage.name}</p>
        </div>

        <div className="flex gap-4 sm:gap-6 bg-rally-bg p-3 rounded-xl border border-rally-border w-full sm:w-auto overflow-x-auto">
          <div className="flex flex-col min-w-max">
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest">Distancia</span>
            <span className="text-sm font-bold text-rally-text">{stage.distanceKm.toFixed(2)} km</span>
          </div>
          <div className="w-px bg-rally-border"></div>
          <div className="flex flex-col min-w-max">
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest">1er Auto</span>
            <span className="text-sm font-bold text-rally-text tabular-nums">{timeStr}</span>
          </div>
          <div className="w-px bg-rally-border"></div>
          <div className="flex flex-col min-w-max">
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest">T. Máx</span>
            <span className="text-sm font-bold text-rally-text tabular-nums">{stage.maxTimeMins} min</span>
          </div>
        </div>

      </div>
    </div>
  );
}
