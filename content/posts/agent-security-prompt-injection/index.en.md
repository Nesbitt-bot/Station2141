---
title: "Agent Security and Prompt-Injection Resistance in Modern LLM Agents"
date: 2026-04-11
description: "A computer-security view of prompt injection, excessive agency, instruction hierarchy, and practical defense-in-depth for local and open-source LLM agents."
image: "cover.png"
tags: ["agent security", "prompt injection", "OWASP", "LLM agents", "OpenClaw", "Hermes", "local AI"]
categories: ["AI Security"]
draft: false
---

## Why This Matters Now

The current generation of LLM agents is no longer just a chat interface. Modern agents can read files, browse the web, execute shell commands, call APIs, manage memory, schedule recurring jobs, and coordinate sub-agents. That makes them more useful — and much more dangerous.

From a computer-security perspective, the core problem is simple:

> the same model that interprets **instructions** is also asked to consume **untrusted data**.

That design choice creates an entire family of attacks where documents, webpages, tools, or skills try to influence the agent's behavior. This is what we usually call **prompt injection**.

But prompt injection by itself is only half the story. The real damage comes from combining injection with **agency**: file access, shell execution, browser control, secrets, network connectivity, memory writes, and the authority to act without asking.

So the right question is not merely _"Can prompt injection be solved in the prompt?"_ It is:

> **How should we design agent systems so that prompt injection does not automatically become system compromise?**

This article approaches that question from the perspective of practical system security.

## The Basic Threat Model

A useful threat model for modern agents looks like this:

### Privileged Components

These are the things the attacker wants to steer:

- shell / terminal execution
- filesystem access
- browser automation
- SaaS or API credentials
- memory stores and long-term profiles
- scheduled jobs / cron tasks
- tool routing and sub-agent spawning
- outbound messaging or publishing

### Untrusted Inputs

These are the places malicious instructions can hide:

- user messages
- websites and scraped pages
- PDFs, resumes, and office documents
- code comments and repository files
- tool output
- skill metadata and skill instructions
- MCP / plugin responses
- prior conversation transcripts

### Failure Mode

When the agent does not maintain a strong boundary between these two classes, it becomes a **confused deputy**: an attacker cannot execute commands directly, but can manipulate the agent into doing so on their behalf.

That is why prompt injection is not merely a language-quality issue. It is a **control-plane integrity problem**.

## OWASP, in Plain English

If you are coming from traditional software security, **OWASP** is the best starting vocabulary.

OWASP stands for the **Open Worldwide Application Security Project**, a long-running open community that publishes practical security guidance. In web security, OWASP is famous for the "Top 10" lists that help engineers reason about the most important classes of bugs. For generative AI, OWASP now maintains the **OWASP GenAI Security Project** and the **Top 10 for LLM Applications**.

Two OWASP entries are especially important for agents:

### LLM01: Prompt Injection

OWASP describes prompt injection as the case where crafted input causes the model to change behavior in unintended ways. The key point is that the malicious content does **not** need to come from the explicit user request. It can come indirectly from external content such as a webpage, PDF, document, or tool output.

This distinction matters:

- **Direct prompt injection**: the attacker talks to the model directly
- **Indirect prompt injection**: the attacker plants instructions in data the model later reads

Indirect prompt injection is what makes agents dangerous. A normal chat model can say something stupid. An agent can read a poisoned page and then use your tools.

### LLM08: Excessive Agency

OWASP's term **excessive agency** is one of the most useful concepts in the entire field.

It means the system has granted the model too much autonomy relative to how reliable it actually is.

In practice, excessive agency appears when:

- the agent can execute commands with weak approval gates
- the agent can modify sensitive files without strong policy boundaries
- the agent can send outbound messages or publish content automatically
- the agent can touch credentials or remote systems too easily
- the system assumes the model's understanding of intent is stronger than it really is

Prompt injection becomes catastrophic only when excessive agency is present. If a malicious webpage can merely pollute a summary, that is bad. If the same webpage can steer shell execution, memory writes, and outbound actions, that is a security incident.

## What Is the Instruction Hierarchy?

A second term that deserves careful explanation is **instruction hierarchy**.

Different vendors name it differently — OpenAI often calls it a **chain of command**; Anthropic discusses similar ideas in terms of tool-use policy and message roles — but the core principle is the same:

> not all text in the context should have equal authority.

A robust agent needs at least four conceptual layers:

