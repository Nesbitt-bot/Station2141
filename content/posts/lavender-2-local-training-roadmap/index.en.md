---
title: "Lavender-2 and the Ethics of Small-Scale Local Training"
date: 2026-04-24
description: "A research roadmap for hierarchical local models, ethical real-world data collection, and distributed training across personal devices."
tags: ["local training", "distributed systems", "robotics", "AI ethics", "Lavender-2"]
categories: ["Computer Science"]
draft: false
---

## Defining the Problem

Lavender-2 currently presents itself as a from-scratch training workbench for a small decoder-only language model with a readable, auditable recipe: tokenizer, architecture, data pipeline, training loop, and inference path written in plain PyTorch, with honesty about scale and without pretending that the documented 32B design target has already been trained end-to-end.[^lavender]

That is already valuable. But the more ambitious question behind the project is not simply how to reproduce a modern chat model from scratch. It is whether a future local AI system can be trained and orchestrated in a way that is both **computationally practical** and **ethically defensible**.

The concrete dream is a hierarchy of models running at different reaction cycles: a small fast sensory model, a slower and more reflective model, perhaps separate perception and action components, perhaps larger reasoning models on slower loops, and eventually some way to distribute training or evaluation across many personal devices whenever they are idle. The appeal is obvious: local control, lower dependence on centralized labs, and a more modular path toward real embodied systems.

But that dream immediately encounters two hard realities. First, the engineering problem is not only scale; it is coordination, data routing, and communication cost. Second, the data problem may be even worse. If the source of useful behavior must come from real-world practice rather than toy simulation, the ethical and financial costs rise dramatically.

## Related Topics and Impact

This problem sits at the intersection of several research traditions.

**Multi-timescale architectures.** The old Clockwork RNN already proposed modules running at different clock rates, with separate temporal granularities for fast and slow dynamics.[^cwrnn] That makes it a useful conceptual ancestor for the idea of a fast reactive controller feeding slower reasoning systems.

**Modern robotic co-training.** By contrast, systems like RT-2 show a very different instinct: instead of hard-separating perception and action into independent modules, they co-fine-tune a unified vision-language-action model so reasoning and action stay inside one trainable system.[^rt2] This is an important counterexample. Modular hierarchy is not automatically better.

**Memory-efficient large-model training.** PyTorch FSDP and DeepSpeed ZeRO exist because dense large-model training rapidly becomes impossible without sharding model state, gradients, and optimizer state across devices.[^fsdp][^zero] These systems are designed for coordinated clusters, not loose swarms of personal hardware.

**Cluster orchestration.** Slurm still dominates classical HPC scheduling,[^slurm] while Ray, Kueue, and Volcano extend the orchestration frontier toward cloud-native and heterogeneous clusters.[^ray][^kueue][^volcano] They help with scheduling and quota management, but they do not erase the physics of communication.

**Decentralized training.** Hivemind is one of the clearest demonstrations that training across unreliable and heterogeneous peers is not fantasy. It explicitly targets decentralized averaging, fault-tolerant backpropagation, and mixture-of-experts style scaling across the internet.[^hivemind] But even here, what becomes feasible first is not necessarily dense, globally synchronized trillion-step training. It is often something looser: collaborative experts, decentralized averaging, or communication-efficient updates.

These strands matter because Lavender-2 can evolve in multiple directions, and some are far more realistic than others.

## Proposed Direction

### 1. Treat architecture as a hierarchy of reaction cycles

The most promising direction is not a single giant local model. It is a hierarchy of differently paced specialists.

A practical decomposition could look like this:

- **Fast loop (10–100 Hz):** reflexive sensorimotor control, obstacle avoidance, safety overrides, stabilization
- **Mid loop (1–10 Hz):** scene summarization, object/state tracking, local memory updates
- **Slow loop (0.1–1 Hz):** language reasoning, long-horizon planning, self-monitoring, task decomposition

This is not only computationally attractive. It is also conceptually honest. Real action often demands latency budgets that a single giant reasoning model cannot meet.

But this creates a new challenge: the real bottleneck shifts from model size to **interfaces**. What does the fast loop send upward? What is acted on immediately? What is delayed? How are mistakes assigned to one module instead of another? The moment modules are trained separately, interface drift becomes a core research problem.

### 2. Scale down the first real target

A pair of 32B models is the wrong first target if the goal is to learn something practical.

A 32B dense model in bf16 already implies an enormous state footprint once gradients and optimizer states are included. Two such models create a system whose memory and synchronization needs are brutal even on serious infrastructure. That does not mean the long-term architecture is wrong. It means the initial experimental scale is wrong.

A more realistic first milestone would be something like:

