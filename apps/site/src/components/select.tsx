'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(options[0] ?? '');
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedValue = value ?? internalValue;

  function toggle() {
    if (!open) {
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom + 6, left: r.left, width: r.width });
    }
    setOpen(!open);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        e.target instanceof Node &&
        !triggerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-fd-background py-2 pl-3 pr-2.5 text-sm font-medium outline-none transition-colors hover:bg-fd-accent ${
          open ? 'border-[#864ffc]' : 'border-fd-border'
        }`}
      >
        <span className="truncate">{selectedValue}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3.5 shrink-0 text-fd-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={label}
            style={{ top: rect.top, left: rect.left, width: rect.width }}
            className="fixed z-50 origin-top animate-[select-in_0.15s_ease-out] rounded-lg border border-fd-border bg-fd-popover p-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === selectedValue}
                onClick={() => {
                  setInternalValue(option);
                  onChange?.(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-fd-accent ${
                  option === selectedValue ? 'font-medium text-fd-foreground' : 'text-fd-muted-foreground'
                }`}
              >
                <span className="truncate">{option}</span>
                {option === selectedValue && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5 shrink-0 text-[#864ffc]"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
