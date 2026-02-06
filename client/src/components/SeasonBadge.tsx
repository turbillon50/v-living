import { cn } from '@/lib/utils';

type Season = 'high' | 'mid' | 'low';

interface SeasonBadgeProps {
  season: Season;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const seasonConfig: Record<Season, { label: string; color: string; bg: string }> = {
  high: {
    label: 'High Season',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  mid: {
    label: 'Mid Season',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  low: {
    label: 'Low Season',
    color: 'text-black',
    bg: 'bg-black',
  },
};

export function SeasonBadge({ season, size = 'md', showLabel = true }: SeasonBadgeProps) {
  const config = seasonConfig[season];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bg,
        season === 'low' ? 'text-white' : config.color,
        sizeClasses[size]
      )}
      data-testid={`badge-season-${season}`}
    >
      <span
        className={cn(
          'rounded-full',
          dotSizes[size],
          season === 'high' && 'bg-primary',
          season === 'mid' && 'bg-amber-500',
          season === 'low' && 'bg-white'
        )}
      />
      {showLabel && config.label}
    </span>
  );
}

export function SeasonIndicator({ season }: { season: Season }) {
  const colors = {
    high: 'bg-primary',
    mid: 'bg-amber-500',
    low: 'bg-black',
  };

  return <span className={cn('w-3 h-3 rounded-full', colors[season])} />;
}
