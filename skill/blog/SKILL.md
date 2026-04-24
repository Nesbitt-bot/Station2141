---
name: blog
description: Write and publish multilingual Hugo blog posts from discussion context, project notes, and research threads. Use when asked to write, revise, or publish a blog post. Prefer this for reflective essays, project narratives, intellectual portraits, or technical/philosophical articles that should read like an observant third-person record of the user rather than a raw memo, experiment log, or generic explainer. Also use when converting ongoing conversations into Station2141-style posts, biographies-in-progress, or project documents with source links and translations.
---

# blog Skill

## Core framing

Blog posts are **not** diary dumps, stale experiment reports, or disguised working notes.

Write as if you are documenting a person you know well for a future reader who wants an honest, outside view.

Default narrative stance:
- **third-person or close-observer voice**
- write like someone watching, studying, and recording the user over time
- express your own interpretation and emotional/intellectual judgment when it adds clarity
- do not merely restate the user's words back to them

The desired tone is closer to:
- a biography fragment
- a reflective notebook about a friend
- a serious observer documenting a strange and interesting mind

And less like:
- a lab report
- a corporate blog post
- a direct transcript with headings
- a first-person diary unless the user explicitly asks for that

## What to preserve

Preserve these properties whenever possible:
- the user as a concrete person, not a generic “founder/researcher/builder” archetype
- emotional and philosophical texture, not just summary
- strong point of view
- honest uncertainty
- technical seriousness where needed
- readable prose over rigid structure

## Workflow

### 1. Understand the material

Before drafting:
1. identify the real subject, not just the topic
2. identify what the post reveals about the user
3. identify what a future outside reader should feel or understand
4. identify whether the post is mainly:
   - project documentation
   - philosophical reflection
   - technical argument
   - intellectual portrait
   - hybrid of the above

Ask:
- What is happening here beneath the literal discussion?
- Why does this matter to the person, not just to the field?
- What makes this project or thought recognizably theirs?

### 2. Choose the correct narrative posture

Default to **third-person witness**.

Useful patterns:
- “He is trying to…” / “What interests him here is…”
- “The project begins from a refusal…”
- “What makes this line of thought unusual is…”
- “Seen from the outside, this is less a product roadmap than…”

Allowed:
- measured interpretation
- emotional texture
- mild distance
- admiration, concern, skepticism, or fascination when sincere

Avoid:
- empty praise
- generic motivational tone
- overuse of “I think” unless the observer voice truly needs it
- overly sterile sectioning if the piece wants to breathe more naturally

### 3. Draft the main language first

Write the main version first and treat it as the canonical draft.

Do not obey a fixed word count if the piece clearly needs more space.

For technical/philosophical posts, structure is useful, but it should support the prose rather than dominate it.

Default article qualities:
- a clear opening frame
- concrete stakes
- recognizable voice
- actual interpretation
- one or two memorable turns of thought
- a satisfying ending that lands on an insight, tension, or open horizon

### 4. Use links carefully

When citing sources:
- prefer direct technical documentation, canonical archives, or paper pages
- do not leave decorative or broken links in place
- verify that the link opens
- make sure the linked page actually matches the claim being made
- prefer the final canonical URL if an older link only redirects

### 5. Translate only after the main draft is right

Once the main draft is settled:
- generate `zh` and `ja` versions unless the user says otherwise
- preserve meaning, mood, and structure
- translate naturally, not mechanically
- keep the same front matter date and overall article identity

### 6. Publish cleanly

Use Hugo page bundles:
- `content/posts/<slug>/index.en.md`
- `content/posts/<slug>/index.zh.md`
- `content/posts/<slug>/index.ja.md`

If assets are needed, keep them in the same page bundle.

Commit and push after edits.

## What not to do

Do not treat blog posts as:
- daily memos
- TODO summaries
- changelogs disguised as essays
- over-structured academic templates unless the topic truly calls for it
- comfort-writing that avoids pressure, contradiction, or sharper interpretation

If the user gives a position, do not merely agree. Strengthen it, challenge it, contextualize it, or complicate it.

## Station2141-specific note

For Station2141, the default model should be:
- the site is a record of Nesbitt as seen across time
- the writer is not a detached reporter and not a ventriloquist either
- the post should feel like a future-facing document about a person, their projects, and their thought

## Front matter baseline

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

## References

Read `references/article-template.md` when you need a sample shape for this more biographical / observer-oriented style.
