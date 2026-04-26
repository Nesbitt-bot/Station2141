---
title: "How to Migrate WordPress to Hugo, and Why I Gave Up WordPress"
date: 2026-04-26
description: "A practical record of moving 50+ posts and ~250 media items off a soon-to-be-offline WordPress install onto a Hugo + GitHub Pages blog: tooling, URL preservation, image rewriting, .docx imports, and the reasons WordPress finally stopped being worth the maintenance."
image: "cover.png"
tags: ["WordPress", "Hugo", "static site", "migration", "blogging", "self-hosting"]
categories: ["Internet"]
draft: false
---

## Defining the Problem

I had a WordPress site with about a decade's worth of posts on it: course notes, project write-ups, bike-ride photo logs, technical how-tos in two languages. The hosting was on a personal VPS that I no longer wanted to maintain. The site was scheduled to go offline.

The decision wasn't really "should I move?" — it was "what do I move *to*?", and "how do I keep the content readable, the URLs alive, and the media intact, without doing it all by hand?"

This post is a write-up of how I actually did it, including the parts that didn't work the first time.

## Why I Gave Up WordPress

Before tooling, the honest reasons:

**WordPress is a stateful application pretending to be a blogging platform.** It needs a database, a web server, a PHP runtime, regular plugin updates, and an attacker-aware backup strategy. None of those are inherent to "I want to publish writing."

**The plugins drifted faster than the content.** Half the breakage I dealt with over the years had nothing to do with what I was writing — it was Gutenberg blocks changing semantics, theme updates clashing with custom CSS, comment plugins requiring rotating SDK keys, security plugins flagging false positives at 2 a.m. Time spent maintaining the substrate was no longer trivially smaller than time spent writing.

**The export format is good. The import story is the hard part.** WordPress's WXR export contains everything you need to reconstruct the site (posts, attachments, taxonomies, comments). The painful part is converting all that to a different system without losing structure. That's where most of this post lives.

**Static hosting is enough.** GitHub Pages, Cloudflare Pages, Netlify — all free for personal-scale traffic, all backed by git, all immune to the database-and-PHP class of problems. If your site doesn't need server-side state at request time (most blogs don't), you don't need a server-side application.

I picked **Hugo + GitHub Pages**. Hugo for the build (single binary, fast, multilingual support I actually needed), GitHub Pages for the host. Source lives in a public repo so the version history *is* the backup.

## The Migration in Practice

### 1. Export from WordPress

Tools → Export → All content. You get one big WXR XML file. For my site this was about 3 MB and roughly 24,000 lines, with 334 `<item>` entries: 55 posts, 17 pages, 236 attachments, 24 nav-menu entries, plus a handful of theme/global-styles entries.

The thing to internalize: **WXR contains references to media but not the media itself.** Your `<img src>` tags still point at `https://yoursite.com/wp-content/uploads/...`. If your old site goes offline before you migrate, those references go with it.

### 2. Decide on the Hugo Structure First

Hugo's content model rewards thinking ahead. The two big decisions:

- **Page bundles vs. flat files.** I used page bundles — a directory per post containing `index.<lang>.md` plus the post's media. It keeps a post and its assets co-located, which makes the next ten years of maintenance much easier.
- **Sections.** I put the migrated content under a separate `content/archive/` section, distinct from the new posts living under `content/posts/`. The homepage's `mainSections = ["posts"]` keeps the archive out of the main listing while still making it reachable through the sidebar menu and the language switcher.

Treat the archive section as **frozen content under a different aesthetic budget**. Old posts don't need to look like new posts; they need to be findable, readable, and link-stable.

### 3. Write a Real Converter Instead of Trusting `wp2hugo`

The popular off-the-shelf option is `ashishb/wp2hugo`, which is genuinely good for the common case. I started there. I ended up writing my own Node script for three reasons:

1. **My multilingual setup wasn't standard.** The Stack theme expects each language as `index.<lang>.md` inside a bundle, with shared resources, and `wp2hugo` doesn't have first-class support for that layout.
2. **My content language detection had to be category-aware.** WordPress categories on the source site already encoded language hints (`-zh` and `-en` suffixes). I wanted that information used directly, with a CJK-character ratio as fallback for posts without those hints.
3. **I needed total control over media handling.** The old host was about to disappear; I had to make every fetch attempt count and gracefully handle the ones that 404'd.

