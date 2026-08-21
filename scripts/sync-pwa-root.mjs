/**
 * Copy built PWA assets to the repository root so legacy GitHub Pages
 * (source: main branch, path /) serves /offline-dictionary/icon.png and
 * /offline-dictionary/manifest.json correctly.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const sourceDir = fs.existsSync(path.join(root, 'dist', 'manifest.json'))
  ? path.join(root, 'dist')
  : path.join(root, 'public');

const files = [
  'manifest.json',
  'icon.png',
  'logo.png',
  'pwa-192.png',
  'pwa-512.png',
  'favicon.png',
  'favicon.ico',
  'apple-touch-icon.png',
  'icon.svg',
  'sw.js',
];

for (const file of files) {
  const from = path.join(sourceDir, file);
  const to = path.join(root, file);
  if (!fs.existsSync(from)) {
    console.warn(`skip missing asset: ${from}`);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log(`synced ${file}`);
}

const wellKnownFrom = path.join(sourceDir, '.well-known', 'assetlinks.json');
const wellKnownToDir = path.join(root, '.well-known');
const wellKnownTo = path.join(wellKnownToDir, 'assetlinks.json');
if (fs.existsSync(wellKnownFrom)) {
  fs.mkdirSync(wellKnownToDir, {recursive: true});
  fs.copyFileSync(wellKnownFrom, wellKnownTo);
  console.log('synced .well-known/assetlinks.json');
}
