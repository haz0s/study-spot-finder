import { useParams, useNavigate } from 'react-router-dom';
import { useSpaces } from '@/context/SpacesContext';
import { getOccupancyPercent, getAvailabilityStatus, getPCUsagePercent, getPCAvailabilityStatus } from '@/types/space';
import { ArrowLeft, Clock, MapPin, Users, Layers, Minus, Plus, Monitor, AlertTriangle } from 'lucide-react';

export default function SpaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { spaces, checkIn, checkOut, pcCheckIn, pcCheckOut } = useSpaces();
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
  const hasPCs = space.totalPCs > 0;
  const pcPct = hasPCs ? getPCUsagePercent(space) : 0;
  const pcStatus = hasPCs ? getPCAvailabilityStatus(space) : null;

  const statusColor = status === 'Available' ? 'text-status-available' : status === 'Moderate' ? 'text-status-moderate' : 'text-status-full';
  const barColor = status === 'Available' ? 'bg-status-available' : status === 'Moderate' ? 'bg-status-moderate' : 'bg-status-full';

  const pcBarColor = pcPct < 50 ? 'bg-status-available' : pcPct < 90 ? 'bg-status-moderate' : 'bg-status-full';
  const pcStatusColor = pcPct < 50 ? 'text-status-available' : pcPct < 90 ? 'text-status-moderate' : 'text-status-full';

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to spaces
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Main info card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-display text-2xl font-bold text-foreground">{space.name}</h1>
            <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{space.building}, {space.floor} Floor</div>
            <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary" />{space.spaceType}</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Capacity: {space.capacity}</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />{space.openingHours}</div>
          </div>

          {/* Room Occupancy */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Room Occupancy</span>
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Check In
            </button>
            <button
              onClick={() => checkOut(space.id)}
              disabled={space.currentCheckIns <= 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                  <span key={sw} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PC Availability card */}
        {hasPCs && pcStatus && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" /> PC Availability
              </h2>
              <span className={`text-sm font-medium ${pcStatusColor}`}>{pcStatus}</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">PCs in use</span>
                <span className="font-medium text-foreground">{space.currentPCCheckIns} / {space.totalPCs} ({pcPct}%)</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${pcBarColor}`} style={{ width: `${pcPct}%` }} />
              </div>
            </div>

            {space.peakHours !== 'N/A' && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-4">
                <AlertTriangle className="w-4 h-4 text-status-moderate mt-0.5 shrink-0" />
                <span>This lab is typically busy during: <strong className="text-foreground">{space.peakHours}</strong></span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => pcCheckIn(space.id)}
                disabled={space.currentPCCheckIns >= space.totalPCs}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Use a PC
              </button>
              <button
                onClick={() => pcCheckOut(space.id)}
                disabled={space.currentPCCheckIns <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" /> Leave PC
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
