import { readFile, stat, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(dist, 'assets/image-manifest.json'), 'utf8'));
let checked = 0;
async function exists(file) {
  const resolved = path.resolve(file);
  if (!resolved.startsWith(dist + path.sep)) throw new Error(`Asset escapes dist: ${file}`);
  if (!(await stat(resolved)).isFile()) throw new Error(`Missing file: ${resolved}`);
  checked++;
}
for (const [original, entry] of Object.entries(manifest.images)) {
  await exists(path.join(dist, 'assets', original));
  for (const group of [entry.variants, entry.fallbackVariants ?? []]) {
    let last = 0;
    for (const variant of group) {
      if (variant.width <= last) throw new Error(`Unordered image sizes: ${original}`);
      await exists(path.join(dist, 'assets', variant.src));
      if ((await stat(path.join(dist, 'assets', variant.src))).size !== variant.bytes) throw new Error(`Stale manifest: ${variant.src}`);
      last = variant.width;
    }
  }
}
const pages = ['index.html', ...(await readdir(path.join(dist, 'projects'))).map(slug => `projects/${slug}/index.html`)];
for (const relative of pages) {
  const file = path.join(dist, relative), html = await readFile(file, 'utf8');
  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  if (imageTags.filter(tag => tag.includes('fetchpriority="high"')).length !== 1) throw new Error(`Expected one important image: ${relative}`);
  if (imageTags.some(tag => !tag.includes('loading=') && !tag.includes('<img alt='))) throw new Error(`Missing loading policy: ${relative}`);
  for (const [, value] of html.matchAll(/\b(?:src|poster|href)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|data:|#)/.test(value)) continue;
    await exists(path.resolve(path.dirname(file), value.split('#')[0]));
  }
  for (const [, value] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of value.split(',')) await exists(path.resolve(path.dirname(file), candidate.trim().split(/\s+/)[0]));
  }
}
console.log(`Checked ${pages.length} pages, ${Object.keys(manifest.images).length} responsive images and ${checked} local paths; no missing image or broken original URL.`);
