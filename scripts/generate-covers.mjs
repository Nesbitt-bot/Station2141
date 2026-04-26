// Generate Penrose-tiling cover.png for each post bundle under content/posts/.
// Palette and seed are deterministic per slug so re-runs produce the same image
// unless --force-shuffle is passed.
//
// Port of drawPenrose() from the penrose_background.js source shared by the
// user, minus React and browser bits.

import { createCanvas } from '@napi-rs/canvas';
import { createHash } from 'node:crypto';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PHI = (Math.sqrt(5) + 1) / 2;
const BASE = 5;
const APOTHEM = Math.cos(Math.PI / (BASE * 2));

const C = (re, im) => ({ re, im });
const cAdd = (a, b) => C(a.re + b.re, a.im + b.im);
const cSub = (a, b) => C(a.re - b.re, a.im - b.im);
const cDivS = (a, s) => C(a.re / s, a.im / s);
const cRect = (r, theta) => C(r * Math.cos(theta), r * Math.sin(theta));

function generateTriangles(divisions, thetaOffset, mirrorShift) {
    const triangles = [];
    for (let i = 0; i < BASE * 2; i++) {
        const a2 = (2 * i - 1) * Math.PI / (BASE * 2) + thetaOffset;
        const a3 = (2 * i + 1) * Math.PI / (BASE * 2) + thetaOffset;
        let v2 = cRect(1, a2);
        let v3 = cRect(1, a3);
        if (((i + mirrorShift) % 2) === 0) {
            const tmp = v2; v2 = v3; v3 = tmp;
        }
        triangles.push({ shape: 'thin', v1: C(0, 0), v2, v3 });
    }

    let tris = triangles;
    for (let i = 0; i < divisions; i++) {
        const next = [];
        for (const t of tris) {
            const { shape, v1, v2, v3 } = t;
            if (shape === 'thin') {
                const p1 = cAdd(v1, cDivS(cSub(v2, v1), PHI));
                next.push({ shape: 'thin', v1: v3, v2: p1, v3: v2 });
                next.push({ shape: 'thicc', v1: p1, v2: v3, v3: v1 });
            } else {
                const p2 = cAdd(v2, cDivS(cSub(v1, v2), PHI));
                const p3 = cAdd(v2, cDivS(cSub(v3, v2), PHI));
                next.push({ shape: 'thicc', v1: p3, v2: v3, v3: v1 });
                next.push({ shape: 'thicc', v1: p2, v2: p3, v3: v2 });
                next.push({ shape: 'thin', v1: p3, v2: p2, v3: v1 });
            }
        }
        tris = next;
    }
    return tris;
}

function drawPenrose(ctx, W, H, opts) {
    const {
        divisions, thetaOffset, mirrorShift,
        zoom = 1, panX = 0, panY = 0, rotation = 0,
        showOutline = true,
        thinColor, thickColor, outlineColor, bgColor,
        outlineWidthPx = 1, enlarge = 1.1,
    } = opts;

    if (bgColor && bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, W, H);
    } else {
        ctx.clearRect(0, 0, W, H);
    }

    const tris = generateTriangles(divisions, thetaOffset, mirrorShift);
    const halfDiagonal = Math.hypot(W, H) / 2;
    const s = (halfDiagonal / APOTHEM) * enlarge * zoom;

    ctx.save();
    ctx.translate(W / 2 + panX, H / 2 + panY);
    ctx.rotate(rotation);
    ctx.scale(s, s);

    for (const t of tris) {
        ctx.beginPath();
        ctx.moveTo(t.v1.re, t.v1.im);
        ctx.lineTo(t.v2.re, t.v2.im);
        ctx.lineTo(t.v3.re, t.v3.im);
        ctx.closePath();
        ctx.fillStyle = t.shape === 'thin' ? thinColor : thickColor;
        ctx.fill();
    }

    if (showOutline) {
        ctx.lineWidth = outlineWidthPx / s;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = outlineColor;
        for (const t of tris) {
            ctx.beginPath();
            ctx.moveTo(t.v2.re, t.v2.im);
            ctx.lineTo(t.v1.re, t.v1.im);
            ctx.lineTo(t.v3.re, t.v3.im);
            ctx.stroke();
        }
    }

    ctx.restore();
    return tris.length;
}

// ---- Deterministic RNG and palette ----

