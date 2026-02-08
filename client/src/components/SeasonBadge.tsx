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
    color: 'text-white',
    bg: 'bg-[#111]',
  },
  mid: {
    label: 'Mid Season',
    color: 'text-white',
    bg: 'bg-[#666]',
  },
  low: {
    label: 'Low Season',
    color: 'text-[#111]',
    bg: 'bg-[#ddd]',
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
        'inline-flex items-center gap-1.5 rounded-md font-medium',
        config.bg,
        config.color,
        sizeClasses[size]
      )}
      data-testid={`badge-season-${season}`}
    >
      <span
        className={cn(
          'rounded-full',
          dotSizes[size],
          season === 'high' && 'bg-white',
          season === 'mid' && 'bg-white',
          season === 'low' && 'bg-[#111]'
        )}
      />
      {showLabel && config.label}
    </span>
  );
}

export function SeasonIndicator({ season }: { season: Season }) {
  const colors = {
    high: 'bg-[#111]',
    mid: 'bg-[#666]',
    low: 'bg-[#ddd]',
  };

  return <span className={cn('w-3 h-3 rounded-full', colors[season])} />;
}
