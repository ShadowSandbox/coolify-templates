'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateCard } from '@/lib/templates';
import { PublisherPill } from './publisher-pill';
import { Icon } from './icons';

function Card({ template }: { template: TemplateCard }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  return (
    <a
      ref={ref}
      href={template.url}
      onMouseMove={onMouseMove}
      className="group relative flex min-h-42 rounded-[10px] bg-fd-border p-px"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[11px] opacity-0 blur-[8px] transition-opacity duration-300 group-hover:opacity-50 dark:group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--spot-x, 0%) var(--spot-y, 0%), rgba(134,79,252,0.55), transparent 70%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-60 dark:group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--spot-x, 0%) var(--spot-y, 0%), #c4b5fd, #864ffc 35%, rgba(134,79,252,0.35) 55%, transparent 80%)',
        }}
      />
      <span className="relative flex w-full flex-col overflow-hidden rounded-[9px] bg-fd-card p-5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40 dark:group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(340px circle at var(--spot-x, 0%) var(--spot-y, 0%), rgba(134,79,252,0.16), transparent 70%)',
          }}
        />
        <span className="relative flex items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-black/10 p-1.5 dark:border-transparent"
            style={{ backgroundColor: template.logoBg }}
          >
            <img src={template.logo} alt="" className="size-full object-contain" />
          </span>
          <span className="relative top-[3px] block min-w-0">
            <span className="block truncate font-medium leading-5">{template.title}</span>
            <span className="-ml-1 mt-px block leading-none">
              <PublisherPill publisher={template.by} />
            </span>
          </span>
        </span>
        <span className="relative mt-6 line-clamp-2 text-[15px] leading-relaxed text-fd-muted-foreground">
          {template.description}
        </span>
      </span>
    </a>
  );
}

export function TemplateBrowser({ templates }: { templates: TemplateCard[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const categories = useMemo(
    () => [...new Set(templates.flatMap((t) => t.categories))].sort(),
    [templates],
  );

  const results = useMemo(() => {
    if (!q) return templates;
    return templates.filter((t) =>
      [t.title, t.description, ...t.categories].join(' ').toLowerCase().includes(q),
    );
  }, [templates, q]);

  const featured = templates
    .filter((t) => t.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
  const byCategory =
    category === 'all' ? templates : templates.filter((t) => t.categories.includes(category));

  return (
    <div className="flex flex-col gap-32">
      <label className="mx-auto block w-full max-w-2xl rounded-2xl border border-fd-border bg-fd-background p-[5px]">
        <span className="relative flex items-center rounded-[11px] border border-fd-border/60 bg-fd-card transition-colors focus-within:border-[#864ffc]/50 focus-within:ring-2 focus-within:ring-[#864ffc]/15">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 size-4.5 text-fd-muted-foreground"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent py-2.5 pl-11 pr-20 text-[15px] outline-none placeholder:text-fd-muted-foreground/70"
          />
          <span className="pointer-events-none absolute right-3 flex gap-1 text-fd-muted-foreground">
            <kbd className="grid size-6 place-items-center rounded-md border border-fd-border bg-fd-muted text-xs">
              ⌘
            </kbd>
            <kbd className="grid size-6 place-items-center rounded-md border border-fd-border bg-fd-muted text-xs">
              K
            </kbd>
          </span>
        </span>
      </label>

      {q ? (
        <section className="flex flex-col gap-4">
          <p className="text-sm text-fd-muted-foreground">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query.trim()}
            &rdquo;
          </p>
          {results.length === 0 ? (
            <div className="rounded-xl border border-fd-border bg-fd-card/60 px-6 py-12 text-center">
              <p className="font-semibold">No results found</p>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                Try a service name or a category like database, analytics, or monitoring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((t) => (
                <Card key={t.slug} template={t} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Featured</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((t) => (
                <Card key={t.slug} template={t} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="border-b border-fd-border pb-4 text-lg font-semibold">Templates</h2>
            <div className="flex flex-col gap-8 md:flex-row">
              <nav className="flex shrink-0 flex-row flex-wrap gap-1 md:w-52 md:flex-col">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    category === 'all'
                      ? 'bg-fd-accent text-fd-foreground'
                      : 'text-fd-muted-foreground hover:text-fd-foreground'
                  }`}
                >
                  <Icon name="all" className="size-4 shrink-0" />
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      category === c
                        ? 'bg-fd-accent text-fd-foreground'
                        : 'text-fd-muted-foreground hover:text-fd-foreground'
                    }`}
                  >
                    <Icon name={c.toLowerCase()} className="size-4 shrink-0" />
                    {c}
                  </button>
                ))}
              </nav>
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {byCategory.map((t) => (
                    <Card key={t.slug} template={t} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
