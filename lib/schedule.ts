import scheduleData from '@/data/rally-schedule.json';

export interface StageSchedule {
  id: string; // e.g. "TC1"
  name: string;
  distanceKm: number;
  firstCarTime: string; // ISO string
  maxTimeMins: number;
  cancelled?: boolean;
  cancelReason?: string;
}

export type StageStatus = 'Siguiente' | 'Cancelado';

export function getAllStages(): StageSchedule[] {
  return scheduleData.stages as StageSchedule[];
}

export function getStageById(id: string): StageSchedule | undefined {
  return getAllStages().find(s => s.id === id);
}

export function getStageStatus(stage: StageSchedule, _currentTimeMs: number = Date.now()): StageStatus {
  if (stage.cancelled) {
    return 'Cancelado';
  }

  // Evitamos estados por hora (atrasos reales). Mostramos un único estado.
  return 'Siguiente';
}
