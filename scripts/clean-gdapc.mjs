// Clean up GDAPC posts after the initial mammoth conversion:
// - Strip <a id="..."></a> anchor remnants from body and titles
// - Drop mammoth's default backslash-escapes for ., -, (, ), _, !, ", +, #, *
// - Re-derive title: prefer the first heading or the first non-empty line of
//   body, with leading __bold markers stripped
// - Generate a short description from the first ~160 chars of body prose

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const archiveDir = join(repoRoot, 'content', 'archive');

function stripAnchors(s) {
    return s.replace(/<a id="[^"]*"><\/a>/g, '');
}

function unescapeMammoth(s) {
    // Only unescape characters mammoth escapes when they're in plain prose;
    // do NOT touch the contents of fenced code blocks.
    const parts = s.split(/(```[\s\S]*?```)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) continue; // code block, leave alone
        parts[i] = parts[i]
            .replace(/\\([.\-_!"+#*()])/g, '$1');
    }
    return parts.join('');
}

function cleanInline(s) {
    // Remove leading bold markers and stray spaces; collapse internal __X __ on
    // single-word headings (mammoth often leaves trailing-space bold runs).
    return s
        .replace(/^__\s*/, '')
        .replace(/\s*__$/, '')
        .replace(/__([^_]+?)__/g, '$1')
        .trim();
}

function deriveTitle(body, week) {
    const stripped = stripAnchors(body);
    // Prefer the first markdown heading
    const heading = stripped.match(/^\s{0,3}#{1,3}\s+(.+?)\s*$/m);
    if (heading) {
        const t = cleanInline(heading[1]);
        if (t && t.length < 120) return `GDAPC Week ${week} — ${t}`;
    }
    // Else first non-empty body line
    for (const raw of stripped.split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith('![')) continue;
        if (line.startsWith('---')) continue;
        const t = cleanInline(line.replace(/^[*_>\-]\s*/, ''));
        if (!t) continue;
        if (t.length > 120) return `GDAPC — Week ${week}`;
        return `GDAPC Week ${week} — ${t}`;
    }
    return `GDAPC — Week ${week}`;
}

function deriveDescription(body) {
    const stripped = stripAnchors(body);
    const lines = stripped.split('\n');
    const buf = [];
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith('!')) continue;            // image
        if (line.startsWith('#')) continue;            // heading
        if (line.startsWith('---')) continue;          // hr or fm
        if (line.startsWith('```')) continue;          // code fence
        if (line.startsWith('|')) continue;            // table row
        if (/^[*\-+]\s/.test(line)) continue;          // bullet
        if (/^\d+\.\s/.test(line)) continue;           // ordered
        const cleaned = line
            .replace(/\\(.)/g, '$1')
            .replace(/\*\*([^*]+?)\*\*/g, '$1')
            .replace(/__([^_]+?)__/g, '$1')
            .replace(/\*([^*]+?)\*/g, '$1')
            .replace(/_([^_]+?)_/g, '$1')
            .replace(/\[([^\]]+?)\]\([^)]+?\)/g, '$1')
            .replace(/<[^>]+?>/g, '')
            .trim();
        if (!cleaned) continue;
        // Skip 1-word / very short label lines like "Week 7" or "Quantitative
        // data" — we want real prose. Once we have meaningful content, accept
        // shorter follow-ups.
        if (cleaned.split(/\s+/).length < 6 && buf.join(' ').length < 60) continue;
        buf.push(cleaned);
        if (buf.join(' ').length > 200) break;
    }
    let desc = buf.join(' ').trim();
    if (!desc) return null;
    if (desc.length > 180) {
        // Trim at a sentence or word boundary near 160
        const cut = desc.slice(0, 160);
        const lastDot = cut.lastIndexOf('.');
        const lastSpace = cut.lastIndexOf(' ');
        const at = lastDot > 100 ? lastDot + 1 : (lastSpace > 100 ? lastSpace : 160);
        desc = cut.slice(0, at).trim();
        if (!/[.!?…]$/.test(desc)) desc += '…';
    }
    return desc;
}

function splitFrontMatter(text) {
    const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return null;
    return { fm: m[1], body: m[2] };
}

function frontMatterMap(fmText) {
    const map = new Map();
    for (const raw of fmText.split('\n')) {
        const m = raw.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
        if (!m) continue;
        map.set(m[1], m[2]);
    }
    return map;
}

function buildFrontMatter(map, order) {
    const lines = ['---'];
    const seen = new Set();
    for (const k of order) {
        if (map.has(k)) {
            lines.push(`${k}: ${map.get(k)}`);
            seen.add(k);
        }
    }
    for (const [k, v] of map) {
        if (seen.has(k)) continue;
        lines.push(`${k}: ${v}`);
    }
    lines.push('---');
    return lines.join('\n');
}

async function main() {
    const entries = await readdir(archiveDir, { withFileTypes: true });
    const dirs = entries
        .filter((e) => e.isDirectory() && /^gdapc-week-\d+$/.test(e.name))
        .sort((a, b) => {
            const ai = parseInt(a.name.split('-').pop(), 10);
            const bi = parseInt(b.name.split('-').pop(), 10);
            return ai - bi;
        });

    let cleaned = 0;
    for (const d of dirs) {
        const week = parseInt(d.name.split('-').pop(), 10);
        const path = join(archiveDir, d.name, 'index.en.md');
        const text = await readFile(path, 'utf8');
        const split = splitFrontMatter(text);
        if (!split) {
            console.warn(`skip ${d.name}: no front matter`);
            continue;
        }

        let body = split.body;
        body = stripAnchors(body);
        body = unescapeMammoth(body);
        // Drop runs of empty bold like __ __ that sometimes survive
        body = body.replace(/__\s+__/g, '');
        // Collapse 3+ blank lines
        body = body.replace(/\n{3,}/g, '\n\n').trim() + '\n';

        const fmMap = frontMatterMap(split.fm);
        const newTitle = deriveTitle(body, week);
        fmMap.set('title', JSON.stringify(newTitle));

        const desc = deriveDescription(body);
        if (desc) {
            fmMap.set('description', JSON.stringify(desc));
        }

        const order = ['title', 'date', 'lastmod', 'image', 'description', 'tags', 'categories', 'draft'];
        const newText = buildFrontMatter(fmMap, order) + '\n\n' + body;
        await writeFile(path, newText);
        cleaned++;
        console.log(`cleaned ${d.name}: title="${newTitle}"`);

        // Mirror the new title and description into the ZH and JA stubs so
        // listings show the real (clean) title in every language.
        for (const lang of ['zh', 'ja']) {
            const stubPath = join(archiveDir, d.name, `index.${lang}.md`);
            try {
                const stubText = await readFile(stubPath, 'utf8');
                const ss = splitFrontMatter(stubText);
                if (!ss) continue;
                const sm = frontMatterMap(ss.fm);
                if (!/(Translation pending|翻译待补|翻訳待ち)/.test(stubText)) continue;
                sm.set('title', JSON.stringify(newTitle));
                if (desc && !sm.has('description')) sm.set('description', JSON.stringify(desc));
                const out = buildFrontMatter(sm, order) + '\n\n' + ss.body.trim() + '\n';
                await writeFile(stubPath, out);
            } catch { /* missing stub: skip */ }
        }
    }
    console.log(`\nDone. Cleaned ${cleaned} files.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
