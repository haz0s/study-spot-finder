import { getOccupancyPercent } from '@/types/space';
import { useSpaces } from '@/context/SpacesContext';
import { Building2, Armchair, Monitor, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { spaces } = useSpaces();

  const totalSpaces = spaces.length;
  const totalAvailableSeats = spaces.reduce((sum, s) => sum + (s.capacity - s.currentCheckIns), 0);
  const mostOccupied = spaces.length
    ? spaces.reduce((max, s) => getOccupancyPercent(s) > getOccupancyPercent(max) ? s : max, spaces[0])
    : null;

  const totalPCs = spaces.reduce((sum, s) => sum + s.totalPCs, 0);
  const totalPCsInUse = spaces.reduce((sum, s) => sum + s.currentPCCheckIns, 0);
  const totalPCsAvailable = totalPCs - totalPCsInUse;
  const mostOccupiedPct = mostOccupied ? getOccupancyPercent(mostOccupied) : 0;

  return (
    <div className="space-y-4 mb-8">
      {/* Top row: quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStat icon={<Building2 className="w-4 h-4" />} label="Spaces" value={totalSpaces} />
        <MiniStat icon={<Armchair className="w-4 h-4" />} label="Seats Free" value={totalAvailableSeats} />
        <MiniStat icon={<Monitor className="w-4 h-4" />} label="PCs Free" value={totalPCsAvailable} suffix={`/ ${totalPCs}`} />
        <MiniStat icon={<Monitor className="w-4 h-4" />} label="PCs In Use" value={totalPCsInUse} />
      </div>

      {/* Featured: Most Occupied */}
      {mostOccupied && (
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Busiest Space Right Now</p>
              <p className="font-display text-lg font-bold text-foreground truncate">{mostOccupied.name}</p>
              <p className="text-sm text-muted-foreground">{mostOccupied.building} · {mostOccupied.spaceType}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-display text-3xl font-bold ${mostOccupiedPct >= 90 ? 'text-status-full' : mostOccupiedPct >= 50 ? 'text-status-moderate' : 'text-status-available'}`}>
                {mostOccupiedPct}%
              </p>
              <p className="text-xs text-muted-foreground">occupied</p>
            </div>
          </div>
          {/* Subtle decorative bar */}
          <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${mostOccupiedPct >= 90 ? 'bg-status-full' : mostOccupiedPct >= 50 ? 'bg-status-moderate' : 'bg-status-available'}`}
              style={{ width: `${mostOccupiedPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number | string; suffix?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold text-foreground leading-tight">
          {value}
          {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}
