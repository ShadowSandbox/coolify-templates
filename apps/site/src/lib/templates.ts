import { getCollection, type CollectionEntry } from 'astro:content';

export type Template = CollectionEntry<'templates'>;

export interface TemplateCard {
  slug: string;
  url: string;
  title: string;
  description: string;
  logo: string;
  categories: string[];
  featured: boolean;
}

/** Prefix a public-relative path (starting with `/`) with the site base path. */
export function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function templateUrl(slug: string): string {
  return withBase(`/${slug}`);
}

export function deployUrl(slug: string): string {
  return `https://app.coolify.io/deploy?template=${slug}`;
}

export async function getTemplates(): Promise<Template[]> {
  const all = await getCollection('templates');
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function toCard(template: Template): TemplateCard {
  return {
    slug: template.id,
    url: templateUrl(template.id),
    title: template.data.title,
    description: template.data.description,
    logo: template.data.logo,
    categories: template.data.categories,
    featured: template.data.featured,
  };
}
