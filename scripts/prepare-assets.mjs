import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = process.cwd();
const target = path.join(root, 'public/images');
await fs.mkdir(path.join(target, 'work'), { recursive: true });
await sharp(path.join(target, 'muhammad-usman.jpeg')).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 86 }).toFile(path.join(target, 'muhammad-usman.webp'));

// Original attachments are retained in assets/work. Lossless WebP reduces their
// transfer size without redrawing, resizing, cropping or changing their pixels.
const projects = ['dipitt', 'loom', 'sweet-treats', 'innovyx-studio', 'qalakari', 'driptide'];
for (const slug of projects) {
  const original = path.join(root, 'assets/work', `${slug}.png`);
  const output = path.join(target, 'work', `${slug}.webp`);
  await sharp(original).webp({ lossless: true, effort: 6 }).toFile(output);
  const [sourcePixels, outputPixels] = await Promise.all([
    sharp(original).ensureAlpha().raw().toBuffer(),
    sharp(output).ensureAlpha().raw().toBuffer(),
  ]);
  assert.ok(sourcePixels.equals(outputPixels), `${slug}: screenshot pixels must remain unchanged`);
  const metadata = await sharp(output).metadata();
  console.log(`${slug}: ${metadata.width}×${metadata.height}, lossless screenshot verified`);
}