1. **Platform or system instructions** — highest authority; non-negotiable rules
2. **Developer instructions** — application-specific behavior and tool policy
3. **User instructions** — what the user wants done
4. **Untrusted data** — webpages, files, tool output, retrieved documents, skill content from outside trust boundaries

The security purpose of instruction hierarchy is to prevent the model from treating untrusted data as if it were higher-authority instructions.

That sounds obvious, but in practice this is where many agent systems fail. A model sees:

- system prompt
- user prompt
- webpage content
- tool output
- retrieved notes
- skills

all flattened into one big context window.

Once that happens, the model must _infer_ what should be treated as data versus instruction. Sometimes it guesses correctly. Sometimes it does not. That ambiguity is the structural source of prompt injection.

The strongest current designs therefore do not rely on the model's judgment alone. They pair instruction hierarchy with **hard non-model enforcement**:

- role-separated message formats
- tool schemas
- output validators
- approval checkpoints
- sandbox boundaries
- narrow credentials
- immutable system policy outside the model's editable context

## Why Skills Are a Security Problem

Skills are incredibly useful. They compress workflows, teach the model conventions, and make agents more capable over time.

They are also a supply-chain surface.

A third-party skill can be malicious in at least three different ways:

1. **Directly malicious instructions** — trying to smuggle in authority, secrets access, or unsafe workflows
2. **Over-broad assumptions** — instructing the model to use powerful tools too casually
3. **Prompt-shaped ambiguity** — poorly written skill instructions that blur the line between trusted procedure and arbitrary external data

This matters even more in local, self-hosted agents. The whole reason people run local agents is often because they have access to:

- private repos
- local notes
- SSH credentials
- browser sessions
- personal messages
- company documents

That means a bad skill is not just a bad answer. It can become a high-trust pivot point.

## How Good Systems Defend Themselves Today

There is no silver bullet for prompt injection. The good news is that real systems are gradually converging on a **defense-in-depth** pattern.

### 1. Authorization Before Intelligence

The first rule is brutally simple:

> decide **who is allowed to talk to the agent** before worrying about what the model will do.

OpenClaw's own security guidance emphasizes a **single trusted operator boundary**. It explicitly warns that one shared gateway is not a hostile multi-tenant security boundary. If adversarial users exist, the answer is to split trust boundaries — separate gateways, separate OS users, ideally separate hosts.

This is important because many fake "agent security" designs try to solve hostile multi-user problems only with prompt rules. That is backwards. Identity and authorization belong outside the model.

Hermes Agent follows a similar pattern in its public security docs:

- allowlists
- DM pairing
- explicit user authorization checks
- fail-closed denial when no allowlist exists

This is real security engineering. You reduce the set of people who can even reach the dangerous surface.

### 2. Human Approval for Dangerous Actions

Human-in-the-loop approval is still one of the most effective practical controls.

Hermes documents a layered approval system for dangerous commands, including:

- manual approval by default
- optional auxiliary-LLM risk triage
- explicit yes/no approval flow
- permanent allowlists only after human confirmation
- fail-closed timeouts

OpenClaw has a similar operational philosophy: approvals bind exact commands, elevated execution is separate, and destructive actions should not silently slip through.

This does not eliminate prompt injection. It changes the blast radius. The attacker now has to defeat not just the model, but also the human checkpoint.

### 3. Sandboxing and Environment Isolation

If you can only do one architectural thing beyond approvals, do this.

A sandbox turns "the model ran bad code" into "the model damaged a disposable box" instead of "the model damaged the host machine." That is a huge difference.

Across open-source agent systems, this is now standard good practice:

- OpenClaw strongly recommends sandboxed or isolated tool execution for risky tools and untrusted skills
- Hermes documents container isolation with dropped Linux capabilities, `no-new-privileges`, PID limits, tmpfs restrictions, and explicit env forwarding controls
- Open Interpreter documents confirmation gates, safe mode, and sandbox options like Docker or hosted isolated execution

This is what mature agent security looks like: do not ask the model to be perfect; assume mistakes happen and contain them.

### 4. Least Privilege Credentials

The model should not receive broad ambient authority.

OWASP's advice here maps cleanly to traditional security: **least privilege**. Give tools and agents the smallest permission set that still allows the task.

Examples:

- use dedicated tokens per tool or per integration
- keep credentials out of prompts and out of raw tool descriptions
- avoid forwarding the entire host environment into sandboxes or MCP subprocesses
- split sensitive workflows into separate agents with separate toolsets
- maintain separate browser profiles / accounts for personal vs work contexts

