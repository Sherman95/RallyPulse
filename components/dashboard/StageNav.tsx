"use client";

import React from 'react';

interface StageNavProps {
  stages: string[];
  selectedStage: string;
  onSelectStage: (stage: string) => void;
}

export default function StageNav({ stages, selectedStage, onSelectStage }: StageNavProps) {
  // Siempre agregamos "General" al inicio
  const allTabs = ["General", ...stages];

  return (
    <div className="w-full bg-rally-surface border-b border-rally-border sticky top-16 sm:top-20 z-40 mb-6 shadow-sm">
      <nav className="max-w-5xl mx-auto flex overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block px-4 sm:px-6 lg:px-8">
        {allTabs.map(tab => {
          const isSelected = selectedStage === tab;
          
          if (tab === "General") {
            return (
              <button
                key={tab}
                onClick={() => onSelectStage(tab)}
                className={`px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 border-t-[3px] transition-colors ${
                  isSelected 
                    ? 'border-rally-accent text-rally-accent bg-rally-surface2' 
                    : 'border-transparent text-rally-muted hover:text-rally-txt'
                }`}
              >
                Acumulado
              </button>
            );
          }

          return (
            <button
              key={tab}
              onClick={() => onSelectStage(tab)}
              className={`px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 border-t-[3px] transition-colors ${
                isSelected 
                  ? 'border-rally-accent text-rally-accent bg-rally-surface2' 
                  : 'border-transparent text-rally-muted hover:text-rally-txt'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
