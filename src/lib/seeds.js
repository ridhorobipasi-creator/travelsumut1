export const SEED_PACKAGES = [
  {
    id: 'seed-1',
    name: 'Eksplorasi Danau Toba & Pulau Samosir',
    excerpt: 'Petualangan 3 Hari 2 Malam mengelilingi danau vulkanik terbesar di dunia. Nikmati budaya Batak yang otentik.',
    price: 2500000,
    duration_days: 3,
    duration_nights: 2,
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'],
    region: { name: 'Danau Toba' },
    status: 'published',
    featured: true,
    content: 'Nikmati keindahan pemandangan dari Bukit Holbung, kunjungi desa wisata Tomok, dan berlayar di perairan biru Danau Toba.'
  },
  {
    id: 'seed-2',
    name: 'Berastagi Adventure: Sibayak Trekking',
    excerpt: 'Pendakian santai melihat matahari terbit di puncak Gunung Sibayak. Kunjungi pasar buah legendaris Berastagi.',
    price: 1850000,
    duration_days: 2,
    duration_nights: 1,
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'],
    region: { name: 'Berastagi' },
    status: 'published',
    featured: true,
    content: 'Cocok untuk pecinta alam yang ingin merasakan udara pegunungan yang segar dan berendam di pemandian air panas Sidebuk-debuk.'
  },
  {
    id: 'seed-3',
    name: 'Bukit Lawang Jungle Trekking & Orangutan',
    excerpt: 'Masuk jauh ke dalam Taman Nasional Gunung Leuser. Bertemu Orangutan di habitat aslinya dan river tubing.',
    price: 3200000,
    duration_days: 4,
    duration_nights: 3,
    images: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470'],
    region: { name: 'Langkat' },
    status: 'published',
    featured: true,
    content: 'Pengalaman sekali seumur hidup berinteraksi dengan satwa liar yang dilindungi di tengah hutan hujan tropis sumatera.'
  },
  {
    id: 'seed-4',
    name: 'Tangkahan: Surga Gajah & Air Terjun Hidden',
    excerpt: 'Memandikan gajah di sungai jernih, jembatan gantung ikonik, dan air terjun rahasia di tengah hutan.',
    price: 2100000,
    duration_days: 3,
    duration_nights: 2,
    images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91'],
    region: { name: 'Langkat' },
    status: 'published',
    featured: false,
    content: 'Tangkahan dikenal sebagai Hidden Paradise Sumatera. Nikmati ketenangan tanpa sinyal yang mengganggu liburan Anda.'
  },
  {
    id: 'seed-5',
    name: 'Medan Heritage & Culinary City Tour',
    excerpt: 'Menjelajahi Istana Maimun, Masjid Raya, menyicipi Durian Ucok, dan kuliner legendaris kota Medan.',
    price: 1200000,
    duration_days: 2,
    duration_nights: 1,
    images: ['https://images.unsplash.com/photo-1559139225-421a6349348e'],
    region: { name: 'Kota Medan' },
    status: 'published',
    featured: false,
    content: 'Tur sehari penuh menjelajahi sejarah Kesultanan Deli dan memuaskan lidah dengan berbagai hidangan akulturasi budaya.'
  }
];

export const SEED_REGIONS = [
  { id: 'reg-toba', name: 'Danau Toba', cover_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997' },
  { id: 'reg-berastagi', name: 'Berastagi', cover_image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2' },
  { id: 'reg-langkat', name: 'Langkat / Bukit Lawang', cover_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
  { id: 'reg-medan', name: 'Kota Medan', cover_image: 'https://images.unsplash.com/photo-1559139225-421a6349348e' }
];

export const SEED_RENTALS = [
  { id: 'rent-1', name: 'Toyota Kijang Innova Reborn', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027', transmission: 'Automatic', seats: 7, fuel_type: 'Bensin', year: '2022', price_per_day: 650000, status: 'available' },
  { id: 'rent-2', name: 'Toyota HiAce Commuter', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', transmission: 'Manual', seats: 15, fuel_type: 'Diesel', year: '2023', price_per_day: 1200000, status: 'available' },
  { id: 'rent-3', name: 'Mitsubishi Pajero Sport', image: 'https://images.unsplash.com/photo-1503376712396-618dabc2c035', transmission: 'Automatic', seats: 7, fuel_type: 'Diesel', year: '2021', price_per_day: 1500000, status: 'available' }
];

export const SEED_ARTICLES = [
  { id: 'art-1', title: '5 Alasan Mengapa Danau Toba Wajib Dikunjungi', excerpt: 'Menjadi danau vulkanik terbesar, Danau Toba menyimpan seribu pesona yang akan menghipnotis mata Anda...', content: '<p>Toba adalah keajaiban dunia...</p>', cover_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997', category: 'Destinasi', status: 'published', created_at: new Date().toISOString() },
  { id: 'art-2', title: 'Tips Persiapan Mendaki Gunung Sibayak', excerpt: 'Bagi pemula, Sibayak adalah gunung yang pas. Namun tetap butuh persiapan agar perjalanan aman dan nyaman.', content: '<p>Bawa jaket tebal...</p>', cover_image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', category: 'Tips & Trik', status: 'published', created_at: new Date().toISOString() }
];
