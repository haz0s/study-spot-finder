import { useState, useMemo } from 'react';
import { useSpaces } from '@/context/SpacesContext';
import { Dashboard } from '@/components/Dashboard';
import { Filters } from '@/components/Filters';
import { SpaceCard } from '@/components/SpaceCard';
import { getOccupancyPercent, getAvailabilityStatus } from '@/types/space';
import { GraduationCap } from 'lucide-react';

const Index = () => {
  const { spaces, loading } = useSpaces();
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');

  const buildings = useMemo(() => [...new Set(spaces.map(s => s.building))], [spaces]);

  const filtered = useMemo(() => {
    let result = spaces;
    if (selectedBuilding !== 'All') result = result.filter(s => s.building === selectedBuilding);
    if (selectedType !== 'All') result = result.filter(s => s.spaceType === selectedType);
    if (selectedStatus !== 'All') result = result.filter(s => getAvailabilityStatus(s) === selectedStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => s.availableSoftware.some(sw => sw.toLowerCase().includes(q)));
    }
    return result.sort((a, b) => getOccupancyPercent(a) - getOccupancyPercent(b));
  }, [spaces, selectedBuilding, selectedType, selectedStatus, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading spaces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">MetSpace</h1>
        </div>

        <Dashboard />

        <Filters
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          search={search}
          setSearch={setSearch}
        />

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No spaces match your filters.</p>
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
