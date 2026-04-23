---
name: blog
description: Generate multilingual blog posts from conversation context and publish to a Hugo-based GitHub Pages site. Trigger on "/blog" command followed by discussion context, or when asked to write/publish a blog post. Handles context analysis, structured article generation, i18n translation, category management, and git-based publishing. NOT for: diary entries, raw memory logs, or social media posts.
---

# blog Skill

## Purpose

Analyze conversation context provided by the user, extract key ideas, and generate a structured blog post in multiple languages. Publish to a Hugo site hosted on GitHub Pages.

## Workflow

### 1. Receive Context

When the user sends `/blog` followed by conversation context or a topic description:

1. Read the provided context carefully
2. Identify the **core thesis** and **key arguments**
3. Note the **sender's perspective** and **intended audience**

### 2. Generate Article Preview (Main Language First)

Produce a ~5-minute-read article (roughly 1200–1500 words) in the user's main language. Use a standard academic discussion tone — structured but conversational.

Required sections:

1. **Defining the Problem** — Main topic, time context, scope, who it affects
2. **Related Topics & Impact** — Adjacent ideas, why readers should care
3. **Proposed Solution / Direction** — Working thesis, conditions that make it logical
4. **Remaining Uncertainties** — What could go wrong, fragile assumptions
5. **Further Reading** *(optional)* — Internet-available references with short descriptions. Omit if discussion is speculative, fictional, or too shallow for citations.

Article metadata (Hugo front matter):

```yaml
---
title: "<concise title>"
date: <YYYY-MM-DD>
description: "<one-line summary>"
tags: ["<tag1>", "<tag2>"]
categories: ["<category>"]
draft: false
---
```

### 3. Preview and Confirm

Present the main-language article to the user as a preview. Wait for:

- Approval to proceed
- Edit requests (apply edits, re-preview)

Do **not** generate translations until the main-language version is confirmed.

### 4. Generate i18n Versions

After confirmation, translate into all configured languages. Maintain:

- Same structure and section headings
- Equivalent tone (not word-for-word translation)
- Culturally appropriate phrasing
- Consistent front matter (same date, tags adapted to target language)

Default language set: **English** (main), **Chinese**, **Japanese**.
The user may override this per-instance.

### 5. Categorize

Auto-assign a category from existing categories in the Hugo site. Category scope should match university-level fields (e.g., `Computer Science`, `Economics`, `Neuroscience`, `Philosophy`, `Fictional Literature`).

Rules:

- Check existing categories first: `find content -name "*.md" -exec grep -h "categories:" {} \; | sort -u`
- If a good match exists, reuse it
- If no match, prompt the user or use `Uncategorized`
- Do not create overly specific categories (e.g., not "AI Agent Security" — use "Computer Science")

### 6. Publish

1. Create page bundle: `content/posts/<slug>/index.<lang>.md` for each language
2. Place any static resources (images, diagrams) in the same page bundle directory
3. Commit and push to the configured repo
4. Verify the GitHub Actions build succeeds

Publishing script: `scripts/publish.sh`

## Configuration

The skill reads site config from the Hugo repo. Key settings the user may customize:

| Setting | Default | Notes |
|---------|---------|-------|
| Repo | `Station2141` | GitHub repo name |
| Languages | `en`, `zh`, `ja` | Hugo `[languages]` keys |
| Main language | `en` | `defaultContentLanguage` in hugo.toml |
| Branch | `main` | Push target |

## Scripts

### `scripts/publish.sh`

Automates the git commit/push cycle for a new post. See the script for usage.

### `scripts/check-build.sh`

Polls GitHub Actions to verify the deployment succeeded after pushing.

## References

### `references/article-template.md`

A sample article structure showing the expected section layout and front matter format. Read this when generating the first article for a new site.

## Notes

- Always preview in the main language before translating
- The user may request edits at any stage — apply and re-preview
- If the user provides a GitHub username to add as collaborator, use the GitHub API
- Keep articles around 1200–1500 words (main language) for a ~5 min read
- Use Hugo page bundles (`index.<lang>.md`) not flat files
