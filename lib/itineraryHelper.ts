import itineraryData from "@/data/itenerariovuelta2026.json";

const YEAR = 2026;

const MONTHS: Record<string, number> = {
  "enero": 0, "febrero": 1, "marzo": 2, "abril": 3,
  "mayo": 4, "junio": 5, "julio": 6, "agosto": 7,
  "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
};

export interface ActiveEvent {
  etapa: string;
  actividad: string;
  lugar?: string;
  startTime: Date;
  endTime?: Date;
  isNow: boolean;
}

function parseDateStr(fechaStr: string): { month: number; day: number } | null {
  // Ej: "Viernes 31 de Julio" o "Domingo 2 de Agosto"
  const parts = fechaStr.toLowerCase().split(" de ");
  if (parts.length < 2) return null;
  
  const dayStr = parts[0].split(" ").pop(); // Obtiene "31" de "Viernes 31"
  const monthStr = parts[1].trim();

  const day = parseInt(dayStr || "", 10);
  const month = MONTHS[monthStr];

  if (isNaN(day) || month === undefined) return null;
  return { month, day };
}

function parseTimeStr(horarioStr: string, baseDate: { month: number; day: number }): { start: Date; end?: Date } | null {
  // Ej: "13H00 - 17H00" o "08H48"
  const times = horarioStr.toUpperCase().split("-").map(t => t.trim());
  
  const createDate = (t: string) => {
    const [hStr, mStr] = t.split("H");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr || "0", 10);
    if (isNaN(h) || isNaN(m)) return null;
    return new Date(YEAR, baseDate.month, baseDate.day, h, m, 0);
  };

  const start = createDate(times[0]);
  if (!start) return null;

  const end = times.length > 1 ? (createDate(times[1]) || undefined) : undefined;
  
  return { start, end };
}

export function getAllEvents(): ActiveEvent[] {
  const events: ActiveEvent[] = [];

  for (const bloque of itineraryData.cronograma) {
    const isEtapa = !!(bloque as any).etapa;
    const etapaName = isEtapa ? (bloque as any).etapa : (bloque as any).seccion;

    if (isEtapa) {
      // Bloque de etapa
      const b = bloque as any;
      const dateInfo = parseDateStr(b.fecha);
      if (!dateInfo) continue;

      for (const item of b.cronograma) {
        const timeInfo = parseTimeStr(item.horario, dateInfo);
        if (!timeInfo) continue;
        
        let actividad = "";
        if (item.tipo === "TC") {
          actividad = `TC${item.numero}: ${item.tramo}`;
        } else {
          actividad = item.tipo;
        }

        events.push({
          etapa: etapaName,
          actividad,
          lugar: item.lugar || undefined,
          startTime: timeInfo.start,
          endTime: timeInfo.end || undefined,
          isNow: false
        });
      }
    } else {
      // Bloque de Revisiones
      const b = bloque as any;
      for (const dia of b.dias) {
        const dateInfo = parseDateStr(dia.fecha);
        if (!dateInfo) continue;

        for (const item of dia.actividades) {
          const timeInfo = parseTimeStr(item.horario, dateInfo);
          if (!timeInfo) continue;

          events.push({
            etapa: etapaName,
            actividad: item.actividad,
            lugar: item.lugar || undefined,
            startTime: timeInfo.start,
            endTime: timeInfo.end || undefined,
            isNow: false
          });
        }
      }
    }
  }

  // Ordenar cronológicamente
  events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return events;
}

export function getCurrentEvent(now: Date = new Date()): ActiveEvent | null {
  const events = getAllEvents();
  
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    
    // Si tiene endTime, comprobamos si estamos en ese rango
    if (ev.endTime) {
      if (now >= ev.startTime && now <= ev.endTime) {
        return { ...ev, isNow: true };
      }
    } else {
      // Si no tiene endTime, asumimos que dura hasta el siguiente evento, o 1 hora por defecto
      const nextEv = events[i + 1];
      const endTime = nextEv ? nextEv.startTime : new Date(ev.startTime.getTime() + 60 * 60 * 1000);
      
      // Expandimos un margen para los TCs para considerarlos activos un poco antes y después
      const marginStart = new Date(ev.startTime.getTime() - 15 * 60 * 1000); // 15 mins antes
      const marginEnd = new Date(endTime.getTime() + 30 * 60 * 1000); // 30 mins después del inicio del siguiente
      
      if (now >= marginStart && now <= marginEnd) {
         return { ...ev, isNow: true };
      }
    }
  }
  
  // Si no hay ninguno activo ahora mismo, buscamos el próximo evento
  const nextEvent = events.find(ev => ev.startTime > now);
  if (nextEvent) {
    return { ...nextEvent, isNow: false };
  }
  
  // Si ya pasaron todos
  if (events.length > 0) {
    return { ...events[events.length - 1], isNow: false };
  }

  return null;
}