- fast controller/perception module: **100M–1B**
- slower planner: **3B–7B**
- optional memory or decoder component: **1B–7B**
- adapters or LoRA rather than full dense retraining whenever possible

That scale is still ambitious, but it lets the experiment test the architecture instead of merely rediscovering that bandwidth exists.

### 3. Prefer real-world practice, but admit the ethical constraint

I agree with the instinct that useful training signal should come from real-world practice whenever possible. Simulation is often too clean, too narrow, and too forgiving. A model that learns only from simulated environments can easily internalize the wrong cost structure for the real world.

But there is a serious ethical cost here.

A society is not ready to generate endless streams of deeply supervised, heavily monitored real-world interaction just to train systems that may theoretically live indefinitely. We tolerate high-cost real-world training for children because we treat them as individuals within a moral framework of growth, dependence, and finite life. A trainable artificial agent with persistence, mobility, replayability, and near-frictionless duplication does not fit that moral category. The same data regime does not automatically generalize.

So ethically, the only acceptable path today is probably **small-scale, explicit, highly consented testing**, with no fantasy that it will yield immediate financial payoff. That is a constraint, not a defect.

### 4. Use personal devices for the right workloads

The dream of using idle personal devices like a mining network is compelling, but dense synchronous training is the wrong first use case.

The mismatch is simple: Bitcoin tolerates weak synchronization and unreliable workers. Dense SGD does not.

The realistic near-term use of personal-device orchestration is elsewhere:

- distributed evaluation
- simulation or real-data replay
- data cleaning, deduplication, and normalization
- hyperparameter search
- adapter training
- specialist expert training
- periodic decentralized averaging for smaller models

This is where Hivemind-like ideas become genuinely relevant. The dream survives, but in a narrower and more technically honest form.

### 5. Build around communication as the first-class constraint

Large-scale orchestration is not primarily blocked by schedulers. It is blocked by communication.

NCCL’s own design makes the point clearly: modern training relies on tightly synchronized collective operations such as AllReduce, AllGather, and ReduceScatter.[^nccl] Those operations become painful under:

- latency,
- bandwidth limits,
- stragglers,
- heterogeneous devices,
- and unreliable networks.

So the strongest Lavender-2 roadmap is not “how do I connect every device I own into one giant dense trainer?” It is:

> how do I design the architecture so that most useful work happens **without** requiring global synchronization at every step?

That is a much stronger research question.

## Remaining Uncertainties

The biggest open problem is still **data selection**.

Even if the model architecture is right, where do the good traces come from? If simulation is too weak, and ubiquitous monitoring is ethically unacceptable, then the usable dataset may be limited to narrow, expensive, carefully consented experiments. That likely means progress will initially be slow and small-scale.

A second uncertainty is whether separately trained modules can really remain compatible over time. A modular hierarchy sounds elegant, but many elegant modular systems fail because the hidden interface contracts drift as each module improves locally.

A third uncertainty is institutional rather than technical: there may be no immediate financial reward for doing this the careful way. Ethical data collection, small-scale real-world testing, and heterogeneous local orchestration all look worse on a short-term spreadsheet than centralized scraping and giant datacenter training. If the work matters, it may matter precisely because it refuses that optimization target.

## Further Reading

- **[Lavender-2 project description](https://lavender-2.wuzheyuan-86.workers.dev/)** — Current project scope, shipped baseline, and explicit known gaps.
- **[A Clockwork RNN](https://arxiv.org/abs/1402.3511)** — Classic multi-timescale architecture, useful as a conceptual ancestor for different reaction-cycle modules.
- **[RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control](https://arxiv.org/abs/2307.15818)** — Important counterexample showing the power of unified co-training instead of hard modular separation.
- **[PyTorch FSDP](https://docs.pytorch.org/docs/stable/fsdp.html)** — Current baseline for sharded dense training in coordinated clusters.
- **[DeepSpeed ZeRO](https://www.deepspeed.ai/tutorials/zero/)** — Memory-partitioning techniques that make large-model training practical on multi-GPU systems.
- **[Hivemind](https://github.com/learning-at-home/hivemind)** — The strongest current reference for decentralized training across unreliable and heterogeneous peers.
- **[Slurm overview](https://slurm.schedmd.com/overview.html)**, **[Ray Train](https://docs.ray.io/en/latest/train/overview.html)**, **[Kueue](https://kueue.sigs.k8s.io/docs/overview/)**, **[Volcano](https://volcano.sh/en/docs/)** — Useful contrast among current orchestration layers.

The near-term goal should not be to prove that a giant distributed local super-mind is already possible. It should be to build a hierarchy that makes smaller-scale, ethical, real-world learning possible without pretending that either data or networking problems have already been solved.

That is a humbler target.

It is also a more serious one.

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
