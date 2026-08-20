import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const blogBaseUrl = process.env.BLOG_BASE_URL ?? "https://blog.trance-0.com";
const root = resolve(process.cwd(), "content", "posts");
const languages = ["en", "zh", "ja"];

if (!repository || !token) {
  console.error("[discussion-sync] GITHUB_REPOSITORY and GITHUB_TOKEN are required");
  process.exit(1);
}

async function github(path, { method = "GET", body } = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Station2141-discussion-sync",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

function parseFrontMatter(source, path) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${path}: invalid or missing front matter`);
  return match[1];
}

function value(frontMatter, key) {
  return frontMatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1]?.trim();
}

function insertIssue(source, issueNumber) {
  if (/^discussion_issue:\s*\d+\s*$/m.test(source)) return source;
  const lines = source.split(/\r?\n/);
  const questionIndex = lines.findIndex((line) => line.startsWith("discussion_question:"));
  const versionIndex = lines.findIndex((line) => line.startsWith("version:"));
  const index = questionIndex >= 0 ? questionIndex : versionIndex + 1;
  lines.splice(index, 0, `discussion_issue: ${issueNumber}`);
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function issueBody({ title, question, permalink }) {
  return `This is the canonical reader discussion for [${title}](${blogBaseUrl}${permalink}).

## Open question

> ${question}

Share a concrete example, counterexample, or reflection. Comments in English, Chinese, or Japanese are welcome. Please keep discussion tied to the article’s claims and avoid posting private or identifying context you do not intend to make public.

Language versions of the article share this issue so that the discussion remains in one place.
`;
}

async function ensureLabel() {
  const encoded = encodeURIComponent("post-discussion");
  const response = await fetch(`https://api.github.com/repos/${repository}/labels/${encoded}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Station2141-discussion-sync",
    },
  });
  if (response.status === 404) {
    await github(`/repos/${repository}/labels`, {
      method: "POST",
      body: {
        name: "post-discussion",
        color: "345d9d",
        description: "Canonical reader discussion for one Station2141 post bundle",
      },
    });
  } else if (!response.ok) {
    throw new Error(`GET label: ${response.status} ${await response.text()}`);
  }
}

await ensureLabel();
let changed = false;

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const files = [];
  for (const language of languages) {
    const path = resolve(root, entry.name, `index.${language}.md`);
    try {
      const source = await readFile(path, "utf8");
      const frontMatter = parseFrontMatter(source, path);
      files.push({
        language,
        path,
        source,
        title: value(frontMatter, "title"),
        question: value(frontMatter, "discussion_question"),
        issue: value(frontMatter, "discussion_issue"),
        slug: value(frontMatter, "slug"),
        draft: value(frontMatter, "draft") === "true",
      });
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }

  if (files.length === 0) continue;
  for (const file of files) {
    if (!file.question) throw new Error(`${file.path}: discussion_question is required before issue synchronization`);
  }

  const declared = new Set(files.map((file) => file.issue).filter(Boolean));
  if (declared.size > 1) {
    throw new Error(`${entry.name}: language variants declare different discussion issues`);
  }

  let issueNumber = declared.size === 1 ? Number([...declared][0]) : null;
  if (!issueNumber) {
    const canonical = files.find((file) => file.language === "en") ?? files[0];
    const issueTitle = `[Discussion] ${canonical.title}`;
    const query = encodeURIComponent(`repo:${repository} is:issue in:title "${issueTitle}"`);
    const search = await github(`/search/issues?q=${query}`);
    const existing = search.items.find((item) => item.title === issueTitle);

    if (existing) {
      issueNumber = existing.number;
      console.log(`[discussion-sync] reuse #${issueNumber} for ${entry.name}`);
    } else {
      if (!canonical.slug) {
        throw new Error(`${canonical.path}: slug is required before automatically creating a discussion issue`);
      }
      const permalink = `/${canonical.language === "en" ? "" : `${canonical.language}/`}posts/${canonical.slug}/`;
      const issue = await github(`/repos/${repository}/issues`, {
        method: "POST",
        body: {
          title: issueTitle,
          body: issueBody({ title: canonical.title, question: canonical.question, permalink }),
          labels: ["post-discussion"],
        },
      });
      issueNumber = issue.number;
      console.log(`[discussion-sync] created #${issueNumber} for ${entry.name}: ${serverUrl}/${repository}/issues/${issueNumber}`);
    }
  }

  for (const file of files) {
    if (file.issue) continue;
    await writeFile(file.path, insertIssue(file.source, issueNumber), "utf8");
    console.log(`[discussion-sync] wrote #${issueNumber} to ${file.path}`);
    changed = true;
  }
}

console.log(`[discussion-sync] changed=${changed}`);
