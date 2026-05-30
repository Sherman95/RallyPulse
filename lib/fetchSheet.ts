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
      // cache: "no-store" asegura que siempre obtengamos los resultados en tiempo real 
      // y no una versión cacheada, crucial para resultados de rally.
      cache: "no-store",
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
