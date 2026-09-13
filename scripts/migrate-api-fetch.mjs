import fs from 'fs';
import path from 'path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const importLine = "import { apiFetch } from '@/lib/api/client';";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'app/api') continue;
      walk(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

let updated = 0;
for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (rel.startsWith('scripts/')) continue;

  let content = fs.readFileSync(file, 'utf8');
  if (!/fetch\(['`]\/api\//.test(content)) continue;

  content = content.replace(/fetch\((['`]\/api\/)/g, 'apiFetch($1');

  if (!content.includes(importLine)) {
    if (content.startsWith("'use client'")) {
      content = content.replace(/^('use client';\n\n?)/, `$1${importLine}\n`);
    }
    if (!content.includes(importLine)) {
      content = `${importLine}\n${content}`;
    }
  }

  fs.writeFileSync(file, content);
  updated++;
  console.log(rel);
}

console.log(`Updated ${updated} files`);
