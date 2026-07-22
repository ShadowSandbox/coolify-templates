'use client';
import { useMemo, useState } from 'react';
import type { TemplateCard } from '@/lib/templates';

type Tab = 'featured' | 'all';

export function TemplateBrowser({ templates }: { templates: TemplateCard[] }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('featured');
  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (q) {
      return templates.filter((t) =>
        [t.title, t.description, ...t.categories].join(' ').toLowerCase().includes(q),
      );
    }
    return tab === 'featured' ? templates.filter((t) => t.featured) : templates;
  }, [templates, q, tab]);

  return (
    <div className="flex flex-col gap-8">
      <label className="relative mx-auto w-full max-w-2xl">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-fd-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to deploy today?"
          className="w-full rounded-xl border border-fd-border bg-fd-card py-3.5 pl-11 pr-4 text-base outline-none transition-colors placeholder:text-fd-muted-foreground focus:border-fd-ring"
        />
      </label>

      <div className="flex items-end justify-between gap-4 border-b border-fd-border">
        {q ? (
          <p className="pb-3 text-sm text-fd-muted-foreground">
            {visible.length} result{visible.length === 1 ? '' : 's'} for &ldquo;{query.trim()}&rdquo;
          </p>
        ) : (
          <div className="flex gap-6">
            {(
              [
                ['featured', 'Featured'],
                ['all', 'All templates'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
                  tab === value
                    ? 'border-fd-primary text-fd-foreground'
                    : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <p className="pb-3 text-sm text-fd-muted-foreground">{templates.length} templates</p>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-fd-muted-foreground">
          No templates match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((t) => (
            <a
              key={t.slug}
              href={t.url}
              className="group flex flex-col gap-3 rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-ring/60 hover:bg-fd-accent"
            >
              <img src={t.logo} alt="" className="size-10 rounded-lg object-contain" />
              <div>
                <h3 className="font-semibold group-hover:text-fd-primary transition-colors">
                  {t.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-fd-muted-foreground">
                  {t.description}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {t.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
