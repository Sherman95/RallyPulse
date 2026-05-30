import Papa from "papaparse";

export interface RallyResult {
  posicion: number;
  numero: number;
  equipo: string;
  tiempo: string;
  diferencia: string;
}

export interface ProcessedResults {
  general: RallyResult[];
  stages: Record<string, RallyResult[]>;
}

export function normalizeResults(csvText: string): ProcessedResults {
  const parsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const rawRows = parsed.data;
  
  const result: ProcessedResults = {
    general: [],
    stages: {}
  };

  let currentStageId = "general";
  
  let colPos = -1;
  let colNum = -1;
  let colEq = -1;
  let colTime = -1;
  
  const tcColumns: Record<string, number> = {}; 

  for (const row of rawRows) {
    // 1. Detectar si la fila es un título de bloque (ej. "TC4 - Nombre del Tramo")
    const tcTitleMatch = row[0] && row[0].trim().match(/^(TC\d+)/i);
    // Asumimos que es título si la fila tiene 2 o menos columnas llenas
    if (tcTitleMatch && row.filter(Boolean).length <= 2) {
      currentStageId = tcTitleMatch[1].toUpperCase();
      // Reiniciamos los índices porque la nueva tabla podría tener un orden distinto
      colPos = -1; colNum = -1; colEq = -1; colTime = -1;
      continue;
    }

    // 2. Detectar fila de cabeceras de tabla
    const isHeader = row.some(cell => {
      const lower = cell.toLowerCase().trim();
      return lower === 'clt' || lower === 'pos' || lower === 'posicion';
    });

    if (isHeader) {
      colPos = row.findIndex(c => ['clt', 'pos', 'posicion'].includes(c.toLowerCase().trim()));
      colNum = row.findIndex(c => ['nº', 'n°', 'no.', 'numero', '#'].includes(c.toLowerCase().trim()));
      colEq = row.findIndex(c => ['equipo', 'piloto', 'concursante'].includes(c.toLowerCase().trim()));
      colTime = row.findIndex(c => ['tiempo', 'time', 'total'].includes(c.toLowerCase().trim()));

      // Registrar columnas TC si estamos en una tabla general o mixta
      row.forEach((cell, idx) => {
        const tcMatch = cell.trim().match(/^(TC\d+)/i);
        if (tcMatch) {
          tcColumns[tcMatch[1].toUpperCase()] = idx;
        }
      });
      continue;
    }

    // 3. Fila de datos
    if (colPos === -1 || colNum === -1 || colEq === -1 || colTime === -1) continue;

    const posStr = row[colPos]?.trim();
    const numStr = row[colNum]?.trim();
    const eqStr = row[colEq]?.trim();
    const timeStr = row[colTime]?.trim();

    const posicion = parseInt(posStr, 10);
    const numero = parseInt(numStr, 10);

    if (isNaN(posicion) || isNaN(numero) || posicion <= 0 || numero <= 0 || !eqStr || !timeStr) {
      continue;
    }

    if (currentStageId === "general") {
      result.general.push({
        posicion,
        numero,
        equipo: eqStr,
        tiempo: timeStr,
        diferencia: "" 
      });

      // Extraer los tiempos de las columnas TC en la misma fila (Modo Columnas)
      for (const [tc, idx] of Object.entries(tcColumns)) {
        const tcTimeStr = row[idx]?.trim();
        if (tcTimeStr && parseTimeToSeconds(tcTimeStr)) {
          if (!result.stages[tc]) result.stages[tc] = [];
          result.stages[tc].push({
            posicion: 0, 
            numero,
            equipo: eqStr,
            tiempo: tcTimeStr,
            diferencia: ""
          });
        }
      }
    } else {
      // Modo Tablas Bloques: Estamos en una tabla exclusiva de un TC
      if (!result.stages[currentStageId]) result.stages[currentStageId] = [];
      result.stages[currentStageId].push({
        posicion,
        numero,
        equipo: eqStr,
        tiempo: timeStr,
        diferencia: ""
      });
    }
  }

  recalculateDifferences(result.general);

  // Generar clasificaciones matemáticas para cada TC
  for (const tcId of Object.keys(result.stages)) {
    const stageArray = result.stages[tcId];
    
    // Ordenar de menor a mayor tiempo
    stageArray.sort((a, b) => {
      const ta = parseTimeToSeconds(a.tiempo) || Infinity;
      const tb = parseTimeToSeconds(b.tiempo) || Infinity;
      return ta - tb;
    });

    // Reasignar posiciones y diferencias (¡Magia de Live Timing!)
    let leaderTime: number | null = null;
    stageArray.forEach((r, idx) => {
      r.posicion = idx + 1;
      const t = parseTimeToSeconds(r.tiempo);
      if (idx === 0) {
        leaderTime = t;
        r.diferencia = "-";
      } else if (leaderTime !== null && t !== null) {
        r.diferencia = formatDiffTime(t - leaderTime);
      }
    });
  }

  return result;
}

export function parseTimeToSeconds(timeStr: string): number | null {
  const parts = timeStr.split(":");
  let total = 0;

  if (parts.length === 2) {
    total += parseInt(parts[0], 10) * 60;
    total += parseFloat(parts[1]);
  } else if (parts.length === 3) {
    total += parseInt(parts[0], 10) * 3600;
    total += parseInt(parts[1], 10) * 60;
    total += parseFloat(parts[2]);
  } else {
    return null;
  }
  return isNaN(total) ? null : total;
}

export function formatDiffTime(diffSeconds: number): string {
  if (diffSeconds < 0) return "-";
  
  const h = Math.floor(diffSeconds / 3600);
  const m = Math.floor((diffSeconds % 3600) / 60);
  const s = (diffSeconds % 60).toFixed(1);

  if (h > 0) {
    return `+${h}:${m.toString().padStart(2, "0")}:${s.padStart(4, "0")}`;
  }
  return `+${m}:${s.padStart(4, "0")}`;
}

function recalculateDifferences(arr: RallyResult[]) {
  if (arr.length === 0) return;
  const sorted = [...arr].sort((a, b) => a.posicion - b.posicion);
  const leaderTime = parseTimeToSeconds(sorted[0].tiempo);
  if (!leaderTime) return;

  for (const r of arr) {
    if (r.posicion === 1) {
      r.diferencia = "-";
    } else {
      const t = parseTimeToSeconds(r.tiempo);
      if (t) r.diferencia = formatDiffTime(t - leaderTime);
    }
  }
}
