import en from '../i18n/en.json';
import id from '../i18n/id.json';
import type { Lang } from './url';

export type Dict = typeof en;
const dicts: Record<Lang, Dict> = { en, id: id as Dict };
export const getDict = (lang: Lang): Dict => dicts[lang];

export const loc = <T extends { en: string; id: string }>(v: T, lang: Lang): string => v[lang];

/** "2025-07" → "Jul 2025" / "Jul 2025" (ID month names). "2025" → "2025". */
export function fmtDate(d: string | undefined, lang: Lang, present = 'Present'): string {
  if (!d) return '';
  if (d === 'present') return present;
  const [y, m] = d.split('-');
  if (!m) return y;
  return `${dicts[lang].months[Number(m) - 1]} ${y}`;
}
export function fmtRange(start: string, end: string | undefined, lang: Lang): string {
  const present = dicts[lang].experience.present;
  const s = fmtDate(start, lang);
  if (!end || end === start) return s;
  return `${s} – ${fmtDate(end, lang, present)}`;
}
export const sortKey = (e: { start: string; end?: string }) => (e.end === 'present' ? '9999' : (e.end ?? e.start)) + '|' + e.start;
