export type Category = 'work' | 'personal' | 'health';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface PolarCoordinate {
  angle: number; // 0-360 degrees
  radius: number; // 0-1 (normalized)
}

export interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  category: Category;
  description?: string;
  isFixed: boolean; // true for calendar events, false for todos
  priority?: Priority; // Priority level (defaults to 'medium')
}

export interface Todo extends Event {
  isComplete: boolean;
  checklist?: string[];
}

export interface BlipPosition {
  x: number;
  y: number;
  polar: PolarCoordinate;
}

