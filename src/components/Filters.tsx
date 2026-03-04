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
  const chipClass = "shrink-0 px-3.5 py-2 text-xs font-medium rounded-full border border-input bg-secondary text-secondary-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer";

  return (
    <div className="mb-6">
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by software (e.g. Python, MATLAB)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <select value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)} aria-label="Building" className={chipClass}>
          {['All', ...buildings].map(o => <option key={o} value={o}>{o === 'All' ? 'Building: All' : o}</option>)}
        </select>
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} aria-label="Type" className={chipClass}>
          {spaceTypes.map(o => <option key={o} value={o}>{o === 'All' ? 'Type: All' : o}</option>)}
        </select>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} aria-label="Status" className={chipClass}>
          {statuses.map(o => <option key={o} value={o}>{o === 'All' ? 'Status: All' : o}</option>)}
        </select>
        <select value={selectedPCStatus} onChange={e => setSelectedPCStatus(e.target.value)} aria-label="PC Status" className={chipClass}>
          {pcStatuses.map(o => <option key={o} value={o}>{o === 'All' ? 'PC Status: All' : o}</option>)}
        </select>
      </div>
    </div>
  );
}
