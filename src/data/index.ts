import { profile } from './profile';
import { projects } from './projects';
import { experience } from './experience';
import { achievements } from './achievements';
import { testimonials } from './testimonials';

// Cross-file checks → clear build errors instead of silent broken links.
const slugs = new Set<string>();
for (const p of projects) {
  if (slugs.has(p.slug)) throw new Error(`❌ projects.ts: duplicate slug "${p.slug}"`);
  slugs.add(p.slug);
}
for (const a of achievements) {
  if (a.relatedProject && !slugs.has(a.relatedProject)) {
    throw new Error(`❌ achievements.ts: "${a.id}" has relatedProject "${a.relatedProject}" but no project has that slug`);
  }
}
const ids = new Set<string>();
for (const e of [...experience, ...achievements]) {
  if (ids.has(e.id)) throw new Error(`❌ duplicate id "${e.id}" (experience.ts / achievements.ts)`);
  ids.add(e.id);
}

export { profile, projects, experience, achievements, testimonials };
