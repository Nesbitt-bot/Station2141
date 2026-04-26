#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const commitPattern = /^[a-f0-9]{40}$/i;
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

async function latestCommitHash() {
    if (commitPattern.test(process.env.GITHUB_SHA || '')) {
        return process.env.GITHUB_SHA;
    }

    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
        cwd: repoRoot
    });
    const hash = stdout.trim();
    if (!commitPattern.test(hash)) {
        throw new Error(`Unexpected commit hash: ${hash}`);
    }
    return hash;
}

const dataDir = resolve(repoRoot, 'data');
const outputPath = resolve(dataDir, 'life_seed.json');
const commit = await latestCommitHash();

await mkdir(dataDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ commit }, null, 2)}\n`);

console.log(`Wrote Conway seed from commit ${commit}`);
