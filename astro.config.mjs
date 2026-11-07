// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * ─── GITHUB PAGES SETUP — CHANGE THESE TWO LINES ─────────────────────────────
 * GITHUB_USER : your GitHub username                       (e.g. "AT1NG")
 * REPO_NAME   : your repository name
 *
 *  A) Project site  → https://<user>.github.io/<repo-name>/   (any repo name)
 *       REPO_NAME = "PortofolioMuhammadFaathir"  → base becomes "/PortofolioMuhammadFaathir"
 *  B) User site     → https://<user>.github.io/               (repo MUST be named "<user>.github.io")
 *       REPO_NAME = "at1ng.github.io"     → base becomes "/"
 *
 * The deploy workflow passes the real repo name automatically (GITHUB_REPOSITORY),
 * so on GitHub it "just works". These constants are used for local builds.
 * Custom domain? Set SITE_URL to it and BASE to "/".
 * ──────────────────────────────────────────────────────────────────────────────
 */
const GITHUB_USER = 'AT1NG';
const REPO_NAME = 'PortofolioMuhammadFaathir';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? REPO_NAME;
const user = (process.env.GITHUB_REPOSITORY?.split('/')[0] ?? GITHUB_USER).toLowerCase();
const isUserSite = repo.toLowerCase() === `${user}.github.io`;

const SITE_URL = process.env.SITE_URL ?? `https://${user}.github.io`;
const BASE = process.env.SITE_URL ? '/' : isUserSite ? '/' : `/${repo}`;

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', id: 'id' } },
      filter: (page) => !page.includes('/tools/') && !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
