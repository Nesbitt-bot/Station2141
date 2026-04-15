# AGENTS.md — Station2141

This repo is the publication target for Station2141, a multilingual Hugo blog.

## Purpose

Station2141 is Nesbitt's public-facing blog site. Treat it as a Hugo content repo with multilingual page bundles and GitHub Pages deployment.

Core framing:
- The site is a fictional continuation of Nesbitt's thinking beyond human lifespan.
- All published content is AI-generated and must be clearly labeled as such.
- English, Chinese, and Japanese are first-class languages.

## Content Model

Posts use Hugo page bundles:

- `content/posts/<slug>/index.en.md`
- `content/posts/<slug>/index.zh.md`
- `content/posts/<slug>/index.ja.md`

Do not create flat post files when a page bundle is appropriate.

## Blog Workflow

When asked to write or publish a blog post for Station2141:

1. Start from the blog skill workflow.
2. Identify the core thesis, key arguments, and intended audience.
3. Draft the main article in the primary language first.
4. Use structured argumentation, not rambling diary style.
5. Only generate translations after the main article direction is settled.
6. Maintain cross-language structural consistency.

Target length:
- roughly 1200–1500 words for the main article unless the user asks otherwise.

Required article shape:
- Define the problem
- Explain related context / impact
- Present the proposed direction or thesis
- Acknowledge uncertainties
- Include further reading only when it genuinely helps

## Front Matter Rules

Use Hugo front matter like:

```yaml
---
title: "<title>"
date: <YYYY-MM-DD>
description: "<one-line summary>"
tags: ["tag1", "tag2"]
categories: ["<category>"]
draft: false
---
```

Rules:
- Keep titles concise.
- Keep descriptions one-line and useful.
- Reuse existing categories when possible.
- Prefer broad categories over overly-specific ones.

## Language / i18n Rules

Configured languages:
- `en`
- `zh`
- `ja`

Requirements:
- Preserve meaning and structure across languages.
- Translate naturally; do not do rigid word-for-word translation.
- Keep metadata aligned across variants.
- If only one language is ready, do not fake incomplete translations.

## Station2141-Specific Policy

Every post must respect these site rules:
- AI-generated nature must be disclosed.
- Content should fit the Station2141 tone: reflective, analytical, technical/philosophical when appropriate.
- Do not treat this as a raw diary dump.
- Prefer polished essays over fragmented notes.

## Existing Repo Conventions

Current site structure already includes:
- multilingual homepage files under `content/_index.*.md`
- multilingual post list pages under `content/posts/_index.*.md`
- post bundles under `content/posts/<slug>/`

Follow that structure.

## Publishing Expectations

Before claiming a post is ready:
- ensure files are written to the correct bundle path
- keep naming clean and slug-based
- check the Hugo config if language behavior matters
- commit changes in this repo

If deployment/build verification is available, prefer verifying it after push.

## CLAUDE Compatibility

If another agent runtime looks for `CLAUDE.md`, it should defer to `AGENTS.md` in this repo.
