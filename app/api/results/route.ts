import { NextResponse } from "next/server";
import { fetchSheetCsv } from "@/lib/fetchSheet";
import { normalizeResults, RallyResult } from "@/lib/normalize";
import { resolveDriverMetadata } from "@/lib/categoryResolver";

export const revalidate = false;

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckYYdRrr3u4YgmsVbGoCuOlUYBCYoSkUoCHVg6qgbsANTQA53p5SW-1mnGUhFWPPp42JkXzRnknD0/pub?gid=0&single=true&output=csv";

function enhanceResult(r: RallyResult) {
  const meta = resolveDriverMetadata(r.numero, r.equipo, r.vehiculo);
  return {
    ...r,
    piloto: meta.piloto,
    copiloto: meta.copiloto,
    vehiculo: meta.vehiculo,
    categoria: meta.categoria,
    categorySource: meta.categorySource,
  };
}

export async function GET() {
  try {
    const csvText = await fetchSheetCsv(SHEET_URL);
    const rawData = normalizeResults(csvText);
    
    // Mejorar cada fila con las categorías y nombres de pilotos
    const finalData = {
      general: rawData.general.map(enhanceResult),
      stages: Object.fromEntries(
        Object.entries(rawData.stages).map(([k, v]) => [k, v.map(enhanceResult)])
      ),
      etapas: Object.fromEntries(
        Object.entries(rawData.etapas || {}).map(([k, v]) => [k, v.map(enhanceResult)])
      )
    };
    
    return NextResponse.json(finalData, { status: 200 });
  } catch (error: any) {
    console.error("[API Results] Read error:", error.message || error);
    
    return NextResponse.json(
      { 
        error: "No se pudieron obtener los resultados desde Google Sheets", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
