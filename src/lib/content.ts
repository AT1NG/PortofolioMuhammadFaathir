/**
 * Turns the validated data files into plain, localized, serializable objects with optimised images,
 * ready to be passed as props to React islands. Runs at build time only.
 */
import { achievements, experience, profile, projects, testimonials } from '../data';
import { fmtDate, fmtRange, getDict, sortKey } from './i18n';
import { resolveImage, type Img } from './images';
import { cleanUrl, domainOf, type Lang } from './url';

export type { Img };
export interface PImg extends Img { alt: string; focus?: string }
export interface Proof { label: string; url: string; platform: 'instagram' | 'website' | 'pdf' | 'other'; domain: string }

export interface AchievementL {
  id: string; title: string; badge: string; issuer: string; year: number; dateLabel: string;
  type: string; typeLabel: string; description: string; role: string;
  certificate: Img | null; gallery: PImg[]; highlight: boolean; proof: Proof[]; placeholder: boolean;
  project: { slug: string; title: string } | null;
}

export interface TimelineItem {
  id: string; type: 'work' | 'organization' | 'committee' | 'speaking' | 'achievement';
  role: string; org: string; range: string; sort: string; description: string;
  topic?: string; audience?: string; images: PImg[]; link?: string; achievementId?: string; placeholder: boolean;
}

export interface ProjectCardData {
  slug: string; title: string; tagline: string; description: string; category: string; year: number;
  tech: string[]; brandColor: string; cover: Img | null; featured: boolean; placeholder: boolean;
  funded: { id: string; year: number } | null;
}

const L = <T extends { en: string; id: string }>(v: T, lang: Lang) => v[lang];

async function imgs(list: { src: string; alt: { en: string; id: string }; focus?: string }[], lang: Lang): Promise<PImg[]> {
  const out: PImg[] = [];
  for (const it of list) {
    const r = await resolveImage(it.src);
    if (r) out.push({ ...r, alt: L(it.alt, lang), focus: it.focus });
  }
  return out;
}

export async function getAchievements(lang: Lang): Promise<AchievementL[]> {
  const d = getDict(lang);
  const list = await Promise.all(achievements.map(async (a): Promise<AchievementL> => {
    const proj = a.relatedProject ? projects.find((p) => p.slug === a.relatedProject) : undefined;
    return {
      id: a.id, title: L(a.title, lang), badge: a.badge ? L(a.badge, lang) : L(a.title, lang),
      issuer: L(a.issuer, lang), year: a.year, dateLabel: fmtDate(a.date ?? String(a.year), lang),
      type: a.type, typeLabel: d.achievements.types[a.type], description: L(a.description, lang), role: L(a.role, lang),
      certificate: await resolveImage(a.certificate), gallery: await imgs(a.gallery, lang),
      highlight: a.highlight, placeholder: a.placeholder,
      proof: a.proof.map((p) => { const url = cleanUrl(p.url); return { label: L(p.label, lang), url, platform: p.platform, domain: domainOf(url) }; }),
      project: proj ? { slug: proj.slug, title: proj.title } : null,
    };
  }));
  return list.sort((a, b) => b.year - a.year);
}

export async function getTimeline(lang: Lang, ach: AchievementL[]): Promise<TimelineItem[]> {
  const items: TimelineItem[] = await Promise.all(experience.map(async (e) => ({
    id: e.id, type: e.type, role: L(e.role, lang), org: L(e.org, lang), range: fmtRange(e.start, e.end, lang),
    sort: sortKey(e), description: L(e.description, lang),
    topic: e.topic ? L(e.topic, lang) : undefined, audience: e.audience ? L(e.audience, lang) : undefined,
    images: await imgs(e.images, lang), link: e.link ? cleanUrl(e.link) : undefined, placeholder: e.placeholder,
  })));
  for (const a of achievements) {
    const l = ach.find((x) => x.id === a.id)!;
    items.push({
      id: `ach-${a.id}`, type: 'achievement', role: l.title, org: l.issuer, range: l.dateLabel,
      sort: (a.date ?? String(a.year)) + '|' + (a.date ?? String(a.year)), description: l.description,
      images: l.gallery, achievementId: a.id, placeholder: a.placeholder,
    });
  }
  return items.sort((x, y) => (x.sort < y.sort ? 1 : -1));
}

export async function getProjectCards(lang: Lang): Promise<ProjectCardData[]> {
  return Promise.all(projects.map(async (p) => {
    const ach = achievements.find((a) => a.relatedProject === p.slug);
    return {
      slug: p.slug, title: p.title, tagline: L(p.tagline, lang), description: L(p.description, lang), category: p.category,
      year: p.year, tech: p.tech, brandColor: p.brandColor ?? '#e8400f', cover: await resolveImage(p.cover),
      featured: p.featured, placeholder: p.placeholder, funded: ach ? { id: ach.id, year: ach.year } : null,
    };
  }));
}

export async function getProjectDetail(slug: string, lang: Lang) {
  const p = projects.find((x) => x.slug === slug)!;
  const [card] = (await getProjectCards(lang)).filter((c) => c.slug === slug);
  const idx = projects.findIndex((x) => x.slug === slug);
  const nav = (i: number) => { const q = projects[(i + projects.length) % projects.length]; return { slug: q.slug, title: q.title, tagline: L(q.tagline, lang) }; };
  return {
    card,
    hero: await resolveImage(p.hero ?? p.cover),
    gallery: await imgs(p.gallery, lang),
    deviceOf: p.gallery.map((g) => g.device ?? 'photo'),
    featureCards: (await Promise.all(p.featureCards.map((f) => resolveImage(f)))).filter(Boolean) as Img[],
    problem: p.problem && L(p.problem, lang), role: p.role && L(p.role, lang), solution: p.solution && L(p.solution, lang),
    features: p.features.map((f) => ({ title: L(f.title, lang), body: L(f.body, lang) })),
    results: p.results?.[lang] ?? [], lessons: p.lessons && L(p.lessons, lang),
    links: { live: p.liveUrl, github: p.githubUrl, playStore: p.playStoreUrl, video: p.videoUrl },
    prev: nav(idx - 1), next: nav(idx + 1),
  };
}

export async function getProfile(lang: Lang) {
  const d = getDict(lang);
  const f = profile.facts;
  return {
    name: profile.name, shortName: profile.shortName, initials: profile.initials, email: profile.email,
    phone: profile.phone, socials: profile.socials,
    title: L(profile.title, lang), location: L(profile.location, lang), bio: L(profile.bio, lang), intro: L(profile.intro, lang),
    roles: profile.roles.map((r) => L(r, lang)),
    facts: { university: L(f.university, lang), chair: L(f.chair, lang), focus: L(f.focus, lang) },
    skills: profile.skills.map((s) => ({ key: s.key, label: d.skills.groups[s.key], items: s.items })),
    stack: profile.stack,
    portrait: await resolveImage(profile.portrait), aboutPhoto: await resolveImage(profile.aboutPhoto),
  };
}

export async function getTestimonials(lang: Lang) {
  return Promise.all(testimonials.map(async (t) => ({
    quote: L(t.quote, lang), name: t.name, role: L(t.role, lang), org: t.org, photo: await resolveImage(t.photo),
  })));
}
