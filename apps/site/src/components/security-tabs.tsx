'use client';

import { Globe, Shield } from 'reicon-react';
import { Tab, Tabs } from './tabs';

interface SecurityInfo {
  privilegedMode: boolean;
  dockerSocketAccess: boolean;
  hostNetworking: boolean;
  hostPidNamespace: boolean;
  hostFilesystemMounts: boolean;
  hostDevices: boolean;
  additionalLinuxCapabilities: string[];
  applicationExposure: { label: string; value: string }[];
}

function SecurityTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="table-fixed">
      <colgroup>
        <col className="w-1/2" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SecurityTabs({ security }: { security: SecurityInfo }) {
  const serverAccess: [string, string][] = [
    ['Privileged mode', security.privilegedMode ? 'Yes' : 'No'],
    ['Docker socket access', security.dockerSocketAccess ? 'Yes' : 'No'],
    ['Host networking', security.hostNetworking ? 'Yes' : 'No'],
    ['Host PID namespace', security.hostPidNamespace ? 'Yes' : 'No'],
    ['Host filesystem mounts', security.hostFilesystemMounts ? 'Yes' : 'No'],
    ['Host devices', security.hostDevices ? 'Yes' : 'No'],
    [
      'Additional Linux capabilities',
      security.additionalLinuxCapabilities.length > 0
        ? security.additionalLinuxCapabilities.join(', ')
        : 'No',
    ],
  ];

  const applicationExposure: [string, string][] = security.applicationExposure.map((item) => [
    item.label,
    item.value,
  ]);

  return (
    <Tabs items={['Server access', 'Application exposure']} className="my-0">
      <Tab value="Server access" icon={Shield}>
        <SecurityTable rows={serverAccess} />
      </Tab>
      <Tab value="Application exposure" icon={Globe}>
        <SecurityTable rows={applicationExposure} />
      </Tab>
    </Tabs>
  );
}
