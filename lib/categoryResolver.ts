import driversData from "@/data/drivers.json";
import { DriverMetadata } from "./mergeDrivers";

// Catálogo oficial estricto
export const CATEGORY_ORDER = [
  "General",
  "Rally 2 / R5",
  "N5 Prototipos",
  "RC3",
  "RC4",
  "RC5",
  "RC2N",
  "T4",
  "T3",
  "T1",
  "TODO TERRENO",
  "UTV-R",
  "UTV-T",
  "CAMIONETAS"
];

// Creamos un mapa rápido en memoria de los conductores registrados
const driversMap = new Map<number, DriverMetadata>();
(driversData as DriverMetadata[]).forEach(driver => {
  driversMap.set(Number(driver.numero), driver);
});

// Fallback por enumeración oficial de FEDAK
export function inferCategory(numero: number): string {
  if (numero >= 951 && numero <= 999) return "UTV-R";
  if (numero >= 900 && numero <= 950) return "UTV-T";
  if (numero >= 700 && numero <= 899) return "CAMIONETAS";
  if (numero >= 600 && numero <= 699) return "TODO TERRENO";
  if (numero >= 400 && numero <= 599) return "T1";
  if (numero >= 300 && numero <= 399) return "T3";
  if (numero >= 200 && numero <= 299) return "T4";
  if (numero >= 100 && numero <= 199) return "RC2N";
  if (numero >= 70 && numero <= 99) return "RC5";
  if (numero >= 50 && numero <= 69) return "RC4";
  if (numero >= 40 && numero <= 49) return "RC3";
  if (numero >= 20 && numero <= 39) return "N5 Prototipos";
  if (numero >= 10 && numero <= 19) return "Rally 2 / R5";

  return "SIN CLASIFICAR";
}

export type CategorySource = "registered" | "inferred" | "unknown";

export interface ResolvedDriverInfo {
  piloto: string;
  copiloto: string;
  vehiculo: string;
  categoria: string;
  categorySource: CategorySource;
}

/**
 * Resuelve la metadata completa de un competidor garantizando
 * el uso estricto del JSON o el fallback oficial FEDAK.
 *
 * @param numero El número del vehículo
 * @param rawEquipo El nombre bruto del equipo proveniente del CSV (usado solo como fallback de piloto/copiloto)
 */
export function resolveDriverMetadata(numero: number, rawEquipo: string): ResolvedDriverInfo {
  // 1. Autoridad máxima: El archivo local
  const registeredMetadata = driversMap.get(numero);
  
  if (registeredMetadata) {
    let validCategory = registeredMetadata.categoria;
    
    // Validar rígidamente. Si drivers.json tiene basura como "RC2E", lo forzamos al reglamento FEDAK.
    if (!CATEGORY_ORDER.includes(validCategory)) {
      validCategory = inferCategory(numero);
    }

    return {
      piloto: registeredMetadata.piloto,
      copiloto: registeredMetadata.copiloto,
      vehiculo: registeredMetadata.vehiculo,
      categoria: validCategory,
      categorySource: "registered"
    };
  }

  // 2. Fallback de nombres para pilotos no registrados
  let fallbackPiloto = rawEquipo;
  let fallbackCopiloto = "";

  if (rawEquipo.includes("/")) {
    const parts = rawEquipo.split("/");
    fallbackPiloto = parts[0].trim();
    fallbackCopiloto = parts[1].trim();
  }

  // 3. Inferencia de Categoría FEDAK
  const inferredCategory = inferCategory(numero);

  return {
    piloto: fallbackPiloto,
    copiloto: fallbackCopiloto,
    vehiculo: "Desconocido",
    categoria: inferredCategory,
    categorySource: inferredCategory === "SIN CLASIFICAR" ? "unknown" : "inferred"
  };
}
