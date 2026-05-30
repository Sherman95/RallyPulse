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
    <div className="w-full bg-rally-surface border-b border-rally-bg sticky top-[44px] z-40 shadow-sm mb-6">
      <nav className="max-w-5xl mx-auto flex overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block px-4 sm:px-6 lg:px-8">
        {allTabs.map(tab => {
          const isSelected = selectedStage === tab;
          
          return (
            <button
              key={tab}
              onClick={() => onSelectStage(tab)}
              className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap flex-shrink-0 border-b-2 transition-colors ${
                isSelected 
                  ? 'text-rally-accent border-rally-accent bg-rally-surface2' 
                  : 'text-rally-muted border-transparent hover:text-rally-txt'
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
