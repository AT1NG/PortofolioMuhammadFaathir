/**
 * Zod schemas for every data file. A typo in a data file fails the build with a clear message
 * (file, field path, what was expected).
 */
import { z } from 'zod';

export const LANGS = ['en', 'id'] as const;
export type Lang = (typeof LANGS)[number];

/** Bilingual text. Both languages are required; unknown keys are rejected (catches "in" vs "id" typos). */
export const L = z.object({ en: z.string().min(1), id: z.string().min(1) }).strict();
export type LText = z.infer<typeof L>;
export const LList = z.object({ en: z.array(z.string().min(1)), id: z.array(z.string().min(1)) }).strict();

const url = z.string().url();
/** Image path relative to src/assets, e.g. "projects/protego/cover.jpg". Missing files show a generated placeholder. */
const img = z.string().regex(/\.(jpe?g|png|webp|avif)$/i, 'image path must end in .jpg/.png/.webp/.avif');

export const platformEnum = z.enum(['instagram', 'website', 'pdf', 'other']);
export const proofLink = z.object({ label: L, url, platform: platformEnum }).strict();

/* ───────────── profile ───────────── */
export const profileSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  initials: z.string(),
  title: L,
  location: L,
  email: z.string().email(),
  phone: z.object({ display: z.string(), wa: url }),
  roles: z.array(L).min(1),
  bio: L,
  intro: L,
  facts: z.object({
    university: L, chair: L, focus: L,
  }),
  skills: z.array(z.object({
    key: z.enum(['erp', 'mobile', 'web', 'iot', 'devops']),
    items: z.array(z.string()).min(1),
  })),
  stack: z.array(z.string()).min(4),
  socials: z.object({ linkedin: url, github: url, instagram: url }),
  portrait: img.optional(),
  aboutPhoto: img.optional(),
}).strict();

/* ───────────── projects ───────────── */
export const projectSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  tagline: L,
  description: L,
  category: z.enum(['ERP', 'Mobile', 'Web', 'IoT', 'Other']),
  year: z.number().int().min(2018).max(2100),
  tech: z.array(z.string()).min(1),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  cover: img.optional(),
  hero: img.optional(),
  gallery: z.array(z.object({ src: img, alt: L, device: z.enum(['phone', 'laptop', 'photo']).optional() })).default([]),
  featureCards: z.array(img).default([]),
  liveUrl: url.optional(),
  githubUrl: url.optional(),
  playStoreUrl: url.optional(),
  videoUrl: url.optional(),
  featured: z.boolean(),
  placeholder: z.boolean().default(false),
  problem: L.optional(),
  role: L.optional(),
  solution: L.optional(),
  features: z.array(z.object({ title: L, body: L })).default([]),
  results: LList.optional(),
  lessons: L.optional(),
}).strict();

/* ───────────── experience ───────────── */
export const experienceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['work', 'organization', 'committee', 'speaking']),
  role: L,
  org: L,
  start: z.string().regex(/^\d{4}(-\d{2})?$/, 'use YYYY or YYYY-MM'),
  end: z.union([z.literal('present'), z.string().regex(/^\d{4}(-\d{2})?$/)]).optional(),
  description: L,
  images: z.array(z.object({ src: img, alt: L, focus: z.string().optional() })).default([]),
  link: url.optional(),
  topic: L.optional(),
  audience: L.optional(),
  placeholder: z.boolean().default(false),
}).strict().superRefine((e, ctx) => {
  if (e.type === 'speaking' && !e.topic) ctx.addIssue({ code: 'custom', message: 'speaking entries need a topic', path: ['topic'] });
});

/* ───────────── achievements ───────────── */
export const achievementSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: L,
  badge: L.optional(),
  issuer: L,
  year: z.number().int(),
  date: z.string().regex(/^\d{4}(-\d{2})?$/).optional(),
  type: z.enum(['grant', 'award', 'competition', 'certification', 'ip']),
  description: L,
  role: L,
  certificate: img.optional(),
  gallery: z.array(z.object({ src: img, alt: L })).default([]),
  relatedProject: z.string().optional(),
  highlight: z.boolean(),
  proof: z.array(proofLink).default([]),
  placeholder: z.boolean().default(false),
}).strict();

/* ───────────── testimonials ───────────── */
export const testimonialSchema = z.object({
  quote: L, name: z.string(), role: L, org: z.string(), photo: img.optional(),
}).strict();

export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;

/** Parse with a readable error: which file + which field. */
export function parseData<T extends z.ZodTypeAny>(file: string, schema: T, data: unknown): z.infer<T> {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  const msg = r.error.issues.map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
  throw new Error(`\n\n❌ Invalid data in ${file}\n${msg}\n`);
}
