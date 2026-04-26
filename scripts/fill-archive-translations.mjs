// Round-2: turn each archive post's render-never EN stub into a real
// English landing page that links to the source-language original. Also
// generate a parallel ZH stub for EN-only posts.
//
// We deliberately do NOT machine-translate bodies. Full translation is
// future human work; this script just makes sure every archive post has
// a presence in every site language so the language switcher works.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const archiveDir = join(repoRoot, 'content', 'archive');

const LANGS = ['en', 'zh'];

// Strings rendered in each language. Hugo i18n could do this too, but
// inlining keeps this script self-contained.
const STR = {
    en: {
        translationPending: 'Translation pending',
        thisPostIsAvailableIn: 'This post is currently only available in',
        sourceLanguageName: { en: 'English', zh: 'Chinese' },
        readOriginal: 'Read the original',
    },
    zh: {
        translationPending: '翻译待补',
        thisPostIsAvailableIn: '本文当前仅有以下语言版本：',
        sourceLanguageName: { en: '英文', zh: '中文' },
        readOriginal: '阅读原文',
    },
};

function frontMatter(text) {
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    if (!m) return null;
    const fm = {};
    for (const line of m[1].split('\n')) {
        const eq = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
        if (!eq) continue;
        fm[eq[1]] = eq[2];
    }
    return fm;
}

function unquote(s) {
    if (s == null) return '';
    const m = s.match(/^"(.*)"$/);
    return m ? m[1].replace(/\\"/g, '"') : s.trim();
}

async function main() {
    const entries = await readdir(archiveDir, { withFileTypes: true });
    let written = 0;

    for (const e of entries) {
        if (!e.isDirectory()) continue;
        const dir = join(archiveDir, e.name);
        const files = await readdir(dir);

        // Find which language file is the real (rendered) source
        const langFiles = {};
        for (const lang of LANGS) {
            const f = `index.${lang}.md`;
            if (files.includes(f)) langFiles[lang] = join(dir, f);
        }
        // Determine source: the file that doesn't have render:never
        let sourceLang = null;
        let sourcePath = null;
        for (const [lang, p] of Object.entries(langFiles)) {
            const t = await readFile(p, 'utf8');
            if (!/render:\s*never/.test(t)) {
                sourceLang = lang;
                sourcePath = p;
                break;
            }
        }
        if (!sourceLang) continue;
        const srcText = await readFile(sourcePath, 'utf8');
        const srcFm = frontMatter(srcText) || {};
        const title = unquote(srcFm.title) || e.name;
        const date = srcFm.date || '';
        const lastmod = srcFm.lastmod || '';
        const cover = unquote(srcFm.image) || '';
        const aliasesBlock = (() => {
            const m = srcText.match(/^aliases:\n((?:  - .+\n)+)/m);
            return m ? m[0] : '';
        })();

        const sourcePathRel = `/${sourceLang === 'en' ? '' : sourceLang + '/'}archive/${e.name}/`;

        for (const targetLang of LANGS) {
            if (targetLang === sourceLang) continue;
            const targetPath = join(dir, `index.${targetLang}.md`);
            // If a non-stub file already exists in target, skip
            if (existsSync(targetPath)) {
                const existing = await readFile(targetPath, 'utf8');
                if (!/render:\s*never/.test(existing) && !/Translation pending/i.test(existing)) {
                    continue;
                }
            }

            const t = STR[targetLang];
            const fmLines = ['---'];
            fmLines.push(`title: ${JSON.stringify(title)}`);
            if (date) fmLines.push(`date: ${date}`);
            if (lastmod) fmLines.push(`lastmod: ${lastmod}`);
            if (cover) fmLines.push(`image: ${JSON.stringify(cover)}`);
            fmLines.push(`description: ${JSON.stringify(t.translationPending)}`);
            fmLines.push('draft: false');
            // Don't carry over aliases on the stub page
            fmLines.push('---');

            const body = [
                '',
                `> ${t.translationPending}`,
                '',
                `${t.thisPostIsAvailableIn} **${t.sourceLanguageName[sourceLang]}**.`,
                '',
                `[${t.readOriginal} →](${sourcePathRel})`,
                '',
            ].join('\n');

            await writeFile(targetPath, fmLines.join('\n') + body);
            written++;
            console.log(`wrote ${targetPath} (translation stub for ${sourceLang} → ${targetLang})`);
        }
    }

    console.log(`\nDone. Wrote ${written} translation stubs.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