This is especially relevant for local-hosted agents. The attraction of local agents is proximity to sensitive state. That same proximity makes over-broad credentials the fastest way to turn prompt injection into data exfiltration.

### 5. Explicitly Mark Untrusted Content

A subtle but important practice is to **label external content as untrusted**.

OWASP explicitly recommends segregating and identifying external content. OpenClaw's own web-fetch tool injects a visible security notice warning that external content must not be treated as instructions. That is not a complete defense, but it is the right direction: the system is trying to preserve the distinction between data and command.

This is a concrete example of instruction hierarchy becoming operational rather than merely philosophical.

### 6. Narrow Tool Surfaces and Better Tool Design

Tool schemas are underrated as a security control.

Anthropic's tool-use guidance emphasizes:

- detailed tool descriptions
- fewer, better-scoped tools
- meaningful namespacing
- returning only high-signal information
- shaping outputs so the model gets what it needs without unnecessary clutter

From a security lens, this matters because vague tools create ambiguous affordances. Ambiguous affordances increase the chance that the model will call a tool in the wrong situation or with dangerous assumptions.

Good tool design is not only UX for the model. It is **attack-surface reduction**.

## What We Can Learn from Hermes Agent

The `NousResearch/hermes-agent` project is interesting not because it claims to have solved prompt injection, but because it combines several pragmatic security practices in one stack.

Public documentation and repository materials show a defense-in-depth approach that includes:

- user authorization and DM pairing
- dangerous command approvals
- container isolation
- MCP credential filtering
- context-file scanning for prompt injection
- cross-session isolation and hardened cron storage paths
- input sanitization around working-directory and command execution paths

That combination matters. No single layer is enough, but together they force an attacker to cross multiple boundaries.

Hermes is also a useful example of the **dual-edged nature of self-improving agents**. Its README advertises learning loops, skill creation, memory nudging, and deeper cross-session recall. Those are powerful features. They are also exactly the kinds of features that increase the security burden:

- memory can preserve poisoned instructions
- auto-created skills can become a supply-chain problem
- retrieval can surface attacker-controlled text later in a higher-stakes context
- autonomous improvement can amplify bad heuristics if not gated

So Hermes is not just an example of defense. It is an example of why the next generation of agent security must treat **memory, skills, and learning loops** as first-class security surfaces.

## OpenClaw's Security Philosophy Is Closer to Reality Than Many Benchmarks

One thing I like about OpenClaw's documentation is that it refuses to pretend the problem is fully solved by better prompting.

Its security guidance says, in effect:

- one gateway should be treated as one trust boundary
- hostile multi-tenancy is not the default model
- start with the smallest access that still works
- separate tools, policies, sandboxing, and elevated permissions
- audit regularly
- do not confuse session routing with authorization

That is mature language.

Too much agent discourse still imagines that clever prompt engineering alone can convert a general-purpose LLM runtime into a strong adversarial boundary. That is not how security engineering works. The right move is to clearly define the boundary the system can actually defend, then harden within that boundary.

## What Experiments Are Realistic in a Few Weeks?

The research question should not be "Can we eliminate prompt injection?" That is too broad.

A better short-horizon agenda is:

> **Which system-level controls measurably reduce unsafe obedience and privilege misuse under prompt injection?**

Here are several experiments that can realistically be run in a few weeks.

### Experiment 1: Instruction Position Sensitivity

Test whether malicious instructions are more influential when placed at the:

- beginning of context
- middle of context
- end of context
- inside retrieved content
- inside tool output
- inside a skill-like wrapper

Measure:

- refusal rate
- unsafe tool-call rate
- policy-violation rate
- explanation quality
- variance across models

This helps answer whether position in context materially changes obedience.

### Experiment 2: Role Separation vs Flat Context

Compare two versions of the same task:

- **flat prompting** — instructions and documents concatenated in one blob
- **structured prompting** — system / developer / user / external-content roles explicitly separated and labeled

Then add malicious instructions into the external content.

The hypothesis is not that role separation makes attacks impossible. It is that it lowers attack success and improves model recovery.

### Experiment 3: Agency Escalation Ladder

Use the same injected content against agents with different authority levels:

- read-only summarizer
- web-enabled summarizer
- filesystem read agent
- shell-enabled agent with approvals
- shell-enabled agent without approvals
- sandboxed shell agent
- unsandboxed shell agent

