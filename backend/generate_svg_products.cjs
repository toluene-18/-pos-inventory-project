const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'storage', 'app', 'public', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const products = [
  {
    file: 'nes-milo-500.svg',
    title: 'Nestlé Milo',
    subtitle: 'Energy Food Drink • 500g Tin',
    tag: 'BEVERAGES',
    bg1: '#14532d',
    bg2: '#166534',
    accent: '#facc15',
    iconType: 'tin',
    detail: 'MALT & COCOA'
  },
  {
    file: 'dan-mlk-800.svg',
    title: 'Dano Full Cream',
    subtitle: 'Rich Milk Powder • 800g Pouch',
    tag: 'DAIRY & BREAKFAST',
    bg1: '#1e3a8a',
    bg2: '#2563eb',
    accent: '#60a5fa',
    iconType: 'milk',
    detail: '100% NATURAL MILK'
  },
  {
    file: 'gld-mrn-900.svg',
    title: 'Golden Morn',
    subtitle: 'Whole Grain Cereal • 900g Pack',
    tag: 'DAIRY & BREAKFAST',
    bg1: '#78350f',
    bg2: '#b45309',
    accent: '#fde047',
    iconType: 'cereal',
    detail: 'MAIZE & SOYA PROTEIN'
  },
  {
    file: 'ind-onc-ctn.svg',
    title: 'Indomie Noodles',
    subtitle: 'Onion Chicken • Carton (40 x 70g)',
    tag: 'GROCERIES',
    bg1: '#991b1b',
    bg2: '#dc2626',
    accent: '#fde047',
    iconType: 'carton',
    detail: 'TASTY NUTRITIOUS'
  },
  {
    file: 'cok-50-pet.svg',
    title: 'Coca-Cola Original',
    subtitle: 'Refreshing Soft Drink • 50cl PET',
    tag: 'BEVERAGES',
    bg1: '#881337',
    bg2: '#e11d48',
    accent: '#ffffff',
    iconType: 'bottle',
    detail: 'ORIGINAL TASTE'
  },
  {
    file: 'pek-evap-160.svg',
    title: 'Peak Evaporated Milk',
    subtitle: 'Rich & Creamy • 160g Tin',
    tag: 'DAIRY & BREAKFAST',
    bg1: '#172554',
    bg2: '#1d4ed8',
    accent: '#fbbf24',
    iconType: 'can',
    detail: 'NO. 1 QUALITY'
  },
  {
    file: 'mam-ric-50k.svg',
    title: 'Mama Gold Rice',
    subtitle: 'Thai Parboiled • 50kg Bag',
    tag: 'GROCERIES',
    bg1: '#713f12',
    bg2: '#a16207',
    accent: '#84cc16',
    iconType: 'sack',
    detail: 'STONE-FREE PREMIUM'
  },
  {
    file: 'dev-oil-5l.svg',
    title: "Devon King's Oil",
    subtitle: 'Pure Cooking Oil • 5 Litre Flagon',
    tag: 'GROCERIES',
    bg1: '#854d0e',
    bg2: '#ca8a04',
    accent: '#fef08a',
    iconType: 'flagon',
    detail: 'CHOLESTEROL FREE'
  },
  {
    file: 'prg-orig-165.svg',
    title: 'Pringles Original',
    subtitle: 'Potato Crisps • 165g Canister',
    tag: 'SNACKS',
    bg1: '#7f1d1d',
    bg2: '#b91c1c',
    accent: '#facc15',
    iconType: 'tube',
    detail: 'CRISPY & SALTY'
  },
  {
    file: 'min-chn-r12.svg',
    title: 'Minimie Chinchin',
    subtitle: 'Crunchy Snack • Roll of 12 Packs',
    tag: 'SNACKS',
    bg1: '#7c2d12',
    bg2: '#c2410c',
    accent: '#fde047',
    iconType: 'snack',
    detail: 'TASTES SO FUN!'
  },
  {
    file: 'sun-det-900.svg',
    title: 'Sunlight 2in1 Powder',
    subtitle: 'Clean & Fresh Detergent • 900g Pouch',
    tag: 'HOUSEHOLD',
    bg1: '#581c87',
    bg2: '#8b5cf6',
    accent: '#fde047',
    iconType: 'detergent',
    detail: 'SPRING SENSATIONS'
  },
  {
    file: 'mrn-fsh-1l.svg',
    title: 'Morning Fresh',
    subtitle: 'Super Concentrated Dishwash • 1L Bottle',
    tag: 'HOUSEHOLD',
    bg1: '#064e3b',
    bg2: '#059669',
    accent: '#6ee7b7',
    iconType: 'soap',
    detail: 'SUPER GREASE CUTTING'
  },
  {
    file: 'orl-prh-140.svg',
    title: 'Oral-B Pro-Health',
    subtitle: 'All-Around Protection • 140g Tube',
    tag: 'PERSONAL CARE',
    bg1: '#0c4a6e',
    bg2: '#0284c7',
    accent: '#38bdf8',
    iconType: 'toothpaste',
    detail: '24HR PLAQUE SHIELD'
  },
  {
    file: 'det-ant-500.svg',
    title: 'Dettol Antiseptic',
    subtitle: 'Disinfectant Liquid • 500ml Bottle',
    tag: 'PERSONAL CARE',
    bg1: '#064e3b',
    bg2: '#047857',
    accent: '#f59e0b',
    iconType: 'antiseptic',
    detail: 'FIRST AID & HYGIENE'
  }
];

