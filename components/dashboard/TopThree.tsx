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
      cardBg:  'bg-amber-50 dark:bg-amber-900/10',
    },
    2: {
      border:  'border-rally-silver/50',
      strip:   'bg-rally-silver',
      numCol:  'text-rally-silver',
      cardBg:  'bg-slate-100 dark:bg-slate-800/20',
    },
    3: {
      border:  'border-rally-bronze/50',
      strip:   'bg-rally-bronze',
      numCol:  'text-rally-bronze',
      cardBg:  'bg-orange-50 dark:bg-orange-900/10',
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
        className={`relative rounded-lg overflow-hidden flex flex-col items-center gap-1 p-3 w-full sm:w-1/3 transition-all duration-300 ${m.cardBg} ${m.border} ${position === 1 ? 'border-2 sm:scale-105 sm:-translate-y-4 shadow-sm' : 'border'} ${orderClass} ${onPilotClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      >
        {/* franja superior de color */}
        <div className={`absolute top-0 inset-x-0 h-1 ${m.strip}`} />

        <span className={`text-3xl font-medium leading-none mt-2 ${m.numCol}`}>
          {position}
        </span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-black/5 dark:bg-white/10 text-rally-muted">
          {driver.numero}
        </span>
        <p className="text-xs font-medium text-rally-txt text-center uppercase tracking-wide leading-tight mt-1">
          {driver.piloto}
        </p>
        <p className="text-[10px] text-rally-muted text-center leading-tight">
          {driver.copiloto}
        </p>

        <div className="w-4/5 h-px bg-rally-txt/10 my-1.5" />

        <span className="text-sm font-medium text-rally-txt tabular-nums font-mono">
          {driver.tiempo}
        </span>
        <span className={`text-[10px] font-mono tabular-nums mb-2 ${position === 1 ? 'text-rally-hint' : 'text-rally-gap'}`}>
          {position === 1 ? 'LÍDER' : driver.diferenciaPrimero}
        </span>
        
        <CategoryBadge cat={driver.categoria} />
      </div>
    );
  };

  return (
    <section className="mb-12 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 lg:gap-6 px-4 sm:px-6">
        {/* Usamos las clases 'order' para alterar el flujo visual y poner al 1ro en medio */}
        {renderCard(second, 2, "order-2 sm:order-1")}
        {renderCard(first, 1, "order-1 sm:order-2")}
        {renderCard(third, 3, "order-3 sm:order-3")}
      </div>
    </section>
  );
}
