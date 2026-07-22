'use client';
import { useEffect, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom';

export interface GalleryImage {
  src: string;
  alt: string;
}

function storedIndex(count: number): number {
  const stored = Number(sessionStorage.getItem(`gallery:${window.location.pathname}`));
  return Number.isInteger(stored) && stored >= 0 && stored < count ? stored : 0;
}

export function TemplateGallery({ images }: { images: GalleryImage[] }) {
  // Rendered with client:only, so sessionStorage is available on first render —
  // the gallery mounts already on the saved image, no hydration hand-off.
  const [index, setIndexState] = useState(() => storedIndex(images.length));
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const image = images[index];

  useEffect(() => {
    document.getElementById('gallery-fallback')?.remove();
    const img = containerRef.current?.querySelectorAll('img')[index];
    if (img?.complete) setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setIndex(next: number) {
    setIndexState(next);
    sessionStorage.setItem(`gallery:${window.location.pathname}`, String(next));
  }

  if (!image) return null;

  const atFirst = index === 0;
  const atLast = index === images.length - 1;

  const navButton =
    'grid size-7 place-items-center rounded-md border border-fd-border transition-colors enabled:hover:bg-fd-accent enabled:hover:text-fd-foreground disabled:opacity-40';

  return (
    <figure className="rounded-xl border border-fd-border bg-fd-card p-1.5">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[9px] border border-fd-border bg-fd-background shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`transition-opacity duration-300 ease-out ${
              i === index
                ? 'opacity-100'
                : 'pointer-events-none absolute inset-0 opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            <Zoom zoomMargin={20} wrapElement="span">
              <img
                src={img.src}
                alt={img.alt}
                className="block w-full"
                onLoad={() => setLoaded(true)}
              />
            </Zoom>
          </div>
        ))}
        {!loaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 flex items-center justify-center bg-fd-card"
          >
            <div className="size-8 animate-spin rounded-full border-2 border-fd-border border-t-[#864ffc]" />
          </div>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-4 px-2.5 pb-1 pt-2.5 text-sm text-fd-muted-foreground">
        <span className="truncate font-medium">{image.alt}</span>
        {images.length > 1 && (
          <span className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              disabled={atFirst}
              aria-label="Previous screenshot"
              className={navButton}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className="mx-1 flex items-center gap-0.5">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Screenshot ${i + 1}`}
                  aria-current={i === index}
                  className={`grid size-7 place-items-center rounded-md text-sm tabular-nums transition-colors ${
                    i === index
                      ? 'bg-fd-accent font-medium text-fd-foreground'
                      : 'hover:text-fd-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </span>
            <button
              type="button"
              onClick={() => setIndex(index + 1)}
              disabled={atLast}
              aria-label="Next screenshot"
              className={navButton}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
