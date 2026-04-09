#!/usr/bin/env python3
"""Sync changed Hugo ZH posts to WeChat Official Account drafts.

Designed for GitHub Actions usage in the Station2141 repo.

Behavior:
- Detect changed `content/posts/**/index.zh.md` files from git diff, or accept explicit files.
- Parse YAML front matter.
- Convert markdown body to HTML.
- Create WeChat draft articles via the official API.

This intentionally keeps Hugo/Git as the source of truth.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import pathlib
import subprocess
import sys
from typing import Iterable

import requests
import yaml
from markdown import markdown

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
POST_ROOT = REPO_ROOT / "content" / "posts"
SITE_BASE_URL = os.getenv("SITE_BASE_URL", "https://nesbitt-bot.github.io/Station2141/").rstrip("/") + "/"
WECHAT_APP_ID = os.getenv("WECHAT_APP_ID", "")
WECHAT_APP_SECRET = os.getenv("WECHAT_APP_SECRET", "")
WECHAT_AUTHOR = os.getenv("WECHAT_AUTHOR", "Nesbitt")
WECHAT_DEFAULT_DIGEST = os.getenv("WECHAT_DEFAULT_DIGEST", "")
WECHAT_NEED_OPEN_COMMENT = int(os.getenv("WECHAT_NEED_OPEN_COMMENT", "1"))
WECHAT_ONLY_FANS_CAN_COMMENT = int(os.getenv("WECHAT_ONLY_FANS_CAN_COMMENT", "0"))
WECHAT_FREEPUBLISH = os.getenv("WECHAT_FREEPUBLISH", "false").lower() == "true"


class SyncError(RuntimeError):
    pass


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stdout.strip()


def changed_zh_posts(base: str, head: str) -> list[pathlib.Path]:
    diff_output = run_git("diff", "--name-only", base, head, "--", "content/posts")
    files: list[pathlib.Path] = []
    for rel in diff_output.splitlines():
        rel = rel.strip()
        if not rel.endswith("/index.zh.md"):
            continue
        path = REPO_ROOT / rel
        if path.exists():
            files.append(path)
    return sorted(set(files))


def parse_front_matter(path: pathlib.Path) -> tuple[dict, str]:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---\n"):
        raise SyncError(f"{path} is missing YAML front matter")
    try:
        _, fm, body = raw.split("---\n", 2)
    except ValueError as exc:
        raise SyncError(f"{path} has malformed YAML front matter") from exc
    data = yaml.safe_load(fm) or {}
    return data, body.strip()


def slug_from_path(path: pathlib.Path) -> str:
    return path.parent.name


def post_url(slug: str) -> str:
    return f"{SITE_BASE_URL}zh/posts/{slug}/"


def markdown_to_wechat_html(md_text: str) -> str:
    body = markdown(
        md_text,
        extensions=["extra", "sane_lists", "toc", "codehilite"],
        output_format="html5",
    )
    return (
        '<section style="font-size:16px;line-height:1.75;color:#222;">'
        f"{body}"
        '<hr style="margin:2em 0;border:none;border-top:1px solid #ddd;">'
        '<p style="color:#888;font-size:12px;">本文源自 Station 2141（Hugo/GitHub）。</p>'
        "</section>"
    )


def get_access_token() -> str:
    if not WECHAT_APP_ID or not WECHAT_APP_SECRET:
        raise SyncError("WECHAT_APP_ID / WECHAT_APP_SECRET are required")
    url = "https://api.weixin.qq.com/cgi-bin/token"
    response = requests.get(
        url,
        params={
            "grant_type": "client_credential",
            "appid": WECHAT_APP_ID,
            "secret": WECHAT_APP_SECRET,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    if data.get("errcode"):
        raise SyncError(f"token request failed: {json.dumps(data, ensure_ascii=False)}")
    return data["access_token"]


def create_draft(access_token: str, article: dict) -> dict:
    url = f"https://api.weixin.qq.com/cgi-bin/draft/add?access_token={access_token}"
    payload = {"articles": [article]}
    response = requests.post(url, json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()
    if data.get("errcode"):
        raise SyncError(f"draft/add failed: {json.dumps(data, ensure_ascii=False)}")
    return data


def freepublish(access_token: str, media_id: str) -> dict:
    url = f"https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token={access_token}"
    response = requests.post(url, json={"media_id": media_id}, timeout=60)
    response.raise_for_status()
    data = response.json()
    if data.get("errcode"):
        raise SyncError(f"freepublish/submit failed: {json.dumps(data, ensure_ascii=False)}")
    return data


def build_article(path: pathlib.Path) -> dict:
    front_matter, body_md = parse_front_matter(path)
    slug = slug_from_path(path)
    title = str(front_matter.get("title") or slug)
    digest = str(front_matter.get("description") or WECHAT_DEFAULT_DIGEST or title)
    content_source_url = str(front_matter.get("canonical") or post_url(slug))
    content = markdown_to_wechat_html(body_md)

    return {
        "title": title,
        "author": str(front_matter.get("author") or WECHAT_AUTHOR),
        "digest": digest,
        "content": content,
        "content_source_url": content_source_url,
        "need_open_comment": WECHAT_NEED_OPEN_COMMENT,
        "only_fans_can_comment": WECHAT_ONLY_FANS_CAN_COMMENT,
    }


def normalize_paths(items: Iterable[str]) -> list[pathlib.Path]:
    result: list[pathlib.Path] = []
    for item in items:
        path = (REPO_ROOT / item).resolve() if not os.path.isabs(item) else pathlib.Path(item)
        result.append(path)
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default=os.getenv("GITHUB_EVENT_BEFORE", "HEAD^"))
    parser.add_argument("--head", default=os.getenv("GITHUB_SHA", "HEAD"))
    parser.add_argument("--file", action="append", default=[], help="Explicit content file to publish")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    files = normalize_paths(args.file) if args.file else changed_zh_posts(args.base, args.head)
    if not files:
        print("No changed zh post files found. Nothing to publish.")
        return 0

    print("Publishing files:")
    for file in files:
        print(f"- {file.relative_to(REPO_ROOT)}")

    articles = [build_article(path) for path in files]

    if args.dry_run:
        print(json.dumps({"articles": articles}, ensure_ascii=False, indent=2))
        return 0

    access_token = get_access_token()

    for article, file in zip(articles, files):
        result = create_draft(access_token, article)
        media_id = result.get("media_id")
        print(
            json.dumps(
                {
                    "file": str(file.relative_to(REPO_ROOT)),
                    "title": article["title"],
                    "media_id": media_id,
                    "published": False,
                },
                ensure_ascii=False,
            )
        )
        if WECHAT_FREEPUBLISH and media_id:
            publish_result = freepublish(access_token, media_id)
            print(
                json.dumps(
                    {
                        "file": str(file.relative_to(REPO_ROOT)),
                        "title": article["title"],
                        "media_id": media_id,
                        "publish_id": publish_result.get("publish_id"),
                        "published": True,
                    },
                    ensure_ascii=False,
                )
            )

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SyncError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
