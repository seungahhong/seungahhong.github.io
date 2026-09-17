---
layout: post
title: The Transformer Is a General-Purpose Differentiable Computer — Rewatching Karpathy's Lecture in 2026
date: 2026-09-07
published: 2026-09-07
category: Development
tags: ['AI', 'LLM', 'transformer', 'attention', 'nanoGPT']
comments: true
thumbnail: './assets/07/thumbnail.png'
github: ''
---

# 1. What Is This Post About?

Notes from watching Andrej Karpathy's Stanford CS25 guest lecture, [Introduction to Transformers](https://www.youtube.com/watch?v=y2p8Va_zu00). The original talk is from January 2023; what I watched is a [re-upload with Korean/English subtitles](https://www.youtube.com/watch?v=y2p8Va_zu00).

Writing up a three-year-old lecture may look odd. But line up what this blog has been publishing lately and the reason becomes clear.

```markdown
skill governance · how to write specs · harnesses · context engineering
   → all of it is about "how do we wrap the model"
```

Talk about the wrapping long enough and **what's being wrapped** goes blurry. This lecture pulls that thing apart in roughly 300 lines of code.

And the lecture's conclusion has held up for three years. In one line:

> The Transformer isn't a neural net for translation. It's a **general-purpose differentiable computer** — expressive, optimizable, and efficient on hardware.

Why that sentence turned out to be a prediction is what this post is about.

---

# 2. Before 2012 — Every Task Had Its Own Toolkit

The lecture opens with a retrospective: what AI looked like before deep learning.

| Field | The standard of the day | What humans did by hand |
| --- | --- | --- |
| **Computer vision** | Hand-designed features (SIFT, HOG) + a classifier | **People designed the feature extractor** |
| **Speech recognition** | Acoustic model + pronunciation lexicon + language model | Each stage trained as a separate model |
| **NLP** | n-grams, parsing pipelines | Linguistic knowledge encoded as rules |
| **Reinforcement learning** | Task-specific policy representations | People picked the state representation |

The point isn't that performance was low. It's that **almost nothing transferred when you changed fields.** Vision researchers and speech researchers didn't attend the same conferences or read the same code.

AlexNet moved feature extraction into learning in 2012. Then the Transformer merged **the modeling toolkit itself.**

That's why we can talk about "AI engineer" as **a single role** today. In 2012 it was at least four roles.

---

# 3. Attention Came Out of a Bottleneck, Not an Idea

The most entertaining stretch of the lecture is the origin story of attention. Karpathy reads an email he received directly from Dzmitry Bahdanau.

The problem was this. Neural machine translation at the time had the **encoder squeeze an entire sentence into a single fixed-length vector**, and the decoder translated from that.

```markdown
"I finally finished the book I borrowed from the library yesterday"
   → [ one fixed-length vector ]        ← the bottleneck is here
   → "..."
```

Longer sentences collapsed. One vector couldn't hold them.

Bahdanau's intuition wasn't technical. **A human translator keeps glancing back at the source.** So he let the decoder, at each output word, **choose for itself** which part of the source to look at.

Two details make the story worth keeping.

- The first name for it wasn't attention — it was **RNNSearch**, a name closer to retrieval
- **Yoshua Bengio suggested the name "attention."** Once it had a name, the concept spread

