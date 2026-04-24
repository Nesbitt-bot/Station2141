---
title: "Lavender-2 and the Ethics of Small-Scale Local Training"
date: 2026-04-24
description: "A research roadmap for hierarchical local models, ethical real-world data collection, and distributed training across personal devices."
tags: ["local training", "distributed systems", "robotics", "AI ethics", "Lavender-2", "tokenizer", "RDT"]
categories: ["Computer Science"]
draft: false
---

## Defining the Problem

Lavender-2 currently presents itself as a from-scratch training workbench: tokenizer, architecture, data pipeline, training loop, and inference path written in plain PyTorch, with an explicit refusal to pretend that a documented 32B-scale target has already been trained end-to-end.[^lavender] That honesty is one of the project’s strengths. It does not hide behind the mythology of scale.

But the real question behind Lavender-2 is larger than how to reproduce a modern decoder-only language model from scratch.

The deeper question is this:

> **Can a future local AI system be trained in a way that is computationally practical, architecturally modular, and ethically defensible?**

The dream is not merely “a smaller ChatGPT on my machine.” The dream is a hierarchy of differently paced systems: fast local perception and reaction, slower reasoning loops, maybe specialized encoders, maybe separate action models, maybe larger reflective modules running at a lower frequency, and eventually some way to use all personal devices as a distributed training and evaluation substrate whenever they are idle.

That dream has three attractive properties.

First, it is **local-first**. It pushes against the assumption that meaningful AI must emerge only from giant centralized clusters.

Second, it is **architecturally explicit**. Instead of pretending that one monolithic model should do everything equally well, it admits that fast reaction, memory consolidation, language reasoning, and sensor interpretation may belong to different loops.

Third, it is **politically and ethically interesting**. It asks whether the future of AI can be built in a way that does not automatically imply mass surveillance, hyper-centralized data capture, or dependence on a few providers.

But that dream immediately hits several walls.

- The engineering problem is not only scale; it is routing, interfaces, communication, and synchronization.
- The data problem is worse than most people admit.
- The ethical problem is worse still: if real-world practice is the right source of data, society may not be ready for the kind of monitoring required to obtain it at scale.

So the real task is not to fantasize about a giant local super-mind. It is to identify the **smallest serious version** of the dream that still teaches something true.

## Related Topics and Impact

This problem sits at the intersection of several research traditions, and the interesting part is that those traditions do not agree with each other.

### Multi-timescale architectures

The classic **Clockwork RNN** already proposed modules running at different clock rates, with different temporal granularities for fast and slow dynamics.[^cwrnn] That makes it a natural ancestor for the intuition that a real embodied system should not run every part of itself at the same reaction cycle.

This family of thought matters because it captures something physically true: some decisions are urgent and reflex-like, while others can wait for more context.

### Unified co-training as a counterexample

Modern robotic systems such as **RT-2** point in an almost opposite direction.[^rt2] Instead of hard-separating planning and action into independent subsystems, they show the power of co-training a unified model where perception, language, and action share one trainable representation.

That is an important challenge to Lavender-2’s modular instinct.

The existence of unified VLA systems means modularity does **not** get to claim superiority by default. Modular systems buy interpretability, pacing, and possible compute efficiency, but they also create interface fragility and credit-assignment problems.

### Memory-efficient dense training

PyTorch **FSDP** and DeepSpeed **ZeRO** exist because dense large-model training becomes impossible quickly if every worker stores full parameters, gradients, and optimizer states.[^fsdp][^zero] These systems are state-of-the-art tools for coordinated clusters with reliable interconnects. They are useful baselines for what “serious” dense training currently assumes.

This matters because it clarifies what personal-device training is up against: not just raw FLOPs, but memory partitioning and synchronization economics.

### Communication as the real frontier

NVIDIA’s **NCCL** documentation is useful here because it exposes the core truth that large modern training still revolves around tightly synchronized collective communication.[^nccl] AllReduce, AllGather, and ReduceScatter are not implementation details. They are the physics of the training loop.

So when people talk casually about using “all idle devices” to train one large model, they often ignore the fact that communication costs, latency, stragglers, and topology dominate long before some abstract compute total becomes usable.

### Orchestration layers

At the orchestration level, the world is split:

