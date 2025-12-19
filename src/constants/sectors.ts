import { Category } from '../types';

export interface Sector {
  category: Category;
  label: string;
  startAngle: number; // degrees
  endAngle: number; // degrees
  color: string;
}

export const SECTORS: Sector[] = [
  { category: 'work', label: 'Work', startAngle: 0, endAngle: 120, color: '#60a5fa' },
  { category: 'personal', label: 'Personal', startAngle: 120, endAngle: 240, color: '#34d399' },
  { category: 'health', label: 'Health', startAngle: 240, endAngle: 360, color: '#fbbf24' },
];

export function getSectorForCategory(category: Category): Sector {
  return SECTORS.find(s => s.category === category) || SECTORS[0];
}

export function categoryToAngle(category: Category): number {
  const sector = getSectorForCategory(category);
  return (sector.startAngle + sector.endAngle) / 2;
}

