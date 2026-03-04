import { useState, useMemo } from 'react';
import { useSpaces } from '@/context/SpacesContext';
import { Dashboard } from '@/components/Dashboard';
import { Filters } from '@/components/Filters';
import { SpaceCard } from '@/components/SpaceCard';
import { getOccupancyPercent, getAvailabilityStatus, getPCAvailabilityStatus } from '@/types/space';
import { GraduationCap } from 'lucide-react';

const Index = () => {
  const { spaces, loading } = useSpaces();
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPCStatus, setSelectedPCStatus] = useState('All');
  const [search, setSearch] = useState('');

  const buildings = useMemo(() => [...new Set(spaces.map(s => s.building))], [spaces]);

  const filtered = useMemo(() => {
    let result = spaces;
    if (selectedBuilding !== 'All') result = result.filter(s => s.building === selectedBuilding);
    if (selectedType !== 'All') result = result.filter(s => s.spaceType === selectedType);
    if (selectedStatus !== 'All') result = result.filter(s => getAvailabilityStatus(s) === selectedStatus);
    if (selectedPCStatus !== 'All') result = result.filter(s => s.totalPCs > 0 && getPCAvailabilityStatus(s) === selectedPCStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => s.availableSoftware.some(sw => sw.toLowerCase().includes(q)));
    }
    return result.sort((a, b) => getOccupancyPercent(a) - getOccupancyPercent(b));
  }, [spaces, selectedBuilding, selectedType, selectedStatus, selectedPCStatus, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold text-primary-foreground tracking-tight">MetSpace</h1>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Find Your Study Space</h2>
          <p className="text-muted-foreground">Browse available spaces across campus and check in instantly.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Dashboard />
        <Filters
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPCStatus={selectedPCStatus}
          setSelectedPCStatus={setSelectedPCStatus}
          search={search}
          setSearch={setSearch}
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{filtered.length} space{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-1">No spaces match your filters</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(space => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