function generateSvg(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="${p.bg2}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="400" rx="24" fill="url(#bgGrad)"/>
  <circle cx="360" cy="40" r="140" fill="#ffffff" opacity="0.04" />
  <circle cx="40" cy="360" r="120" fill="#ffffff" opacity="0.04" />

  <!-- Category Tag -->
  <rect x="24" y="24" width="130" height="26" rx="6" fill="#000000" opacity="0.3" />
  <text x="32" y="41" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="${p.accent}" letter-spacing="1">${p.tag}</text>

  <!-- Product Icon Graphic Container -->
  <g transform="translate(130, 80)" filter="url(#shadow)">
    <!-- Base Container Shape -->
    <rect x="10" y="20" width="120" height="150" rx="16" fill="#ffffff" opacity="0.12"/>
    <rect x="16" y="26" width="108" height="138" rx="12" fill="#000000" opacity="0.2"/>

    <!-- Central Icon Badge -->
    <circle cx="70" cy="95" r="46" fill="#ffffff" opacity="0.95"/>
    <circle cx="70" cy="95" r="42" fill="${p.bg2}"/>
    
    <!-- Visual Symbol inside Badge -->
    <path d="M52 95 L65 80 L75 90 L88 75" stroke="${p.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="70" cy="115" r="5" fill="${p.accent}"/>

    <!-- Top Cap / Seal -->
    <rect x="40" y="8" width="60" height="16" rx="6" fill="${p.accent}"/>
    <rect x="52" y="2" width="36" height="8" rx="3" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Product Detail Ribbon -->
  <rect x="24" y="258" width="352" height="2" fill="${p.accent}" opacity="0.3"/>
  <text x="200" y="280" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="800" fill="${p.accent}" letter-spacing="1.5">${p.detail}</text>

  <!-- Main Product Title -->
  <text x="200" y="322" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="0.2">${p.title}</text>

  <!-- Subtitle / Measure -->
  <text x="200" y="348" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="500" fill="#e2e8f0" opacity="0.85">${p.subtitle}</text>

  <!-- Verified Seal -->
  <g transform="translate(330, 24)">
    <circle cx="16" cy="16" r="14" fill="#ffffff" opacity="0.15"/>
    <path d="M10 16 L14 20 L22 12" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>`;
}

products.forEach(p => {
  const filePath = path.join(outputDir, p.file);
  fs.writeFileSync(filePath, generateSvg(p), 'utf8');
  console.log(`Generated: ${p.file}`);
});

console.log('Successfully generated all 14 product SVGs in storage/app/public/products');
