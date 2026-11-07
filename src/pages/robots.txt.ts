import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${base}sitemap-index.xml`.replace('//', '/'), site).href}\n`, { headers: { 'Content-Type': 'text/plain' } });
};
