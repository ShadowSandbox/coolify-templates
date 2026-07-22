import type { CSSProperties } from 'react';

export type VerifiedBadgeVariant = 'shimmer' | 'static';
export type VerifiedBadgeSize = 'sm' | 'md' | 'lg';
export type VerifiedBadgeTone = 'brand' | 'gold' | 'green' | 'neutral';

const verifiedBadgeSizePixels: Record<VerifiedBadgeSize, number> = {
  sm: 18,
  md: 22,
  lg: 28,
};

const verifiedBadgeToneClassNames: Record<VerifiedBadgeTone, string> = {
  brand: 'text-[#864ffc]',
  gold: 'text-[#eab308]',
  green: 'text-[#22c55e]',
  neutral: 'text-fd-muted-foreground',
};

const SCALLOP_PATH =
  'M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z';

const scallopMaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path fill="white" d="${SCALLOP_PATH}"/></svg>`;
const scallopMaskUrl = `url("data:image/svg+xml,${encodeURIComponent(scallopMaskSvg)}")`;

const scallopMaskStyle: CSSProperties = {
  maskImage: scallopMaskUrl,
  WebkitMaskImage: scallopMaskUrl,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
};

function resolveVerifiedBadgePixelSize(size: VerifiedBadgeSize | number): number {
  if (typeof size === 'number') {
    if (!Number.isFinite(size) || size <= 0) return verifiedBadgeSizePixels.md;
    return size;
  }

  return verifiedBadgeSizePixels[size];
}

export interface VerifiedBadgeProps {
  /** @default false */
  decorative?: boolean;
  /** Preset or explicit pixel width/height. @default "md" (22px) */
  size?: VerifiedBadgeSize | number;
  /** @default brand */
  tone?: VerifiedBadgeTone;
  /** @default shimmer */
  variant?: VerifiedBadgeVariant;
  className?: string;
  ariaLabel?: string;
}

export function VerifiedBadge({
  variant = 'shimmer',
  size = 'md',
  tone = 'brand',
  decorative = false,
  className = '',
  ariaLabel = 'Verified',
}: VerifiedBadgeProps) {
  const pixelSize = resolveVerifiedBadgePixelSize(size);
  const checkSize = pixelSize * 0.5;
  const strokeWidth = Math.max(2, Math.min(4, pixelSize * 0.16));
  const a11yProps = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ 'aria-label': ariaLabel, role: 'img' } as const);

  return (
    <span
      className={`relative inline-block shrink-0 align-middle ${verifiedBadgeToneClassNames[tone]} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      {...a11yProps}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 22 22">
        <path d={SCALLOP_PATH} fill="currentColor" />
      </svg>

      {variant === 'shimmer' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={scallopMaskStyle}
        >
          <span
            className="absolute inset-0 motion-safe:animate-[verified-badge-shimmer_3.5s_ease-in-out_infinite]"
            style={{
              transform: 'translateX(-100%)',
              background:
                'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
            }}
          />
        </span>
      )}

      <svg
        aria-hidden="true"
        className="absolute inset-0 z-10 m-auto"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={{ width: checkSize, height: checkSize }}
        viewBox="0 0 24 24"
      >
        <polyline points="5 12.5 10 17.5 19 7.5" />
      </svg>
    </span>
  );
}

export default VerifiedBadge;
