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

  const MEDAL: Record<number, any> = {
    1: {
      border:  'border-rally-gold',
      strip:   'bg-rally-gold',
      numCol:  'text-rally-gold',
      cardBg:  'bg-rally-gold/10',
    },
    2: {
      border:  'border-rally-silver/50',
      strip:   'bg-rally-silver',
      numCol:  'text-rally-silver',
      cardBg:  'bg-rally-surface',
    },
    3: {
      border:  'border-rally-bronze/50',
      strip:   'bg-rally-bronze',
      numCol:  'text-rally-bronze',
      cardBg:  'bg-rally-bronze/10',
    },
  };

  const renderCard = (
    driver: EnrichedRallyResult | undefined,
    position: number,
    orderClass: string
  ) => {
    if (!driver) return null;
    const m = MEDAL[position];

    return (
      <div
        onClick={() => onPilotClick && onPilotClick(driver)}
        className={`relative min-w-0 rounded-lg overflow-hidden flex flex-col items-center gap-0.5 p-2 sm:gap-1 sm:p-3 flex-1 basis-0 transition-all duration-300 ${m.cardBg} ${m.border} ${position === 1 ? 'z-10 border-2 flex-[1.28] scale-[1.07] -translate-y-2 shadow-md ring-1 ring-rally-gold/25 sm:scale-105 sm:-translate-y-4 sm:shadow-sm sm:ring-0' : 'border opacity-95'} ${orderClass} ${onPilotClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      >
        {/* franja superior de color */}
        <div className={`absolute top-0 inset-x-0 h-1 ${m.strip}`} />

        <span className={`text-2xl sm:text-3xl font-medium leading-none mt-1.5 sm:mt-2 ${m.numCol}`}>
          {position}
        </span>
        <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-rally-txt/5 text-rally-muted">
          {driver.numero}
        </span>
        <p className="w-full px-1 text-[10px] sm:text-xs font-medium text-rally-txt text-center uppercase tracking-wide leading-tight mt-1 overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-normal sm:overflow-visible sm:text-clip">
          {driver.piloto}
        </p>
        <p className="w-full px-1 text-[9px] sm:text-[10px] text-rally-muted text-center leading-tight overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-normal sm:overflow-visible sm:text-clip">
          {driver.copiloto}
        </p>

        <div className="w-4/5 h-px bg-rally-txt/10 my-1" />

        <span className="text-xs sm:text-sm font-medium text-rally-txt tabular-nums font-mono">
          {driver.tiempo}
        </span>
        <span className={`text-[9px] sm:text-[10px] font-mono tabular-nums mb-1.5 sm:mb-2 ${position === 1 ? 'text-rally-hint' : 'text-rally-gap'}`}>
          {position === 1 ? 'LÍDER' : driver.diferencia}
        </span>
        
        <CategoryBadge
          cat={driver.categoria}
          className="max-w-full truncate sm:whitespace-normal sm:overflow-visible sm:text-clip text-[9px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-md"
        />
      </div>
    );
  };

  return (
    <section className="mb-8 sm:mb-12 w-full max-w-5xl mx-auto px-2 sm:px-6">
      <div className="bg-rally-surface rounded-xl p-3 sm:p-6 lg:p-8 flex flex-row items-end justify-center gap-2 sm:gap-4 lg:gap-6 shadow-inner">
        {/* Usamos las clases 'order' para alterar el flujo visual y poner al 1ro en medio */}
        {renderCard(second, 2, "order-1")}
        {renderCard(first, 1, "order-2")}
        {renderCard(third, 3, "order-3")}
      </div>
    </section>
  );
}
