import { parseData, profileSchema } from './schema';

export const profile = parseData('src/data/profile.ts', profileSchema, {
  name: 'Muhammad Faathir',
  shortName: 'Faathir',
  initials: 'FM',
  title: { en: 'Informatics student · ERP & app developer', id: 'Mahasiswa Teknik Informatika · Developer ERP & aplikasi' },
  location: { en: 'Bandung, Indonesia', id: 'Bandung, Indonesia' },

  // Contact details — exactly as provided.
  email: 'almukhrij@gmail.com',
  phone: { display: '0813-2107-6699', wa: 'https://wa.me/6281321076699' },
  socials: {
    linkedin: 'https://www.linkedin.com/in/muhammad-faathir-915b5935a/',
    github: 'https://github.com/AT1NG',
    instagram: 'https://www.instagram.com/akubukancinaa/',
  },

  // Rotating hero text
  roles: [
    { en: 'Odoo Developer', id: 'Developer Odoo' },
    { en: 'Flutter Developer', id: 'Developer Flutter' },
    { en: 'Web Developer', id: 'Web Developer' },
    { en: 'Public Speaker', id: 'Pembicara Publik' },
  ],

  // DRAFT – review: wording polished from your brief
  intro: {
    en: 'Informatics student who builds backend systems and mobile apps.',
    id: 'Mahasiswa Teknik Informatika yang membangun sistem backend dan aplikasi mobile.',
  },
  bio: {
    en: 'Informatics student who builds backend systems and mobile apps.',
    id: 'Mahasiswa Teknik Informatika yang membangun sistem backend dan aplikasi mobile.',
  },
  facts: {
    university: { en: 'Informatics (Teknik Informatika), Universitas Muhammadiyah Bandung', id: 'Teknik Informatika, Universitas Muhammadiyah Bandung' },
    chair: { en: 'Chair of HMIF, 2025–2026 term', id: 'Ketua HMIF, periode 2025–2026' },
    focus: { en: 'Backend · Mobile apps (Flutter)', id: 'Backend · Aplikasi mobile (Flutter)' },
  },

  skills: [
    { key: 'erp', items: ['Odoo customization', 'Custom modules', 'QWeb reports', 'RFID attendance', 'HRIS'] },
    { key: 'mobile', items: ['Flutter', 'Dart', 'Provider', 'Firebase'] },
    { key: 'web', items: ['HTML / CSS / JS', 'React', 'TypeScript', 'Go (Gin)', 'PHP (CodeIgniter)', 'Web deployment'] },
    { key: 'iot', items: ['ESP8266', 'RFID', 'Sensors & dashboards'] },
    { key: 'devops', items: ['Docker', 'Cloudflare', 'Tailscale', 'Git & GitHub', 'Linux'] },
  ],

  // Marquee
  stack: ['Odoo', 'Python', 'Flutter', 'Dart', 'React', 'TypeScript', 'Go', 'PHP', 'MySQL', 'PostgreSQL', 'Firebase', 'Docker', 'Cloudflare', 'Tailscale', 'ESP8266', 'Astro', 'Tailwind CSS'],

  portrait: 'profile/hero-portrait.jpg',
  aboutPhoto: 'profile/about-portrait.jpg',
});
