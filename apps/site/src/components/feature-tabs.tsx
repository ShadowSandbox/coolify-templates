'use client';
import { Box, Monitor } from 'reicon-react';
import { Tab, Tabs } from './tabs';

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul>
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}

export function FeatureTabs({
  application,
  template,
}: {
  application: string[];
  template: string[];
}) {
  return (
    <Tabs items={['Application', 'Template']} className="my-0">
      <Tab value="Application" icon={Monitor}>
        <FeatureList features={application} />
      </Tab>
      <Tab value="Template" icon={Box}>
        <FeatureList features={template} />
      </Tab>
    </Tabs>
  );
}
