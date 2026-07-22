import { VerifiedBadge } from './verified-badge';

export type Publisher = 'coolify' | 'community' | 'creator';

const PUBLISHER_LABEL: Record<Publisher, string> = {
  coolify: 'By Coolify',
  community: 'By Community',
  creator: 'By Creator',
};

const PUBLISHER_TOOLTIP: Record<Publisher, string> = {
  coolify: "Official template, maintained by the Coolify team.",
  community: "Maintained by community contributors.",
  creator: "Maintained by the creators of this service.",

};

export function PublisherPill({ publisher }: { publisher: Publisher }) {
  return (
    <span className="group/pill relative inline-flex">
      <span className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-fd-border bg-fd-muted px-2 py-0.5 text-xs text-fd-muted-foreground">
        {PUBLISHER_LABEL[publisher]}
        {publisher === 'creator' && (
          <VerifiedBadge size="sm" variant="static" tone="neutral" decorative />
        )}
        {publisher === 'coolify' && (
          <>
            <VerifiedBadge size="sm" variant="static" decorative />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 motion-safe:animate-[verified-badge-shimmer_3.5s_ease-in-out_infinite]"
              style={{
                transform: 'translateX(-100%)',
                background:
                  'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
              }}
            />
          </>
        )}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-64 translate-y-1 rounded-lg border border-fd-border bg-fd-popover px-3 py-2 text-xs leading-relaxed text-fd-foreground/90 opacity-0 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_rgba(0,0,0,0.6)] transition-all delay-150 duration-200 group-hover/pill:translate-y-0 group-hover/pill:opacity-100"
      >
        <span
          aria-hidden="true"
          className="absolute -top-1 left-4 size-2 rotate-45 border-l border-t border-fd-border bg-fd-popover"
        />
        {PUBLISHER_TOOLTIP[publisher]}
      </span>
    </span>
  );
}