Then came [Attention Is All You Need](https://arxiv.org/abs/1706.03762) in 2017. The lecture's observation is that this paper **removed things rather than adding them.** It took out the RNN and kept only attention.

> The auxiliary device built to patch a bottleneck ended up **pushing out the main body.**

What follows is more surprising still. That architecture went **more than five years nearly unchanged.** The one change worth calling significant is moving layer normalization to the front of the block.

---

# 4. Attention Is Message Passing on a Graph

This is the most valuable part of the lecture. It explains attention as a **communication structure** rather than a formula.

Treat tokens as **nodes in a directed graph**. Each node holds a vector, and at every layer it communicates once with its neighbors. That communication is attention.

| What it emits | Meaning | In plain words |
| --- | --- | --- |
| **Query** | what this node is looking for | "what am I curious about right now" |
| **Key** | what this node holds | "what am I information about" |
| **Value** | what this node will pass along | "if you pick me, here's what you get" |

```python
# each node emits three things
q = x @ Wq   # what am I looking for
k = x @ Wk   # what do I have
v = x @ Wv   # what will I communicate

# my query dotted with your key = how much I attend to you
w = softmax(q @ k.T / sqrt(d))
out = w @ v   # information arrives as a weighted average
```

And here's the decisive sentence.

> The weights **depend on the data.** Attention isn't fixed wiring — it's **routing redrawn for every input.**

Convolution has fixed wiring: it always looks at neighboring pixels. Attention lets **the input decide what to look at.** That single difference is the cause of everything that follows.

The view earns its keep one more way: **every architectural variant reduces to "how do you place the edges."**

| Variant | Edge layout |
| --- | --- |
| **Encoder** | every node sees every node |
| **Decoder** | only the past (causal masking) |
| **Cross-attention** | nodes from a different set |
| **ViT** | image patches become the nodes |

---

# 5. nanoGPT — the Architecture Is Smaller Than You Think

From the midpoint the lecture puts [nanoGPT](https://github.com/karpathy/nanoGPT) on screen and reads it line by line. The entire GPT architecture is **about 300 lines.**

| Piece | What it does |
| --- | --- |
| **Token embedding** | token id → vector |
| **Positional embedding** | attention has no notion of order; order is supplied separately |
| **Block × N** | causal self-attention + MLP, each with a residual connection |
| **Layer norm** | sits **in front of** the block (pre-LN) |
| **Final linear layer** | vector → logits over the whole vocabulary |

One block reduces to this shape.

```markdown
x = x + attention(layernorm(x))   ← nodes exchange information (communicate)
x = x + mlp(layernorm(x))         ← each digests what it received (compute)
```

What Karpathy emphasizes is the **residual connection**. Because of the `x + ...` shape, there's a path from input to output made purely of additions. Gradients ride that path straight down during backprop, which is why you can stack the thing very deep and still train it.

The thing to be surprised by isn't the complexity — it's **how small it is.** The bigness in "large language model" lives in **parameters and data**, not in the architecture. The blueprint fits in one file.

---

# 6. Causal Masking — One Line That Buys Training Efficiency

The decoder must not see the future. If the task is predicting the next token, looking at the answer teaches nothing.

The implementation is almost anticlimactically short.

```python
# fill the upper-triangular (future) positions with -inf; softmax then zeroes them
att = att.masked_fill(tril == 0, float('-inf'))
att = softmax(att, dim=-1)
```

The lecture's point isn't "hide the future" — it's the **side effect.**

| | RNN | Transformer + causal masking |
| --- | --- | --- |
| **Sequence processing** | front to back, sequentially | **all positions at once** |
| **Training signal per sequence** | accumulated sequentially | length T gives you **T of them at once** |
| **GPU utilization** | starved by sequential dependence | filled by one big matmul |

Feed in a single sequence of length 1024 and you're solving **1024 problems simultaneously** — predict token 2 from token 1, all the way to predicting token 1024 from the first 1023. One line of masking makes that possible.

Without training efficiency like that, today's scale would never have been reachable.

---

# 7. The Same Block Walks Across Domains

The back half of the lecture is extensions. The list is the argument.

| Model | Domain | What became a token |
| --- | --- | --- |
| **ViT** | images | 16×16 patches |
| **Whisper** | speech | slices of a spectrogram |
| **Decision Transformer** | reinforcement learning | (reward, state, action) sequences |
| **AlphaFold** | proteins | amino acid residues |

The block is unchanged. The only thing that moved is **what counts as a node.**

> When you bring a Transformer to a new field, the thing you design isn't the architecture — it's the **tokenization.**

Set that next to the table from section 2 and the contrast is sharp. What used to be a different toolkit per field became a different **token definition** per field.

---

# 8. GPT-3's In-Context Learning — Learning Without Touching Weights

Covering GPT-3's few-shot ability, the lecture makes a turn.

"Learning" used to mean **changing weights**. But put a few examples in GPT-3's prompt and it does the task **without changing a single weight.**

```markdown
sea otter    → loutre de mer
cheese       → fromage
plush girafe → ???        ← this happens inside a forward pass, not training
```

Karpathy's reading of it is where the lecture reaches furthest.

| | Outer loop | Inner loop |
| --- | --- | --- |
| **What** | pretraining (gradient descent) | the forward pass reading the context |
| **What changes** | weights | activations only |
| **When** | at training time | at inference, every time |

The outer loop **trained the inner loop.** Gradient descent planted a procedure — "look at the patterns and follow them" — inside the weights, and that procedure runs during the forward pass. Karpathy calls this **meta-learning.**

Accept that view and one piece of practice gets reinterpreted. **The context window isn't storage; it's where the program is written.** What this blog keeps saying in [context engineering](/en/posts/2026-07-31-context-engineering-claude5/) and [how to write specs](/en/posts/2026-09-13-writing-specs-for-agents/) — treat prompts like code — has its basis here. It isn't a metaphor. Computation genuinely happens there.

---

# 9. Three Reasons the Transformer Was Going to Win

The lecture's conclusion. The Transformer didn't get lucky; it was a **rare candidate that satisfied three conditions at once.**

| Condition | Meaning | How the Transformer gets it |
| --- | --- | --- |
| **Expressive** | the forward pass can express enough | data-dependent routing + global communication at every layer |
| **Optimizable** | backprop actually trains it | residuals · layer norm · a smooth softmax |
| **Efficient** | it fills the hardware | no sequential dependence, so it reduces to **big matmuls** |

The third gets undervalued most often. An RNN needs the previous step's result before computing the next, so it starves the GPU. The Transformer has no such dependence and saturates the hardware.

> However expressive, it dies if it won't train; however trainable, it loses at scale if it can't fill a GPU. **Hitting all three was rare.**

Which is why the lecture calls the Transformer a **general-purpose differentiable computer.**

| The phrase | What it means |
| --- | --- |
| **General-purpose** | not tied to a domain (§7) |
| **Differentiable** | programmed by data, not written by people |
| **Computer** | the forward pass is execution (§8) |

---

# 10. The Open Problem Left in the Q&A — a Notepad

In the closing Q&A, Karpathy names **external memory** as what's missing: models have no **notepad** to write their thinking down on.

In 2023 that was a wish. Three years later, most of what we use daily is that notepad.

| The 2023 gap | The 2026 counterpart |
| --- | --- |
| nowhere to write down thinking | plans and specs written to files, `SPEC.md` |
| can't pull in knowledge on demand | skills · progressive disclosure |
| context is one undifferentiated block | subagents · context separation |
| procedure is improvised every time | harnesses · workflows |

That table is the real reason I wrote this post. **Harnesses and skills aren't a fashion outside the architecture — they fill the slots the architecture left empty.** They're less about doing what the model can't, and more about bolting on what the model **wasn't born with.**

---

# 11. Wrapping Up — How a Three-Year-Old Lecture Reads Now

| | The lecture's claim | What 2026 confirmed |
| --- | --- | --- |
| **1** | the toolkit merged into one | change the tokenization and the domain changes |
| **2** | attention came from a bottleneck | the auxiliary device pushed out the main body |
| **3** | attention is data-dependent routing | architectural variants = edge layouts |
| **4** | the architecture is 300 lines | the bigness is scale, not the blueprint |
| **5** | the forward pass is execution | context = a program, not a store |
| **6** | expressive, optimizable, efficient | it became the scorecard for successor architectures |
| **7** | we need a notepad | that's what skills and harnesses are now |

Overlay this blog's recent posts and the place it occupies is clear.

- [Context engineering](/en/posts/2026-07-31-context-engineering-claude5/) — what to write into the forward pass
- [How to write specs agents follow](/en/posts/2026-09-13-writing-specs-for-agents/) — **what shape** to write that program in
- [Skill governance](/en/posts/2026-09-06-skills-governance/) — what happens when **many people** share what's written
- This post — what the thing **reading it** is actually made of

Working with agents keeps becoming work outside the model: prompts, skills, harnesses, verification. Which is exactly why **knowing the inside precisely, once, pays off.** A call like "should I add one more rule to the context" turns from instinct into reasoning when you know the shape underneath.

An hour is enough to read one 300-line file.

---

# References

- Andrej Karpathy, Stanford CS25 — [Introduction to Transformers](https://www.youtube.com/watch?v=y2p8Va_zu00) (subtitled re-upload) · [original](https://www.youtube.com/watch?v=XfpMkf4rD6E)
- [Stanford CS25: Transformers United](https://web.stanford.edu/class/cs25/)
- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- Bahdanau, Cho, Bengio, [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- Karpathy, [nanoGPT](https://github.com/karpathy/nanoGPT)
- Earlier posts — [How to write specs agents follow](/en/posts/2026-09-13-writing-specs-for-agents/) · [Skill governance](/en/posts/2026-09-06-skills-governance/) · [Context engineering](/en/posts/2026-07-31-context-engineering-claude5/)
