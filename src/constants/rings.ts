export interface Ring {
  id: number;
  label: string;
  radius: number; // 0-1 normalized
  hours: [number, number]; // [start, end] hours from now
}

export const RINGS: Ring[] = [
  { id: 1, label: '0-8h', radius: 0.2, hours: [0, 8] },
  { id: 2, label: '8-16h', radius: 0.4, hours: [8, 16] },
  { id: 3, label: '16-24h', radius: 0.6, hours: [16, 24] },
  { id: 4, label: 'Tomorrow', radius: 0.8, hours: [24, 48] },
  { id: 5, label: 'Week', radius: 1.0, hours: [48, 168] },
];

