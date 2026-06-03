import { NextResponse } from "next/server";
import { loadFinalResults } from "@/lib/finalResults";

export const revalidate = false;

export async function GET() {
  try {
    const finalData = await loadFinalResults();
    return NextResponse.json(finalData, { status: 200 });
  } catch (error: any) {
    console.error("[API Results] Read error:", error.message || error);
    
    // Devolvemos 500. En Vercel ISR, esto causa que Next.js retenga la caché 
    // antigua (stale-while-revalidate), lo cual es el comportamiento deseado.
    return NextResponse.json(
      { 
        error: "No se pudieron obtener los resultados locales", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
