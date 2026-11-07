import { parseData, projectSchema } from './schema';
import { z } from 'zod';

/**
 * Projects. Images go in src/assets/projects/<slug>/ and are referenced as "projects/<slug>/<file>".
 * Missing images automatically show a generated placeholder.
 * Everything marked "// DRAFT – review" is generated launch-style copy: please read it.
 * Nothing here is an invented metric: `results` stays empty until real numbers are confirmed (TODO: confirm).
 */
export const projects = parseData('src/data/projects.ts', z.array(projectSchema), [
  /* ───────────────────────── CDC UM Bandung ───────────────────────── */
  {
    // DRAFT – review
    title: 'CDC UM Bandung',
    slug: 'cdc-umbandung',
    tagline: { en: 'From campus to career, in one place.', id: 'Dari kampus ke karier, dalam satu tempat.' },
    description: {
      en: 'The Career Development Center web app of Universitas Muhammadiyah Bandung: job listings, applications and placement reports for the whole university.',
      id: 'Aplikasi web Career Development Center Universitas Muhammadiyah Bandung: lowongan kerja, lamaran, dan laporan penempatan untuk seluruh kampus.',
    },
    category: 'Web',
    year: 2026,
    tech: ['Go', 'Gin', 'React', 'TypeScript', 'MariaDB', 'Docker'],
    brandColor: '#1e5fbf', // TODO: sample from the real UI/logo during the mockup step
    cover: 'projects/cdc-umbandung/cover.jpg',
    gallery: [
      { src: 'projects/cdc-umbandung/01-landing.jpg', alt: { en: 'Home page of the CDC web app', id: 'Beranda aplikasi web CDC' }, device: 'laptop' },
      { src: 'projects/cdc-umbandung/02-lowongan.jpg', alt: { en: 'Public job listing with filters', id: 'Daftar lowongan publik dengan filter' }, device: 'laptop' },
      { src: 'projects/cdc-umbandung/03-panel.jpg', alt: { en: 'Admin dashboard summary', id: 'Ringkasan dasbor admin' }, device: 'laptop' },
      { src: 'projects/cdc-umbandung/04-panel-lowongan.jpg', alt: { en: 'Admin: managing job vacancies', id: 'Admin: mengelola lowongan' }, device: 'laptop' },
      { src: 'projects/cdc-umbandung/05-panel-perusahaan.jpg', alt: { en: 'Admin: partner companies', id: 'Admin: perusahaan mitra' }, device: 'laptop' },
      { src: 'projects/cdc-umbandung/06-mobile-landing.jpg', alt: { en: 'Mobile view of the home page', id: 'Tampilan mobile beranda' }, device: 'phone' },
    ],
    featured: true,
    githubUrl: undefined, // TODO: add public repo URL if there is one
    problem: {
      en: 'Job vacancies, student data and placement reports lived in separate spreadsheets and chats. Students could not find openings easily, and admins had to compile reports for the city manpower office by hand.',
      id: 'Lowongan kerja, data mahasiswa, dan laporan penempatan tersebar di spreadsheet dan chat. Mahasiswa sulit menemukan lowongan, dan admin menyusun laporan untuk Disnaker secara manual.',
    },
    solution: {
      en: 'A single web platform where CDC admins at university, faculty and study-program level publish vacancies, students and alumni browse and apply, and placements roll up into reports for Disnaker.',
      id: 'Satu platform web tempat admin CDC tingkat universitas, fakultas, dan prodi menayangkan lowongan, mahasiswa dan alumni mencari dan melamar, lalu penempatan terekap menjadi laporan untuk Disnaker.',
    },
    features: [
      { title: { en: 'Browse every vacancy', id: 'Jelajahi semua lowongan' }, body: { en: 'Filter openings by study program and apply straight to the company.', id: 'Filter lowongan berdasarkan prodi dan lamar langsung ke perusahaan.' } },
      { title: { en: 'Track your applications', id: 'Pantau lamaran' }, body: { en: 'Every application and its status in one list.', id: 'Setiap lamaran beserta statusnya dalam satu daftar.' } },
      { title: { en: 'Role-based admin', id: 'Admin berbasis peran' }, body: { en: 'University, faculty and program admins each see and manage only their own scope.', id: 'Admin universitas, fakultas, dan prodi masing-masing hanya mengelola cakupannya.' } },
      { title: { en: 'Placement reports', id: 'Laporan penempatan' }, body: { en: 'Placements are recorded once and reported monthly, quarterly or yearly.', id: 'Penempatan dicatat sekali dan dilaporkan bulanan, triwulanan, atau tahunan.' } },
    ],
    role: { en: 'Backend developer.', id: 'Pengembang backend.' },
    // results: { en: [], id: [] }, // TODO: confirm real numbers (no invented metrics)
  },

  /* ───────────────────────── SI PESONAMU ───────────────────────── */
  {
    // DRAFT – review
    title: 'SI PESONAMU',
    slug: 'pesonamu',
    role: { en: 'Backend developer.', id: 'Pengembang backend.' },
    tagline: { en: 'Know your group. Meet your mentor.', id: 'Kenali kelompokmu. Temui mentormu.' },
    description: {
      en: 'The campus orientation system: dynamic group generator plus mentor contacts, replacing the spreadsheet that used to run the event.',
      id: 'Sistem ospek kampus: generator kelompok dinamis beserta kontak mentor, menggantikan spreadsheet yang dulu dipakai.',
    },
    category: 'Web',
    year: 2026,
    tech: ['CodeIgniter 4', 'PHP', 'MySQL', 'Bootstrap'],
    brandColor: '#0f766e', // TODO: sample from the real logo during the mockup step
    cover: 'projects/pesonamu/cover.jpg',
    gallery: [
      { src: 'projects/pesonamu/01-dashboard.jpg', alt: { en: 'Dataris dashboard with live counts', id: 'Dasbor dataris dengan angka langsung' }, device: 'laptop' },
      { src: 'projects/pesonamu/02-camaba.jpg', alt: { en: 'New-student data table with filters', id: 'Tabel data mahasiswa baru dengan filter' }, device: 'laptop' },
      { src: 'projects/pesonamu/03-kelompok.jpg', alt: { en: 'Group batch history', id: 'Riwayat batch kelompok' }, device: 'laptop' },
      { src: 'projects/pesonamu/04-mentor.jpg', alt: { en: 'Mentor management list', id: 'Daftar pengelolaan mentor' }, device: 'laptop' },
      { src: 'projects/pesonamu/05-kesiapan.jpg', alt: { en: 'Event-day readiness checklist', id: 'Checklist kesiapan hari-H' }, device: 'laptop' },
      { src: 'projects/pesonamu/06-mobile-home.jpg', alt: { en: 'New-student home on mobile', id: 'Beranda mahasiswa baru di mobile' }, device: 'phone' },
      { src: 'projects/pesonamu/07-mobile-login.jpg', alt: { en: 'Mobile login screen', id: 'Layar masuk di mobile' }, device: 'phone' },
    ],
    featured: true,
    problem: {
      en: 'Orientation was run on Excel files shared between mentors and committee, and that data had leaked before. New students had no simple way to see which group and mentor they belonged to.',
      id: 'Ospek dijalankan lewat file Excel yang dibagikan antara mentor dan panitia, dan datanya pernah bocor. Mahasiswa baru tidak punya cara mudah untuk tahu kelompok dan mentornya.',
    },
    solution: {
      en: 'A mobile-first web system: new students sign in, fill in their health notes and instantly see their group and mentor (with WhatsApp contact). Committee roles manage groups with a dynamic generator.',
      id: 'Sistem web mobile-first: mahasiswa baru login, mengisi riwayat kesehatan, lalu langsung melihat kelompok dan mentornya (lengkap dengan kontak WhatsApp). Peran panitia mengelola kelompok dengan generator dinamis.',
    },
    features: [
      { title: { en: 'Your group at a glance', id: 'Kelompokmu sekilas' }, body: { en: 'Students see their group and mentor the moment they log in.', id: 'Mahasiswa melihat kelompok dan mentor begitu login.' } },
      { title: { en: 'Dynamic group generator', id: 'Generator kelompok dinamis' }, body: { en: 'Balanced groups, adjustable by dragging, even as new students arrive mid-event.', id: 'Kelompok seimbang yang bisa disesuaikan dengan drag, bahkan saat mahasiswa baru masih berdatangan.' } },
      { title: { en: 'Role-based access', id: 'Akses berbasis peran' }, body: { en: 'Admin, committee, faculty coordinators and mentors each see only what they need.', id: 'Admin, panitia, koordinator fakultas, dan mentor hanya melihat yang mereka perlukan.' } },
      { title: { en: 'Swappable campus data', id: 'Data kampus yang bisa ditukar' }, body: { en: 'Demo runs on dummy data; production plugs into the campus system without rewriting the app.', id: 'Demo berjalan dengan data dummy; produksi tersambung ke sistem kampus tanpa menulis ulang aplikasi.' } },
    ],
  },

  /* ───────────────────────── Zenith ───────────────────────── */
  {
    // DRAFT – review
    title: 'Zenith',
    slug: 'zenith',
    role: { en: 'Built the whole app on my own: design, frontend and backend.', id: 'Mengerjakan seluruh aplikasi sendiri: desain, frontend, dan backend.' },
    tagline: { en: 'Know where every rupiah goes.', id: 'Tahu ke mana setiap rupiah pergi.' },
    description: {
      en: 'A personal finance tracker: accounts, transactions, budgets and savings goals with automatic monthly insights.',
      id: 'Pencatat keuangan pribadi: akun, transaksi, anggaran, dan target tabungan dengan insight bulanan otomatis.',
    },
    category: 'Mobile',
    year: 2026,
    tech: ['Flutter', 'Provider', 'Node.js', 'Express', 'Prisma', 'PostgreSQL'],
    brandColor: '#4f46e5', // TODO: sample from the real UI
    cover: 'projects/zenith/cover.jpg',
    gallery: [
      { src: 'projects/zenith/01-dashboard.jpg', alt: { en: 'Dashboard with total balance, accounts and spending breakdown', id: 'Dasbor dengan total saldo, akun, dan rincian pengeluaran' }, device: 'phone' },
      { src: 'projects/zenith/02-aktivitas.jpg', alt: { en: 'Activity: transactions grouped by day', id: 'Aktivitas: transaksi dikelompokkan per hari' }, device: 'phone' },
      { src: 'projects/zenith/03-anggaran.jpg', alt: { en: 'Budget per category with progress bars', id: 'Anggaran per kategori dengan progress bar' }, device: 'phone' },
      { src: 'projects/zenith/04-insight.jpg', alt: { en: 'Monthly insights and month-end projection', id: 'Insight bulanan dan proyeksi akhir bulan' }, device: 'phone' },
      { src: 'projects/zenith/05-lainnya.jpg', alt: { en: 'Profile, categories, accounts and savings goals', id: 'Profil, kategori, akun, dan target tabungan' }, device: 'phone' },
    ],
    featured: false,
    problem: {
      en: 'Most expense trackers are either too basic to show trends or too heavy to use daily.',
      id: 'Kebanyakan pencatat pengeluaran terlalu sederhana untuk melihat tren, atau terlalu rumit dipakai setiap hari.',
    },
    solution: {
      en: 'A Flutter app on a JWT-secured Express + Prisma + PostgreSQL backend. Balances update atomically with every transaction, and transfers never distort income or expense reports.',
      id: 'Aplikasi Flutter dengan backend Express + Prisma + PostgreSQL yang diamankan JWT. Saldo diperbarui secara atomik pada setiap transaksi, dan transfer tidak pernah mengacaukan laporan pemasukan/pengeluaran.',
    },
    features: [
      { title: { en: 'Dashboard', id: 'Dasbor' }, body: { en: 'Total balance, this month at a glance and a category breakdown.', id: 'Total saldo, ringkasan bulan ini, dan rincian per kategori.' } },
      { title: { en: 'Income, expense, transfer', id: 'Pemasukan, pengeluaran, transfer' }, body: { en: 'Three transaction types with correct balances every time.', id: 'Tiga jenis transaksi dengan saldo yang selalu benar.' } },
      { title: { en: 'Budgets', id: 'Anggaran' }, body: { en: 'Progress bars that warn you before you overspend.', id: 'Progress bar yang memberi peringatan sebelum kamu boros.' } },
      { title: { en: 'Monthly insights', id: 'Insight bulanan' }, body: { en: 'Compare months, spot top categories and see a month-end projection.', id: 'Bandingkan bulan, lihat kategori teratas, dan proyeksi akhir bulan.' } },
    ],
  },

  /* ───────────────────────── Duluin ───────────────────────── */
  {
    // DRAFT – review
    title: 'Duluin',
    slug: 'duluin',
    role: { en: 'Backend developer.', id: 'Pengembang backend.' },
    tagline: { en: 'Deadlines first. Stress later.', id: 'Deadline dulu. Stres belakangan.' },
    description: {
      en: 'A smart task manager for students with calendar, progress tracking and reminders.',
      id: 'Pengelola tugas cerdas untuk mahasiswa dengan kalender, pelacak progres, dan pengingat.',
    },
    category: 'Mobile',
    year: 2026, // TODO: confirm year
    tech: ['Flutter', 'Dart', 'Provider', 'Firebase'],
    brandColor: '#f59e0b', // TODO: sample from the real logo
    cover: 'projects/duluin/cover.jpg',
    gallery: [
      { src: 'projects/duluin/01-beranda.jpg', alt: { en: 'Home: today at a glance', id: 'Beranda: ringkasan hari ini' }, device: 'phone' },
      { src: 'projects/duluin/02-tugas.jpg', alt: { en: 'All tasks ranked by urgency', id: 'Semua tugas diurutkan berdasarkan urgensi' }, device: 'phone' },
      { src: 'projects/duluin/03-kalender.jpg', alt: { en: 'Calendar view of deadlines', id: 'Tampilan kalender deadline' }, device: 'phone' },
      { src: 'projects/duluin/04-progres.jpg', alt: { en: 'Progress and statistics', id: 'Progres dan statistik' }, device: 'phone' },
      { src: 'projects/duluin/05-tentang.jpg', alt: { en: 'About screen and default contact settings', id: 'Layar tentang dan pengaturan kontak bawaan' }, device: 'phone' },
    ],
    featured: false,
    solution: {
      en: 'A Flutter app that lists tasks by urgency, shows them on a calendar and tracks progress, with local notifications for upcoming deadlines.',
      id: 'Aplikasi Flutter yang mengurutkan tugas berdasarkan urgensi, menampilkannya di kalender, dan melacak progres, dengan notifikasi lokal untuk deadline.',
    },
    features: [
      { title: { en: 'Calendar view', id: 'Tampilan kalender' }, body: { en: 'See the whole month of deadlines.', id: 'Lihat seluruh deadline sebulan.' } },
      { title: { en: 'Progress tracking', id: 'Pelacak progres' }, body: { en: 'Know how much is done and what is left.', id: 'Tahu seberapa banyak yang selesai dan yang tersisa.' } },
      { title: { en: 'Reminders', id: 'Pengingat' }, body: { en: 'Notifications before a deadline hits.', id: 'Notifikasi sebelum deadline tiba.' } },
    ],
  },

  /* ───────────────────────── E-Voting V2 ───────────────────────── */
  {
    // DRAFT – review
    title: 'E-Voting V2',
    slug: 'e-voting-v2',
    role: { en: 'Built the whole app on my own: design, frontend and backend.', id: 'Mengerjakan seluruh aplikasi sendiri: desain, frontend, dan backend.' },
    tagline: { en: 'One person, one vote, in your pocket.', id: 'Satu orang, satu suara, di genggaman.' },
    description: {
      en: 'A mobile e-voting app with candidate profiles and real-time results, built on Flutter and Firebase.',
      id: 'Aplikasi e-voting mobile dengan profil kandidat dan hasil real-time, dibangun dengan Flutter dan Firebase.',
    },
    category: 'Mobile',
    year: 2026, // TODO: confirm year
    tech: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore'],
    brandColor: '#2563eb', // TODO: sample from the real UI
    cover: 'projects/e-voting-v2/cover.jpg',
    gallery: [
      { src: 'projects/e-voting-v2/01-login.jpg', alt: { en: 'Voter login with student ID (NIM)', id: 'Login pemilih dengan NIM' }, device: 'phone' },
      { src: 'projects/e-voting-v2/02-voting.jpg', alt: { en: 'Candidate list', id: 'Daftar kandidat' }, device: 'phone' },
      { src: 'projects/e-voting-v2/03-kandidat.jpg', alt: { en: 'Candidate detail with vision and mission', id: 'Detail kandidat dengan visi dan misi' }, device: 'phone' },
      { src: 'projects/e-voting-v2/04-hasil.jpg', alt: { en: 'Live results after voting', id: 'Hasil sementara setelah memilih' }, device: 'phone' },
      { src: 'projects/e-voting-v2/05-admin.jpg', alt: { en: 'Admin dashboard with real-time count', id: 'Dasbor admin dengan hitung suara langsung' }, device: 'phone' },
    ],
    featured: false,
    solution: {
      en: 'Voters pick a candidate from clear profiles and the app records the vote in Firebase.', // TODO: confirm features after reading the source
      id: 'Pemilih memilih kandidat dari profil yang jelas dan aplikasi mencatat suara di Firebase.',
    },
  },

  /* ───────────────────────── Protego ───────────────────────── */
  {
    // DRAFT – review
    title: 'Protego',
    slug: 'protego',
    tagline: { en: 'Smart safety helmet monitoring.', id: 'Pemantauan helm keselamatan pintar.' },
    description: {
      en: 'An IoT work-safety system: a smart helmet sends sensor readings to a monitoring dashboard and a mobile app. The project was funded by the PKM grant.',
      id: 'Sistem keselamatan kerja berbasis IoT: helm pintar mengirim data sensor ke dasbor pemantauan dan aplikasi mobile. Proyek ini didanai hibah PKM.',
    },
    category: 'Mobile',
    year: 2025,
    tech: ['IoT', 'ESP', 'Next.js', 'Supabase', 'Android WebView'],
    brandColor: '#505cbd',
    cover: 'projects/protego/cover.jpg',
    gallery: [
      { src: 'projects/protego/01-beranda.jpg', alt: { en: 'Android app: welcome screen', id: 'Aplikasi Android: halaman sambutan' }, device: 'phone' },
      { src: 'projects/protego/02-dashboard.jpg', alt: { en: 'Android app: dashboard with connected helmets', id: 'Aplikasi Android: dasbor perangkat helm yang terhubung' }, device: 'phone' },
      { src: 'projects/protego/03-log.jpg', alt: { en: 'Android app: event logs with filters and CSV export', id: 'Aplikasi Android: log kejadian dengan filter dan ekspor CSV' }, device: 'phone' },
    ],
    featured: true,
    role: { en: 'Built the Android app (a WebView wrapper around the web dashboard).', id: 'Membuat aplikasi Android (WebView yang membungkus dasbor web).' },
    features: [
      { title: { en: 'Live vitals', id: 'Data langsung' }, body: { en: 'Heart rate, temperature and air pressure from the helmet sensors.', id: 'Detak jantung, suhu, dan tekanan udara dari sensor helm.' } },
      { title: { en: 'Safety alerts', id: 'Peringatan keselamatan' }, body: { en: 'Status for falls, impacts and nearby objects: safe, caution or danger.', id: 'Status jatuh, benturan, dan objek di sekitar: aman, waspada, atau bahaya.' } },
      { title: { en: 'Worker location', id: 'Lokasi pekerja' }, body: { en: 'See where each worker is on site.', id: 'Lihat posisi setiap pekerja di lokasi.' } },
    ],
  },
]);
