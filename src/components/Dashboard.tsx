import { StudySpace, getOccupancyPercent, getAvailabilityStatus } from '@/types/space';
import { useSpaces } from '@/context/SpacesContext';

export function Dashboard() {
  const { spaces } = useSpaces();

  const totalSpaces = spaces.length;
  const totalAvailableSeats = spaces.reduce((sum, s) => sum + (s.capacity - s.currentCheckIns), 0);
  const mostOccupied = spaces.length
    ? spaces.reduce((max, s) => getOccupancyPercent(s) > getOccupancyPercent(max) ? s : max, spaces[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard label="Total Spaces" value={totalSpaces} />
      <StatCard label="Available Seats" value={totalAvailableSeats} />
      <StatCard
        label="Most Occupied"
        value={mostOccupied ? mostOccupied.name : '—'}
        sub={mostOccupied ? `${getOccupancyPercent(mostOccupied)}% full` : undefined}
      />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-foreground truncate">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
