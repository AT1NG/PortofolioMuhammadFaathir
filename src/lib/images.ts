/**
 * Image resolution. Data files reference images by path relative to src/assets
 * ("projects/protego/cover.jpg"). Astro optimises them at build time (AVIF + WebP, multiple sizes).
 * Missing file → returns null → components render a generated placeholder.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif,JPG,PNG}', { eager: true });

export interface Img { src: string; avif: string; webp: string; w: number; h: number }
const cache = new Map<string, Promise<Img | null>>();
const WIDTHS = [480, 960, 1600];

export function imageExists(p?: string) { return !!p && !!files[`/src/assets/${p}`]; }

export function resolveImage(p?: string): Promise<Img | null> {
  if (!p) return Promise.resolve(null);
  const meta = files[`/src/assets/${p}`]?.default;
  if (!meta) { console.warn(`[images] missing: src/assets/${p} (showing placeholder)`); return Promise.resolve(null); }
  if (!cache.has(p)) cache.set(p, (async () => {
    const widths = WIDTHS.filter((w) => w < meta.width).concat(Math.min(meta.width, 1600)).filter((v, i, a) => a.indexOf(v) === i);
    const mk = async (format: 'avif' | 'webp') => {
      const out = await Promise.all(widths.map((w) => getImage({ src: meta, width: w, format, quality: format === 'avif' ? 55 : 76 })));
      return out.map((o, i) => `${o.src} ${widths[i]}w`).join(', ');
    };
    const [avif, webp] = await Promise.all([mk('avif'), mk('webp')]);
    const mid = await getImage({ src: meta, width: Math.min(meta.width, 960), format: 'webp', quality: 76 });
    return { src: mid.src, avif, webp, w: meta.width, h: meta.height };
  })());
  return cache.get(p)!;
}