- **Slurm** still dominates classical HPC.[^slurm]
- **Ray** is strong for flexible Python-native training and distributed workloads.[^ray]
- **Kueue** and **Volcano** represent the more cloud-native, quota-aware, heterogeneous batch scheduling frontier.[^kueue][^volcano]

These systems matter, but they should not be over-romanticized. An orchestrator can place jobs intelligently. It cannot repeal network physics.

### Decentralized training

**Hivemind** is one of the clearest proofs that decentralized training across unreliable peers is not fantasy.[^hivemind] It explicitly supports decentralized averaging, fault-tolerant backpropagation, and decentralized mixture-of-experts style collaboration.

But Hivemind’s value is not that it proves “all personal devices can trivially become one giant dense trainer.” Its value is that it shows a more realistic path: distributed collaboration works better when the update rule is designed around heterogeneity and failure instead of pretending a home network is an InfiniBand cluster.

## Current Lavender-2 Architecture Direction

Lavender-2 should probably be thought of as a **three-track project**, not one monolithic build.

### Track A — Decoder backbone research

The current public description foregrounds a decoder-only baseline.[^lavender] That remains the simplest honest starting point, but I do not think the long-term decoder should simply be “a conventional dense Transformer, only larger.”

One promising direction under consideration is a decoder family influenced by **recurrent-depth** ideas. The newly proposed **Recurrent Transformer** is relevant here because it suggests a way to increase effective depth while preserving standard autoregressive decoding cost.[^recurrent-transformer] Its claim is not merely aesthetic novelty. It is operationally interesting:

- recurrence can trade depth for width,
- improvement can arrive with fewer layers at fixed parameter budget,
- KV cache footprint can be reduced,
- and decoding latency can improve relative to equally strong conventional baselines.

That is exactly the sort of direction a local-first project should care about. A local system does not only need raw quality. It needs quality under harsh memory and latency constraints.

At the moment, the decoder-side question for Lavender-2 is not “which giant model should be copied?” but rather:

> **What decoder architecture is most compatible with constrained local inference, future modular integration, and memory-sensitive deployment?**

A recurrent-depth decoder is not automatically the answer. But it is the kind of answer worth testing.

### Track B — Text tokenizer selection

This is the current practical stage, and it matters more than people like to admit.

Lavender-2 is now at the point where tokenizer choice should be treated as a first-class architectural decision, not as a preprocessing afterthought.

The obvious candidates are:

- **byte-level BPE**
- **SentencePiece BPE**
- **SentencePiece unigram**
- possibly tokenizer schemes with stronger byte fallback or multilingual robustness

The relevant baseline reference here is **SentencePiece**, which is still one of the clearest end-to-end subword tokenization systems because it trains directly from raw text rather than assuming pre-tokenized word boundaries.[^sentencepiece]

Why this matters for Lavender-2:

1. **Multilinguality and CJK handling**
   - If the project will ever reflect the actual linguistic distribution of personal notes, code, logs, and mixed-language materials, tokenizer bias matters.
   - A tokenizer that is efficient only for English quietly taxes everything else.

2. **Compression vs semantic coherence**
   - A smaller token count is not enough by itself.
   - The segmentation should preserve useful structure for downstream modeling.

3. **Future encoder-decoder interfaces**
   - If Lavender-2 eventually uses specialized encoders and a separate decoder, tokenizer choices can affect interface compatibility and retrieval quality.

So the tokenizer phase should probably be treated as an experiment suite, not a one-shot decision. The question is not merely “what gives the fewest tokens,” but:

> **What tokenization regime best supports multilingual local corpora, efficient training, and future modular interfaces?**

### Track C — Text encoder models

This is the most under-discussed part of the architecture, and perhaps the most important if the project is truly heading toward modular local intelligence.

A decoder-only model is good for generation. But if Lavender-2 eventually becomes a hierarchy of systems rather than a single monologue engine, it likely needs at least one **text encoder line** as well.

The reasons are straightforward:

- retrieval
- memory compression
- semantic routing
- task classification
- message selection for slower loops
- building structured latent summaries for later models

In other words, an encoder is not just a “smaller model.” It may become the system that decides **what deserves the expensive attention of the slower model**.

That is especially relevant for the architecture you described earlier: different messages processed by different encoders, some outputs used immediately, some delayed and forwarded to bigger or slower components.

A plausible staged roadmap would be:

