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
      <div className="w-full mb-8 overflow-x-auto flex flex-nowrap [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-2 sm:gap-3 px-2 sm:px-0 py-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const displayCat = cat === "General" ? "Todas" : cat;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg transition-colors border flex items-center justify-center min-w-[80px] ${
                  isSelected 
                    ? 'bg-rally-accent text-white border-rally-accent' 
                    : 'bg-rally-surface2 text-rally-txt border-rally-border hover:bg-rally-surface'
                }`}
              >
                {displayCat}
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
