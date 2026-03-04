export type SpaceType = 'Silent' | 'Group' | 'Computer Lab';

export type AvailabilityStatus = 'Available' | 'Moderate' | 'Likely Full';

export interface StudySpace {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  spaceType: SpaceType;
  availableSoftware: string[];
  openingHours: string;
  currentCheckIns: number;
}

export function getOccupancyPercent(space: StudySpace): number {
  if (space.capacity === 0) return 100;
  return Math.round((space.currentCheckIns / space.capacity) * 100);
}

export function getAvailabilityStatus(space: StudySpace): AvailabilityStatus {
  const pct = getOccupancyPercent(space);
  if (pct < 50) return 'Available';
  if (pct < 90) return 'Moderate';
  return 'Likely Full';
}