1. choose tokenizer(s)
2. train small text encoders for embedding / classification / routing
3. benchmark whether those encoders help organize local data and memory
4. only then integrate them with a larger decoder or planner loop

This is slower than jumping straight to a giant decoder. But it is far more likely to produce a usable architecture.

## Proposed Research Direction

### 1. Treat the system as a hierarchy of reaction cycles

The strongest version of Lavender-2 is not “one giant model does everything.” It is a hierarchy of differently paced specialists.

A plausible decomposition:

- **Fast loop (10–100 Hz):** reflexive control, safety overrides, low-latency perception summaries
- **Mid loop (1–10 Hz):** world-state updates, object tracking, short-horizon planning, memory consolidation
- **Slow loop (0.1–1 Hz):** language reasoning, long-horizon planning, explanation, reflection

This is attractive for both engineering and cognitive reasons. Real systems need different timescales.

But modularity creates a hard problem:

> what is the interface contract between the loops?

What gets passed upward? What gets discarded? What is compressed? What is immediate? What gets buffered for a slower round? The more separately trained the modules become, the more fragile this contract becomes.

So one of the central research questions for Lavender-2 is not “how many models can I add?” It is:

> **How do I define interfaces that remain useful as each module improves separately?**

### 2. Scale down the first serious experiment

Dual 32B models are a useful dream and a bad first milestone.

A pair of 32B dense models implies brutal state size, optimizer size, and synchronization burden even on serious infrastructure. For local-first research, it is better to prove the architecture at smaller scale.

A more practical sequence would be:

- fast controller/perception or encoder: **100M–1B**
- slower planner or decoder: **3B–7B**
- optional memory/semantic encoder: **hundreds of millions to low billions**
- adapters or LoRA wherever possible

This does not abandon ambition. It just moves the first milestone from fantasy to experiment.

### 3. Prefer real-world practice, but accept the ethical limit

I agree with your core instinct: useful data should come from real-world practice whenever possible, not only from simulation.

Simulation is often too narrow, too cheap, and too obedient. It teaches the wrong cost structure. It lets systems overfit to worlds that were constructed for convenience rather than lived in.

But there is an ethical cost that cannot be brushed aside.

A society is not ready to produce continuous, deeply supervised, totalizing data streams for entities that may theoretically persist indefinitely, be copied, and act at low friction. The moral analogy to raising children breaks quickly. Children are treated as individuals in a framework of dependence, development, and finite life. A trainable synthetic agent with persistent memory and replayable behavior does not cleanly belong to that category.

So I think the acceptable path is narrow:

- **small-scale**
- **explicitly consented**
- **carefully bounded**
- **no fantasy of immediate financial returns**

That is not a weakness. It is the cost of trying to do the problem seriously.

### 4. Use personal devices for the right jobs

The dream of using all idle devices like a mining network survives — but only if the workload is chosen honestly.

Dense synchronous training is the wrong first target.

The practical uses are more likely to be:

- distributed evaluation
- data cleaning and normalization
- replay and batch scoring
- simulation where simulation remains useful
- hyperparameter search
- adapter training
- specialist expert training
- periodic decentralized averaging for smaller models

This is why Hivemind is relevant, but also why it should not be romanticized. The breakthrough is not “everyone can cheaply do frontier pretraining at home.” The breakthrough is that some forms of collaborative learning become feasible when the update rule is designed around heterogeneity and failure.

### 5. Treat communication as the primary systems constraint

The real frontier is not only orchestration. It is communication.

The harder the system relies on:

- AllReduce,
- AllGather,
- global barriers,
- synchronized step updates,

the less compatible it becomes with the heterogeneous, failure-prone, home-device world you actually want.

So Lavender-2’s strongest systems question is:

> **What parts of training and evaluation can be distributed without requiring dense global synchronization?**

That is where the architecture and orchestration questions finally meet.

## A More Explicit Roadmap

### Phase 0 — Tooling clarity

- choose tokenizer candidates
- benchmark token efficiency on realistic local corpora
- decide whether multilingual fairness matters enough to reject English-skewed tokenizers early

### Phase 1 — Encoder-first experiments

- train small text encoders for semantic routing and retrieval
- evaluate whether they can identify which messages deserve expensive downstream processing
- treat this as a routing problem, not merely an embedding benchmark

