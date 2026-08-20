import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("./sync-discussion-issues.mjs", import.meta.url), "utf8");
for (const required of [
  "GITHUB_REPOSITORY",
  "GITHUB_TOKEN",
  "discussion_question",
  "discussion_issue",
  "post-discussion",
  "[Discussion]",
  "language variants declare different discussion issues",
]) {
  assert.ok(source.includes(required), `sync script must contain ${required}`);
}
console.log("[discussion-sync-test] static contract checks passed");
