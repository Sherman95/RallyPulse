import Papa from "papaparse";
import { formatDiffTime, parseTimeToSeconds } from "@/lib/time";

export interface RallyResult {
  posicion: number;
  numero: number;
  equipo: string;
  vehiculo?: string;
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
  let colVeh = -1;
  let colTime = -1;
  
  const tcColumns: Record<string, number> = {}; 

  for (const row of rawRows) {
    const firstCell = (row[0] ?? "").toString().trim();

    // 0. Detectar fila de cabeceras de tabla (lo calculamos temprano para no confundirla con títulos TC)
    const isHeader = row.some(cell => {
      const lower = (cell ?? "").toString().toLowerCase().trim();
      return lower === 'clt' || lower === 'pos' || lower === 'posicion';
    });

    // 1. Detectar si la fila es un título de bloque (ej. "TC4 - Nombre del Tramo")
    const tcTitleMatch = firstCell.match(/^(TC\d+)/i);
    // En Google Sheets a veces el título trae columnas extra; si la primera celda empieza con TCx,
    // lo tratamos como título de bloque siempre que NO sea una cabecera de tabla.
    if (tcTitleMatch && !isHeader) {
      currentStageId = tcTitleMatch[1].toUpperCase();
      // Reiniciamos los índices porque la nueva tabla podría tener un orden distinto
      colPos = -1; colNum = -1; colEq = -1; colVeh = -1; colTime = -1;
      continue;
    }

    // 2. Detectar fila de cabeceras de tabla

    if (isHeader) {
      colPos = row.findIndex(c => ['clt', 'pos', 'posicion'].includes(c.toLowerCase().trim()));
      colNum = row.findIndex(c => ['nº', 'n°', 'no.', 'numero', '#'].includes(c.toLowerCase().trim()));
      colEq = row.findIndex(c => ['equipo', 'piloto', 'concursante'].includes(c.toLowerCase().trim()));
      colVeh = row.findIndex(c => ['vehiculo', 'vehículo', 'auto', 'carro', 'coche'].includes(c.toLowerCase().trim()));
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
    const vehStr = colVeh >= 0 ? row[colVeh]?.trim() : "";
    const timeStr = row[colTime]?.trim();

    const numero = parseInt(numStr, 10);

    if (isNaN(numero) || numero <= 0 || !eqStr) continue;

    const posicionParsed = parseInt(posStr, 10);
    const posicion = isNaN(posicionParsed) ? 0 : posicionParsed;

    // En la tabla general por columnas, a veces vienen filas sin CLT y/o sin TIEMPO total.
    // No debemos descartarlas si tienen al menos un tiempo en alguna columna TCx.
    let hasAnyStageTime = false;
    if (currentStageId === "general") {
      for (const idx of Object.values(tcColumns)) {
        const tcTimeCandidate = row[idx]?.trim();
        if (tcTimeCandidate && parseTimeToSeconds(tcTimeCandidate) !== null) {
          hasAnyStageTime = true;
          break;
        }
      }

      // Si no hay tiempo total ni tiempos de TC, no es una fila válida de corredor
      if ((!timeStr || timeStr.length === 0) && !hasAnyStageTime) continue;
    } else {
      // En tablas por bloque (TC1/TC3...), exigimos posición y tiempo del bloque
      if (posicion <= 0 || !timeStr) continue;
    }

    if (currentStageId === "general") {
      // Guardamos la fila "general" solo si trae un tiempo total usable.
      // Si no lo trae, igual se incorporará en la General calculada vía TCs.
      if (timeStr && parseTimeToSeconds(timeStr) !== null) {
        result.general.push({
          posicion,
          numero,
          equipo: eqStr,
          vehiculo: vehStr || undefined,
          tiempo: timeStr,
          diferencia: "" 
        });
      }

      // Extraer los tiempos de las columnas TC en la misma fila (Modo Columnas)
      for (const [tc, idx] of Object.entries(tcColumns)) {
        const tcTimeStr = row[idx]?.trim();
        if (tcTimeStr && parseTimeToSeconds(tcTimeStr) !== null) {
          if (!result.stages[tc]) result.stages[tc] = [];
          result.stages[tc].push({
            posicion: 0, 
            numero,
            equipo: eqStr,
            vehiculo: vehStr || undefined,
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
        vehiculo: vehStr || undefined,
        tiempo: timeStr,
        diferencia: ""
      });
    }
  }

  recalculateDifferences(result.general);

  // Si la tabla "General" del sheet viene incompleta (p. ej. solo quienes completaron todos los TCs),
  // construimos una general calculada con TODOS los pilotos vistos en cualquier TC.
  const computedGeneral = buildComputedGeneral(result.stages);
  if (computedGeneral.length > result.general.length) {
    result.general = computedGeneral;
  }

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

function buildComputedGeneral(stages: Record<string, RallyResult[]>): RallyResult[] {
  const stageIds = Object.keys(stages);
  if (stageIds.length === 0) return [];

  const byDriver = new Map<number, { numero: number; equipo: string; vehiculo?: string; total: number; completed: number }>();

  for (const stageId of stageIds) {
    const stageResults = stages[stageId] ?? [];
    for (const r of stageResults) {
      const t = parseTimeToSeconds(r.tiempo);
      if (t == null) continue;

      const existing = byDriver.get(r.numero);
      if (!existing) {
        byDriver.set(r.numero, {
          numero: r.numero,
          equipo: r.equipo,
          vehiculo: r.vehiculo,
          total: t,
          completed: 1,
        });
      } else {
        existing.total += t;
        existing.completed += 1;
        if (!existing.equipo) existing.equipo = r.equipo;
        if (!existing.vehiculo && r.vehiculo) existing.vehiculo = r.vehiculo;
      }
    }
  }

  const drivers = [...byDriver.values()];
  if (drivers.length === 0) return [];

  const maxCompleted = drivers.reduce((acc, d) => Math.max(acc, d.completed), 0);

  drivers.sort((a, b) => {
    if (b.completed !== a.completed) return b.completed - a.completed;
    if (a.total !== b.total) return a.total - b.total;
    return a.numero - b.numero;
  });

  const leaderFull = drivers.find(d => d.completed === maxCompleted);
  const leaderTime = leaderFull ? leaderFull.total : null;

  return drivers.map((d, idx) => {
    let diferencia = "-";
    if (idx === 0) {
      diferencia = "-";
    } else if (d.completed === maxCompleted && leaderTime != null) {
      diferencia = formatDiffTime(d.total - leaderTime);
    } else {
      const missing = maxCompleted - d.completed;
      diferencia = missing === 1 ? "FALTA 1 TC" : `FALTAN ${missing} TC`;
    }

    return {
      posicion: idx + 1,
      numero: d.numero,
      equipo: d.equipo,
      vehiculo: d.vehiculo,
      tiempo: formatTotalTime(d.total),
      diferencia,
    };
  });
}

function formatTotalTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "-";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = (totalSeconds % 60).toFixed(1);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.padStart(4, "0")}`;
  }

  return `${m}:${s.padStart(4, "0")}`;
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
