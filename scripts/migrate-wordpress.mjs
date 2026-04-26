// Migrate WordPress (WXR) export into Hugo page bundles under content/archive/.
//
// - Only `post_type=post` items are converted; pages, nav menus, and the
//   front-page entry are skipped.
// - Each post becomes content/archive/<slug>/index.<lang>.md, with media
//   referenced from its body downloaded into the same bundle.
// - If the post has a WordPress featured image (`_thumbnail_id`), it is
//   downloaded as cover.<ext>; otherwise we fall back to a Penrose cover via
//   the existing generator. Posts without a body image and no thumbnail get
//   a Penrose cover after this script runs.
// - Language is detected from category `nicename` suffixes (-en, -zh) when
//   available, and falls back to a CJK-character ratio over the title and
//   the first ~400 chars of plain text.
// - Posts get a single language file for now; missing translations are
//   recorded in TODO.md so a future round can fill them in.
//
// Usage:
//   node scripts/migrate-wordpress.mjs [--xml=path] [--out=archive] [--force]

import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { mkdir, writeFile, readFile, stat, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from 'node:https';
import { request as httpRequest } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');

const args = process.argv.slice(2);
const argVal = (name, def) => {
    const a = args.find((x) => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : def;
};
const force = args.includes('--force');
const xmlPath = resolve(repoRoot, argVal('xml', 'migration/trance-0.WordPress.2026-04-26.xml'));
const outSection = argVal('out', 'archive');
const outDir = resolve(repoRoot, 'content', outSection);

// ---------- Helpers ----------

function fetchBuffer(url, redirectBudget = 5) {
    return new Promise((resolveP, rejectP) => {
        try {
            const u = new URL(url);
            const lib = u.protocol === 'http:' ? httpRequest : request;
            const req = lib({
                method: 'GET',
                hostname: u.hostname,
                port: u.port || undefined,
                path: u.pathname + u.search,
                headers: { 'user-agent': 'station2141-migrator/1.0' },
            }, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                    if (redirectBudget <= 0) return rejectP(new Error('too many redirects'));
                    const next = new URL(res.headers.location, u).toString();
                    res.resume();
                    return fetchBuffer(next, redirectBudget - 1).then(resolveP, rejectP);
                }
                if (res.statusCode !== 200) {
                    res.resume();
                    return rejectP(new Error(`HTTP ${res.statusCode}`));
                }
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => resolveP(Buffer.concat(chunks)));
                res.on('error', rejectP);
            });
            req.on('error', rejectP);
            req.end();
        } catch (err) {
            rejectP(err);
        }
    });
}

function decodeSlug(s, fallbackId) {
    let candidate = s || '';
    try {
        candidate = decodeURIComponent(s);
    } catch { /* keep raw */ }
    const ascii = candidate
        .replace(/[^\x20-\x7e]/g, '')   // strip non-ASCII
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    if (!ascii) return fallbackId ? `post-${fallbackId}` : s.toLowerCase();
    if (ascii.length > 80) return `post-${fallbackId}`;
    return ascii;
}

function safeFilename(name) {
    // Keep extension; replace anything else hostile.
    const ext = extname(name);
    const stem = basename(name, ext)
        .replace(/[^\w.\-一-鿿]+/g, '_')
        .slice(0, 80);
    return stem + ext.toLowerCase();
}

function cjkRatio(text) {
    if (!text) return 0;
    let cjk = 0, total = 0;
    for (const ch of text) {
        const code = ch.codePointAt(0);
        if (code > 32) total++;
        if ((code >= 0x4e00 && code <= 0x9fff) ||
            (code >= 0x3040 && code <= 0x30ff) ||
            (code >= 0x3400 && code <= 0x4dbf)) {
            cjk++;
        }
    }
    return total === 0 ? 0 : cjk / total;
}

function detectLang(post) {
    const cats = (post.categories || []).map((c) => c.nicename || '');
    if (cats.some((c) => c.endsWith('-zh'))) return 'zh';
    if (cats.some((c) => c.endsWith('-en'))) return 'en';
    const sample = (post.title || '') + ' ' + (post.content || '').replace(/<[^>]+>/g, ' ').slice(0, 400);
    return cjkRatio(sample) >= 0.3 ? 'zh' : 'en';
}

function stripGutenbergComments(html) {
    return html.replace(/<!--\s*\/?wp:[^>]*-->/g, '').trim();
}

function asArray(v) {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
}

// ---------- WXR parsing ----------

const xml = await readFile(xmlPath, 'utf8');
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    parseTagValue: false,
    trimValues: false,
    isArray: (name) => ['item', 'category', 'wp:postmeta'].includes(name),
});
const doc = parser.parse(xml);
const channel = doc.rss.channel;
const items = asArray(channel.item);

