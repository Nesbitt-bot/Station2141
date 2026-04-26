// Normalize formatting in CSE 247 / CSE 132 lecture notes:
// - Shift heading levels up so the first body heading is `##` (H1 belongs to
//   the front-matter title that Stack renders).
// - Collapse `-   ` (and `*   `) list markers down to `- ` / `* ` (one space).
//
// Operates in-place. Code blocks are skipped.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const archiveDir = join(repoRoot, 'content', 'archive');

function shiftHeadings(md) {
    // Find the minimum heading depth in the body (outside fenced blocks)
    const parts = md.split(/(```[\s\S]*?```)/g);
    let minDepth = Infinity;
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) continue;
        for (const m of parts[i].matchAll(/^(#{1,6})\s/gm)) {
            if (m[1].length < minDepth) minDepth = m[1].length;
        }
    }
    if (!isFinite(minDepth) || minDepth <= 2) return md; // already starts at ## or no headings
    const shift = minDepth - 2;
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) continue;
        parts[i] = parts[i].replace(/^(#{1,6})(\s)/gm, (full, hashes, ws) => {
            const newDepth = Math.max(2, hashes.length - shift);
            return '#'.repeat(newDepth) + ws;
        });
    }
    return parts.join('');
}

function tightenLists(md) {
    const parts = md.split(/(```[\s\S]*?```)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) continue;
        // `-   x` / `*   x` / `+   x` → `- x` / `* x` / `+ x`
        parts[i] = parts[i].replace(/^(\s*)([-*+])[ \t]{2,}/gm, '$1$2 ');
    }
    return parts.join('');
}

function processBody(md) {
    let out = shiftHeadings(md);
    out = tightenLists(out);
    return out;
}

async function main() {
    // Process every archive post (course notes + others). Headings already at
    // `##` no-op; list markers always normalize.
    const entries = await readdir(archiveDir, { withFileTypes: true });
    let touched = 0;
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        const dir = join(archiveDir, e.name);
        const files = await readdir(dir);
        for (const f of files) {
            if (!/^index\.[a-z]+\.md$/.test(f)) continue;
            const path = join(dir, f);
            const text = await readFile(path, 'utf8');
            // Skip stub files
            if (/Translation pending|翻译待补|翻訳待ち/.test(text)) continue;
            const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
            if (!m) continue;
            const newBody = processBody(m[2]);
            if (newBody === m[2]) continue;
            await writeFile(path, `---\n${m[1]}\n---\n${newBody}`);
            touched++;
            console.log(`fixed ${e.name}/${f}`);
        }
    }
    console.log(`\nDone. Fixed ${touched} files.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
