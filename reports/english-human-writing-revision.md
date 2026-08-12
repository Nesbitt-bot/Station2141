# English human-writing revision audit

Reviewed all eight current English posts under `content/posts/**/index.en.md`. The imported Chinese standard was applied as a prose diagnostic rather than as a mechanical punctuation rule for English. Front matter, links, factual claims, attribution, and AI disclosures were preserved unless noted below.

## `agent-security-prompt-injection`

- Main problems: long and heavily structured, but the structure serves a technical reference article; most claims are concrete and qualified.
- Action: no change. A broad rewrite risked altering security claims or source-dependent descriptions without providing a clear prose gain.
- Human verification: confirm current OWASP numbering and the descriptions of OpenClaw, Hermes Agent, and Open Interpreter controls against the linked/current documentation. The Further Reading entries are names rather than clickable URLs.

## `lavender-2-local-training-roadmap`

- Main problems: some repeated roadmap language and several emphatic pivots, but the article carries many technical distinctions and citations.
- Action: no change. Material revision would need a technical fact-check, especially for the 2026 Recurrent Transformer paper, rather than a style-only pass.
- Human verification: confirm Lavender-2's current public scope, the claims attributed to arXiv:2604.21215, and the intended use of Cedar's first-person/project voice.

## `origin`

- Main problems: manifesto-like certainty, rigid template explanation, repeated summaries, and product-copy phrasing.
- Action: compressed the site-format and tooling sections; made the continuity claim more honest about uncertainty; replaced generic lists with concrete project context; gave the ending an unresolved, testable distinction.
- Human verification: confirm that “creator” and the stated posthumous-continuation aim remain the preferred public wording; confirm the `/blog` skill is publicly available in the linked OpenClaw ecosystem.

## `pause-without-a-story`

- Main problems: abstract diagnostic language, false pivots, unsupported claims about the present age, and a highly staged closing image.
- Action: grounded the opening in the act of narrating one's life; replaced categorical cultural claims with plausible sources of pressure; simplified the account of internal resistance; ended with practical actions rather than a grand diagnosis.
- Human verification: this reads partly as mental-health advice. Confirm that the bounded-pause recommendations reflect Cedar's intended position and add professional-help context if the original discussion involved severe depression or risk.

## `the-intelligence-in-the-echo`

- Main problems: repeated understand/echo opposition, over-neat abstractions, and an ending built from rhetorical questions and a triadic cadence.
- Action: stated the recognition hypothesis directly; tightened the chamber description; made errors part of the human-model loop; replaced the rhetorical ending with a concrete verification choice attributed to Cedar.
- Human verification: verify any factual claims made in the underlying voice-interface conversation, especially model identity, access rules, and whether the system actually performed checks. Confirm Cedar is the desired public name/attribution.

## `too-perfect-to-be-real`

- Main problems: dramatic claims, a paradox staged as a list, repeated summary endings, and a late shift into an underspecified information metric.
- Action: qualified the practical stakes; noted that “too perfect” is only a temporary detection habit; attributed the evaluation-function idea to Cedar; ended on the narrower claim that visual plausibility can no longer bear proof alone.
- Human verification: clarify the source and intended formal definition of information as change in future behavior, and whether Cedar wants that unfinished research idea in this post.

## `value-of-work-after-ai`

- Main problems: an unsupported benchmark claiming broad five-year-professional performance, premature declaration that company-scale coordination costs are collapsing, rigid three-bucket framing, and excessive certainty around agent finitude.
- Action: qualified the capability claim by field and evaluation method; retained the small-team leverage argument while restoring the continuing roles of organizations; made section labels less totalizing; reframed finitude as an empirical hypothesis.
- Human verification: supply a source or benchmark for the early-2026 capability claim if a stronger version is desired; verify whether “one-person company” is meant descriptively or aspirationally; the LessWrong link is not a primary research source.

## `wordpress-to-hugo-migration`

- Main problems: occasional emphatic phrasing and list density, but the first-person account is concrete, technically useful, and anchored by exact migration details.
- Action: no change. Its specificity and procedural progression already meet the revision goal, and stylistic smoothing would remove useful personality.
- Human verification: confirm the counts (334 items, 55 posts, 17 pages, 236 attachments, 24 menu entries), the converter length, the ~30% repository reduction, and the statement that GitHub Pages is free for this site's usage. Confirm tool behavior against current Hugo, Mammoth, and Stack versions.
