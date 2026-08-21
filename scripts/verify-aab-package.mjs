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
const EXPECTED_SHA1 = '24:7A:A9:16:C7:B3:60:7F:66:59:84:B8:84:4F:06:19:A0:B9:EA:0A';
const CI_ONLY_SHA1 = 'A3:F4:F0:B4:0F:B2:34:77:54:A4:0F:D5:8E:6C:EE:CA:32:CD:83:B5';
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

function normalizeFingerprint(value) {
  return value.replace(/[^0-9A-F]/gi, '').toUpperCase();
}

function readSigningSha1(aabPath) {
  try {
    const out = execFileSync('keytool', ['-printcert', '-jarfile', aabPath], {
      encoding: 'utf8',
    });
    if (!/not a signed jar file/i.test(out)) {
      const match = out.match(/SHA1:\s*([0-9A-F:]+)/i);
      if (match?.[1]) {
        return match[1];
      }
    }
  } catch {
    // Fall back to reading META-INF/*.RSA from the bundle zip.
  }

  try {
    const listing = execFileSync('unzip', ['-Z1', aabPath], { encoding: 'utf8' });
    const certEntry = listing
      .split('\n')
      .find((line) => /^META-INF\/[^/]+\.(RSA|DSA|EC)$/i.test(line.trim()));
    if (!certEntry) {
      return null;
    }
    const certBytes = execFileSync('unzip', ['-p', aabPath, certEntry.trim()]);
    const out = execFileSync('keytool', ['-printcert'], {
      encoding: 'utf8',
      input: certBytes,
    });
    const match = out.match(/SHA1:\s*([0-9A-F:]+)/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
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

  const sha1 = readSigningSha1(aabPath);
  if (!sha1) {
    console.error('[verify-aab-package] Could not read signing certificate SHA1 from AAB.');
    ok = false;
  } else if (normalizeFingerprint(sha1) !== normalizeFingerprint(EXPECTED_SHA1)) {
    console.error(`[verify-aab-package] signing SHA1 mismatch: got ${sha1}`);
    console.error(`[verify-aab-package] expected ${EXPECTED_SHA1}`);
    if (normalizeFingerprint(sha1) === normalizeFingerprint(CI_ONLY_SHA1)) {
      console.error(
        '[verify-aab-package] This AAB was signed with the CI temporary key. ' +
          'Run node scripts/setup-android-signing.mjs with your Play upload signing.keystore, then rebuild.',
      );
    }
    ok = false;
  }

  if (!ok) {
    process.exit(1);
  }

  console.log(`[verify-aab-package] OK ${aabPath}`);
  console.log(`  package=${packageName}`);
  console.log(`  versionCode=${versionCode} versionName=${versionName}`);
  console.log(`  signingSHA1=${sha1}`);
}

main();
