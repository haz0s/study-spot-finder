import { StudySpace } from '@/types/space';

export async function loadSpaces(): Promise<StudySpace[]> {
  const res = await fetch('/data/spaces.csv');
  const text = await res.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line, idx) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += char;
    }
    values.push(current.trim());

    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = values[i] || ''; });

    const software = obj.availableSoftware === 'None' ? [] : obj.availableSoftware.split(',').map(s => s.trim());

    return {
      id: `space-${idx}`,
      name: obj.name,
      building: obj.building,
      floor: obj.floor,
      capacity: parseInt(obj.capacity, 10),
      spaceType: obj.spaceType as StudySpace['spaceType'],
      availableSoftware: software,
      openingHours: obj.openingHours,
      currentCheckIns: 0,
      totalPCs: parseInt(obj.totalPCs, 10) || 0,
      currentPCCheckIns: 0,
      peakHours: obj.peakHours || 'N/A',
    };
  });
}
