import { useState } from 'react';
import { Search, MapPin, Sun, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  onSearch?: () => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [usage, setUsage] = useState('');

  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center bg-white border border-border rounded-2xl md:rounded-full p-3 md:p-2 shadow-lg">
      <div className="flex-1 px-4 py-2 md:border-r border-border">
        <label className="text-xs font-semibold text-foreground block mb-1">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="border-0 p-0 h-auto text-sm shadow-none focus:ring-0" data-testid="select-location">
            <SelectValue placeholder="Search destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spain">Spain</SelectItem>
            <SelectItem value="france">France</SelectItem>
            <SelectItem value="italy">Italy</SelectItem>
            <SelectItem value="greece">Greece</SelectItem>
            <SelectItem value="portugal">Portugal</SelectItem>
            <SelectItem value="switzerland">Switzerland</SelectItem>
            <SelectItem value="usa">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 px-4 py-2 md:border-r border-border">
        <label className="text-xs font-semibold text-foreground block mb-1">Season</label>
        <Select value={season} onValueChange={setSeason}>
          <SelectTrigger className="border-0 p-0 h-auto text-sm shadow-none focus:ring-0" data-testid="select-season">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                High Season
              </span>
            </SelectItem>
            <SelectItem value="mid">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Mid Season
              </span>
            </SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Low Season
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 px-4 py-2">
        <label className="text-xs font-semibold text-foreground block mb-1">Usage Type</label>
        <Select value={usage} onValueChange={setUsage}>
          <SelectTrigger className="border-0 p-0 h-auto text-sm shadow-none focus:ring-0" data-testid="select-usage">
            <SelectValue placeholder="Select usage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="living">Personal Living</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="rental">Rental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSearch}
        className="rounded-full h-12 px-6 bg-primary hover:bg-primary/90"
        data-testid="button-search"
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}

export function FilterBar() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-4">
      {['All', 'Villas', 'Beachfront', 'Mountain', 'Urban', 'High Season', 'Available Now'].map((filter) => (
        <Button
          key={filter}
          variant={filter === 'All' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full whitespace-nowrap"
          data-testid={`filter-${filter.toLowerCase().replace(' ', '-')}`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
