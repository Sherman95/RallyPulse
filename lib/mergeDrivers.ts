import { RallyResult, ProcessedResults } from "./normalize";
import { resolveDriverMetadata, CategorySource } from "./categoryResolver";

export interface DriverMetadata {
  numero: number;
  piloto: string;
  copiloto: string;
  vehiculo: string;
  categoria: string;
}

export interface EnrichedRallyResult {
  posicion: number;
  numero: number;
  piloto: string;
  copiloto: string;
  categoria: string;
  vehiculo: string;
  tiempo: string;
  diferencia: string;
  categorySource: CategorySource;
}

export interface EnrichedProcessedResults {
  general: EnrichedRallyResult[];
  stages: Record<string, EnrichedRallyResult[]>;
}

/**
 * Enriquece una lista de resultados cruzándolos con la metadata local
 * y el sistema oficial de categorización (FEDAK fallback).
 */
export function mergeWithDrivers(liveResults: RallyResult[]): EnrichedRallyResult[] {
  return liveResults.map(result => {
    const resolvedInfo = resolveDriverMetadata(result.numero, result.equipo, result.vehiculo);
    return {
      posicion: result.posicion,
      numero: result.numero,
      piloto: resolvedInfo.piloto,
      copiloto: resolvedInfo.copiloto,
      categoria: resolvedInfo.categoria,
      vehiculo: resolvedInfo.vehiculo,
      tiempo: result.tiempo,
      diferencia: result.diferencia,
      categorySource: resolvedInfo.categorySource
    };
  });
}

/**
 * Enriquece todos los bloques de resultados (General y TCs independientes)
 */
export function mergeAllResults(processedData: ProcessedResults): EnrichedProcessedResults {
  const enriched: EnrichedProcessedResults = {
    general: mergeWithDrivers(processedData.general),
    stages: {}
  };

  for (const tcId of Object.keys(processedData.stages)) {
    enriched.stages[tcId] = mergeWithDrivers(processedData.stages[tcId]);
  }

  return enriched;
}
