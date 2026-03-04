import { useParams, useNavigate } from 'react-router-dom';
import { useSpaces } from '@/context/SpacesContext';
import { getOccupancyPercent, getAvailabilityStatus } from '@/types/space';
import { ArrowLeft, Clock, MapPin, Users, Layers, Minus, Plus } from 'lucide-react';

export default function SpaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { spaces, checkIn, checkOut } = useSpaces();
  const space = spaces.find(s => s.id === id);

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Space not found.</p>
      </div>
    );
  }

  const pct = getOccupancyPercent(space);
  const status = getAvailabilityStatus(space);

  const statusColor = status === 'Available' ? 'text-status-available' : status === 'Moderate' ? 'text-status-moderate' : 'text-status-full';
  const barColor = status === 'Available' ? 'bg-status-available' : status === 'Moderate' ? 'bg-status-moderate' : 'bg-status-full';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to spaces
        </button>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-display text-2xl font-bold text-foreground">{space.name}</h1>
            <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{space.building}, {space.floor} Floor</div>
            <div className="flex items-center gap-2"><Layers className="w-4 h-4" />{space.spaceType}</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4" />Capacity: {space.capacity}</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{space.openingHours}</div>
          </div>

          {/* Occupancy */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Occupancy</span>
              <span className="font-medium text-foreground">{space.currentCheckIns} / {space.capacity} ({pct}%)</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Check in/out */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => checkIn(space.id)}
              disabled={space.currentCheckIns >= space.capacity}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Check In
            </button>
            <button
              onClick={() => checkOut(space.id)}
              disabled={space.currentCheckIns <= 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" /> Check Out
            </button>
          </div>

          {/* Software */}
          {space.availableSoftware.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-foreground mb-2">Available Software</h2>
              <div className="flex flex-wrap gap-2">
                {space.availableSoftware.map(sw => (
                  <span key={sw} className="px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
