'use client';

import { useState, type FormEvent } from 'react';
import { Select } from './select';

const PROBLEM_TYPES = [
  'Deployment failed',
  'Health check failed',
  'Application was not reachable',
  'Missing configuration',
  'Incorrect documentation',
  'Data persistence problem',
  'Outdated application version',
  'Security concern',
  'Other',
];

type FeedbackType = 'helpful' | 'problem';

const fieldClass =
  'block h-10 w-full rounded-lg border border-fd-border bg-fd-background px-3 text-sm outline-none transition-shadow placeholder:text-fd-muted-foreground focus:border-[#864ffc] focus:ring-2 focus:ring-[#864ffc]/15';

const textareaClass =
  'block w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-3 text-sm outline-none transition-shadow placeholder:text-fd-muted-foreground focus:border-[#864ffc] focus:ring-2 focus:ring-[#864ffc]/15';

export function TemplateFeedback({
  template,
  variant,
  version,
}: {
  template: string;
  variant: string;
  version: string;
}) {
  const [type, setType] = useState<FeedbackType>('helpful');
  const [problemType, setProblemType] = useState(PROBLEM_TYPES[0]);
  const [helpfulText, setHelpfulText] = useState('');
  const [problemDetails, setProblemDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-fd-border bg-fd-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <div>
            <h3 className="font-semibold">Feedback submitted</h3>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              Thank you. Your feedback is linked to {template} {variant} {version}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function reset() {
    setHelpfulText('');
    setProblemDetails('');
    setProblemType(PROBLEM_TYPES[0]);
  }

  return (
    <div className="rounded-2xl border border-fd-border bg-fd-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.7 6.5L5 21l3.4-1.5c1.1.3 2.3.5 3.6.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3Z" />
          </svg>
          Was this template helpful?
        </h3>

        <div className="flex gap-2">
        {([
          ['helpful', 'Helpful'],
          ['problem', 'Had a problem'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              type === value
                ? 'border-[#864ffc] bg-[#864ffc] text-white'
                : 'border-fd-border bg-fd-background hover:bg-fd-accent'
            }`}
          >
            {value === 'helpful' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
                <path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Zm0 10h9.3a3 3 0 0 0 2.9-2.2l1.5-5.5A1.8 1.8 0 0 0 19 10h-4l.6-3.1A2.4 2.4 0 0 0 13.2 4L7 10Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6M12 17h.01" />
              </svg>
            )}
            {label}
          </button>
        ))}
        </div>
      </div>

      {type === 'helpful' && (
        <form className="mt-4" onSubmit={submit} onReset={reset}>
          <div className="relative">
            <textarea
              id="feedback-worked-well"
              rows={4}
              maxLength={1000}
              value={helpfulText}
              onChange={(event) => setHelpfulText(event.target.value)}
              aria-label="What worked well"
              placeholder="What worked, what didn't? (optional)"
              className={`${textareaClass} min-h-28 resize-y pb-8`}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 text-[11px] text-fd-muted-foreground">
              {helpfulText.length}/1000
            </span>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button type="reset" className="rounded-full border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent">
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-[#864ffc] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7440e0]">
              Send feedback
            </button>
          </div>
        </form>
      )}

      {type === 'problem' && (
        <form className="mt-5" onSubmit={submit} onReset={reset}>
          <div>
            <label className="mb-2 block text-sm font-medium">Problem type</label>
            <Select
              label="Problem type"
              options={PROBLEM_TYPES}
              value={problemType}
              onChange={setProblemType}
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium" htmlFor="feedback-problem-details">
              Describe the problem
            </label>
            <div className="relative mt-2">
              <textarea
                id="feedback-problem-details"
                rows={4}
                maxLength={1000}
                required
                value={problemDetails}
                onChange={(event) => setProblemDetails(event.target.value)}
                placeholder="The service started, but the console domain returned a connection error."
                className={`${textareaClass} min-h-28 resize-y pb-8`}
              />
              <span className="pointer-events-none absolute bottom-3 right-3 text-[11px] text-fd-muted-foreground">
                {problemDetails.length}/1000
              </span>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium">
              Environment information <span className="font-normal text-fd-muted-foreground">Optional</span>
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block font-medium">Coolify version</span>
                <input type="text" placeholder="4.x.x" className={fieldClass} />
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium">Server architecture</span>
                <input type="text" placeholder="ARM64" className={fieldClass} />
              </label>
            </div>
          </fieldset>

          <div className="mt-5 flex justify-end gap-2">
            <button type="reset" className="rounded-full border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent">
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-[#864ffc] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7440e0]">
              Send feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
