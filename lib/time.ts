export function parseTimeToSeconds(timeStr: string): number | null {
  // Limpiar espacios extra
  let cleanTime = timeStr.trim().toLowerCase();
  
  // Si viene con formato "1h29:33.9", cambiar la 'h' por ':'
  cleanTime = cleanTime.replace('h', ':');
  
  const parts = cleanTime.split(":");
  let total = 0;

  if (parts.length === 2) {
    total += parseInt(parts[0], 10) * 60;
    total += parseFloat(parts[1]);
  } else if (parts.length === 3) {
    total += parseInt(parts[0], 10) * 3600;
    total += parseInt(parts[1], 10) * 60;
    total += parseFloat(parts[2]);
  } else {
    return null;
  }

  return isNaN(total) ? null : total;
}

export function formatDiffTime(diffSeconds: number): string {
  if (diffSeconds < 0) return "-";

  const h = Math.floor(diffSeconds / 3600);
  const m = Math.floor((diffSeconds % 3600) / 60);
  const s = (diffSeconds % 60).toFixed(1);

  if (h > 0) {
    return `+${h}:${m.toString().padStart(2, "0")}:${s.padStart(4, "0")}`;
  }

  return `+${m}:${s.padStart(4, "0")}`;
}
