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
    <div className="w-full bg-[#e8ecf1] dark:bg-rally-surface border-b border-gray-200 dark:border-rally-nav sticky top-[44px] z-40 mb-6 shadow-sm">
      <nav className="max-w-5xl mx-auto flex overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block px-4 sm:px-6 lg:px-8">
        {allTabs.map(tab => {
          const isSelected = selectedStage === tab;
          
          return (
            <button
              key={tab}
              onClick={() => onSelectStage(tab)}
              className={`px-5 py-3 text-sm font-bold whitespace-nowrap flex-shrink-0 border-t-[3px] transition-colors ${
                isSelected 
                  ? 'border-[#f03a17] text-[#f03a17] bg-white dark:border-rally-accent dark:text-rally-accent dark:bg-rally-surface2' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-rally-muted dark:hover:text-rally-txt'
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
