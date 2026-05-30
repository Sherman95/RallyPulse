"use client";

import React, { useState, useMemo } from 'react';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';
import { CATEGORY_ORDER } from '@/lib/categoryResolver';
import TopThree from './TopThree';
import Leaderboard from './Leaderboard';

interface CategoryTabsProps {
  results: EnrichedRallyResult[];
  onPilotClick?: (pilot: EnrichedRallyResult) => void;
}

export default function CategoryTabs({ results, onPilotClick }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("General");

  // 1. Usar el orden oficial FEDAK, evitando generar pestañas basura
  const categories = useMemo(() => {
    const finalTabs = [...CATEGORY_ORDER];
    
    // Si el sistema detectó pilotos que no caen en el fallback, habilitamos la pestaña al final
    const hasUnclassified = results.some(r => r.categoria === "SIN CLASIFICAR");
    if (hasUnclassified && !finalTabs.includes("SIN CLASIFICAR")) {
      finalTabs.push("SIN CLASIFICAR");
    }

    // Filtrar para mostrar solo General y las categorías que tienen corredores
    return finalTabs.filter(cat => {
      if (cat === "General") return true;
      return results.some(r => r.categoria === cat);
    });
  }, [results]);

  // 2. Filtrar y recalcular los resultados según la categoría seleccionada
  const filteredResults = useMemo(() => {
    if (selectedCategory === "General") {
      return results;
    }
    
    const filtered = results.filter(r => r.categoria === selectedCategory);
    
    // Recalcular posiciones locales para el podio
    return filtered.map((item, index) => ({
      ...item,
      posicion: index + 1
    }));
  }, [results, selectedCategory]);

  return (
    <div className="w-full flex flex-col">
      
      {/* Navegación de Tabs */}
      <div className="w-full border-b border-rally-surface mb-8 overflow-x-auto flex flex-nowrap [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-2 sm:gap-6 px-2 sm:px-0">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = cat === "General" ? results.length : results.filter(r => r.categoria === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                  isSelected 
                    ? 'border-rally-accent text-rally-txt' 
                    : 'border-transparent text-rally-muted hover:text-rally-txt hover:border-rally-surface'
                }`}
              >
                {cat}
                {/* Badge opcional con la cantidad de participantes en la pestaña */}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border border-transparent ${isSelected ? 'bg-rally-accent/10 text-rally-accent border-rally-accent/20' : 'bg-rally-bg text-rally-muted border-rally-surface'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <TopThree topDrivers={filteredResults} onPilotClick={onPilotClick} />
      
      {filteredResults.length > 0 ? (
        <Leaderboard results={filteredResults} onPilotClick={onPilotClick} />
      ) : (
        <div className="py-12 text-center text-rally-muted text-sm bg-rally-surface border border-rally-surface rounded-xl">
          No hay vehículos registrados en esta categoría.
        </div>
      )}
      
    </div>
  );
}
