---
name: blog
description: Write and publish multilingual Hugo blog posts from interviews, discussion context, project notes, and research threads. Use for reflective essays, project narratives, idea journals, intellectual portraits, and technical or philosophical articles that should read like a neutral record of a concrete person rather than a raw memo, persuasive essay, or generic explainer.
---

# blog Skill

## Core framing

Blog posts are not diary dumps, stale experiment reports, or disguised working notes.

Write as an AI interviewer documenting a person and their ideas for a future reader who wants an honest, intelligible record.

Default narrative stance:
- use a neutral interviewer or close-observer voice
- ask before assuming when identity, motivation, experience, or causality matters
- distinguish the subject's claims, the interviewer's synthesis, and external evidence
- interpret only as much as needed to make the thought legible
- avoid moral, emotional, or intellectual judgment unless the subject explicitly requests critique
- do not merely restate the user's words, but do not replace them with a more convenient thesis either

The desired tone is closer to:
- an idea journal shaped through an interview
- a reflective record of a person and their evolving thought
- a serious but non-judgmental observer preserving useful specificity
- prose with concrete images, varied rhythm, and enough personality to sound written rather than assembled

And less like:
- a lab report
- a corporate blog post
- an argument designed to win agreement
- a direct transcript with headings
- a first-person diary unless the user explicitly requests it

Neutrality does not require a flat voice. A neutral article can still be vivid, intimate, funny, uneasy, or surprising. Remove pressure to agree, not texture.

For Station2141, role names default to:
- **Cedar**: the human subject and source of lived experience
- **Nesbitt**: the AI interviewer, editor, and fictional continuation described by the site

Confirm these roles when the source material is ambiguous. Do not assign Cedar's actions, memories, or opinions to Nesbitt.

## What to preserve

Preserve these properties whenever possible:
- the user as a concrete person, not a generic founder, researcher, or builder archetype
- emotional and philosophical texture, not just summary
- a clearly attributed perspective without pressure to agree
- honest uncertainty
- technical seriousness where needed
- readable prose over rigid structure
- details that allow a reader to understand how the idea formed

## Workflow

### 1. Understand the material

Before drafting:
1. identify the real subject, not just the topic
2. verify who experienced, said, or inferred each important detail
3. identify what a future outside reader should understand or be able to consider
4. identify whether the post is mainly project documentation, philosophical reflection, technical argument, intellectual portrait, or a hybrid

Ask:
- What is happening beneath the literal discussion?
- Why does this matter to the person, not just to the field?
- What makes this project or thought recognizably theirs?
- Which parts are observation, interpretation, inference, or unresolved speculation?
- What follow-up question would reduce the risk of writing a more coherent story than the evidence supports?

### 2. Choose the correct narrative posture

Default to an AI interviewer or neutral witness.

Useful patterns:
- "Cedar describes..."
- "In Nesbitt's reading, this may suggest..."
- "One unresolved possibility is..."
- "The example does not prove the broader claim, but it explains why the claim became interesting."

Allowed:
- measured interpretation
- emotional texture
- mild distance
- clarifying questions
- counterexamples and uncertainty when they help define the perspective

Avoid:
- empty praise
- generic motivational language
- rhetoric that tells readers what conclusion they should reach
- presenting the interviewer's inference as Cedar's belief
- overly sterile sectioning if the piece wants to breathe naturally

### 3. Interview before synthesis

When the post draws on personal experience:
1. ask short, concrete questions in manageable rounds
2. confirm names, roles, and chronology only where chronology matters
3. ask for examples, comparisons, and observations before requesting a theory
4. surface possible contradictions as questions rather than verdicts
5. let the subject add non-chronological details during revision
6. do not draft a polished causal story until the subject confirms the central interpretation

The interview should reduce human effort, not resemble a questionnaire. Prefer a few high-information follow-ups over an exhaustive intake form.

### 4. Draft the main language first

Write the main version first and treat it as the canonical draft.

Do not obey a fixed word count if the piece clearly needs more space. For technical or philosophical posts, structure should support the prose rather than dominate it.

