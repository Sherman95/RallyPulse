import Papa from "papaparse";
import { formatDiffTime, parseTimeToSeconds, formatRallyTime, parsePenalty } from "@/lib/time";
import { groupStageKeysByEtapa } from "@/lib/itineraryHelper";

export interface RallyResult {
  posicion: number;
  numero: number;
  equipo: string;
  vehiculo?: string;
  tiempo: string;
  diferencia: string;
  penalizacion?: string;
  penalizacionMs?: number;
  penalizacionStatus?: 'pending' | 'applied';
}

export interface ProcessedResults {
  general: RallyResult[];
  stages: Record<string, RallyResult[]>;
  etapas: Record<string, RallyResult[]>;
}

export function normalizeResults(csvText: string): ProcessedResults {
  const parsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const rawRows = parsed.data;
  
  const result: ProcessedResults = {
    general: [],
    stages: {},
    etapas: {}
  };

  let currentStageId = "general";
  
  let colPos = -1;
  let colNum = -1;
  let colEq = -1;
  let colVeh = -1;
  let colTime = -1;
  let colPenalty = -1;
  
  const tcColumns: Record<string, number> = {}; 

  for (const row of rawRows) {
    const firstCell = (row[0] ?? "").toString().trim();

    // 0. Detectar fila de cabeceras de tabla (lo calculamos temprano para no confundirla con títulos TC)
    const isHeader = row.some(cell => {
      const lower = (cell ?? "").toString().toLowerCase().trim();
      return lower === 'clt' || lower === 'pos' || lower === 'posicion';
    });

    // 1. Detectar si la fila es un título de bloque (ej. "TC4 - Nombre del Tramo" o "SUPER PRIME 1" o "TC1_E2")
    const tcTitleMatch = firstCell.match(/^(TC\s*\d+[\s_A-Z0-9-]*|SUPER PRIME\s*\d+[\s_A-Z0-9-]*|SP\s*\d+[\s_A-Z0-9-]*|SUPER PRIME|SP|TC)/i);
    // En Google Sheets a veces el título trae columnas extra; si la primera celda empieza con TCx,
    // lo tratamos como título de bloque siempre que NO sea una cabecera de tabla.
    if (tcTitleMatch && !isHeader) {
      currentStageId = tcTitleMatch[1].toUpperCase().trim();
      // Reiniciamos los índices porque la nueva tabla podría tener un orden distinto
      colPos = -1; colNum = -1; colEq = -1; colVeh = -1; colTime = -1; colPenalty = -1;
      continue;
    }

    // 2. Detectar fila de cabeceras de tabla

    if (isHeader) {
      colPos = row.findIndex(c => ['clt', 'pos', 'posicion'].includes(c.toLowerCase().trim()));
      colNum = row.findIndex(c => ['nº', 'n°', 'no.', 'numero', '#'].includes(c.toLowerCase().trim()));
      colEq = row.findIndex(c => ['equipo', 'piloto', 'concursante'].includes(c.toLowerCase().trim()));
      colVeh = row.findIndex(c => ['vehiculo', 'vehículo', 'auto', 'carro', 'coche'].includes(c.toLowerCase().trim()));
      colTime = row.findIndex(c => ['tiempo', 'time', 'total'].includes(c.toLowerCase().trim()));
      colPenalty = row.findIndex(c => ['penal.', 'penalizacion', 'penalty', 'penal'].includes(c.toLowerCase().trim()));

      // Registrar columnas TC si estamos en una tabla general o mixta
      row.forEach((cell, idx) => {
        const tcMatch = cell.trim().match(/^(TC\s*\d+[\s_A-Z0-9-]*|SUPER PRIME\s*\d+[\s_A-Z0-9-]*|SP\s*\d+[\s_A-Z0-9-]*|SUPER PRIME|SP|TC)/i);
        if (tcMatch) {
          tcColumns[tcMatch[1].toUpperCase().trim()] = idx;
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
    const penalStr = colPenalty >= 0 ? row[colPenalty]?.trim() : "";

    const numero = parseInt(numStr, 10);

    if (isNaN(numero) || numero <= 0 || !eqStr) continue;

    const posicionParsed = parseInt(posStr, 10);
    const posicion = isNaN(posicionParsed) ? 0 : posicionParsed;
    const penalMs = parsePenalty(penalStr);

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
      let sumStageSeconds = 0;
      // Extraer los tiempos de las columnas TC en la misma fila (Modo Columnas)
      for (const [tc, idx] of Object.entries(tcColumns)) {
        const tcTimeStr = row[idx]?.trim();
        const tSecs = parseTimeToSeconds(tcTimeStr);
        if (tcTimeStr && tSecs !== null) {
          sumStageSeconds += tSecs;
          if (!result.stages[tc]) result.stages[tc] = [];
          result.stages[tc].push({
            posicion: 0, 
            numero,
            equipo: eqStr,
            vehiculo: vehStr || undefined,
            tiempo: formatRallyTime(tSecs),
            diferencia: ""
          });
        }
      }

      // Guardamos la fila "general" solo si trae un tiempo total usable.
      const officialTimeSecs = parseTimeToSeconds(timeStr);
      if (timeStr && officialTimeSecs !== null) {
        let status: 'pending' | 'applied' | undefined = undefined;
        
        if (penalMs > 0) {
          // Check if penalty is applied (with a 1-second tolerance due to rounding)
          const diffNoPenal = Math.abs(officialTimeSecs - sumStageSeconds);
          const diffWithPenal = Math.abs(officialTimeSecs - (sumStageSeconds + (penalMs / 1000)));
          
          if (diffWithPenal <= 1.0) {
            status = 'applied';
          } else if (diffNoPenal <= 1.0) {
            status = 'pending';
          } else {
            status = 'pending'; // Si no cuadra exacto, asumimos pending por seguridad
          }
        }

        result.general.push({
          posicion,
          numero,
          equipo: eqStr,
          vehiculo: vehStr || undefined,
          tiempo: formatRallyTime(officialTimeSecs),
          diferencia: "",
          penalizacion: penalStr || undefined,
          penalizacionMs: penalMs,
          penalizacionStatus: status
        });
      }
    } else {
      // Modo Tablas Bloques: Estamos en una tabla exclusiva de un TC
      const blockTimeSecs = parseTimeToSeconds(timeStr);
      if (!result.stages[currentStageId]) result.stages[currentStageId] = [];
      result.stages[currentStageId].push({
        posicion,
        numero,
        equipo: eqStr,
        vehiculo: vehStr || undefined,
        tiempo: blockTimeSecs !== null ? formatRallyTime(blockTimeSecs) : timeStr,
        diferencia: ""
      });
    }
  }

  recalculateDifferences(result.general);

  // Mezclar la tabla General oficial (que viene con los tiempos oficiales y penalizaciones)
  // con los pilotos que no aparecen en la General pero sí corrieron algún TC (abandonos/reenganchados).
  const computedGeneral = buildComputedGeneral(result.stages);
  
  if (computedGeneral.length > 0) {
    const officialNumbers = new Set(result.general.map(r => r.numero));
    const missingDrivers = computedGeneral.filter(c => !officialNumbers.has(c.numero));
    
    // Asignar posiciones continuas a los que faltan
    let nextPos = result.general.length > 0 ? Math.max(...result.general.map(r => r.posicion)) + 1 : 1;
    missingDrivers.forEach(d => {
      d.posicion = nextPos++;
    });

    // Solo añadimos a los que faltan
    result.general.push(...missingDrivers);
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

  // Generar clasificaciones matemáticas para cada Etapa (General del Día)
  const groupedEtapas = groupStageKeysByEtapa(Object.keys(result.stages));
  for (const group of groupedEtapas) {
    const stageResultsForEtapa: Record<string, RallyResult[]> = {};
    for (const key of group.keys) {
      if (result.stages[key]) {
        stageResultsForEtapa[key] = result.stages[key];
      }
    }
    const computedEtapa = buildComputedGeneral(stageResultsForEtapa);
    if (computedEtapa.length > 0) {
      result.etapas[group.etapa] = computedEtapa;
    }
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
      tiempo: formatRallyTime(d.total),
      diferencia,
    };
  });
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
