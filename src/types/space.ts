export type SpaceType = 'Silent' | 'Group' | 'Computer Lab';

export type AvailabilityStatus = 'Available' | 'Moderate' | 'Likely Full';

export type PCAvailabilityStatus = 'PCs Available' | 'Limited PCs' | 'PCs Likely Full';

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
  totalPCs: number;
  currentPCCheckIns: number;
  peakHours: string;
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

export function getPCUsagePercent(space: StudySpace): number {
  if (space.totalPCs === 0) return 0;
  return Math.round((space.currentPCCheckIns / space.totalPCs) * 100);
}

export function getPCAvailabilityStatus(space: StudySpace): PCAvailabilityStatus {
  const pct = getPCUsagePercent(space);
  if (pct < 50) return 'PCs Available';
  if (pct < 90) return 'Limited PCs';
  return 'PCs Likely Full';
}
