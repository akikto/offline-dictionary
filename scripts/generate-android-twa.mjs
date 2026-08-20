#!/usr/bin/env node
/**
 * Generates / regenerates the Bubblewrap TWA Android project under android/
 * using the dictionary icon and version metadata from android/twa-manifest.json.
 *
 * Usage:
 *   TWA_HOST=your-deployed-host.example.com node scripts/generate-android-twa.mjs
 *
 * TWA_HOST (or APP_URL host) must be the HTTPS hostname that serves this PWA
 * (the same origin that hosts /.well-known/assetlinks.json).
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { TwaManifest, TwaGenerator, ConsoleLog } = require('@bubblewrap/core');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const androidDir = path.join(root, 'android');
const publicDir = path.join(root, 'public');
const manifestPath = path.join(androidDir, 'twa-manifest.json');

// Must match the existing Play Console listing (AI Studio / PWABuilder).
// Bubblewrap init auto-generates io.github.akikto.twa from the hostname — wrong for this app.
const PLAY_PACKAGE_ID = 'studio.ai.service_5743.twa';

function resolveHost() {
  if (process.env.TWA_HOST) {
    return process.env.TWA_HOST.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
    return new URL(process.env.APP_URL).host;
  }
  const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (existing.host && !existing.host.startsWith('REPLACE_') && existing.host !== 'placeholder.invalid') {
    return existing.host;
  }
  console.warn(
    '[generate-android-twa] TWA_HOST not set; using placeholder. ' +
      'Set TWA_HOST to your live PWA hostname before publishing.',
  );
  return existing.host || 'REPLACE_WITH_DEPLOYED_HOST';
}

function resolveStartUrl() {
  if (process.env.TWA_START_URL) {
    const url = process.env.TWA_START_URL.startsWith('/')
      ? process.env.TWA_START_URL
      : `/${process.env.TWA_START_URL}`;
    return url.endsWith('/') ? url : `${url}/`;
  }
  const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return existing.startUrl || '/';
}

function contentType(filePath) {
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      const filePath = path.join(publicDir, safe === '/' ? 'index.html' : safe);
      if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

function patchReleaseSigning(buildGradlePath) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf8');
  if (gradle.includes('signingConfigs')) {
    return;
  }

  gradle = gradle.replace(
    /(\s+)buildTypes \{\s*\n\s*release \{\s*\n\s*minifyEnabled true\s*\n\s*\}/,
    `$1signingConfigs {
$1    release {
$1        if (project.hasProperty('RELEASE_STORE_FILE')) {
$1            storeFile file("../" + RELEASE_STORE_FILE)
$1            storePassword RELEASE_STORE_PASSWORD
$1            keyAlias RELEASE_KEY_ALIAS
$1            keyPassword RELEASE_KEY_PASSWORD
$1        }
$1    }
$1}
$1buildTypes {
$1    release {
$1        minifyEnabled true
$1        if (project.hasProperty('RELEASE_STORE_FILE')) {
$1            signingConfig signingConfigs.release
$1        }
$1    }`,
  );

  fs.writeFileSync(buildGradlePath, gradle);
}

async function main() {
  const host = resolveHost();
  const startUrl = resolveStartUrl();
  const { server, port } = await startStaticServer();
  const origin = `http://127.0.0.1:${port}`;

  try {
    const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (raw.packageId && raw.packageId !== PLAY_PACKAGE_ID) {
      console.warn(
        `[generate-android-twa] Overriding packageId ${raw.packageId} -> ${PLAY_PACKAGE_ID}`,
      );
    }
    raw.packageId = PLAY_PACKAGE_ID;
    raw.host = host;
    raw.startUrl = startUrl;
    raw.appVersion = '1.0.1';
    raw.appVersionName = '1.0.1';
    raw.appVersionCode = 2;
    raw.iconUrl = `${origin}/icon.png`;
    raw.maskableIconUrl = `${origin}/icon.png`;
    raw.webManifestUrl = `${origin}/manifest.json`;
    raw.fullScopeUrl = `https://${host}${startUrl === '/' ? '/' : startUrl}`;
    raw.signingKey = {
      path: 'android.keystore',
      alias: raw.signingKey?.alias || 'android',
    };

    fs.writeFileSync(
      manifestPath,
      JSON.stringify(
        {
          ...raw,
          packageId: PLAY_PACKAGE_ID,
          // Persist portable relative icon hints for humans; generation uses localhost URLs above.
          iconUrl: '../public/icon.png',
          maskableIconUrl: '../public/icon.png',
          webManifestUrl: null,
          host,
          startUrl,
          appVersion: '1.0.1',
          appVersionName: '1.0.1',
          appVersionCode: 2,
        },
        null,
        2,
      ) + '\n',
    );

    const twaManifest = new TwaManifest({
      ...raw,
      appVersion: '1.0.1',
    });

    const generator = new TwaGenerator();
    const log = new ConsoleLog('generate-android-twa');

    // Keep twa-manifest.json; regenerate the Bubblewrap Android project files around it.
    const preserve = new Set(['twa-manifest.json', 'README.md', '.gitignore']);
    for (const entry of fs.readdirSync(androidDir)) {
      if (preserve.has(entry)) continue;
      fs.rmSync(path.join(androidDir, entry), { recursive: true, force: true });
    }

    await generator.createTwaProject(androidDir, twaManifest, log);
    patchReleaseSigning(path.join(androidDir, 'app', 'build.gradle'));
    console.log(`[generate-android-twa] Generated TWA project in ${androidDir}`);
    console.log(`[generate-android-twa] packageId=${twaManifest.packageId}`);
    console.log(`[generate-android-twa] versionCode=${twaManifest.appVersionCode} versionName=${twaManifest.appVersionName}`);
    console.log(`[generate-android-twa] host=${twaManifest.host}`);
  } finally {
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    await new Promise((resolve) => server.close(resolve));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
