import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "content", "posts");
const output = resolve(process.cwd(), "data", "post_versions.json");
const languages = ["en", "zh", "ja"];
const manifest = {};
let failed = false;
let warnings = 0;

function frontMatterValue(frontMatter, key) {
  return frontMatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1]?.trim();
}

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const bundle = resolve(root, entry.name);
  const records = {};
  const publishedVersions = new Set();

  for (const language of languages) {
    const path = resolve(bundle, `index.${language}.md`);
    try {
      const source = await readFile(path, "utf8");
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match) {
        console.error(`[versions] ${entry.name}/${language}: invalid or missing front matter`);
        failed = true;
        continue;
      }

      const version = frontMatterValue(match[1], "version");
      const draft = frontMatterValue(match[1], "draft") === "true";
      const discussionIssue = frontMatterValue(match[1], "discussion_issue");
      const discussionQuestion = frontMatterValue(match[1], "discussion_question");
      if (!version) {
        console.error(`[versions] ${entry.name}/${language}: missing version`);
        failed = true;
      } else if (!/^\d+\.\d+\.\d+$/.test(version)) {
        console.error(`[versions] ${entry.name}/${language}: invalid semantic version ${version}`);
        failed = true;
      }

      if (!discussionIssue || !/^\d+$/.test(discussionIssue)) {
        console.error(`[versions] ${entry.name}/${language}: missing or invalid discussion_issue`);
        failed = true;
      }
      if (!discussionQuestion) {
        console.error(`[versions] ${entry.name}/${language}: missing discussion_question`);
        failed = true;
      }

      records[language] = {
        status: draft ? "draft" : "published",
        version: version ?? "unversioned",
        discussion_issue: discussionIssue ? Number(discussionIssue) : null,
      };
      if (!draft && version) publishedVersions.add(version);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      records[language] = { status: "missing" };
    }
  }

  const issueNumbers = new Set(
    languages
      .map((language) => records[language]?.discussion_issue)
      .filter((value) => Number.isInteger(value)),
  );
  if (issueNumbers.size > 1) {
    console.error(`[versions] ${entry.name}: language variants do not share one discussion issue`);
    failed = true;
  }

  manifest[entry.name] = records;
  const summary = languages.map((language) => {
    const record = records[language];
    return record.status === "missing"
      ? `${language}=missing`
      : `${language}=${record.version}${record.status === "draft" ? "(draft)" : ""}`;
  });

  const unavailable = languages.filter((language) => records[language].status !== "published");
  if (publishedVersions.size > 1 || unavailable.length > 0) {
    warnings += 1;
    console.warn(`[versions] warning ${entry.name}: ${summary.join(" ")}`);
  } else {
    console.log(`[versions] synced ${entry.name}: ${summary.join(" ")}`);
  }
}

await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`[versions] wrote ${output}; ${warnings} bundle(s) need translation attention`);

if (failed) process.exit(1);
