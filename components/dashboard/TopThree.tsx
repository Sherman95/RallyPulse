import React from 'react';
import { EnrichedRallyResult } from '@/lib/mergeDrivers';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface TopThreeProps {
  topDrivers: EnrichedRallyResult[];
  onPilotClick?: (pilot: EnrichedRallyResult) => void;
}

export default function TopThree({ topDrivers, onPilotClick }: TopThreeProps) {
  if (!topDrivers || topDrivers.length === 0) return null;

  // Extraer explícitamente los 3 primeros (garantizando orden)
  const first = topDrivers[0];
  const second = topDrivers[1];
  const third = topDrivers[2];

  /**
   * Helper para renderizar cada posición con su identidad visual
   */
  const renderCard = (
    driver: EnrichedRallyResult | undefined,
    rank: number,
    orderClass: string,
    visualRank: 'gold' | 'silver' | 'bronze'
  ) => {
    if (!driver) return null;

    // Diseño Flat para legibilidad extrema bajo el sol (sin degradados)
    const rankStyles = {
      gold: "border-[3px] border-amber-400 dark:border-amber-500 shadow-xl shadow-amber-400/20 sm:scale-105 sm:-translate-y-4",
      silver: "border-2 border-gray-300 dark:border-gray-500",
      bronze: "border-2 border-orange-400 dark:border-orange-600"
    };

    const textStyles = {
      gold: "text-amber-400 dark:text-amber-500",
      silver: "text-gray-400 dark:text-gray-400",
      bronze: "text-orange-500 dark:text-orange-500"
    };

    return (
      <div
        onClick={() => onPilotClick && onPilotClick(driver)}
        className={`flex w-full sm:w-1/3 flex-col items-center rounded-xl bg-rally-surface p-4 sm:p-6 transition-all duration-300 ${rankStyles[visualRank]} ${orderClass} ${onPilotClick ? 'cursor-pointer hover:bg-rally-bg' : ''}`}
      >
        {/* Medalla de Posición (Flat Design) */}
        <div className={`text-5xl sm:text-6xl font-black mb-2 sm:mb-4 ${textStyles[visualRank]} tracking-tighter drop-shadow-sm`}>
          {rank}
        </div>
        
        <div className="text-center w-full">
          <div className="flex justify-center items-center gap-2 mb-3">
            <CategoryBadge cat={driver.categoria} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-rally-text line-clamp-2 leading-tight min-h-[3rem]">
            {driver.piloto}
          </h3>
          <p className="mt-1 text-sm font-semibold text-rally-muted">
            Auto #{driver.numero}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-6 rounded-2xl bg-rally-bg border border-rally-border px-3 py-2 sm:px-4 sm:py-3 w-full text-center">
          <span className="text-lg sm:text-xl font-mono font-bold text-rally-text tabular-nums tracking-tight">
            {driver.tiempo}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-12 w-full">
      <h2 className="text-center text-sm font-bold text-rally-muted uppercase tracking-widest mb-8">
        Líderes de la Clasificación
      </h2>
      
      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-4 lg:gap-8 px-2 sm:px-0">
        {/* Usamos las clases 'order' para alterar el flujo visual y poner al 1ro en medio */}
        {renderCard(second, 2, "order-2 sm:order-1", "silver")}
        {renderCard(first, 1, "order-1 sm:order-2", "gold")}
        {renderCard(third, 3, "order-3 sm:order-3", "bronze")}
      </div>
    </section>
  );
}
