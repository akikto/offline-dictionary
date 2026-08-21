#!/usr/bin/env node
/**
 * One-shot Play Store release: locate upload keystore → configure signing → build AAB → verify SHA1.
 *
 * Usage:
 *   node scripts/build-play-release.mjs [path/to/signing.keystore]
 *
 * Drop signing.keystore in the repo root or Cursor chat uploads, then run with no arguments.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findUploadKeystoreCandidates } from './find-upload-keystore.mjs';
import { PLAY_UPLOAD_SHA1 } from './setup-android-signing.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distAab = path.join(root, 'android/dist/shobdokosh-1.0.1-versionCode-2.aab');

function readSha1(aabPath) {
  const out = execFileSync('node', ['scripts/verify-aab-package.mjs', aabPath], {
    cwd: root,
    encoding: 'utf8',
  });
  const match = out.match(/signingSHA1=([0-9A-F:]+)/i);
  return match?.[1] ?? null;
}

function printBlockedHelp() {
  console.error(`
[build-play-release] signing.keystore ফাইল পাওয়া যায়নি।

আপনাকে শুধু একটি কাজ করতে হবে:
  AI Studio / PWABuilder থেকে ডাউনলোড করা signing.keystore ফাইলটি Cursor চ্যাটে আপলোড করুন।

ফাইল আপলোডের পর আমরা আবার চালাব:
  npm run android:play-release

(পাসওয়ার্ড/alias ইতিমধ্যে আছে — signing-key-info.txt থেকে।)
`);
}

function main() {
  const candidates = findUploadKeystoreCandidates(process.argv[2]);
  if (candidates.length === 0) {
    printBlockedHelp();
    process.exit(1);
  }

  let configured = false;
  for (const candidate of candidates) {
    console.log(`[build-play-release] Trying keystore: ${candidate}`);
    const setup = spawnSync(
      process.execPath,
      ['scripts/setup-android-signing.mjs', candidate],
      { cwd: root, encoding: 'utf8' },
    );
    process.stdout.write(setup.stdout ?? '');
    process.stderr.write(setup.stderr ?? '');
    if (setup.status === 0) {
      configured = true;
      break;
    }
  }

  if (!configured) {
    console.error(
      '[build-play-release] কোনো keystore Play Console-এর প্রত্যাশিত SHA1 (24:7A:A9:16:…) এর সাথে মিলেনি.\n' +
        '  সঠিক signing.keystore (AI Studio/PWABuilder থেকে) আপলোড করুন।',
    );
    process.exit(1);
  }

  console.log('[build-play-release] Building signed AAB…');
  execFileSync('npm', ['run', 'android:package'], { cwd: root, stdio: 'inherit' });

  if (!fs.existsSync(distAab)) {
    console.error(`[build-play-release] Expected output missing: ${distAab}`);
    process.exit(1);
  }

  const sha1 = readSha1(distAab);
  console.log('');
  console.log('[build-play-release] ✅ Play Store AAB ready');
  console.log(`  File: ${distAab}`);
  console.log(`  SHA1: ${sha1 ?? PLAY_UPLOAD_SHA1}`);
  console.log('  Play Console-এ এই ফাইল আপলোড করুন।');
}

main();