function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function seedFromString(str) {
    const h = createHash('sha256').update(str).digest();
    return h.readUInt32BE(0);
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const c = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function palette(rng) {
    // Pick a base hue; thick and thin are analogous colors, outline is a darker
    // desaturated version, background is a very light near-complementary tint.
    const baseH = Math.floor(rng() * 360);
    const hueShift = 18 + rng() * 24;
    const thinH = (baseH + hueShift) % 360;
    const thickH = baseH;
    const thinS = 55 + rng() * 25;
    const thickS = 60 + rng() * 25;
    const thinL = 62 + rng() * 10;
    const thickL = 50 + rng() * 10;

    const outlineH = baseH;
    const outlineS = 35 + rng() * 20;
    const outlineL = 18 + rng() * 10;

    const bgH = (baseH + 180 + (rng() * 40 - 20) + 360) % 360;
    const bgS = 15 + rng() * 15;
    const bgL = 92 + rng() * 5;

    return {
        thin: hslToHex(thinH, thinS, thinL),
        thick: hslToHex(thickH, thickS, thickL),
        outline: hslToHex(outlineH, outlineS, outlineL),
        bg: hslToHex(bgH, bgS, bgL),
    };
}

// ---- Post discovery ----

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(__filename, '..', '..');
const SEARCH_SECTIONS = ['posts', 'archive'];

async function listPostBundles() {
    const bundles = [];
    for (const section of SEARCH_SECTIONS) {
        const sectionDir = join(repoRoot, 'content', section);
        let entries;
        try {
            entries = await readdir(sectionDir, { withFileTypes: true });
        } catch { continue; }
        for (const e of entries) {
            if (!e.isDirectory()) continue;
            const full = join(sectionDir, e.name);
            const children = await readdir(full);
            if (!children.some((c) => c.startsWith('index.') && c.endsWith('.md'))) continue;
            // Skip if any cover.* image already exists (regardless of extension)
            const hasCover = children.some((c) => /^cover\.(png|jpe?g|gif|webp)$/i.test(c));
            bundles.push({ slug: e.name, dir: full, hasCover });
        }
    }
    return bundles;
}

// ---- Main ----

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const width = Number(args.find((a) => a.startsWith('--w='))?.slice(4)) || 1600;
    const height = Number(args.find((a) => a.startsWith('--h='))?.slice(4)) || 900;
    const divRaw = args.find((a) => a.startsWith('--divisions='))?.slice(12);
    const divisions = divRaw !== undefined && !isNaN(Number(divRaw)) ? Number(divRaw) : 6;

    const bundles = await listPostBundles();
    if (bundles.length === 0) {
        console.error('No post bundles found under', postsDir);
        process.exit(1);
    }

    for (const { slug, dir, hasCover } of bundles) {
        const outPath = join(dir, 'cover.png');
        if (!force && hasCover) {
            console.log(`skip ${slug} (cover already present, pass --force to overwrite)`);
            continue;
        }

        const seed = seedFromString(slug);
        const rng = mulberry32(seed);
        const p = palette(rng);
        const thetaOffset = rng() * Math.PI * 2;
        const mirrorShift = rng() < 0.5 ? 0 : 1;
        const rotation = rng() * Math.PI * 2;
        const zoom = 0.9 + rng() * 0.4;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        drawPenrose(ctx, width, height, {
            divisions,
            thetaOffset,
            mirrorShift,
            zoom,
            panX: 0,
            panY: 0,
            rotation,
            showOutline: true,
            thinColor: p.thin,
            thickColor: p.thick,
            outlineColor: p.outline,
            bgColor: p.bg,
            outlineWidthPx: 1.2,
            enlarge: 1.1,
        });

        const buf = await canvas.encode('png');
        await writeFile(outPath, buf);
        console.log(
            `wrote ${outPath}  ` +
            `palette(thin=${p.thin}, thick=${p.thick}, outline=${p.outline}, bg=${p.bg})`
        );

        // Make sure each language file in the bundle has `image: "cover.png"`
        // so Stack picks it up. Insert after `description:` if present, else
        // after `title:`.
        const dirEntries = await readdir(dir);
        for (const entry of dirEntries) {
            if (!/^index\.[a-z]+\.md$/.test(entry)) continue;
            const mdPath = join(dir, entry);
            let text = await readFile(mdPath, 'utf8');
            if (/^image:/m.test(text)) continue;
            // Skip render-never stubs
            if (/render:\s*never/.test(text)) continue;
            const inserted = text.replace(
                /^(description:[^\n]*\n)/m,
                '$1image: "cover.png"\n'
            );
            const finalText = inserted !== text ? inserted : text.replace(
                /^(title:[^\n]*\n)/m,
                '$1image: "cover.png"\n'
            );
            if (finalText !== text) {
                await writeFile(mdPath, finalText);
                console.log(`  + image:cover.png in ${entry}`);
            }
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
