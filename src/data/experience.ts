import { experienceSchema, parseData } from './schema';
import { z } from 'zod';

/**
 * Experience & activities. type: "work" | "organization" | "committee" | "speaking".
 * Dates: "YYYY" or "YYYY-MM"; end: "present" for ongoing, omit for a single date.
 * Wording is DRAFT – review.  Dates marked TODO are best guesses from file names – please confirm.
 */
export const experience = parseData('src/data/experience.ts', z.array(experienceSchema), [
  {
    id: 'tenumba-internship',
    type: 'work',
    role: { en: 'Intern, Odoo ERP & Web', id: 'Magang, ERP Odoo & Web' },
    org: { en: 'PT Tenumba Sinergi Informatika', id: 'PT Tenumba Sinergi Informatika' },
    start: '2026-06', end: '2026-09', // 12 Jun – 12 Sep (year assumed 2026, TODO: confirm)
    description: {
      en: 'Internship focused on Odoo ERP implementation, HRIS, and web & digital marketing.',
      id: 'Magang di bidang implementasi ERP Odoo, HRIS, serta web & digital marketing.',
    },
    images: [
      { src: 'experience/tenumba-office-1.jpg', focus: '50% 52%', alt: { en: 'With the team at the Tenumba office, which shares a building with Ruang Jumpa Coffee, Cimahi', id: 'Bersama tim di kantor Tenumba, satu gedung dengan Ruang Jumpa Coffee, Cimahi' } },
      { src: 'experience/tenumba-office-2.jpg', alt: { en: 'Faathir with colleagues in front of the Ruang Jumpa Coffee sign at the Tenumba office', id: 'Faathir bersama rekan di depan papan Ruang Jumpa Coffee, kantor Tenumba' } },
      { src: 'experience/tenumba-office-3.jpg', alt: { en: 'Team photo at the Tenumba office, Cimahi', id: 'Foto tim di kantor Tenumba, Cimahi' } },
      { src: 'experience/tenumba-office-4.jpg', focus: '50% 62%', alt: { en: 'Tenumba team under the glass roof, Ruang Jumpa Coffee sign in the middle', id: 'Tim Tenumba di bawah atap kaca, papan Ruang Jumpa Coffee di tengah' } },
      { src: 'experience/tenumba-team-1.jpg', alt: { en: 'Working through a problem with colleagues at Tenumba', id: 'Berdiskusi menyelesaikan masalah bersama rekan di Tenumba' } },
    ],
    link: 'https://tenumba.com',
  },
  {
    id: 'hmif-chair',
    type: 'organization',
    role: { en: 'Chair (Ketua) of HMIF', id: 'Ketua HMIF' },
    org: { en: 'Informatics Student Association, Universitas Muhammadiyah Bandung', id: 'Himpunan Mahasiswa Informatika, Universitas Muhammadiyah Bandung' },
    start: '2025-12', end: '2026-12', // term Dec 2025 – Dec 2026 (confirmed)
    description: {
      en: 'Chair of HMIF, the Informatics student association of Universitas Muhammadiyah Bandung.',
      id: 'Ketua HMIF, Himpunan Mahasiswa Informatika Universitas Muhammadiyah Bandung.',
    },
    images: [
      { src: 'experience/hmif-chair-1.jpg', alt: { en: 'Faathir at the HMIF secretariat', id: 'Faathir di sekretariat HMIF' } },
      { src: 'experience/hmif-chair-2.jpg', alt: { en: 'HMIF inauguration ceremony, 2025–2026 term', id: 'Pelantikan HMIF periode 2025–2026' } },
      { src: 'experience/hmif-chair-3.jpg', alt: { en: 'Faathir speaking at an HMIF event', id: 'Faathir berbicara di acara HMIF' } },
      { src: 'experience/hmif-chair-4.jpg', alt: { en: 'HMIF members gathering', id: 'Kebersamaan anggota HMIF' } },
      { src: 'experience/hmif-chair-5.jpg', alt: { en: 'Faathir delivering a speech at the podium', id: 'Faathir menyampaikan sambutan di podium' } },
    ],
  },
  {
    id: 'pesonamu-2026-koor',
    type: 'committee',
    role: { en: 'Faculty Mentor Coordinator, Science & Technology', id: 'Koordinator Mentor Fakultas Sains & Teknologi' },
    org: { en: 'PESONAMU 2026 (campus orientation)', id: 'PESONAMU 2026 (ospek kampus)' },
    start: '2026-09',
    description: {
      en: 'Faculty Mentor Coordinator for Science & Technology in the campus orientation (PESONAMU 2026).',
      id: 'Koordinator Mentor Fakultas Sains & Teknologi pada ospek kampus (PESONAMU 2026).',
    },
    images: [
      { src: 'experience/pesonamu-2026-koor-1.jpg', focus: '50% 62%', alt: { en: 'Science & Technology mentor team, PESONAMU 2026', id: 'Tim mentor Saintek, PESONAMU 2026' } },
      { src: 'experience/pesonamu-2026-koor-2.jpg', alt: { en: 'Mentor coordinators posing together', id: 'Para koordinator mentor berfoto bersama' } },
      { src: 'experience/pesonamu-2026-koor-3.jpg', alt: { en: 'Mentor team group photo', id: 'Foto bersama tim mentor' } },
    ],
  },
  {
    id: 'pesonamu-2024-mentor',
    type: 'committee',
    role: { en: 'Mentor', id: 'Mentor' },
    org: { en: 'PESONAMU 2024 (campus orientation)', id: 'PESONAMU 2024 (ospek kampus)' },
    start: '2024-09',
    description: {
      en: 'Mentor in the campus orientation (PESONAMU 2024).',
      id: 'Mentor pada ospek kampus (PESONAMU 2024).',
    },
    images: [
      { src: 'experience/pesonamu-2024-mentor-1.jpg', alt: { en: 'Mentor group at PESONAMU 2024', id: 'Kelompok mentoring PESONAMU 2024' } },
      { src: 'experience/pesonamu-2024-mentor-2.jpg', alt: { en: 'Mentees with their name cards', id: 'Mentee dengan kartu nama mereka' } },
      { src: 'experience/pesonamu-2024-mentor-3.jpg', alt: { en: 'Group photo after the session', id: 'Foto bersama setelah sesi' } },
    ],
  },
  {
    id: 'olympicad-2024-lo',
    type: 'committee',
    role: { en: 'Liaison Officer (LO)', id: 'Liaison Officer (LO)' },
    org: { en: 'OlympicAD 7, 2024', id: 'OlympicAD 7, 2024' },
    start: '2024-03',
    description: {
      en: 'Liaison Officer at OlympicAD 7, 2024.',
      id: 'Liaison Officer pada OlympicAD 7, 2024.',
    },
    images: [
      { src: 'experience/olympicad-2024-lo-1.jpg', alt: { en: 'LO team at OlympicAD 7', id: 'Tim LO di OlympicAD 7' } },
      { src: 'experience/olympicad-2024-lo-2.jpg', alt: { en: 'LO team members with participant cards', id: 'Anggota LO dengan kartu peserta' } },
    ],
  },
  {
    id: 'kinemaksi-2024',
    type: 'committee',
    role: { en: 'Committee Member', id: 'Panitia' }, // TODO: confirm exact role
    org: { en: 'KINEMAKSI 2024', id: 'KINEMAKSI 2024' },
    start: '2024-10',
    description: {
      en: 'Part of the organizing committee of KINEMAKSI 2024.', // TODO: confirm what the event is
      id: 'Bagian dari kepanitiaan KINEMAKSI 2024.',
    },
    images: [
      { src: 'experience/kinemaksi-2024-1.jpg', alt: { en: 'Faathir at the KINEMAKSI exhibition space', id: 'Faathir di ruang pameran KINEMAKSI' } },
      { src: 'experience/kinemaksi-2024-2.jpg', alt: { en: 'KINEMAKSI 2024 committee', id: 'Panitia KINEMAKSI 2024' } },
    ],
  },
  {
    id: 'thufan-al-aqsha-foh',
    type: 'committee',
    role: { en: 'Front of House', id: 'Front of House' },
    org: { en: 'Thufan Al-Aqsha', id: 'Thufan Al-Aqsha' },
    start: '2026-10', // 25 Oct 2026 (confirmed)
    description: {
      en: 'Front of House committee for the Thufan Al-Aqsha event.',
      id: 'Panitia Front of House acara Thufan Al-Aqsha.',
    },
    images: [{ src: 'experience/thufan-al-aqsha-foh-1.jpg', alt: { en: 'Thufan Al-Aqsha committee on stage', id: 'Panitia Thufan Al-Aqsha di atas panggung' } }],
  },
  {
    id: 'talk-literasi-digital',
    type: 'speaking',
    role: { en: 'Speaker', id: 'Pemateri' },
    org: { en: 'MTs As Salafiyah, Paseh, Sumedang', id: 'MTs As Salafiyah, Paseh, Sumedang' },
    start: '2025-08', // TODO: confirm date (the slide is hard to read)
    topic: { en: 'Bijak Bermedia Sosial, Aman Berteknologi', id: 'Bijak Bermedia Sosial, Aman Berteknologi' },
    audience: { en: 'Students of MTs As Salafiyah', id: 'Siswa dan siswi MTs As Salafiyah' },
    description: {
      en: 'Digital literacy class for MTs As Salafiyah students on using social media wisely and staying safe with technology.',
      id: 'Kelas literasi digital untuk siswa MTs As Salafiyah tentang bijak bermedia sosial dan aman berteknologi.',
    },
    images: [{ src: 'experience/talk-literasi-digital-1.jpg', alt: { en: 'Faathir presenting the digital literacy class', id: 'Faathir membawakan kelas literasi digital' } }],
  },
  {
    id: 'talk-teknik-persidangan',
    type: 'speaking',
    role: { en: 'Speaker', id: 'Pemateri' },
    org: { en: 'SATRIKA, department orientation', id: 'SATRIKA, ospek jurusan' }, // event name confirmed by Faathir
    start: '2024', // year confirmed by Faathir
    topic: { en: 'Teknik Persidangan (assembly procedure)', id: 'Teknik Persidangan' },
    audience: { en: 'SATRIKA participants', id: 'Peserta SATRIKA' }, // TODO: confirm audience wording
    description: {
      en: 'Speaker on assembly procedure (Teknik Persidangan) at SATRIKA, the department orientation.',
      id: 'Pemateri Teknik Persidangan di SATRIKA, ospek jurusan.',
    },
    images: [
      { src: 'experience/talk-teknik-persidangan-1.jpg', alt: { en: 'Faathir presenting on assembly procedure', id: 'Faathir menyampaikan materi teknik persidangan' } },
      { src: 'experience/talk-teknik-persidangan-2.jpg', alt: { en: 'Presenting with the slide in view', id: 'Memaparkan materi dengan slide di belakang' } },
      { src: 'experience/talk-teknik-persidangan-3.jpg', alt: { en: 'Answering questions from the audience', id: 'Menjawab pertanyaan peserta' } },
    ],
  },
]);