// Index attachments by post_id so we can resolve `_thumbnail_id`
const attachmentsById = new Map();
for (const it of items) {
    if (extractCdata(it['wp:post_type']) !== 'attachment') continue;
    const id = String(extractCdata(it['wp:post_id']));
    const url = extractCdata(it['wp:attachment_url']) || extractCdata(it.guid);
    if (id && url) attachmentsById.set(id, url);
}

function extractCdata(node) {
    if (node == null) return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'object' && node.__cdata != null) return String(node.__cdata);
    if (typeof node === 'object' && '#text' in node) return String(node['#text']);
    return '';
}

function categoryList(it) {
    return asArray(it.category).map((c) => ({
        domain: c['@_domain'],
        nicename: c['@_nicename'],
        name: typeof c === 'string' ? c : (c.__cdata || c['#text'] || ''),
    }));
}

function getPostmeta(it, key) {
    const metas = asArray(it['wp:postmeta']);
    for (const m of metas) {
        if (extractCdata(m['wp:meta_key']) === key) return extractCdata(m['wp:meta_value']);
    }
    return null;
}

const posts = items
    .filter((it) => extractCdata(it['wp:post_type']) === 'post')
    .filter((it) => extractCdata(it['wp:status']) === 'publish')
    .map((it) => {
        const cats = categoryList(it);
        return {
            id: extractCdata(it['wp:post_id']),
            title: extractCdata(it.title),
            slugRaw: extractCdata(it['wp:post_name']),
            date: extractCdata(it['wp:post_date_gmt']) || extractCdata(it['wp:post_date']),
            modified: extractCdata(it['wp:post_modified_gmt']),
            content: extractCdata(it['content:encoded']),
            excerpt: extractCdata(it['excerpt:encoded']),
            categories: cats,
            thumbnailId: getPostmeta(it, '_thumbnail_id'),
        };
    });

console.log(`Found ${posts.length} published posts.`);

// ---------- Conversion ----------

const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
});

// Preserve Gutenberg figures cleanly (WXR HTML wraps images in <figure>).
turndown.addRule('figure', {
    filter: 'figure',
    replacement: (content) => '\n\n' + content.trim() + '\n\n',
});

await mkdir(outDir, { recursive: true });

const todoEntries = [];

