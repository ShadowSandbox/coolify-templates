'use client';

import { Box, Globe, Lifebuoy } from 'reicon-react';
import { Tab, Tabs } from './tabs';

const TEMPLATE_PROBLEMS = [
  'Deployment fails',
  'Health check fails',
  'Missing environment variable',
  'Incorrect port',
  'Data does not persist',
  'Documentation is wrong',
];

const PLATFORM_PROBLEMS = [
  'Server connection',
  'Proxy configuration',
  'Domain generation',
  'Deployment engine',
  'Coolify instance behaviour',
];

const DEFAULT_APPLICATION_PROBLEMS = [
  'Application behaviour',
  'API usage',
  'Access policies',
  'Application configuration',
  'Application bugs',
];

function ProblemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SupportLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="not-prose inline-flex items-center rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm font-medium text-fd-foreground transition-colors hover:border-[#864ffc]/50 hover:bg-fd-accent"
    >
      {children}
    </a>
  );
}

export function SupportTabs({
  application,
  applicationProblems = DEFAULT_APPLICATION_PROBLEMS,
  docs,
  repository,
}: {
  application: string;
  applicationProblems?: string[];
  docs?: string;
  repository?: string;
}) {
  return (
    <Tabs items={['Template', 'Coolify platform', application]} className="my-0">
      <Tab value="Template" icon={Box}>
        <p>Use the Coolify Templates issue tracker for problems such as:</p>
        <ProblemList items={TEMPLATE_PROBLEMS} />
        <SupportLink href="https://github.com/ShadowSandbox/coolify-templates/issues/new">
          Report a template problem
        </SupportLink>
      </Tab>

      <Tab value="Coolify platform" icon={Lifebuoy}>
        <p>Use Coolify support when the problem affects:</p>
        <ProblemList items={PLATFORM_PROBLEMS} />
        <SupportLink href="https://coolify.io/docs/support">Open Coolify support</SupportLink>
      </Tab>

      <Tab value={application} icon={Globe}>
        <p>Use upstream {application} support for:</p>
        <ProblemList items={applicationProblems} />
        <div className="not-prose flex flex-wrap gap-2">
          {docs && <SupportLink href={docs}>Open {application} documentation</SupportLink>}
          {repository && <SupportLink href={repository}>Open {application} repository</SupportLink>}
        </div>
      </Tab>
    </Tabs>
  );
}
