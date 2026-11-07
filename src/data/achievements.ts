import { achievementSchema, parseData } from './schema';
import { z } from 'zod';

/**
 * Achievements. 1–2 entries → only hero badges + timeline + project badges.
 * 3+ entries → an "Achievements & Certifications" section appears automatically.
 */
export const achievements = parseData('src/data/achievements.ts', z.array(achievementSchema), [
  {
    id: 'pkm-2025',
    // Scheme read from the announcement poster; year 2025 confirmed by Faathir
    title: { en: 'PKM Grant Recipient: Protego', id: 'Penerima Pendanaan PKM: Protego' },
    badge: { en: 'PKM Grant Recipient 2025', id: 'Penerima Hibah PKM 2025' },
    issuer: { en: 'Pekan Kreativitas Mahasiswa (PKM), PKM-Karsa Cipta scheme', id: 'Pekan Kreativitas Mahasiswa (PKM), skema PKM-Karsa Cipta' },
    year: 2025,
    date: '2025-07',
    type: 'grant',
    description: {
      en: 'Team PROTEGO passed selection and received funding in the Pekan Kreativitas Mahasiswa program, PKM-Karsa Cipta scheme, for Protego.',
      id: 'Tim PROTEGO lolos seleksi dan meraih pendanaan program Pekan Kreativitas Mahasiswa skema PKM-Karsa Cipta untuk Protego.',
    },
    role: { en: 'Team member (Informatics): built the Android app', id: 'Anggota tim (Teknik Informatika): membuat aplikasi Android' },
    gallery: [
      { src: 'achievements/pkm-protego-announcement.jpg', alt: { en: 'Congratulation poster for Team PROTEGO', id: 'Poster ucapan selamat untuk Tim PROTEGO' } },
      { src: 'achievements/pkm-protego-team-1.jpg', alt: { en: 'Team PROTEGO working session', id: 'Sesi kerja Tim PROTEGO' } },
      { src: 'achievements/pkm-protego-team-2.jpg', alt: { en: 'Team PROTEGO at the PKM funding announcement', id: 'Tim PROTEGO pada pengumuman pendanaan PKM' } },
    ],
    relatedProject: 'protego',
    highlight: true,
    proof: [
      {
        label: { en: 'View official announcement', id: 'Lihat pengumuman resmi' },
        url: 'https://www.instagram.com/p/DLsKtRFpQlm/',
        platform: 'instagram',
      },
    ],
  },
]);