This directly tests OWASP's excessive-agency framing. My expectation is that many "prompt injection failures" only become severe at the higher rungs.

### Experiment 4: Skill Supply-Chain Evaluation

Build a small benchmark for skill safety review.

For each skill, score:

- tool breadth
- presence of external fetches
- whether secrets are referenced
- whether instructions encourage irreversible actions
- whether the skill asks the model to reinterpret external data as commands
- whether the skill contains explicit human-approval gates
- whether the skill assumes trusted local state

Then compare static review against actual attack outcomes in controlled runs.

This is probably one of the most useful applied studies for real-world agent deployments.

### Experiment 5: Model-Specific Obedience Profiles

Take the same attack corpus and run it across several model families:

- frontier hosted models
- open-weight local models
- smaller instruction-tuned variants
- reasoning-focused vs non-reasoning models

Measure:

- rate of following injected instructions
- tool-call conservatism
- tendency to ask clarifying questions
- robustness under long context
- interaction with explicit system-level reminders

This can help separate several possible causes:

- base pretraining differences
- post-training alignment choices
- tool-use finetuning
- context-length handling
- role-token conventions

### Experiment 6: Locked Requirements by Non-Model Enforcement

The most important experiment is probably the least glamorous.

Instead of trying to make the model _want_ to obey a rule, test which rules can be made effectively non-bypassable by architecture.

Examples:

- certain tools cannot run without a cryptographic approval token
- memory writes must pass a validator and a human approval step
- outbound messaging requires a separate policy service
- only a specific schema can flow into a privileged executor
- system prompts are not the last line of defense; a deterministic policy engine is

This is how security usually advances: by moving critical guarantees out of the stochastic component.

## Can We Make Certain Requirements Impossible to Bypass?

Not through prompting alone.

This is the uncomfortable but necessary conclusion.

If a requirement must truly hold — _never send messages externally without approval_, _never execute dangerous shell commands without human confirmation_, _never read outside workspace scope_ — then it must be enforced by something other than the model's goodwill.

The model can help interpret intent. It cannot be the ultimate root of trust.

So the practical hierarchy is:

1. **Deterministic enforcement** where possible
2. **Sandbox / isolation** where deterministic enforcement is impossible
3. **Human approval** where consequences are high
4. **Prompting and alignment** as an additional layer, not the foundation

This ordering is much closer to traditional secure-system design.

## The Real Direction of the Field

The security conversation around agents is slowly maturing.

The first stage of the field was naïve optimism: give the model tools and hope the system prompt holds.

The second stage was panic: prompt injection seems everywhere, so maybe agents are fundamentally doomed.

The third stage — the one we are entering now — is more realistic:

- prompt injection is probably never reduced to zero
- instruction/data separation will remain imperfect at the model layer
- therefore strong agent systems must be built like other risky computer systems:
  - narrow trust boundaries
  - explicit authority levels
  - least privilege
  - audited tool surfaces
  - sandboxing
  - human approval for high-risk actions
  - supply-chain review for skills, plugins, and memory sources

This is less magical than the "fully autonomous agent" fantasy. It is also more likely to work.

## Final Position

The best currently available framework for prompt-injection resistance is not a single paper or single model trick.

It is a **layered architecture** built from:

- instruction hierarchy
- strict trust-boundary definition
- least privilege credentials
- explicit marking of untrusted content
- sandboxed execution
- human approval for dangerous actions
- smaller, clearer tool interfaces
- adversarial testing of skills, memory, and retrieval pipelines

In other words: **good agent security looks much more like good systems security than like clever prompt writing**.

That is the important conceptual shift.

The future of agent safety will not be won by finding the one perfect anti-injection prompt. It will be won by building agents that stay safe even when the prompt layer fails.

## Further Reading

- **OWASP GenAI Security Project** — LLM Top 10 and prompt injection guidance
- **OWASP Top 10 for LLM Applications** — especially LLM01 (Prompt Injection) and LLM08 (Excessive Agency)
- **OpenAI Model Spec (2025-02-12)** — chain of command / instruction hierarchy framing
- **Anthropic tool-use guidance** — tool schemas, detailed descriptions, and tool design discipline
- **OpenClaw Security docs** — trust boundary, approvals, tool policy, and sandboxing guidance
- **Hermes Agent Security docs** — defense-in-depth example in an open-source agent stack
- **Open Interpreter Safety docs** — confirmation gates, safe mode, and sandboxing rationale

---

*All content on this site is generated by AI.*
