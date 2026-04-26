// Migrate migration/GDAPC/*.docx into Hugo page bundles under
// content/archive/gdapc-week-<N>/.
//
// - Each .docx is converted via mammoth, with embedded images extracted
//   into the bundle directory and rewritten to bare filenames so they
//   travel with the post.
// - The first image in each post becomes cover.<ext>; otherwise we leave
//   no `image:` and let scripts/generate-covers.mjs fill in a Penrose cover.
// - These are course notes, so we follow the same convention as the other
//   archive course-notes: write index.en.md as the source, and leave a
//   "Translation pending" stub for the other site languages (handled
//   separately by scripts/fill-archive-translations.mjs in a follow-up
//   pass; for now we just emit the EN file plus a render:never stub for ZH
//   so resources attach correctly to ZH archive listings).

import mammoth from 'mammoth';
import { mkdir, readdir, writeFile, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const sourceDir = join(repoRoot, 'migration', 'GDAPC');
const outRoot = join(repoRoot, 'content', 'archive');

const args = process.argv.slice(2);
const force = args.includes('--force');

function extFromContentType(contentType) {
    if (!contentType) return '.bin';
    const map = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'image/bmp': '.bmp',
    };
    return map[contentType] || '.png';
}

async function migrateOne(docxPath) {
    const filename = basename(docxPath, '.docx');
    // "GDAPC Week 12" → "gdapc-week-12"
    const m = filename.match(/Week\s*(\d+)/i);
    if (!m) {
        console.warn(`! skip (cannot parse week from filename): ${filename}`);
        return;
    }
    const week = parseInt(m[1], 10);
    const slug = `gdapc-week-${week}`;
    const bundleDir = join(outRoot, slug);
    const targetMd = join(bundleDir, 'index.en.md');

    if (existsSync(targetMd) && !force) {
        console.log(`skip ${slug} (exists; --force to overwrite)`);
        return;
    }
    await mkdir(bundleDir, { recursive: true });

    const imagesByName = new Map(); // local filename -> Buffer
    let imgCounter = 0;
    const seenHashes = new Map(); // sha1 -> filename (de-dup identical images)

    const result = await mammoth.convertToMarkdown(
        { path: docxPath },
        {
            convertImage: mammoth.images.imgElement(async (img) => {
                const buf = await img.read();
                const hash = createHash('sha1').update(buf).digest('hex');
                let name = seenHashes.get(hash);
                if (!name) {
                    imgCounter += 1;
                    const ext = extFromContentType(img.contentType);
                    name = `image-${imgCounter}${ext}`;
                    seenHashes.set(hash, name);
                    imagesByName.set(name, buf);
                }
                return { src: name };
            }),
        }
    );

    let md = result.value;
    const messages = result.messages || [];

    // Strip mammoth's bookmark anchors and aggressive backslash-escapes for
    // plain prose characters, plus stray empty bold runs.
    md = md
        .replace(/<a id="[^"]*"><\/a>/g, '')
        .replace(/__\s+__/g, '');
    {
        const parts = md.split(/(```[\s\S]*?```)/g);
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) continue;
            parts[i] = parts[i].replace(/\\([.\-_!"+#*()])/g, '$1');
        }
        md = parts.join('');
    }

    // Mammoth occasionally emits empty bullets and stray non-breaking spaces.
    md = md
        .replace(/ /g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Write images to disk
    for (const [name, buf] of imagesByName) {
        await writeFile(join(bundleDir, name), buf);
    }

    // First image becomes cover.<ext>
    let coverFile = null;
    if (imagesByName.size > 0) {
        const firstName = imagesByName.keys().next().value;
        const ext = extname(firstName).toLowerCase();
        const buf = imagesByName.get(firstName);
        coverFile = `cover${ext}`;
        await writeFile(join(bundleDir, coverFile), buf);
    }

    // Try to use the first H1/H2 from the document as the post title; fall
    // back to "GDAPC — Week N".
    let titleFromDoc = null;
    {
        const h = md.match(/^#{1,2}\s+(.+?)\s*$/m);
        if (h) titleFromDoc = h[1].trim();
    }
    const title = titleFromDoc
        ? `GDAPC Week ${week} — ${titleFromDoc}`
        : `GDAPC — Week ${week}`;

    // Pull the file's mtime as a stable date stand-in.
    const st = await stat(docxPath);
    const date = st.mtime.toISOString();

    const fm = ['---'];
    fm.push(`title: ${JSON.stringify(title)}`);
    fm.push(`date: ${date}`);
    if (coverFile) fm.push(`image: ${JSON.stringify(coverFile)}`);
    fm.push(`description: ${JSON.stringify('Google Data Analytics Professional Certificate — Week ' + week + ' notes.')}`);
    fm.push(`tags: ["GDAPC","Google Data Analytics","Coursera","Week ${week}"]`);
    fm.push('categories: ["Google data analytics professional certificates"]');
    fm.push('draft: false');
    fm.push('---');

    const body = fm.join('\n') + '\n\n' + md + '\n';
    await writeFile(targetMd, body);

    // Translation stubs for ZH/JA so the language switcher always works.
    const stubZh = `---
title: ${JSON.stringify(title)}
date: ${date}
${coverFile ? `image: ${JSON.stringify(coverFile)}\n` : ''}description: "翻译待补"
draft: false
---

> 翻译待补

本文当前仅有以下语言版本： **英文**.

[阅读原文 →](/archive/${slug}/)
`;
    const stubJa = `---
title: ${JSON.stringify(title)}
date: ${date}
${coverFile ? `image: ${JSON.stringify(coverFile)}\n` : ''}description: "翻訳待ち"
draft: false
---

> 翻訳待ち

この記事は現在 **英語** のみで公開されています。

[原文を読む →](/archive/${slug}/)
`;
    if (!existsSync(join(bundleDir, 'index.zh.md')) || force) {
        await writeFile(join(bundleDir, 'index.zh.md'), stubZh);
    }
    if (!existsSync(join(bundleDir, 'index.ja.md')) || force) {
        await writeFile(join(bundleDir, 'index.ja.md'), stubJa);
    }

    console.log(
        `wrote ${slug}: ${imagesByName.size} images, ` +
        `cover=${coverFile || '(none)'}, messages=${messages.length}`
    );
}

async function main() {
    const entries = await readdir(sourceDir);
    const docxFiles = entries
        .filter((e) => e.toLowerCase().endsWith('.docx'))
        .sort((a, b) => {
            const ai = parseInt((a.match(/Week\s*(\d+)/i) || [])[1] || '0', 10);
            const bi = parseInt((b.match(/Week\s*(\d+)/i) || [])[1] || '0', 10);
            return ai - bi;
        });

    console.log(`Found ${docxFiles.length} docx files in ${sourceDir}`);
    for (const f of docxFiles) {
        try {
            await migrateOne(join(sourceDir, f));
        } catch (err) {
            console.error(`! ${f}: ${err.message}`);
        }
    }
    console.log('Done.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
