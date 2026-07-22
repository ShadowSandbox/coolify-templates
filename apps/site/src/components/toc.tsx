'use client';
import { useRef } from 'react';
import { AnchorProvider, ScrollProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';

export function Toc({ items }: { items: TOCItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  return (
    <AnchorProvider toc={items}>
      <p className="mb-3 text-sm font-medium">On this page</p>
      <div ref={containerRef} className="flex flex-col border-l border-fd-border">
        <ScrollProvider containerRef={containerRef}>
          {items.map((item) => (
            <TOCItem
              key={item.url}
              href={item.url}
              className="-ml-px border-l border-transparent py-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:border-[#864ffc] data-[active=true]:text-fd-foreground"
              style={{ paddingLeft: 12 + (item.depth - 2) * 12 }}
            >
              {item.title}
            </TOCItem>
          ))}
        </ScrollProvider>
      </div>
    </AnchorProvider>
  );
}
