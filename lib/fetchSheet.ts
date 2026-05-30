/**
 * Descarga el contenido de un Google Sheet público en formato CSV.
 * 
 * @param url - La URL de exportación a CSV del Google Sheet público.
 *              (Ej. https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID})
 * @returns Una promesa que resuelve con el texto CSV.
 * @throws Error si falla la conexión de red, la respuesta no es OK o el contenido está vacío.
 */
export async function fetchSheetCsv(url: string, retries = 3, backoff = 1000): Promise<string> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      // AbortSignal para forzar timeout en 5 segundos, previniendo que Vercel cancele
      // toda la request con error 500 por superar los 10s límite.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "text/csv, text/plain, */*",
        },
        // Usamos revalidate de 30 segundos (ISR)
        next: { revalidate: 30 },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();

      if (!csvText || csvText.trim().length === 0) {
        throw new Error("El documento obtenido de Google Sheets está vacío.");
      }

      return csvText;
    } catch (error: any) {
      attempt++;
      
      const isAbortError = error.name === 'AbortError' || error.message?.includes('timeout');
      
      console.warn(`[fetchSheet] Intento ${attempt} fallido: ${error.message}`);
      
      if (attempt >= retries) {
        throw new Error(`Fallo definitivo al obtener CSV tras ${retries} intentos: ${error.message}`);
      }
      
      // Si fue timeout o error de red, esperamos antes de reintentar (Backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error("Error desconocido en fetchSheetCsv");
}
