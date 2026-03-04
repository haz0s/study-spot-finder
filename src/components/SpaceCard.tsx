import { useNavigate } from 'react-router-dom';
import { StudySpace, getOccupancyPercent, getAvailabilityStatus, getPCUsagePercent, getPCAvailabilityStatus } from '@/types/space';
import { Users, Monitor, Volume2, UsersRound, ArrowRight } from 'lucide-react';

const statusStyles: Record<string, string> = {
  'Available': 'bg-status-available/15 text-status-available',
  'Moderate': 'bg-status-moderate/15 text-status-moderate',
  'Likely Full': 'bg-status-full/15 text-status-full',
};

const pcStatusStyles: Record<string, string> = {
  'PCs Available': 'bg-status-available/15 text-status-available',
  'Limited PCs': 'bg-status-moderate/15 text-status-moderate',
  'PCs Likely Full': 'bg-status-full/15 text-status-full',
};

const typeIcons: Record<string, React.ReactNode> = {
  'Silent': <Volume2 className="w-3.5 h-3.5" />,
  'Group': <UsersRound className="w-3.5 h-3.5" />,
  'Computer Lab': <Monitor className="w-3.5 h-3.5" />,
};

export function SpaceCard({ space }: { space: StudySpace }) {
  const navigate = useNavigate();
  const pct = getOccupancyPercent(space);
  const status = getAvailabilityStatus(space);
  const hasPCs = space.totalPCs > 0;
  const pcPct = hasPCs ? getPCUsagePercent(space) : 0;
  const pcStatus = hasPCs ? getPCAvailabilityStatus(space) : null;

  return (
    <div
      onClick={() => navigate(`/space/${space.id}`)}
      className="group bg-card rounded-xl border border-border p-5 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{space.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{space.building} · {space.floor} Floor</p>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      {/* Meta chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
          {typeIcons[space.spaceType]} {space.spaceType}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
          <Users className="w-3.5 h-3.5" /> {space.capacity} seats
        </span>
        {hasPCs && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
            <Monitor className="w-3.5 h-3.5" /> {space.totalPCs} PCs
          </span>
        )}
      </div>

      {/* Bars */}
      <div className="space-y-2.5">
        {/* Room occupancy */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Seats</span>
            <span className="font-medium text-foreground">{space.currentCheckIns}/{space.capacity}</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct < 50 ? 'bg-status-available' : pct < 90 ? 'bg-status-moderate' : 'bg-status-full'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* PC usage */}
        {hasPCs && pcStatus && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>PCs</span>
              <span className={`font-medium text-xs px-1.5 py-0.5 rounded-full ${pcStatusStyles[pcStatus]}`}>{pcStatus}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pcPct < 50 ? 'bg-status-available' : pcPct < 90 ? 'bg-status-moderate' : 'bg-status-full'}`}
                style={{ width: `${pcPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-1">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
          View Details <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
