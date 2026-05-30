/**
 * Descarga el contenido de un Google Sheet público en formato CSV.
 * 
 * @param url - La URL de exportación a CSV del Google Sheet público.
 *              (Ej. https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID})
 * @returns Una promesa que resuelve con el texto CSV.
 * @throws Error si falla la conexión de red, la respuesta no es OK o el contenido está vacío.
 */
export async function fetchSheetCsv(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "text/csv, text/plain, */*",
      },
      // Usamos revalidate de 30 segundos (ISR) en lugar de "no-store".
      // Esto protege la API de Google Sheets almacenando la respuesta en la caché
      // compartida de Vercel (Edge/Serverless) durante 30s sin importar cuántos usuarios la pidan.
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la petición de red HTTP: ${response.status} ${response.statusText}`
      );
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error("El documento obtenido de Google Sheets está vacío.");
    }

    return csvText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fallo al obtener el CSV de Google Sheets: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al intentar descargar el Google Sheet.");
  }
}