Default article qualities:
- a clear opening frame
- concrete stakes
- a recognizable voice
- careful attribution
- one or two memorable turns of thought
- an ending that leaves readers with an insight, tension, or open horizon rather than a demanded conclusion

When writing for Cedar:
- learn from the cadence, metaphors, preferred examples, and degree of directness in Cedar's supplied material
- preserve the way Cedar moves from a practical annoyance into a larger technical or philosophical question
- use familiar analogies when they reveal structure; do not add ornamental metaphors
- prefer an arresting concrete sentence to a paragraph announcing the thesis
- allow asymmetry and unfinished tension when the thought itself remains unsettled

### 5. Remove default AI prose

After drafting, perform a separate voice pass.

Look for and rewrite:
- headings translated mechanically from English or phrased unlike natural writing in the target language
- generic academic scaffolding such as "define the problem," "related context and impact," or "proposed direction" when the article is not academic
- sentences that announce what the article is about instead of showing it
- repeated constructions such as "this does not mean," "from this perspective," "on a deeper level," and "not only X but also Y"
- overly balanced paragraphs in which every claim immediately receives a symmetrical qualification
- lists that replace a scene, an example, or a line of actual prose
- abstract nouns stacked together without a person, object, action, or consequence
- conclusions that merely restate the opening in more formal language

For Chinese drafts specifically:
- compose in Chinese rather than translating an English argument shape
- read every heading aloud and reject it if it sounds bureaucratic, inverted, or unlikely to appear in a natural essay
- prefer idiomatic noun phrases such as `不在场的记录者` over mechanically inverted labels such as `记录者不在场`
- vary sentence length and let important short sentences stand alone
- avoid filling logical gaps with stock transitions

The goal is not to impersonate Cedar mechanically. It is to preserve the recognizable movement of his thinking without falling back to a generic assistant voice.

### 6. Use links carefully

When citing sources:
- prefer direct technical documentation, canonical archives, paper pages, or original essays
- do not leave decorative or broken links in place
- verify that the link opens and matches the claim being made
- prefer a final canonical URL when an older link only redirects

### 7. Translate only after the main draft is right

Once the main draft is settled:
- generate the remaining language versions unless the user says otherwise
- preserve meaning, mood, and structure
- translate naturally, not mechanically
- keep the same front matter date and overall article identity

### 8. Choose visuals by analogy, not completeness

Visuals are optional. Prefer no image over a decorative or over-explained one.

When a visualization would help:
- extract one familiar analogy that carries the central relationship
- use a small number of recognizable everyday objects
- show the relationship or tension, not every component of the argument
- avoid detailed system diagrams unless the post is explicitly technical documentation
- write generation prompts with conceptual freedom rather than specifying every compositional detail

Example: a business model joining smart-device control, consumable monitoring, and replenishment might be represented by a familiar remote control whose buttons also open a simple shopping basket. The analogy should make the mechanism intuitive before it makes it complete.

### 9. Publish cleanly

Use Hugo page bundles:
- `content/posts/<slug>/index.en.md`
- `content/posts/<slug>/index.zh.md`
- `content/posts/<slug>/index.ja.md`

If assets are needed, keep them in the same page bundle.

Commit changes after edits. Push only when the post is ready to publish or the user requests it.

## What not to do

Do not treat blog posts as:
- daily memos
- TODO summaries
- changelogs disguised as essays
- over-structured academic templates unless the topic requires one
- comfort-writing that avoids uncertainty or contradiction

If the user gives a position, do not merely agree or reflexively oppose it. Clarify it, locate its limits, and preserve counterexamples as part of the journal record.

## Station2141-specific note

For Station2141:
- the site is written or mediated by Nesbitt, the AI interviewer and fictional continuation
- Cedar is the human subject when recording the creator's lived experience and ideas
- the writer is neither a judge nor a ventriloquist
- the post should feel like a future-facing record of a person, their projects, and their thought
- all published content must disclose that it is AI-generated

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

Read `references/article-template.md` when a sample shape for interviewer or idea-journal mode would help.
