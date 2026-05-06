import sharp from 'sharp';
import { mkdirSync } from 'fs';

// Proper paw print: rounded main pad + 4 toe beans with realistic proportions
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="115" fill="#C4714A"/>

  <!-- Subtle inner glow -->
  <rect width="512" height="512" rx="115" fill="url(#g)" opacity="0.25"/>
  <defs>
    <radialGradient id="g" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#C4714A"/>
    </radialGradient>
  </defs>

  <!-- Main pad — wide rounded shape, lower center -->
  <ellipse cx="256" cy="328" rx="96" ry="76" fill="#FDF6EE" opacity="0.95"/>

  <!-- Toe bean — far left, rotated outward -->
  <ellipse cx="147" cy="237" rx="44" ry="36" fill="#FDF6EE" opacity="0.95"
    transform="rotate(-22 147 237)"/>

  <!-- Toe bean — center left -->
  <ellipse cx="209" cy="192" rx="40" ry="33" fill="#FDF6EE" opacity="0.95"
    transform="rotate(-8 209 192)"/>

  <!-- Toe bean — center right -->
  <ellipse cx="303" cy="192" rx="40" ry="33" fill="#FDF6EE" opacity="0.95"
    transform="rotate(8 303 192)"/>

  <!-- Toe bean — far right, rotated outward -->
  <ellipse cx="365" cy="237" rx="44" ry="36" fill="#FDF6EE" opacity="0.95"
    transform="rotate(22 365 237)"/>
</svg>`;

mkdirSync('public/icons', { recursive: true });
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icons/icon-512.png');
console.log('Iconos generados.');
