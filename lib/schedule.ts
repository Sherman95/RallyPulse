import scheduleData from '@/data/rally-schedule.json';

export interface StageSchedule {
  id: string; // e.g. "TC1"
  name: string;
  distanceKm: number;
  firstCarTime: string; // ISO string
  maxTimeMins: number;
}

export type StageStatus = 'Próximo' | 'En Curso' | 'Finalizado';

export function getAllStages(): StageSchedule[] {
  return scheduleData.stages as StageSchedule[];
}

export function getStageById(id: string): StageSchedule | undefined {
  return getAllStages().find(s => s.id === id);
}

export function getStageStatus(stage: StageSchedule, currentTimeMs: number = Date.now()): StageStatus {
  const firstCarMs = new Date(stage.firstCarTime).getTime();
  const maxTimeMs = stage.maxTimeMins * 60 * 1000;
  const endTimeMs = firstCarMs + maxTimeMs;

  if (currentTimeMs < firstCarMs) {
    return 'Próximo';
  } else if (currentTimeMs > endTimeMs) {
    return 'Finalizado';
  } else {
    return 'En Curso';
  }
}
