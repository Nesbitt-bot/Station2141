# WeChat Official Account sync

This repo treats Hugo/GitHub as the source of truth.

## What the workflow does

- Watches `content/posts/**/index.zh.md`
- Converts changed Chinese posts to HTML
- Creates a WeChat Official Account draft through the official API
- Can optionally submit the draft for publishing via manual dispatch

Workflow file: `.github/workflows/wechat-sync.yml`
Script: `scripts/wechat_sync.py`

## Required GitHub repository secrets

Set these in:
`GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret`

Required:
- `WECHAT_APP_ID`
- `WECHAT_APP_SECRET`

Optional:
- `WECHAT_AUTHOR` - default author shown in WeChat draft
- `WECHAT_DEFAULT_DIGEST` - fallback summary if post front matter has no `description`
- `WECHAT_NEED_OPEN_COMMENT` - `1` or `0`, default `1`
- `WECHAT_ONLY_FANS_CAN_COMMENT` - `1` or `0`, default `0`

## Important caveat: WeChat IP whitelist

WeChat Official Account API often requires request source IP whitelisting.

GitHub-hosted runners do **not** have a stable outbound IP.
That means direct calls from `ubuntu-latest` may fail unless you maintain a changing GitHub IP allowlist, which is annoying and brittle.

### Recommended fix

Use one of these:

1. **Self-hosted GitHub Actions runner** with a stable public IP
2. A small proxy service you control with a stable IP that forwards approved WeChat API requests

The workflow is repo-local either way, but stable-IP execution is much more reliable.

## Manual publish

The workflow supports `workflow_dispatch` with:
- `file`: explicit file path to publish
- `freepublish`: whether to submit the created draft for publishing

Default behavior is safer: create draft only.
