"use client";

import React, { useState } from 'react';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';

interface DiagnosticsProps {
  results: EnrichedRallyResult[];
}

export default function Diagnostics({ results }: DiagnosticsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Contadores
  const registered = results.filter(r => r.categorySource === "registered");
  const inferred = results.filter(r => r.categorySource === "inferred");
  const unknown = results.filter(r => r.categorySource === "unknown");

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-rally-surface border border-rally-border text-rally-text px-4 py-2 rounded-full text-xs shadow-xl hover:bg-rally-bg transition z-50 flex items-center gap-2 font-medium"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${unknown.length > 0 ? 'bg-red-400' : 'bg-green-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${unknown.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
        </span>
        Diagnóstico FEDAK
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] flex flex-col bg-rally-surface border border-rally-border shadow-2xl rounded-xl z-50 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-rally-bg px-4 py-3 border-b border-rally-border">
        <h3 className="text-sm font-bold text-rally-text flex items-center gap-2">
          <svg className="w-4 h-4 text-rally-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
          </svg>
          Diagnóstico de Categorías
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-rally-muted hover:text-rally-text transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-rally-border border-b border-rally-border">
        <div className="bg-rally-surface p-3 text-center">
          <div className="text-[10px] font-semibold text-rally-muted uppercase tracking-wider mb-1">Registrados</div>
          <div className="text-lg font-black text-green-600 dark:text-green-500">{registered.length}</div>
        </div>
        <div className="bg-rally-surface p-3 text-center">
          <div className="text-[10px] font-semibold text-rally-muted uppercase tracking-wider mb-1">Inferidos</div>
          <div className="text-lg font-black text-yellow-600 dark:text-yellow-500">{inferred.length}</div>
        </div>
        <div className="bg-rally-surface p-3 text-center">
          <div className="text-[10px] font-semibold text-rally-muted uppercase tracking-wider mb-1">Sin Categoría</div>
          <div className="text-lg font-black text-red-600 dark:text-red-500">{unknown.length}</div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-rally-bg">
        {results.map(r => {
          let badgeColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
          if (r.categorySource === "inferred") badgeColor = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
          if (r.categorySource === "unknown") badgeColor = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";

          return (
            <div key={r.numero} className="flex items-center justify-between p-2 rounded-lg bg-rally-surface border border-rally-border shadow-sm text-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="font-mono text-rally-muted font-semibold w-8">#{r.numero}</span>
                <span className="text-rally-text truncate font-medium">{r.piloto}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                {r.categorySource}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
