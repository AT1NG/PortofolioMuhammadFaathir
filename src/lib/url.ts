/** URL helpers: tracking-param stripping, domain display, base-aware paths. */
const TRACKING = /^(utm_.+|igsh|igshid|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|si|ref|ref_src|ref_url|_ga|yclid|twclid|wbraid|gbraid)$/i;

export function cleanUrl(raw: string): string {
  try {
    const u = new URL(raw);
    for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
    return u.toString();
  } catch { return raw; }
}
export function domainOf(raw: string): string {
  try { return new URL(raw).hostname.replace(/^www\./, ''); } catch { return raw; }
}
/** Prefix with Astro's base ("/" or "/repo-name/"). path: "projects/x/" or "#about" */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path.startsWith('#')) return path;
  return `${base}/${path.replace(/^\//, '')}`;
}
export type Lang = 'en' | 'id';
/** Localized path: lp('id','projects/x/') → "/repo/id/projects/x/" */
export function lp(lang: Lang, path = ''): string {
  return withBase(lang === 'id' ? `id/${path}` : path);
}
