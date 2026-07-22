import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const templates = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/templates' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    logo: z.string(),
    logoBg: z.string().default('#ffffff'),
    categories: z.array(z.string()).default([]),
    // false = not featured; a number both features the template and sets its order
    featured: z.union([z.boolean(), z.number()]).default(false),
    by: z.enum(['coolify', 'community', 'creator']).default('community'),
    services: z
      .array(
        z.object({
          name: z.string(),
          image: z.string(),
        }),
      )
      .default([]),
    links: z
      .object({
        website: z.string().url().optional(),
        docs: z.string().url().optional(),
        github: z.string().url().optional(),
      })
      .default({}),
    // Dummy feature lists until the real backend supplies them.
    features: z
      .object({
        application: z.array(z.string()),
        template: z.array(z.string()),
      })
      .default({
        application: [
          'Fast and lightweight, runs comfortably on small servers',
          'REST API with token authentication',
          'Built-in web dashboard',
          'Role-based access control',
        ],
        template: [
          'One-click deploy with sensible defaults',
          'Persistent storage preconfigured',
          'Automatic HTTPS via the Coolify proxy',
          'Health checks and restart policy included',
          'Secrets generated on first deploy',
        ],
      }),
    // Dummy deployment manifest until the real backend supplies it.
    deployment: z
      .object({
        publicEndpoints: z.array(z.string()).default([]),
        internalPorts: z.array(z.object({ port: z.number(), label: z.string() })).default([]),
        volumes: z
          .array(
            z.object({
              name: z.string(),
              path: z.string(),
              contains: z.string().default('Persistent application data.'),
            }),
          )
          .default([]),
        architectures: z.array(z.string()).default([]),
      })
      .default({
        publicEndpoints: ['Web dashboard'],
        internalPorts: [{ port: 3000, label: 'Web dashboard' }],
        volumes: [{ name: 'data', path: '/data', contains: 'Persistent application data.' }],
        architectures: ['AMD64', 'ARM64'],
      }),
    configuration: z
      .array(
        z.object({
          env: z.string(),
          required: z.boolean(),
          description: z.string(),
        }),
      )
      .default([
        {
          env: 'APP_URL',
          required: true,
          description: 'Public URL used by the application.',
        },
        {
          env: 'APP_SECRET',
          required: true,
          description: 'Secret used to sign sessions and application data.',
        },
        {
          env: 'TZ',
          required: false,
          description: 'Timezone used by the application.',
        },
      ]),
    // Dummy registry stats until the real backend supplies them.
    stats: z
      .object({
        lastUpdated: z.string(),
        updatedBy: z.object({
          name: z.string(),
          url: z.string().url(),
        }),
        variants: z.array(z.string()),
        templateVersions: z.array(z.string()),
        appVersions: z.array(z.string()),
      })
      .default({
        lastUpdated: '2026-07-18',
        updatedBy: { name: 'ShadowArcanist', url: 'https://github.com/ShadowArcanist' },
        variants: ['default', 'with workers'],
        templateVersions: ['1.2.0 (latest)', '1.1.3', '1.0.0'],
        appVersions: ['2.4.1 (latest)', '2.4.0', '2.3.7', '2.3.2', '2.2.0'],
      }),
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = {
  templates,
};
