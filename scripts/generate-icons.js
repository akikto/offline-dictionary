// Generates every icon asset in public/ from the official app icon
// (assets/dictionary-app-icon.png). Run with: node scripts/generate-icons.js
//
// The source is a square render of the circular gold/blue medallion on a
// white background. This script trims the white margin, cuts the backdrop
// away (keeping the magnifier handle that pokes out past the rim), and
// exports all PNG sizes, a multi-size favicon.ico, and public/icon.svg
// (the 512px PNG embedded as a data URI).
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'assets', 'dictionary-app-icon.png');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Deep blue sampled from the medallion; used to flatten the iOS icon
// because iOS renders transparent apple-touch-icons with a black backdrop.
const APPLE_BG = '#0E335C';

async function buildTransparentMaster() {
  const { data, info } = await sharp(SRC)
    .trim({ threshold: 10 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  // Medallion circle is inscribed in the trimmed square; inset by 1px so
  // antialiased white pixels at the very rim are dropped (no white fringe).
  const R = Math.min(w, h) / 2 - 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Circular mask with a ~1.5px antialiased edge.
      let a;
      if (dist <= R - 0.75) a = 255;
      else if (dist >= R + 0.75) a = 0;
      else a = Math.round(((R + 0.75 - dist) / 1.5) * 255);

      if (a < 255) {
        // The magnifier handle extends beyond the rim at the bottom right.
        // Outside the circle, keep strongly non-white pixels and drop the
        // white/near-white backdrop and faint shadows.
        const dw = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
        const colorA = Math.max(0, Math.min(255, (dw - 40) * 4));
        a = Math.max(a, colorA);
      }
      data[i + 3] = a;
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source icon not found: ${SRC}`);
    process.exit(1);
  }

  const master = await buildTransparentMaster();

  const pngTargets = [
    { file: 'icon.png', size: 512 },
    { file: 'logo.png', size: 512 },
    { file: 'pwa-512.png', size: 512 },
    { file: 'pwa-192.png', size: 192 },
    { file: 'favicon.png', size: 64 },
  ];

  for (const { file, size } of pngTargets) {
    await sharp(master)
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC_DIR, file));
    console.log(`Wrote public/${file} (${size}x${size}, transparent)`);
  }

  await sharp(master)
    .resize(180, 180)
    .flatten({ background: APPLE_BG })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log(`Wrote public/apple-touch-icon.png (180x180, flattened on ${APPLE_BG})`);

  const png32 = await sharp(master).resize(32, 32).png().toBuffer();
  const png16 = await sharp(master).resize(16, 16).png().toBuffer();
  const ico = await pngToIco([png32, png16]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), ico);
  console.log('Wrote public/favicon.ico (32x32 + 16x16)');

  const png512 = fs.readFileSync(path.join(PUBLIC_DIR, 'icon.png'));
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
    `<image width="512" height="512" href="data:image/png;base64,${png512.toString('base64')}"/>` +
    '</svg>\n';
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), svg);
  console.log('Wrote public/icon.svg (512px PNG embedded as data URI)');

  console.log('All icons generated successfully!');
}

main().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