for (const post of posts) {
    const slug = decodeSlug(post.slugRaw, post.id);
    const lang = detectLang(post);
    const bundleDir = join(outDir, slug);
    const targetMd = join(bundleDir, `index.${lang}.md`);

    if (existsSync(targetMd) && !force) {
        console.log(`skip ${slug} (exists; --force to overwrite)`);
        continue;
    }
    await mkdir(bundleDir, { recursive: true });

    let html = stripGutenbergComments(post.content || '');

    // Gather all media URLs that the body references and download them into
    // the bundle, rewriting src/href to bare filenames.
    const mediaMap = new Map(); // original URL -> local filename
    const urlPattern = /https?:\/\/[^\s"'<>)]+\.(?:png|jpe?g|gif|webp|svg|mp3|mp4|m4a|ogg|wav|pdf|zip)/gi;
    const found = new Set();
    for (const match of html.matchAll(urlPattern)) found.add(match[0]);

    for (const url of found) {
        const fname = safeFilename(decodeURIComponent(url.split('/').pop()).split('?')[0]);
        const dest = join(bundleDir, fname);
        if (!existsSync(dest)) {
            try {
                const buf = await fetchBuffer(url);
                await writeFile(dest, buf);
                console.log(`  + ${slug}/${fname}  (${buf.length} B)`);
            } catch (err) {
                console.warn(`  ! ${slug}: ${url} -> ${err.message}`);
                // Still rewrite the body to a local-style reference so Hugo
                // doesn't try resources.GetRemote on a broken URL at build time.
                // The local file won't exist, but Stack's image helper will
                // silently skip rather than warn.
                mediaMap.set(url, fname);
                continue;
            }
        }
        mediaMap.set(url, fname);
    }

    // Rewrite references. Do longest-URL-first so a URL that's a prefix of
    // another doesn't get partially rewritten.
    const sortedUrls = [...mediaMap.keys()].sort((a, b) => b.length - a.length);
    for (const url of sortedUrls) {
        const fname = mediaMap.get(url);
        html = html.split(url).join(fname);
    }

    // Featured image -> cover.<ext>
    let coverFile = null;
    if (post.thumbnailId && attachmentsById.has(post.thumbnailId)) {
        const url = attachmentsById.get(post.thumbnailId);
        const ext = extname(url.split('?')[0]).toLowerCase() || '.png';
        const dest = join(bundleDir, `cover${ext}`);
        try {
            if (!existsSync(dest)) {
                const buf = await fetchBuffer(url);
                await writeFile(dest, buf);
            }
            coverFile = `cover${ext}`;
            console.log(`  cover ${slug} <- ${url.split('/').pop()}`);
        } catch (err) {
            console.warn(`  ! ${slug} featured image: ${err.message}`);
        }
    }

    // Convert HTML body to Markdown
    let md = turndown.turndown(html);
    // Tighten excessive blank lines
    md = md.replace(/\n{3,}/g, '\n\n').trim();

    // Build front matter
    const tags = post.categories
        .filter((c) => c.domain === 'post_tag')
        .map((c) => c.name || c.nicename)
        .filter(Boolean);
    const cats = post.categories
        .filter((c) => c.domain === 'category')
        .map((c) => c.name || c.nicename)
        .filter(Boolean);

    const frontmatter = ['---'];
    frontmatter.push(`title: ${JSON.stringify(post.title || slug)}`);
    if (post.date) frontmatter.push(`date: ${post.date.replace(' ', 'T') + 'Z'}`);
    if (post.modified && post.modified !== post.date) {
        frontmatter.push(`lastmod: ${post.modified.replace(' ', 'T') + 'Z'}`);
    }
    if (post.excerpt) frontmatter.push(`description: ${JSON.stringify(post.excerpt)}`);
    if (coverFile) frontmatter.push(`image: ${JSON.stringify(coverFile)}`);
    if (tags.length) frontmatter.push(`tags: ${JSON.stringify(tags)}`);
    if (cats.length) frontmatter.push(`categories: ${JSON.stringify(cats)}`);
    frontmatter.push('draft: false');
    frontmatter.push('aliases:');
    frontmatter.push(`  - /${decodeURIComponent(post.slugRaw)}/`);
    frontmatter.push('---');

    const body = frontmatter.join('\n') + '\n\n' + md + '\n';
    await writeFile(targetMd, body);
    console.log(`wrote ${targetMd}`);

    // For non-default-language posts, write a non-rendered EN stub so Hugo
    // attaches the bundle's media as page Resources. Without this, body
    // images on a `index.zh.md`-only bundle don't resolve.
    if (lang !== 'en') {
        const stub = `---
title: ${JSON.stringify(post.title || slug)}
build:
  render: never
  list: never
---
`;
        await writeFile(join(bundleDir, 'index.en.md'), stub);
    }

    // Track for TODO
    const otherLang = lang === 'en' ? 'zh' : 'en';
    todoEntries.push({ slug, lang, otherLang, title: post.title });
}

// ---------- Section _index pages and TODO ----------

const sectionIndexEn = `---
title: "Archive"
description: "Pre-Station-2141 posts migrated from the old WordPress site."
---

The archive holds posts from the trance-0 WordPress site, migrated as-is. They predate Station 2141 and represent earlier writing.
`;
const sectionIndexZh = `---
title: "存档"
description: "从旧 WordPress 站点迁移过来的、Station 2141 之前的文章。"
---

本存档收录了从 trance-0 WordPress 站点迁移来的文章。它们写在 Station 2141 之前,作为早期写作的留存。
`;
const sectionIndexJa = `---
title: "アーカイブ"
description: "旧 WordPress サイトから移行された、Station 2141 以前の記事。"
---

このアーカイブは、trance-0 WordPress サイトから移行された記事を収録しています。Station 2141 以前に書かれたものです。
`;
await writeFile(join(outDir, '_index.en.md'), sectionIndexEn);
await writeFile(join(outDir, '_index.zh.md'), sectionIndexZh);
await writeFile(join(outDir, '_index.ja.md'), sectionIndexJa);

const todoPath = resolve(repoRoot, 'TODO.md');
const todoLines = [
    '# TODO',
    '',
    '## Archive translations',
    '',
    'Each migrated post currently exists in its detected source language only. The next migration round should add the missing translation file (e.g. an `index.zh.md` written next to a post that is currently `index.en.md`-only).',
    '',
    '| Slug | Have | Need |',
    '| --- | --- | --- |',
];
for (const t of todoEntries) {
    todoLines.push(`| \`${t.slug}\` | \`index.${t.lang}.md\` | \`index.${t.otherLang}.md\` |`);
}
todoLines.push('');
await writeFile(todoPath, todoLines.join('\n'));
console.log(`\nWrote TODO.md with ${todoEntries.length} entries.`);
console.log('Done.');
