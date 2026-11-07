// One-off: copies photos from the asset folder into src/assets (originals are NEVER modified),
// applying orientation fix, light crops, a gentle auto-level, and kebab-case names.
// Run: node scripts/prep-photos.mjs   (re-runnable)
import sharp from 'sharp'; import convert from 'heic-convert'; import fs from 'fs'; import path from 'path';
const SRC = process.env.ASSET_DIR ?? 'D:/Project/porto faathir';
const OUT = 'src/assets';
// crop = fractions [left, top, right, bottom] of the oriented image to KEEP (0..1)
const jobs = [
  ['Foto Halaman Utama/IMG_1660 (2).JPG', 'profile/hero-portrait.jpg', { crop: [0, 0, 1, 1] }],
  ['Foto Halaman Utama/IMG_1664.JPG', 'profile/about-portrait.jpg'],
  ['Ketua Himpunan di Himpunan Mahasiwa Informatika Universitas Muhammadiyah Bandung/DSC_0400.JPG', 'experience/hmif-chair-1.jpg'],
  ['Ketua Himpunan di Himpunan Mahasiwa Informatika Universitas Muhammadiyah Bandung/IMG-20260107-WA0019.jpg', 'experience/hmif-chair-2.jpg'],
  ['Ketua Himpunan di Himpunan Mahasiwa Informatika Universitas Muhammadiyah Bandung/IMG-20260225-WA0099.jpg', 'experience/hmif-chair-3.jpg'],
  ['Ketua Himpunan di Himpunan Mahasiwa Informatika Universitas Muhammadiyah Bandung/IMG-20260314-WA0147.jpg', 'experience/hmif-chair-4.jpg'],
  ['Ketua Himpunan di Himpunan Mahasiwa Informatika Universitas Muhammadiyah Bandung/WhatsApp Image 2026-11-07 at 01.42.55.jpeg', 'experience/hmif-chair-5.jpg'],
  ['tenumba/IMG_8816.HEIC', 'experience/tenumba-office-1.jpg'],
  ['tenumba/IMG_8814.HEIC', 'experience/tenumba-office-2.jpg'],
  ['tenumba/IMG_8817.HEIC', 'experience/tenumba-office-3.jpg'],
  ['tenumba/WhatsApp Image 2026-11-07 at 02.26.06.jpeg', 'experience/tenumba-office-4.jpg'],
  // crop the plastic bag + phone at the bottom edge
  ['tenumba/WhatsApp Image 2026-11-07 at 02.26.0633.jpeg', 'experience/tenumba-team-1.jpg', { crop: [0, 0, 1, 0.8] }],
  ['KOOR MENTOR FAKULTAS SAINTEK PANITIA PESONAMU 2026 (OSPEK KAMPUS)/WhatsApp Image 2026-11-07 at 01.51.47.jpeg', 'experience/pesonamu-2026-koor-1.jpg'],
  ['KOOR MENTOR FAKULTAS SAINTEK PANITIA PESONAMU 2026 (OSPEK KAMPUS)/WhatsApp Image 2026-11-07 at 01.51.48.jpeg', 'experience/pesonamu-2026-koor-2.jpg'],
  ['KOOR MENTOR FAKULTAS SAINTEK PANITIA PESONAMU 2026 (OSPEK KAMPUS)/WhatsApp Image 2026-11-07 at 01.51.485.jpeg', 'experience/pesonamu-2026-koor-3.jpg'],
  // keep only the people (drop the sky above the canopy)
  ['Mentor Pesonamu 2024/IMG-20240917-WA0070.jpg', 'experience/pesonamu-2024-mentor-1.jpg', { crop: [0, 0.47, 1, 0.97] }],
  ['Mentor Pesonamu 2024/IMG-20240921-WA0050.jpg', 'experience/pesonamu-2024-mentor-2.jpg', { crop: [0, 0.3, 1, 1] }],
  ['Mentor Pesonamu 2024/IMG-20240921-WA0058.jpg', 'experience/pesonamu-2024-mentor-3.jpg', { crop: [0, 0.3, 1, 1] }],
  ['LO OlympicAD 7 2024/IMG-20240308-WA0068.jpg', 'experience/olympicad-2024-lo-1.jpg'],
  ['LO OlympicAD 7 2024/WhatsApp Image 2026-11-06 at 13.59.01.jpeg', 'experience/olympicad-2024-lo-2.jpg'],
  ['KINEMAKSI 2024/IMG-20241024-WA0081.jpg', 'experience/kinemaksi-2024-1.jpg'],
  ['KINEMAKSI 2024/IMG-20241031-WA0059.jpg', 'experience/kinemaksi-2024-2.jpg'],
  ['FOH THUFAN Al -AQSHA/FALL7685.jpg', 'experience/thufan-al-aqsha-foh-1.jpg'],
  ['PEMATERI TEKNIK PERSIDANGAN/DSC_0109.JPG', 'experience/talk-teknik-persidangan-1.jpg'],
  ['PEMATERI TEKNIK PERSIDANGAN/DSC_0130.JPG', 'experience/talk-teknik-persidangan-2.jpg'],
  ['PEMATERI TEKNIK PERSIDANGAN/ARB00636.JPG', 'experience/talk-teknik-persidangan-3.jpg'],
  // drop the white top bar + Instagram camera sticker (top-left)
  ['PEMATERI LITERASI DIGITAL MTs AS SALAFIYAH/bijak-bermedia-sosial-mts-as-salafiyah.png', 'experience/talk-literasi-digital-1.jpg', { crop: [0, 0.4, 1, 1], noUpscale: true }],
  // hide the contact line at the bottom of the poster
  ['pkm/IMG-20250704-WA0042.jpg', 'achievements/pkm-protego-announcement.jpg', { crop: [0, 0, 1, 0.9] }],
  ['pkm/IMG-20250707-WA0025.jpg', 'achievements/pkm-protego-team-1.jpg'],
  ['pkm/IMG-20251021-WA0054.jpg', 'achievements/pkm-protego-team-2.jpg'],
];
let n = 0;
for (const [rel, dest, o = {}] of jobs) {
  const from = path.join(SRC, rel); const to = path.join(OUT, dest);
  if (!fs.existsSync(from)) { console.warn('MISSING', rel); continue; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const input = /\.heic$/i.test(from) ? Buffer.from(await convert({ buffer: fs.readFileSync(from), format: 'JPEG', quality: 0.92 })) : from;
  let img = sharp(input, { failOn: 'none' }).rotate();
  const m = await sharp(await img.clone().toBuffer()).metadata();
  if (o.crop) { const [l, t, r, b] = o.crop; img = sharp(await img.toBuffer()).extract({ left: Math.round(l * m.width), top: Math.round(t * m.height), width: Math.round((r - l) * m.width), height: Math.round((b - t) * m.height) }); }
  else img = sharp(await img.toBuffer());
  img = img.resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true }).normalise({ lower: 1, upper: 99 }).modulate({ saturation: 1.04 });
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(to); n++; console.log('✓', dest);
}
console.log(n, 'photos');
