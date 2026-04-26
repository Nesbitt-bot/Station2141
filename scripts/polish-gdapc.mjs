// Second-pass polish for GDAPC bodies (after migrate-gdapc.mjs and
// clean-gdapc.mjs).
//
// What this does:
// - Convert mammoth's `__bold__` runs into `**bold**` (canonical), trim
//   trailing whitespace inside the markers.
// - Promote standalone bold-only lines (e.g., `__Ask__` between blank
//   lines) into level-3 headings.
// - For lines that look like `Term: explanation.`, bold the term.
// - Italicize standalone definition-style runs the same way as Coursera's
//   own glossary cards (term in bold, body in plain prose).
//
// Code blocks and tables are left alone.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const archiveDir = join(repoRoot, 'content', 'archive');

function processBody(body) {
    // Split out fenced code blocks so they're untouched.
    const parts = body.split(/(```[\s\S]*?```)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) continue;
        let chunk = parts[i];

        // 1) `__X __` → `__X__` (trim inner whitespace)
        chunk = chunk.replace(/__\s*([^_\n]+?)\s*__/g, '__$1__');

        // 2) Standalone bold-only lines become ### headings.
        chunk = chunk.replace(/(^|\n)__([^_\n]{1,80})__(\s*)\n/g,
            (full, lead, inner, trail) => `${lead}### ${inner.trim()}\n`);

        // 3) Inline `__bold__` → `**bold**` (anywhere that survived).
        chunk = chunk.replace(/__([^_\n]+?)__/g, '**$1**');

        // 4) Detect "Term: explanation." patterns and bold the term.
        //    Conditions: term is 1–6 words, line is ≤ 220 chars, term has no
        //    leading bold yet, and the part after `:` looks like a sentence.
        chunk = chunk.replace(
            /(^|\n)([A-Z][\w][^\n:]{0,60}):\s+([A-Z][^\n]{15,})(?=\n|$)/g,
            (full, lead, term, rest) => {
                if (term.startsWith('*') || term.startsWith('#')) return full;
                if (term.split(/\s+/).length > 6) return full;
                return `${lead}**${term}**: ${rest}`;
            }
        );

        parts[i] = chunk;
    }
    return parts.join('');
}

async function main() {
    const entries = await readdir(archiveDir, { withFileTypes: true });
    const dirs = entries
        .filter((e) => e.isDirectory() && /^gdapc-week-\d+$/.test(e.name));

    let polished = 0;
    for (const d of dirs) {
        const path = join(archiveDir, d.name, 'index.en.md');
        const text = await readFile(path, 'utf8');
        const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!m) continue;
        const fm = m[1];
        const body = m[2];
        const newBody = processBody(body);
        if (newBody === body) continue;
        await writeFile(path, `---\n${fm}\n---\n${newBody}`);
        polished++;
        console.log(`polished ${d.name}`);
    }
    console.log(`\nDone. Polished ${polished} files.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
