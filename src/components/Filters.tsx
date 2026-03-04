import { Search } from 'lucide-react';

interface FiltersProps {
  buildings: string[];
  selectedBuilding: string;
  setSelectedBuilding: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  selectedPCStatus: string;
  setSelectedPCStatus: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

const spaceTypes = ['All', 'Silent', 'Group', 'Computer Lab'];
const statuses = ['All', 'Available', 'Moderate', 'Likely Full'];
const pcStatuses = ['All', 'PCs Available', 'Limited PCs', 'PCs Likely Full'];

export function Filters({
  buildings, selectedBuilding, setSelectedBuilding,
  selectedType, setSelectedType,
  selectedStatus, setSelectedStatus,
  selectedPCStatus, setSelectedPCStatus,
  search, setSearch,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by software..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <SelectFilter label="Building" value={selectedBuilding} onChange={setSelectedBuilding} options={['All', ...buildings]} />
      <SelectFilter label="Type" value={selectedType} onChange={setSelectedType} options={spaceTypes} />
      <SelectFilter label="Status" value={selectedStatus} onChange={setSelectedStatus} options={statuses} />
      <SelectFilter label="PC Status" value={selectedPCStatus} onChange={setSelectedPCStatus} options={pcStatuses} />
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={label}
      className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
    </select>
  );
}
