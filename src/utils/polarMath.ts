import { PolarCoordinate } from '../types';
import { categoryToAngle } from '../constants/sectors';
import { RINGS } from '../constants/rings';

/**
 * Convert time difference (in hours) to normalized radius (0-1)
 */
export function timeToRadius(hours: number): number {
  if (hours <= 0) return 0;
  if (hours <= 8) return (hours / 8) * 0.2; // Ring 1
  if (hours <= 16) return 0.2 + ((hours - 8) / 8) * 0.2; // Ring 2
  if (hours <= 24) return 0.4 + ((hours - 16) / 8) * 0.2; // Ring 3
  if (hours <= 48) return 0.6 + ((hours - 24) / 24) * 0.2; // Ring 4
  return 0.8 + Math.min((hours - 48) / 168, 0.2); // Ring 5
}

/**
 * Convert event time to polar coordinates
 * For unscheduled todos (startTime === endTime and in past), place on outer perimeter
 */
export function timeToPolar(eventTime: Date, now: Date, category: string, isFixed: boolean = true): PolarCoordinate {
  const timeDiff = eventTime.getTime() - now.getTime();
  const hours = timeDiff / (1000 * 60 * 60);
  
  // Unscheduled todos go to outer perimeter (Ring 5)
  let radius: number;
  if (!isFixed && hours < 0) {
    radius = 0.95; // Outer perimeter
  } else {
    radius = timeToRadius(hours);
  }
  
  const angle = categoryToAngle(category as any);
  
  return { angle, radius };
}

/**
 * Convert polar coordinates to Cartesian (x, y) on canvas
 */
export function polarToCartesian(
  angle: number,
  radius: number,
  centerX: number,
  centerY: number,
  maxRadius: number
): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  const r = radius * maxRadius;
  const x = centerX + r * Math.cos(radians);
  const y = centerY + r * Math.sin(radians);
  return { x, y };
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