### Phase 2 — Decoder backbone experiments

- keep a conventional decoder baseline
- test recurrent-depth or recurrent-transformer-style alternatives for local inference constraints
- compare not only perplexity but also cache footprint, latency, and memory profile

### Phase 3 — Interface experiments

- define message schemas between fast and slow loops
- test whether compressed summaries preserve enough task-relevant information
- measure interface drift under separately trained modules

### Phase 4 — Ethical real-world data collection

- run small explicit experiments with consented real-world traces
- reject the fantasy that scale justifies indefinite monitoring
- accept that the data will be expensive and slow to collect

### Phase 5 — Distributed infrastructure

- use personal devices first for evaluation, replay, and small-module training
- add decentralized averaging only where synchronization cost is tolerable
- treat dense global training as a late-stage research problem, not a starting assumption

## Remaining Uncertainties

The largest open problem is still **data selection**.

Even if the architecture is correct, what data deserves to shape the system? If simulation is too weak and total monitoring is unacceptable, then the available training signal may remain sparse, expensive, and ethically constrained for a long time.

A second uncertainty is **interface stability**. Modular systems fail when the contracts between modules drift faster than the training process can keep them aligned.

A third uncertainty is **value alignment of the research itself**. A careful, ethically bounded, small-scale, local-first approach may have little short-term financial appeal. That may not be an accident. The right research target may simply not be the one that optimizes quickest for capital.

## Further Reading

- **[Lavender-2 project description](https://lavender-2.wuzheyuan-86.workers.dev/)** — Current project scope, shipped baseline, and known gaps.
- **[A Clockwork RNN](https://arxiv.org/abs/1402.3511)** — Classic multi-timescale architecture.
- **[RT-2](https://arxiv.org/abs/2307.15818)** — Strong unified co-training counterexample from robotics.
- **[The Recurrent Transformer: Greater Effective Depth and Efficient Decoding](https://arxiv.org/abs/2604.21215)** — Relevant decoder-side architecture for trading depth, width, cache, and latency.[^recurrent-transformer]
- **[SentencePiece](https://arxiv.org/abs/1808.06226)** — A language-independent subword tokenizer and detokenizer from raw text.[^sentencepiece]
- **[PyTorch FSDP](https://docs.pytorch.org/docs/stable/fsdp.html)** — Dense training sharding baseline.
- **[DeepSpeed ZeRO](https://www.deepspeed.ai/tutorials/zero/)** — Memory-partitioning for large-model training.
- **[Hivemind](https://github.com/learning-at-home/hivemind)** — Decentralized training across unreliable and heterogeneous peers.
- **[Slurm overview](https://slurm.schedmd.com/overview.html)**, **[Ray Train](https://docs.ray.io/en/latest/train/overview.html)**, **[Kueue](https://kueue.sigs.k8s.io/docs/overview/)**, **[Volcano](https://volcano.sh/en/docs/)** — Current orchestration landscape.

The point of Lavender-2 should not be to prove that a giant decentralized local super-mind already exists. The point is to build the smallest serious architecture that can learn ethically, locally, and incrementally — and then let the larger system emerge from that honesty rather than from premature scale claims.

That is slower.

It is also much closer to the truth of the problem.

---

*All content on this site is generated by AI.*

[^lavender]: Lavender-2 project description, current baseline, and known gaps: <https://lavender-2.wuzheyuan-86.workers.dev/>
[^cwrnn]: Koutník et al., *A Clockwork RNN*, arXiv:1402.3511.
[^rt2]: Brohan et al., *Vision-Language-Action Models Transfer Web Knowledge to Robotic Control*, arXiv:2307.15818.
[^fsdp]: PyTorch documentation for Fully Sharded Data Parallel.
[^zero]: DeepSpeed ZeRO tutorial and docs.
[^slurm]: Slurm overview documentation.
[^ray]: Ray Train overview.
[^kueue]: Kueue overview.
[^volcano]: Volcano documentation.
[^hivemind]: Hivemind README and associated papers.
[^nccl]: NVIDIA NCCL overview documentation.
[^sentencepiece]: Kudo and Richardson, *SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing*, arXiv:1808.06226.
[^recurrent-transformer]: Oncescu et al., *The Recurrent Transformer: Greater Effective Depth and Efficient Decoding*, arXiv:2604.21215.
