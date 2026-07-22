import type { APIRoute } from 'astro';
import { createElement } from 'react';
import { ImageResponse } from 'takumi-js/response';
import { generate as DefaultImage } from 'fumadocs-ui/og/takumi';
import { getEntry } from 'astro:content';
import { getTemplates } from '@/lib/templates';

export async function getStaticPaths() {
  return (await getTemplates()).map((template) => ({
    params: { slug: template.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const template = await getEntry('templates', params.slug!);

  if (!template) return new Response(undefined, { status: 404 });

  return new ImageResponse(
    createElement(DefaultImage, {
      title: template.data.title,
      description: template.data.description,
      site: 'Coolify Templates',
    }),
    {
      width: 1200,
      height: 630,
      format: 'webp',
    },
  );
};
