import sharp from 'sharp';
import { mkdirSync } from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#C4714A"/>
  <rect width="512" height="512" rx="110" fill="#B5623C"/>
  <!-- Background warm circle -->
  <circle cx="256" cy="256" r="190" fill="#D4845A" opacity="0.3"/>
  <!-- Main pad -->
  <ellipse cx="256" cy="320" rx="88" ry="72" fill="#FDF6EE"/>
  <!-- Top left toe -->
  <circle cx="155" cy="228" r="44" fill="#FDF6EE"/>
  <!-- Top center-left toe -->
  <circle cx="216" cy="185" r="39" fill="#FDF6EE"/>
  <!-- Top center-right toe -->
  <circle cx="296" cy="185" r="39" fill="#FDF6EE"/>
  <!-- Top right toe -->
  <circle cx="357" cy="228" r="44" fill="#FDF6EE"/>
</svg>`;

mkdirSync('public/icons', { recursive: true });

await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icons/icon-512.png');
console.log('Iconos generados correctamente.');
