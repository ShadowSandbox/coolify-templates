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