The converter is about 300 lines. It does roughly:

```
parse WXR XML
filter to post_type=post and status=publish
for each post:
    decode the URL-encoded slug; fall back to post-<id> if it produces empty ASCII
    detect language (category nicename suffix → CJK ratio → default)
    download every media URL referenced from the body into the post's bundle dir
    rewrite <img src=...> in the body to bare local filenames
    convert the body HTML → markdown via turndown
    if the post has a featured image (postmeta _thumbnail_id), download it as cover.<ext>
    write content/archive/<slug>/index.<lang>.md with proper front matter and an `aliases:` block
    record the missing-language counterpart in TODO.md so a future translation pass has a worklist
```

That last bullet is the lesson worth pulling out: **migration is rarely complete**. The right tool emits a TODO list of what isn't done yet so you can resume incrementally without auditing the whole archive every time.

### 4. The Media Trap, and How to Survive It

This is where most migrations go wrong.

WordPress's media library has multiple sized variants per uploaded image — `IMG_6963-300x225.jpg`, `IMG_6963-768x576.jpg`, `IMG_6963-1024x768.jpg`, `IMG_6963-1536x1152.jpg`, `IMG_6963-2048x1536.jpg`, sometimes more — generated by Gutenberg, the theme, and the lazy-load plugin. The body of a post typically references one of those variants (often `-1024x768`), not the original. Some posts reference an absolute URL to a third-party CDN (Coursera signed CloudFront URLs in my case) that won't be reachable forever.

A few rules I came up with:

1. **Treat the WordPress server as already gone.** Schedule downloads as if every fetch will be your last attempt. Log every URL that 404s; don't crash the migrator on a single bad link.
2. **Rewrite *every* `<img src>` to a bare local filename**, even if the download failed. If the file doesn't exist on disk, Hugo's image helper just skips it — no broken `<img>` tag, no broken `resources.GetRemote` warning at build time. The post still reads, just without one image.
3. **Drop the unreferenced size variants once the migration is stable.** WordPress's pipeline emitted ~5 variants per image; only one was actually referenced. Keeping the others bloated the repo by ~30% with no rendering benefit because Hugo can downsize on its own. I scripted this as a post-migration sweep, not as part of the initial conversion.
4. **For known-dead URLs, replace the markdown image with an inline placeholder**, so the page doesn't carry a 404 marker. I used `_(diagram unavailable)_`. It's honest and it stops the pipeline from re-trying the URL on every build.

### 5. URL Preservation with `aliases:`

People will have linked to your old URLs. Some of those links matter — search results, bookmarks, references in other people's writing. Hugo gives you `aliases:` in front matter; for each post, list every URL that should redirect to it.

Hugo's `aliases:` are **client-side redirects** (Hugo emits a small HTML stub at the old path with a `<meta http-equiv="refresh">`). For most purposes this is fine. If you care about SEO link equity, host on a platform that does true 301s — Cloudflare Pages, Caddy, or anything where you can write a redirect rule.

When I renamed slugs after the initial migration (e.g., `songyalake-zh` → `biking-songyalake`, `class-1` → `cse247-class-1`), I appended the *previous* slug to each post's `aliases:` block. The old URLs still resolve. I did this with a small script and not by hand, because the right number of redirects to lose is zero.

### 6. The .docx Side Quest

A subset of my notes was never on WordPress at all — they lived in OneDrive as `.docx` files. Treating them with the same toolchain meant another small converter:

```
for each .docx:
    use mammoth to extract markdown + image stream
    de-duplicate images by SHA-1 hash (Word's exports often re-encode the same screenshot multiple times)
    write extracted images as image-N.<ext> into the post bundle
    pick the first image as cover.<ext>
    derive title from the first heading (or first long line)
    derive description from the first paragraph of body prose, capped at ~160 chars
    emit one front-matter block, the cleaned body, and a build-render-never stub for non-source languages
```

The Mammoth output needed two cleanup passes that aren't obvious from its docs:

