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
    <div className="w-full bg-rally-surface border-b border-rally-border sticky top-16 z-40 shadow-sm mb-6">
      <div className="max-w-5xl mx-auto overflow-x-auto flex flex-nowrap [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8">
          {allTabs.map(tab => {
            const isSelected = selectedStage === tab;
            
            return (
              <button
                key={tab}
                onClick={() => onSelectStage(tab)}
                className={`whitespace-nowrap px-1 py-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  isSelected 
                    ? 'border-rally-accent text-rally-accent' 
                    : 'border-transparent text-rally-muted hover:text-rally-text hover:border-rally-border'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
