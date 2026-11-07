# Faathir · Portfolio

Personal portfolio built with **Astro + Tailwind CSS + TypeScript**, animated with **Motion** (React islands) and **Lenis** smooth scrolling. Fully static, bilingual (EN `/` and ID `/id/`), deployed to **GitHub Pages**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321/<base>/
npm run build      # static output in dist/
npm run preview    # serve dist/
```

Node 22+ is required.

## Where things live

| What | Where |
|---|---|
| Profile, roles, skills, tech marquee, contact links | `src/data/profile.ts` |
| Projects | `src/data/projects.ts` |
| Experience / committees / talks | `src/data/experience.ts` |
| Achievements + proof links | `src/data/achievements.ts` |
| Testimonials (empty = hidden) | `src/data/testimonials.ts` |
| All UI text | `src/i18n/en.json` + `src/i18n/id.json` |
| Colours, type scale, spacing, radii, shadows | `src/styles/global.css` (`@theme`) |
| Shared motion presets | `src/lib/motion.ts` |
| Images | `src/assets/projects/<slug>/`, `src/assets/experience/`, `src/assets/achievements/`, `src/assets/profile/` |

Every visitor-facing field has an `en` and an `id` version. Data is validated with **zod** (`src/data/schema.ts`), so a typo gives a clear build error that names the file and the field. Anything still unfinished is marked **PLACEHOLDER** (search the project for that word) or `TODO` / `DRAFT – review`.

## Add a project

1. Put screenshots in `src/assets/projects/<slug>/` (any size or aspect ratio; phone screenshots are fine).
2. Add an object to the array in `src/data/projects.ts`:
   ```ts
   {
     title: 'My App', slug: 'my-app',                 // slug = URL: /projects/my-app/
     tagline: { en: '…', id: '…' },
     description: { en: 'What it is for…', id: 'Untuk apa…' },
     category: 'Web',                                 // ERP | Mobile | Web | IoT | Other
     year: 2026, tech: ['Astro', 'Go'], featured: false,
     cover: 'projects/my-app/cover.jpg',
     gallery: [{ src: 'projects/my-app/01.jpg', alt: { en: '…', id: '…' }, device: 'laptop' }],
     // optional: liveUrl, githubUrl, playStoreUrl, videoUrl, problem, role, solution, features, results, lessons
   }
   ```
   Empty optional fields are hidden on the page. A missing image shows a generated placeholder, never a broken box.
3. `npm run build` checks everything.

## Add an experience, achievement or testimonial

* **Experience**: append to `src/data/experience.ts` with `type: 'work' | 'organization' | 'committee' | 'speaking'`. Dates are `YYYY` or `YYYY-MM`; use `end: 'present'` for ongoing. Speaking entries also need `topic` (and optionally `audience`). With **3+ speaking entries** a draggable speaker slider appears automatically.
* **Achievement**: append to `src/data/achievements.ts`. Add `proof: [{ label, url, platform }]` (`instagram | website | pdf | other`); tracking parameters (`utm_*`, `igsh`, …) are stripped at build time. `highlight: true` shows it as a Hero badge. Set `relatedProject` to a project slug to show a "Funded by" badge and section on that project. With **1–2 achievements** there is no separate section (they appear in the hero, timeline and project badges); with **3+** an "Achievements & Certifications" grid appears and the navbar link is added.
* **Testimonial**: fill the array in `src/data/testimonials.ts`; the section and navbar link appear automatically.

## Add images

Always reference an image by its path **relative to `src/assets/`**, e.g. `experience/my-event-1.jpg`.

* **With git**: copy the file into the folder, then `git add . && git commit -m "Add photos" && git push`.
* **On GitHub's website**: open the repo → go to the folder (e.g. `src/assets/experience`) → **Add file → Upload files** → drag the photos in → **Commit changes**.

Photos are optimised during the build (AVIF/WebP, several sizes, lazy-loaded), so raw, unresized photos are fine. Prefer short kebab-case names (`tenumba-office-1.jpg`).

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically. Your site appears at the URL shown in the workflow run.

`site` and `base` are set in `astro.config.mjs` (see the comment at the top). The deploy workflow reads the real repository name, so it works for both:

* **Project site** `https://<user>.github.io/<repo-name>/`: nothing to change.
* **User site** `https://<user>.github.io/`: name the repository `<user>.github.io` (base becomes `/` automatically).

For local builds, edit `GITHUB_USER` and `REPO_NAME` at the top of `astro.config.mjs`.

## Notes

* No CV/resume download by design.
* Light theme only. Respects `prefers-reduced-motion` (no preloader, marquee, tilt, parallax, scroll reveals or Lenis). All content is readable with JavaScript disabled.
* Secrets are excluded by `.gitignore` (`.env*`, `*.jks`, `*.keystore`, `*.p12`, `key.properties`, …). Never commit project source code or credentials here.
