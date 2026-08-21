#!/usr/bin/env node
/**
 * Locates the Play upload keystore from common drop locations (repo root, android/, chat uploads).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const androidDir = path.join(root, 'android');

const KEYSTORE_NAMES = new Set([
  'signing.keystore',
  'android.keystore',
  'upload.keystore',
  'release.keystore',
]);

const KEYSTORE_EXTENSIONS = new Set(['.keystore', '.jks', '.p12', '.pfx']);

function isKeystoreFile(name) {
  const lower = name.toLowerCase();
  if (KEYSTORE_NAMES.has(lower)) {
    return true;
  }
  return KEYSTORE_EXTENSIONS.has(path.extname(lower));
}

function listKeystoreFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isKeystoreFile(entry.name))
    .map((entry) => path.join(dir, entry.name));
}

function uniqueExisting(paths) {
  const seen = new Set();
  const result = [];
  for (const candidate of paths) {
    const resolved = path.resolve(candidate);
    if (seen.has(resolved) || !fs.existsSync(resolved)) {
      continue;
    }
    seen.add(resolved);
    result.push(resolved);
  }
  return result;
}

/**
 * @param {string | undefined} explicitPath Optional path from CLI or env
 * @returns {string[]} Keystore paths, most preferred first
 */
export function findUploadKeystoreCandidates(explicitPath) {
  const uploadsDir = process.env.CURSOR_UPLOADS_DIR || '/home/ubuntu/.cursor/projects/workspace/uploads';

  const staticCandidates = uniqueExisting(
    [
      explicitPath,
      process.env.SIGNING_KEYSTORE_PATH,
      path.join(root, 'signing.keystore'),
      path.join(androidDir, 'signing.keystore'),
      ...listKeystoreFiles(uploadsDir),
      ...listKeystoreFiles(root),
      ...listKeystoreFiles(androidDir).filter(
        (filePath) => path.basename(filePath) !== 'android.keystore',
      ),
    ].filter(Boolean),
  );

  return staticCandidates;
}

export function findUploadKeystore(explicitPath) {
  return findUploadKeystoreCandidates(explicitPath)[0] ?? null;
}

function main() {
  const candidates = findUploadKeystoreCandidates(process.argv[2]);
  if (candidates.length === 0) {
    console.error('[find-upload-keystore] No keystore file found.');
    process.exit(1);
  }
  for (const candidate of candidates) {
    console.log(candidate);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
