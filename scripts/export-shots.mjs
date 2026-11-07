// Turns raw Playwright screenshots (kept outside the repo) into optimised gallery images + a cover per project.
// Only images are written into src/assets/projects/<slug>/. No source code, no .env, no databases.
// Usage: SHOTS=<dir with <project>/<name>.png> node scripts/export-shots.mjs [slug...]
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';

const SHOTS = process.env.SHOTS ?? 'C:/Users/FAATHIR/AppData/Local/Temp/claude/3efe9c33e1fcf9bd/143eae8b-a634-4ecd-86fc-5c424160dba6/scratchpad/shots';
const OUT = 'src/assets/projects';

/** cover: 'first' = crop the first shot to 16:10, 'phones' = 3 phone screens on a soft background. */
const manifest = {
  'cdc-umbandung': { dir: 'cdc', cover: 'first', shots: ['landing', 'lowongan', 'panel', 'panel-lowongan', 'panel-perusahaan', 'mobile-landing'] },
  pesonamu: { dir: 'pesonamu', cover: 'first', shots: ['dashboard', 'camaba', 'kelompok', 'mentor', 'kesiapan', 'mobile-home', 'mobile-login'] },
  protego: { dir: 'protego', cover: 'phones', shots: ['01-beranda', '02-dashboard', '03-log'] },
  zenith: { dir: 'zenith', cover: 'phones', shots: ['01-dashboard', '02-aktivitas', '03-anggaran', '04-insight', '05-lainnya'] },
  duluin: { dir: 'duluin', cover: 'phones', shots: ['beranda', 'tugas', 'kalender', 'progres', 'tentang'] },
  'e-voting-v2': { dir: 'voting', cover: 'phones', shots: ['01-login', '02-voting', '03-kandidat', '04-hasil', '05-admin'] },
};

const only = process.argv.slice(2);
const bg = { r: 236, g: 231, b: 218 };

async function coverPhones(files, dest) {
  const W = 1600, H = 1000, h = 800, w = Math.round(h * 390 / 844), gap = 70;
  const picks = files.slice(0, 3);
  const total = picks.length * w + (picks.length - 1) * gap;
  const layers = [];
  for (let i = 0; i < picks.length; i++) {
    const shot = await sharp(picks[i]).resize({ width: w, height: h, fit: 'cover', position: 'top' }).toBuffer();
    const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="38" ry="38"/></svg>`);
    const rounded = await sharp(shot).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    const left = Math.round((W - total) / 2 + i * (w + gap)); const top = Math.round((H - h) / 2 + (i === 1 ? -20 : 20));
    const shadow = await sharp({ create: { width: w, height: h, channels: 4, background: { r: 18, g: 18, b: 18, alpha: 0.28 } } }).composite([{ input: mask, blend: 'dest-in' }]).blur(26).png().toBuffer();
    layers.push({ input: shadow, left, top: top + 24 }, { input: rounded, left, top });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } }).composite(layers).jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
}

for (const [slug, m] of Object.entries(manifest)) {
  if (only.length && !only.includes(slug)) continue;
  const files = m.shots.map((n) => path.join(SHOTS, m.dir, n + '.png')).filter((f) => fs.existsSync(f));
  if (!files.length) { console.log('skip', slug, '(no screenshots yet)'); continue; }
  const dir = path.join(OUT, slug); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let i = 0;
  for (const f of files) {
    i++; const meta = await sharp(f).metadata(); const tall = meta.height > meta.width;
    const name = path.basename(f, '.png').replace(/^\d+-/, '');
    await sharp(f).resize({ width: tall ? 780 : 1800, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(dir, `${String(i).padStart(2, '0')}-${name}.jpg`));
  }
  const first = files[0];
  if (m.cover === 'first') await sharp(first).resize({ width: 1600, height: 1000, fit: 'cover', position: 'top' }).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(dir, 'cover.jpg'));
  else await coverPhones(files, path.join(dir, 'cover.jpg'));
  console.log('✓', slug, files.length, 'screens + cover');
}
