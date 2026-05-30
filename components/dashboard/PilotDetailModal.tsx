"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { EnrichedRallyResult, EnrichedProcessedResults } from '@/lib/mergeDrivers';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface PilotDetailModalProps {
  pilot: EnrichedRallyResult | null;
  allData: EnrichedProcessedResults | null;
  onClose: () => void;
}

export default function PilotDetailModal({ pilot, allData, onClose }: PilotDetailModalProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Evitar scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (pilot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pilot]);

  if (!pilot || !allData) return null;

  const { generalPosition, categoryPosition } = useMemo(() => {
    const generalIndex = allData.general.findIndex(r => r.numero === pilot.numero);
    const generalPos = generalIndex >= 0 ? generalIndex + 1 : null;

    const categoryList = allData.general.filter(r => r.categoria === pilot.categoria);
    const categoryIndex = categoryList.findIndex(r => r.numero === pilot.numero);
    const categoryPos = categoryIndex >= 0 ? categoryIndex + 1 : null;

    return { generalPosition: generalPos, categoryPosition: categoryPos };
  }, [allData.general, pilot.categoria, pilot.numero]);

  // Extraer los tiempos del piloto en cada TC
  const stageTimes: { tcId: string; tiempo: string; posicion: number }[] = [];
  
  for (const tcId of Object.keys(allData.stages)) {
    const stageResults = allData.stages[tcId];
    const pilotInStage = stageResults.find(r => r.numero === pilot.numero);
    if (pilotInStage) {
      stageTimes.push({
        tcId,
        tiempo: pilotInStage.tiempo,
        posicion: pilotInStage.posicion
      });
    }
  }

  const buildShareText = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const catPos = categoryPosition ? `Pos. Cat: ${categoryPosition}` : 'Pos. Cat: -';
    const genPos = generalPosition ? `Pos. Gral: ${generalPosition}` : 'Pos. Gral: -';
    return `Rally Pulse | ${pilot.piloto} (#${pilot.numero}) | ${pilot.categoria} | ${catPos} | ${genPos} | Tiempo: ${pilot.tiempo} ${origin}`.trim();
  };

  const handleShareText = async () => {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Rally Pulse', text });
        setShareStatus('Compartido');
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareStatus('Copiado');
        return;
      }
    } catch {
      setShareStatus('No se pudo compartir');
      return;
    }

    setShareStatus('No se pudo compartir');
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  const createShareImage = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#f5f6fa';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('Rally Pulse', 80, 110);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText(`#${pilot.numero}`, 80, 220);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 52px sans-serif';
    let y = wrapText(ctx, pilot.piloto, 80, 320, 920, 60);

    ctx.fillStyle = '#6b7280';
    ctx.font = '500 34px sans-serif';
    y = wrapText(ctx, `Copiloto: ${pilot.copiloto || 'N/A'}`, 80, y + 10, 920, 44);

    ctx.fillStyle = '#111827';
    ctx.font = '600 36px sans-serif';
    ctx.fillText(`Categoria: ${pilot.categoria}`, 80, y + 60);

    ctx.fillStyle = '#111827';
    ctx.font = '600 36px sans-serif';
    ctx.fillText(`Pos. Cat: ${categoryPosition ?? '-'}`, 80, y + 120);
    ctx.fillText(`Pos. Gral: ${generalPosition ?? '-'}`, 480, y + 120);

    ctx.fillStyle = '#ef4444';
    ctx.font = '700 44px sans-serif';
    ctx.fillText(`Tiempo: ${pilot.tiempo}`, 80, y + 200);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    ctx.fillStyle = '#6b7280';
    ctx.font = '500 30px sans-serif';
    ctx.fillText(origin || 'rally-pulse.vercel.app', 80, height - 80);

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
  };

  const handleShareImage = async () => {
    try {
      const blob = await createShareImage();
      if (!blob) {
        setShareStatus('No se pudo crear imagen');
        return;
      }

      const file = new File([blob], `rallypulse-${pilot.numero}.png`, { type: 'image/png' });
      const text = buildShareText();

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Rally Pulse', text });
        setShareStatus('Imagen compartida');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rallypulse-${pilot.numero}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setShareStatus('Imagen descargada');
    } catch {
      setShareStatus('No se pudo compartir imagen');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop oscuro */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-rally-surface rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-rally-surface">
        
        {/* Botón Cerrar (Flotante) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-rally-bg border border-rally-surface text-rally-muted hover:text-rally-txt transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header del Piloto */}
        <div className="bg-rally-bg px-6 pt-8 pb-6 border-b border-rally-surface flex flex-col items-center text-center relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl font-black text-2xl mb-4 bg-rally-accent text-white shadow-lg shadow-rally-accent/20">
            #{pilot.numero}
          </div>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
            <CategoryBadge cat={pilot.categoria} />
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest px-2.5 py-1">
              Pos. Cat: {categoryPosition ?? "-"}
            </span>
            <span className="text-[10px] font-bold text-rally-muted uppercase tracking-widest px-2.5 py-1">
              Pos. Gral: {generalPosition ?? "-"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-rally-txt leading-tight">
            {pilot.piloto}
          </h3>
          <p className="text-sm font-medium text-rally-muted mt-1">
            Copiloto: {pilot.copiloto || "N/A"}
          </p>
          <p className="text-xs font-semibold text-rally-muted mt-2">
            🚗 {pilot.vehiculo}
          </p>
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 border-b border-rally-surface bg-rally-surface flex flex-wrap gap-2">
          <button
            onClick={handleShareText}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-rally-accent text-white hover:opacity-90 transition-opacity"
          >
            Compartir
          </button>
          <button
            onClick={handleShareImage}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-rally-bg text-rally-txt border border-rally-surface hover:bg-rally-surface transition-colors"
          >
            Compartir imagen
          </button>
          {shareStatus && (
            <span className="text-[10px] sm:text-xs text-rally-muted flex items-center">
              {shareStatus}
            </span>
          )}
        </div>

        {/* Tiempos por Tramo (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-rally-surface p-6">
          <h4 className="text-xs font-bold text-rally-muted uppercase tracking-widest mb-4 ml-1">
            Tiempos por Tramo (TC)
          </h4>
          
          {stageTimes.length === 0 ? (
            <div className="text-center py-8 text-sm text-rally-muted bg-rally-bg rounded-xl border border-rally-surface">
              Este vehículo aún no registra tiempos en ningún tramo.
            </div>
          ) : (
            <div className="space-y-3">
              {stageTimes.map(st => (
                <div key={st.tcId} className="flex items-center justify-between bg-rally-surface border border-rally-surface rounded-xl p-4 shadow-sm hover:border-rally-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rally-bg border border-rally-surface flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-rally-muted leading-none mb-0.5">POS</span>
                      <span className="text-sm font-black text-rally-txt leading-none tabular-nums">{st.posicion}</span>
                    </div>
                    <span className="font-bold text-rally-txt">{st.tcId}</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-rally-txt tabular-nums">
                    {st.tiempo}
                  </span>
                </div>
              ))}
              
              <div className="flex items-center justify-between bg-rally-bg border border-rally-surface rounded-xl p-4 shadow-sm mt-6">
                <span className="font-bold text-rally-txt">Tiempo General Total</span>
                <span className="font-mono text-lg font-bold text-rally-accent tabular-nums">
                  {pilot.tiempo}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
