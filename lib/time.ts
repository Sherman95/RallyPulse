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

export function parsePenalty(value: string | number | null | undefined): number {
  if (!value) return 0;
  
  const strValue = String(value).trim();
  if (strValue === '' || strValue === '0' || strValue === '0.0') return 0;

  if (strValue.includes(':')) {
    const parts = strValue.split(':');
    if (parts.length === 2) {
      return (parseInt(parts[0], 10) * 60 + parseFloat(parts[1])) * 1000;
    }
  }
  
  const parsed = parseFloat(strValue);
  return isNaN(parsed) ? 0 : parsed * 1000;
}

export function formatPenalty(ms: number): string {
  if (ms <= 0) return '';
  const totalSeconds = ms / 1000;
  const m = Math.floor(totalSeconds / 60);
  const s = (totalSeconds % 60).toFixed(1);
  
  if (m > 0) {
    return `+${m}:${s.padStart(4, "0")}`;
  }
  return `+${s}`;
}

export function formatRallyTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "-";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = (totalSeconds % 60).toFixed(1);

  if (h > 0) {
    return `${h}h${m.toString().padStart(2, "0")}:${s.padStart(4, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.padStart(4, "0")}`;
}
