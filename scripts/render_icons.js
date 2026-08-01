import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgPath = path.join(process.cwd(), 'public', 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

function renderPng(targetWidth, outputPath) {
  const resvg = new Resvg(svgBuffer, {
    fitTo: {
      mode: 'width',
      value: targetWidth,
    },
    font: {
      loadSystemFonts: true,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Rendered ${targetWidth}x${targetWidth} -> ${outputPath}`);
}

const targets = [
  { width: 512, file: 'public/logo.png' },
  { width: 512, file: 'public/icon.png' },
  { width: 512, file: 'public/pwa-512.png' },
  { width: 192, file: 'public/pwa-192.png' },
  { width: 180, file: 'public/apple-touch-icon.png' },
  { width: 64, file: 'public/favicon.png' },
];

for (const target of targets) {
  const outPath = path.join(process.cwd(), target.file);
  renderPng(target.width, outPath);
}

// Copy favicon.png to favicon.ico for fallback
fs.copyFileSync(
  path.join(process.cwd(), 'public/favicon.png'),
  path.join(process.cwd(), 'public/favicon.ico')
);

console.log('All icons generated successfully!');
