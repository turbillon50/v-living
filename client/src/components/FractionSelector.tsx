import { useState } from 'react';
import { Link } from 'wouter';
import { Check, Info, Calendar, TrendingUp, Home, Building } from 'lucide-react';
import { Property, Fraction, formatPrice, Season, UsageMode } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { SeasonBadge } from './SeasonBadge';
import { cn } from '@/lib/utils';

interface FractionSelectorProps {
  property: Property;
  selectedFraction?: Fraction;
  onSelect?: (fraction: Fraction) => void;
}

export function FractionSelector({ property, selectedFraction, onSelect }: FractionSelectorProps) {
  const [seasonFilter, setSeasonFilter] = useState<Season | 'all'>('all');
  const [usageFilter, setUsageFilter] = useState<UsageMode | 'all'>('all');

  const filteredFractions = property.fractions.filter((f) => {
    if (f.status !== 'available') return false;
    if (seasonFilter !== 'all' && !f.usageWeeks.some((w) => w.season === seasonFilter)) return false;
    if (usageFilter !== 'all' && f.usageMode !== usageFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Filter by Season</h4>
        <div className="flex flex-wrap gap-2">
          {(['all', 'high', 'mid', 'low'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeasonFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                seasonFilter === s
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              )}
              data-testid={`filter-season-${s}`}
            >
              {s === 'all' ? 'All Seasons' : <SeasonBadge season={s} size="sm" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Filter by Usage</h4>
        <div className="flex flex-wrap gap-2">
          {(['all', 'living', 'investment', 'rental'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUsageFilter(u)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                usageFilter === u
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              )}
              data-testid={`filter-usage-${u}`}
            >
              {u === 'living' && <Home className="w-3.5 h-3.5" />}
              {u === 'investment' && <TrendingUp className="w-3.5 h-3.5" />}
              {u === 'rental' && <Building className="w-3.5 h-3.5" />}
              {u === 'all' ? 'All Types' : u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Available Fractions</h4>
          <span className="text-sm text-muted-foreground">{filteredFractions.length} available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredFractions.map((fraction) => (
            <Link
              key={fraction.id}
              href={`/property/${property.id}/fraction/${fraction.id}`}
              data-testid={`card-fraction-${fraction.id}`}
            >
              <div
                className={cn(
                  'p-3 rounded-xl border cursor-pointer transition-all',
                  selectedFraction?.id === fraction.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:shadow-sm'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">#{fraction.fractionNumber}</span>
                  {selectedFraction?.id === fraction.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {fraction.ownershipPercentage}% ownership
                </p>
                <p className="text-sm font-semibold">{formatPrice(fraction.price)}</p>
                <div className="flex gap-1 mt-2">
                  {fraction.usageWeeks.slice(0, 2).map((w, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        w.season === 'high' && 'bg-primary',
                        w.season === 'mid' && 'bg-amber-500',
                        w.season === 'low' && 'bg-orange-500'
                      )}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