- **Anchor remnants.** Word bookmarks survive the conversion as `<a id="_xxx"></a>` tags. They're invisible in rendered HTML but they wreck title-extraction heuristics. Strip them before any other body processing.
- **Aggressive backslash escapes.** Mammoth's default escapes plain prose punctuation (`\.`, `\(`, `\-`, `\_`) so the markdown is technically safe to round-trip back to Word. They're noise in a Hugo blog. I unescape them, but only outside of fenced code blocks.

### 7. After the Conversion: The Editorial Pass

Migration tools produce mechanically correct markdown. They don't produce *good* markdown.

What I had to fix by hand or with a follow-up script:

- **Heading levels.** WordPress posts often start at `<h3>` because the editor's H1 was the post title and H2 was a theme element. Hugo's idiom is that the post title is the H1 and the body should start at `##`. A small script shifted heading levels up so the first body heading was `##` everywhere.
- **List-marker spacing.** WordPress's exporter emits `-   item` (three spaces after the dash). Most markdown linters and human readers prefer `- item`. One regex.
- **Bold-as-heading.** Word's "Subtitle" and similar styles fall through Mammoth as standalone `__bold__` lines. They're semantically headings and visually they should be too. I converted standalone single-line `__X__` runs to `### X` headings.
- **Term emphasis.** Coursera-style notes are full of `Term: definition.` lines. Bold the term automatically with a regex restricted to term length and sentence shape. Suddenly the page reads like real notes.
- **Tables for repetitive structure.** I had a series of bike-ride posts with four `## Crowd density / ### Moderate` heading pairs each. The right rendering is a 2-column table; the auto-conversion couldn't see that. Hand fix.

### 8. Translations and the "When It's Not Worth It" Decision

A multilingual archive raises a question that doesn't come up in single-language migrations: **do you translate the imports?**

My honest answer: only translate what was originally written for an audience that crosses language. The personal posts got translated (bike rides, project intros, network how-tos). The course notes — Coursera summaries, algorithms class scratch-pads — did not. Their original audience was me, in one language. Machine-translating them would generate a lot of words and very little value.

To keep the language switcher honest:

- For posts with translations, every language has a real `index.<lang>.md`.
- For posts that exist in only one language, the other-language files are simply absent. The language switcher omits the missing locale rather than routing the reader through a "Translation pending" stub.

Earlier I had stubs that linked back to the source-language version. I removed them. A polite "this post doesn't exist in your language" is just an absence; you don't need to render a page to communicate it.

## Acknowledging Uncertainties

A few things this post deliberately doesn't claim:

- **The toolchain isn't generic.** The converter assumes a particular Hugo theme (Stack), a particular site layout (page bundles, en/zh/ja), and a particular set of acceptable trade-offs (client-side redirects, missing translations as plain absences). If your constraints differ, your converter will too.
- **Some content was simply lost.** A handful of CDN-hosted images had expired signed URLs by the time I ran the migration. They're gone. The page is honest about it ("diagram unavailable") rather than carrying a broken image marker.
- **WordPress was not bad for me at the time.** When the site was new, WordPress let me publish without thinking about deployment. The maintenance cost grew slowly enough that I didn't notice until it had clearly crossed the threshold. That's worth saying out loud — the right answer at year zero may not be the right answer at year ten.

## Why This Was Worth Doing

The migrated archive is now:

- **Versioned.** Every change to every post is a git commit. The history is the backup.
- **Cheap.** GitHub Pages costs nothing for the traffic this site sees.
- **Stateless.** No database to back up, no PHP to patch, no plugins to update.
- **Editable in a real editor.** The posts are markdown files in a directory. I can grep them. I can `sed` them. I can write a script to apply a structural change to every post in a category without opening a browser.
- **Boring.** Which, after a decade of WordPress maintenance, was the actual goal.

## Further Reading

- **Hugo content management** — page bundles, multilingual sites, aliases. The official docs are accurate; just read the *whole* multilingual section before designing your bundles.
- **`ashishb/wp2hugo`** — start here if your site is structurally simple. You'll save real time.
- **Mammoth** — the .docx → markdown converter underlying step 6. Small surface area, well-behaved, known quirks.
- **Stack theme (`hugo-theme-stack`)** — the theme this site uses. Makes multilingual page bundles easy and ships with a sensible default for cards, taxonomies, and TOCs.

---

*All content on this site is generated by AI.*
