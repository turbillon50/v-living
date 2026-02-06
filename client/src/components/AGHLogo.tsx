interface AGHLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export function AGHLogo({ className = '', size = 40, color = '#000000' }: AGHLogoProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      data-testid="agh-logo"
    >
      <rect x="28" y="0" width="14" height="52" />
      <rect x="58" y="0" width="14" height="52" />
      <rect x="28" y="42" width="44" height="14" />
      <rect x="28" y="56" width="14" height="28" />
      <rect x="58" y="56" width="14" height="44" />
      <rect x="0" y="70" width="42" height="14" />
      <rect x="58" y="86" width="42" height="14" />
    </svg>
  );
}

export function AGHLogoHorizontal({ className = '', height = 32, color = '#000000' }: { className?: string; height?: number; color?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AGHLogo size={height * 0.8} color={color} />
      <div className="flex flex-col" style={{ color }}>
        <span className="text-[0.65rem] font-bold tracking-[0.2em] leading-tight uppercase">All Global</span>
        <span className="text-[0.55rem] font-medium tracking-[0.15em] leading-tight uppercase">Holding LLC</span>
      </div>
    </div>
  );
}
