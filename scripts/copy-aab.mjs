#!/usr/bin/env node
/**
 * Copies the Gradle release AAB to android/dist/ with Play-friendly filenames.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(
  root,
  'android/app/build/outputs/bundle/release/app-release.aab',
);
const distDir = path.join(root, 'android/dist');

function readVersionCode() {
  const twaManifestPath = path.join(root, 'android/twa-manifest.json');
  if (!fs.existsSync(twaManifestPath)) {
    return 2;
  }
  const twa = JSON.parse(fs.readFileSync(twaManifestPath, 'utf8'));
  return twa.appVersionCode || 2;
}

function main() {
  if (!fs.existsSync(source)) {
    console.error(`[copy-aab] Release AAB not found. Run npm run android:build first.\n  ${source}`);
    process.exit(1);
  }

  const versionCode = readVersionCode();
  fs.mkdirSync(distDir, { recursive: true });
  const copies = [
    path.join(distDir, `shobdokosh-versionCode-${versionCode}.aab`),
    path.join(distDir, 'শব্দকোষ.aab'),
  ];

  for (const target of copies) {
    fs.copyFileSync(source, target);
    console.log(`[copy-aab] ${target}`);
  }
}

main();
