import { readFile } from "fs/promises";
import path from "path";
import { formatDiffTime, parseTimeToSeconds } from "@/lib/time";

interface FinalResultsFile {
  encabezados: string[];
  resultados: Record<string, string>[],
}

function normalizeTimeString(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\s+/g, "").replace(/(\d+)h/gi, "$1:");
}

function splitTeam(team: string): { piloto: string; copiloto: string } {
  const parts = team.split("/").map(p => p.trim()).filter(Boolean);
  return {
    piloto: parts[0] || team.trim(),
    copiloto: parts[1] || "",
  };
}

export async function loadFinalResults(): Promise<any> {
  const generalPath = path.join(process.cwd(), "data", "resultadosgeneral.json");
  const jsonText = await readFile(generalPath, "utf-8");
  const parsed: FinalResultsFile = JSON.parse(jsonText);

  const tcKeys = parsed.encabezados.filter(h => /^TC\d+$/i.test(h));

  const general = parsed.resultados.map((row, index) => {
    const posicion = parseInt(row["Clt"], 10);
    const numero = parseInt(row["N°"], 10);
    const { piloto, copiloto } = splitTeam(row["Equipo"] || "");
    const tiempo = normalizeTimeString(row["Tiempo"]) || "-";

    return {
      posicion: Number.isFinite(posicion) ? posicion : index + 1,
      numero: Number.isFinite(numero) ? numero : 0,
      piloto,
      copiloto,
      categoria: (row["Grupo"] || "SIN CLASIFICAR").trim(),
      vehiculo: (row["Vehiculo"] || "").trim(),
      tiempo,
      diferencia: "-",
      categorySource: "registered",
    };
  }).filter(r => r.numero > 0);

  // Asegurar orden por posicion
  general.sort((a, b) => a.posicion - b.posicion);

  const leaderSeconds = parseTimeToSeconds(general[0]?.tiempo || "");
  if (leaderSeconds != null) {
    for (let i = 0; i < general.length; i++) {
      if (i === 0) {
        general[i].diferencia = "-";
        continue;
      }
      const t = parseTimeToSeconds(general[i].tiempo);
      if (t != null) {
        general[i].diferencia = formatDiffTime(t - leaderSeconds);
      }
    }
  }

  const stages: Record<string, typeof general> = {};

  for (const tcKey of tcKeys) {
    const stageRows = parsed.resultados
      .map((row) => {
        const rawTime = normalizeTimeString(row[tcKey]);
        if (!rawTime) return null;

        const numero = parseInt(row["N°"], 10);
        const { piloto, copiloto } = splitTeam(row["Equipo"] || "");

        return {
          posicion: 0,
          numero: Number.isFinite(numero) ? numero : 0,
          piloto,
          copiloto,
          categoria: (row["Grupo"] || "SIN CLASIFICAR").trim(),
          vehiculo: (row["Vehiculo"] || "").trim(),
          tiempo: rawTime,
          diferencia: "-",
          categorySource: "registered",
        };
      })
      .filter(Boolean) as typeof general;

    stageRows.sort((a, b) => {
      const ta = parseTimeToSeconds(a.tiempo) ?? Infinity;
      const tb = parseTimeToSeconds(b.tiempo) ?? Infinity;
      return ta - tb;
    });

    let stageLeader: number | null = null;
    stageRows.forEach((row, idx) => {
      row.posicion = idx + 1;
      const t = parseTimeToSeconds(row.tiempo);
      if (idx === 0) {
        stageLeader = t;
        row.diferencia = "-";
      } else if (stageLeader != null && t != null) {
        row.diferencia = formatDiffTime(t - stageLeader);
      }
    });

    stages[tcKey.toUpperCase()] = stageRows;
  }

  return { general, stages };
}
