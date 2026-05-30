import { NextResponse } from "next/server";
import { fetchSheetCsv } from "@/lib/fetchSheet";
import { normalizeResults } from "@/lib/normalize";
import { mergeAllResults } from "@/lib/mergeDrivers";

// Habilitamos ISR (Incremental Static Regeneration).
// Esta ruta mantendrá en caché la respuesta en Vercel durante 30 segundos.
// Las peticiones de los usuarios en ese lapso no llegarán a Google Sheets.
export const revalidate = 30;

export async function GET() {
  try {
    // Definimos el sheet público
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFe5HuuC7i-gBTbAZgUJ5gsaR-fPFV17pBPcWoLY4XD-Tq05y1b1F8tn-wK6LNFydxdGTkrXfTfpzA/pub?output=csv";

    // 1. Obtener CSV bruto
    const rawCsvText = await fetchSheetCsv(sheetUrl);

    // 2. Normalizar la data en objetos (Ahora extrae General y Stages)
    const cleanData = normalizeResults(rawCsvText);

    // 3. Enriquecer con data local y fallback FEDAK
    const finalData = mergeAllResults(cleanData);

    // 4. Retornar al cliente
    return NextResponse.json(finalData, { status: 200 });
  } catch (error) {
    console.error("Error fetching live results:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los resultados" },
      { status: 500 }
    );
  }
}
