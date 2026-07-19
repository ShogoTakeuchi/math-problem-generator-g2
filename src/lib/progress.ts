import type { ProblemType } from "./problems";

export interface ModeProgress {
  best: number;
  sessions: number;
  correct: number;
  answered: number;
}

export type Progress = Record<ProblemType, ModeProgress>;

const STORAGE_KEY = "sansuu-island-progress-v1";

const emptyMode = (): ModeProgress => ({
  best: 0,
  sessions: 0,
  correct: 0,
  answered: 0,
});

export const emptyProgress = (): Progress => ({
  addition: emptyMode(),
  subtraction: emptyMode(),
  multiplication: emptyMode(),
  division: emptyMode(),
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress();
    const parsed = JSON.parse(saved) as Partial<Progress>;
    const base = emptyProgress();

    return {
      addition: { ...base.addition, ...parsed.addition },
      subtraction: { ...base.subtraction, ...parsed.subtraction },
      multiplication: { ...base.multiplication, ...parsed.multiplication },
      division: { ...base.division, ...parsed.division },
    };
  } catch {
    return emptyProgress();
  }
}

export function saveSession(type: ProblemType, score: number, total: number) {
  const progress = loadProgress();
  const current = progress[type];
  progress[type] = {
    best: Math.max(current.best, score),
    sessions: current.sessions + 1,
    correct: current.correct + score,
    answered: current.answered + total,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function resetProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getTotalStars(progress: Progress) {
  return Object.values(progress).reduce(
    (total, mode) => total + Math.min(mode.best, 10),
    0,
  );
}
