import { useNavigate } from 'react-router-dom';
import { StudySpace, getOccupancyPercent, getAvailabilityStatus } from '@/types/space';
import { Users, Monitor, Volume2, UsersRound } from 'lucide-react';

const statusColors: Record<string, string> = {
  'Available': 'bg-status-available/10 text-status-available',
  'Moderate': 'bg-status-moderate/10 text-status-moderate',
  'Likely Full': 'bg-status-full/10 text-status-full',
};

const typeIcons: Record<string, React.ReactNode> = {
  'Silent': <Volume2 className="w-4 h-4" />,
  'Group': <UsersRound className="w-4 h-4" />,
  'Computer Lab': <Monitor className="w-4 h-4" />,
};

export function SpaceCard({ space }: { space: StudySpace }) {
  const navigate = useNavigate();
  const pct = getOccupancyPercent(space);
  const status = getAvailabilityStatus(space);

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground text-lg leading-tight">{space.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{space.building}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">{typeIcons[space.spaceType]} {space.spaceType}</span>
        <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" /> {space.capacity}</span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Occupancy</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct < 50 ? 'bg-status-available' : pct < 90 ? 'bg-status-moderate' : 'bg-status-full'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/space/${space.id}`)}
        className="mt-auto w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        View Details
      </button>
    </div>
  );
}
