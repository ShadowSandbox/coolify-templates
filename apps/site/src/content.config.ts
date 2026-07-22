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
    // Dummy registry stats until the real backend supplies them.
    stats: z
      .object({
        lastUpdated: z.string(),
        updatedBy: z.object({
          name: z.string(),
          url: z.string().url(),
        }),
        variants: z.array(z.string()),
        versions: z.array(z.string()),
      })
      .default({
        lastUpdated: '2026-07-18',
        updatedBy: { name: 'ShadowArcanist', url: 'https://github.com/ShadowArcanist' },
        variants: ['default', 'with workers'],
        versions: ['2.4.1 (latest)', '2.4.0', '2.3.7', '2.3.2', '2.2.0'],
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
