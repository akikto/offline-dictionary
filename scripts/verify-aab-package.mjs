#!/usr/bin/env node
/**
 * Verifies an AAB has the Play Console package ID and minimum versionCode.
 *
 * Usage:
 *   node scripts/verify-aab-package.mjs [path/to/app.aab]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const EXPECTED_PACKAGE = 'studio.ai.service_5743.twa';
const MIN_VERSION_CODE = 2;
const DEFAULT_AAB = path.join(
  root,
  'android/app/build/outputs/bundle/release/app-release.aab',
);
const BUNDLETOOL_JAR = path.join(root, '.tools/bundletool.jar');
const BUNDLETOOL_URL =
  'https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar';

function ensureBundletool() {
  if (fs.existsSync(BUNDLETOOL_JAR)) {
    return BUNDLETOOL_JAR;
  }
  fs.mkdirSync(path.dirname(BUNDLETOOL_JAR), { recursive: true });
  execFileSync('curl', ['-sL', '-o', BUNDLETOOL_JAR, BUNDLETOOL_URL], {
    stdio: 'inherit',
  });
  return BUNDLETOOL_JAR;
}

function readManifest(aabPath) {
  const jar = ensureBundletool();
  return execFileSync(
    'java',
    ['-jar', jar, 'dump', 'manifest', '--bundle=' + aabPath],
    { encoding: 'utf8' },
  );
}

function parseAttr(manifest, name) {
  const match = manifest.match(new RegExp(`${name}="([^"]+)"`));
  return match?.[1] ?? null;
}

function main() {
  const aabPath = path.resolve(root, process.argv[2] || DEFAULT_AAB);
  if (!fs.existsSync(aabPath)) {
    console.error(`[verify-aab-package] AAB not found: ${aabPath}`);
    process.exit(1);
  }

  const manifest = readManifest(aabPath);
  const packageName = parseAttr(manifest, 'package');
  const versionCode = Number.parseInt(parseAttr(manifest, 'android:versionCode') ?? '', 10);
  const versionName = parseAttr(manifest, 'android:versionName');

  let ok = true;
  if (packageName !== EXPECTED_PACKAGE) {
    console.error(
      `[verify-aab-package] package mismatch: got "${packageName}", expected "${EXPECTED_PACKAGE}"`,
    );
    ok = false;
  }
  if (!Number.isFinite(versionCode) || versionCode < MIN_VERSION_CODE) {
    console.error(
      `[verify-aab-package] versionCode must be >= ${MIN_VERSION_CODE}, got ${versionCode}`,
    );
    ok = false;
  }

  if (!ok) {
    process.exit(1);
  }

  console.log(`[verify-aab-package] OK ${aabPath}`);
  console.log(`  package=${packageName}`);
  console.log(`  versionCode=${versionCode} versionName=${versionName}`);
}

main();
