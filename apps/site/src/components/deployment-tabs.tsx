'use client';
import { Box, Database, Flash } from 'reicon-react';
import type { CoolIcon } from './cool-types';
import { Tab, Tabs } from './tabs';

export interface DeploymentInfo {
  publicEndpoints: string[];
  internalPorts: { port: number; label: string }[];
  volumes: { name: string; path: string; contains: string }[];
  architectures: string[];
}

function serviceIcon(name: string): CoolIcon {
  if (/postgres|mysql|maria|mongo|clickhouse|sqlite/i.test(name)) return Database;
  if (/redis|cache|valkey/i.test(name)) return Flash;
  return Box;
}

export function DeploymentTabs({
  services,
  deployment,
}: {
  services: { name: string; image: string }[];
  deployment: DeploymentInfo;
}) {
  return (
    <Tabs items={services.map((service) => service.name)} className="my-0">
      {services.map((service, index) => {
        // Dummy wiring: endpoints/ports/volumes belong to the primary container
        // until the real registry maps them per service.
        const primary = index === 0;
        const ports = primary ? deployment.internalPorts : [];
        const volumes = primary ? deployment.volumes : [];
        const endpoints = (primary ? deployment.publicEndpoints : []).map((label, endpointIndex) => ({
          domain:
            endpointIndex === 0
              ? 'example.com'
              : `${label.split(/\s+/)[0].toLowerCase()}.example.com`,
          label,
        }));

        return (
          <Tab key={service.name} value={service.name} icon={serviceIcon(service.name)}>
            <table className="table-fixed">
              <colgroup>
                <col className="w-44" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Image</td>
                  <td>
                    <code>{service.image}</code>
                  </td>
                </tr>
                {endpoints.length > 0 && (
                  <tr>
                    <td>Public endpoints</td>
                    <td>
                      {endpoints.map((endpoint, i) => (
                        <span key={endpoint.label}>
                          {i > 0 && <br />}
                          <code>{endpoint.domain}</code> — {endpoint.label}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
                {ports.length > 0 && (
                  <tr>
                    <td>Internal ports</td>
                    <td>
                      {ports.map((port, i) => (
                        <span key={port.port}>
                          {i > 0 && <br />}
                          <code>{port.port}</code> — {port.label}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
                {volumes.length > 0 && (
                  <tr>
                    <td>Persistent volumes</td>
                    <td>
                      {volumes.map((volume, i) => (
                        <span key={volume.name}>
                          {i > 0 && <br />}
                          <code>{volume.name}</code> → <code>{volume.path}</code>
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
                {deployment.architectures.length > 0 && (
                  <tr>
                    <td>Architectures</td>
                    <td>{deployment.architectures.join(', ')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Tab>
        );
      })}
    </Tabs>
  );
}
