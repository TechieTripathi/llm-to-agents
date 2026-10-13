---
section: 2
layout: artifact
clicks: 3
lede: "A neural network trained to predict the next token. Everything else in this workshop builds on that."
sources: [brown2020, ouyang2022]
scale: 0.94
---

::title::
# What is a large language model?

::default::
<LlmPipeline mode="overview" />

<!--
**Time:** ~1.5 min
**Objective:** Participants can name the three parts of every LLM interaction — input context, parameters, generated output — and know that the parameters do not change while they use the model.
**Say:** A large language model is a neural network trained on a very large body of text to do one thing: given some text, predict what token comes next. The "knowledge" it has lives in its parameters — billions of numbers that were adjusted during training until its predictions got good. When you use it, those numbers are fixed. The only thing you control is the input context: your instructions, the documents you paste, the earlier messages. The output is generated one token at a time. Chat assistants are the same kind of model with extra training to follow instructions and hold a conversation.
**Example:** Think of a very well-read new colleague who has read millions of documents but has never seen your project files. They can only work with what you put on their desk — and they will still answer fluently even if you put nothing there.
**Notice:** Click through: input (highlight the attached meeting note), parameters (the grid stands for the learned weights; the dashed training lane underneath happened before you ever used it), output (tokens, written one after another).
**Ask:** "When you correct ChatGPT or Copilot in a chat, does the model itself learn from that?" (Not in the parameters; the correction only sits in the context of that conversation, unless a product adds a memory feature around the model.)
**Caveat:** "Billions of parameters" is typical of today's large models; GPT-3 had 175 billion [brown2020]. Products may add memory, retrieval and tools around the model — those are system features, not the network itself (Sections 3–5).
**Transition:** If the model reads and writes tokens, we need to see what a token actually is.
**Sources:** brown2020 — GPT-3: a 175B-parameter model trained to predict the next token, used via text in its context. ouyang2022 — InstructGPT: base models fine-tuned with human feedback to follow instructions.
-->

---
section: 2
layout: artifact
clicks: 4
lede: "Token boundaries rarely match words, and they differ between models. A dot marks a leading space."
sources: [s2tiktoken, s2gpttokenizer, sennrich2016]
scale: 0.94
---

::title::
# Models read tokens, not words

::default::
<Tokenizer />

<!--
**Time:** ~2 min
**Objective:** Participants see that text is split into tokens — whole words, word pieces, digits, punctuation or bytes — and that token counts drive cost, limits and some error types.
**Say:** Before a model sees your text, a tokenizer cuts it into pieces from a fixed vocabulary — here about 200,000 pieces. Common words are usually one token, often including the space before them. Rare words, codes, numbers and many non-English scripts get broken into several pieces. These are real tokenizers — the ones OpenAI uses for GPT-4o and GPT-5, for GPT-4, and for the original GPT-3 — running live in this page, not a simulation. Claude, Gemini and Llama have their own tokenizers, so counts differ between products.
**Example:** Click through the presets. The email line is roughly one token per word. The date and amount split into small digit groups. The product code shatters into fragments — which is one reason models sometimes mis-copy reference numbers. The Hindi phrase is 5 tokens for GPT-4o, 17 for GPT-4 and 34 for GPT-3: newer tokenizers handle non-English text far more efficiently. Click GPT-3 to show it.
**Notice:** Token count vs word count in the big numbers; the dot marking a leading space; the "Same text" line, which counts the text with all three tokenizers. Type a participant's suggestion into the box if time allows (keep it to one line).
**Ask:** "Where in your work do exact strings matter — account numbers, part codes, legal references?" Those deserve extra checking.
**Caveat:** Token counts are what usage limits and API pricing are measured in, so the same content can cost more in some languages. Tokenization is one reason (among several) for character-level slips; it does not explain every error.
**Transition:** Once text is tokens, what does the model do with them? Let's open the box — carefully simplified.
**Sources:** s2tiktoken — OpenAI's tiktoken mapping shows o200k_base for GPT-4o, o-series, GPT-4.1 and GPT-5 models, cl100k_base for GPT-4/GPT-3.5 Turbo, and r50k_base for GPT-3 (davinci). s2gpttokenizer — the JavaScript port used live on this slide. sennrich2016 — byte-pair encoding (subword units), the family of methods these tokenizers use.
-->

---
section: 2
layout: artifact
clicks: 5
lede: "A deliberately simplified picture of what happens between tokens in and a prediction out."
sources: [vaswani2017, geva2021ff, brown2020]
---

::title::
# A transformer turns context into a prediction

::default::
<TransformerSchematic />

<!--
**Time:** ~2 min
**Objective:** Participants can describe the main stages — embeddings, attention, feed-forward, many stacked layers, output distribution — in plain words, and know this is a simplified picture.
**Say:** Step through it bottom to top. Each token is first turned into a long list of numbers — an embedding — that stands for its meaning, plus its position. Then comes attention: each position gathers information from earlier positions, so "to" can draw on "moved" and "meeting". Then a feed-forward network processes each position on its own; research suggests these layers act like a store of learned associations. Attention plus feed-forward is one layer, and large models stack many — GPT-3 had 96. At the top, the vector at the last position becomes a probability for every possible next token.
**Example:** Like a document going through a review chain: at every desk (layer) the reviewer first checks the other documents in the folder (attention), then applies their own expertise (feed-forward), and passes it up — 96 desks deep.
**Notice:** The term chip on the right names the official term for each stage; the faint parts are still to come. The "× many layers" stack appears at step 4.
**Ask:** None — keep moving; the next slide zooms into attention.
**Caveat:** This is not a complete implementation: it omits residual connections, layer normalisation, multiple attention heads and the exact maths. The original Transformer [vaswani2017] was an encoder–decoder for translation; today's chat LLMs use the decoder-only variant shown here, which only looks backwards. The "store of associations" view of feed-forward layers is one research interpretation [geva2021ff], not settled fact.
**Transition:** Attention is the step that made transformers work so well. Let's look at it on a single sentence.
**Sources:** vaswani2017 — Transformer: multi-head self-attention plus position-wise feed-forward sub-layers, with residual connections and layer normalisation. geva2021ff — feed-forward layers operate as key-value memories. brown2020 — GPT-3 175B has 96 layers, 96 attention heads, model width 12,288 (Table 2.1).
-->

---
section: 2
layout: artifact
clicks: 2
lede: "Lines show which earlier words a word draws on. An illustration, not a measurement."
sources: [vaswani2017, jain2019attention, wiegreffe2019attention]
---

::title::
# Attention lets each word draw on earlier words

::default::
<AttentionExplorer />

<!--
**Time:** ~2 min
**Objective:** Participants grasp attention as "each token builds its meaning from a weighted mix of earlier tokens", see why context resolves ambiguity, and learn not to over-read attention pictures.
**Say:** Look at "it". Does it mean the file or the drive? At the moment the model reaches "it", it cannot know — the deciding word has not arrived, and a model that writes left to right can only look backwards. So in this illustration "it" draws on both nouns. Click: at "big", the model looks back at "it" and "file" — files are what is too big. Click: change one word to "small", and now the strongest link from "small" goes to "drive". One word changed the meaning, and attention is how that information gets combined.
**Example:** This is the same mechanism that lets a model connect "the client" in paragraph four of an email to the company named in paragraph one — or fail to, when the reference is genuinely ambiguous.
**Notice:** The selected word is solid blue; earlier words it draws on are tinted; later words are dashed and greyed because they are not visible yet. Underneath: the ranking bars and the "can show / cannot show" panel.
**Ask:** "Where do ambiguous references show up in your documents?" (Pronouns in contracts, "the system" in incident notes.)
**Caveat:** The weights here are hand-authored for teaching, not read from any model — the tag says so. Real models run many attention heads in each of many layers; individual heads often track things that are not human-readable. Researchers disagree on how far attention weights explain a model's output: Jain and Wallace found they often are not faithful explanations; Wiegreffe and Pinter argued it depends on what you mean by "explanation". Either way, a single attention picture is not an audit of why a model answered as it did.
**Transition:** We now have the pieces: tokens in, layers of attention, a prediction out. Let's put them together into how an answer is written.
**Sources:** vaswani2017 — self-attention mechanism. jain2019attention — attention weights frequently uncorrelated with feature importance; different attention can give the same prediction. wiegreffe2019attention — rebuttal: depends on the definition of explanation; attention can still be informative.
-->

---
section: 2
layout: artifact
clicks: 5
lede: "An answer is not written in one go. It is this loop, one token per pass."
sources: [holtzman2020degeneration]
---

::title::
# Generation is a loop: predict, pick, append, repeat

::default::
<LlmPipeline mode="generation" />

<!--
**Time:** ~1.5 min
**Objective:** Participants can describe one pass of generation and know that decoding — how a token is picked from the probabilities — is a separate choice from the model itself.
**Say:** Step one: everything so far is the context. Step two: the model processes it. Step three: out comes a probability for every token in the vocabulary — about 200,000 options. Step four: a decoding rule picks one. Greedy decoding always takes the most likely; sampling draws at random in proportion to the probabilities, and the temperature setting sharpens or flattens those odds first. Step five: the chosen token is appended, and the whole thing runs again — hundreds of times for a long answer.
**Example:** Autocomplete on your phone does the first three steps with a much smaller model, then lets you do step four by tapping a suggestion.
**Notice:** The bars in stage 3 — " March" is only 34%; most of the probability is spread elsewhere. The dashed loop arrow turns solid at the last click.
**Ask:** None.
**Caveat:** The probabilities shown are illustrative. Decoding strategy matters a lot: always taking the top token tends to produce bland, repetitive text, while unconstrained sampling can drift into incoherence; methods like nucleus (top-p) sampling sit in between [holtzman2020degeneration]. Products choose these settings for you; some APIs expose temperature.
**Transition:** Let's run the loop for real — well, for illustration — across a whole sentence.
**Sources:** holtzman2020degeneration — decoding strategy alone dramatically changes the quality of generated text from the same model; compares maximisation, temperature and nucleus sampling.
-->

---
section: 2
layout: artifact
clicks: 12
lede: "Each picked token joins the context for the next. Switch to sampling — one different pick changes the rest."
sources: [holtzman2020degeneration, openai2024o1, deepseek2025r1]
scale: 0.94
---

::title::
# Autoregression: one token at a time

::default::
<TokenSimulator />

<!--
**Time:** ~2.5 min
**Objective:** Participants see that generated tokens become context for later tokens, that decoding settings change the result, and that a fluent answer can be produced with no supporting information at all.
**Say:** The prompt asks for a status update on Project Lark. Click through: each click picks one token and appends it to the context. With greedy decoding the top candidate wins every time and we get "on track for the March launch". Now switch to sampling at temperature 1 and step to token 5: " running" had a 17% chance, this draw picked it, and everything after follows from that choice — "two weeks behind schedule". Same model, same prompt, opposite message. And notice: the prompt contained no project data at all. Both sentences are invented.
**Example:** Ask an assistant the same question twice and get two differently worded — sometimes differently substantive — answers. That is sampling, not the model "changing its mind".
**Notice:** The bars are the model's odds; the decoding rule decides what to do with them. "All other tokens" is the long tail of the ~200,000-token vocabulary. On the final step both completed sentences appear side by side. Temperature works between these two extremes: below 1 it sharpens the odds toward greedy, above 1 it flattens them toward random.
**Ask:** "Which of your tasks need repeatable output (classification, data extraction), and which benefit from variety (brainstorming)?"
**Caveat:** Token boundaries are real (o200k_base); probabilities and the sampled draw are illustrative and prepared in advance. Greedy or low-temperature decoding does not make an answer correct — only more repeatable. Reasoning models (such as OpenAI's o1 series and DeepSeek-R1) run this same loop longer: they first generate intermediate reasoning tokens, and OpenAI reported o1's performance improves with more of this "thinking" time at inference [openai2024o1]; DeepSeek-R1 learned such reasoning behaviours through reinforcement learning [deepseek2025r1]. More computation helps on many tasks, but it is not a guarantee of correctness.
**Transition:** If every token shifts the next prediction, then the words we choose in the prompt matter too. How much?
**Sources:** holtzman2020degeneration — temperature and sampling vs maximisation decoding. openai2024o1 — o1 "thinks before it answers" with a chain of thought; performance improves with test-time compute (12 Sep 2024). deepseek2025r1 — Nature 2025: reasoning incentivised via RL, with self-reflection and verification patterns.
-->

---
section: 2
layout: artifact
clicks: 3
lede: "Everything in the prompt shifts the next-token odds, even details a person would ignore."
sources: [brown2020, zhao2021calibrate, lu2022order, sclar2024formatting]
---

::title::
# Why wording and examples change the output

::default::
<WordingEffects />

<!--
**Time:** ~1.5 min
**Objective:** Participants understand the mechanism of prompt sensitivity — the output is conditioned on every token in the context — without being handed a recipe (that comes on slides 18–20 and in the prompt lab on slide 56).
**Say:** Because the model conditions on everything in the context, small changes can move the answer. Four kinds of change. Ambiguity: "is this urgent?" leaves the model to guess what urgent means. Which examples: if every example says "Routine", answers drift toward Routine — researchers measured this "majority label bias" in GPT-3. Example order: the same examples reordered can change the answer, because labels near the end get extra weight. Formatting alone: separators and capitals that mean nothing to a person moved accuracy by up to 76 points on one model in one study — and the best format for one model was not the best for another.
**Example:** Two team members asking the "same" question in their own words and getting differently scoped answers is this effect, not one person being better at AI.
**Notice:** Each tab changes one thing; the task and the message stay identical. The grey line underneath is what research measured; the cards are simulated illustrations of that kind of shift.
**Ask:** None — keep pace.
**Caveat:** Do not conclude that one format always wins: the formatting study found performance only weakly correlates between models. Larger and instruction-tuned models are often less sensitive, but the study found sensitivity remains even with more examples, larger size and instruction tuning. The practical response is to test prompts on several real cases, not to chase a magic phrasing.
**Transition:** Wording is one lever. The bigger one is what information is in the context at all.
**Sources:** brown2020 — in-context learning from examples in the prompt. zhao2021calibrate — format, example choice and order swing few-shot accuracy from near chance to near state of the art; majority-label and recency bias (Section 4). lu2022order — order alone can mean the difference between near state-of-the-art and random-guess performance. sclar2024formatting — up to 76 accuracy points from formatting with LLaMA-2-13B; format performance weakly correlated across models.
-->

---
section: 2
layout: artifact
clicks: 4
lede: "Add and remove documents. A bigger window helps only if the right material is in it, and gets used."
sources: [liu2024lost, shi2023distracted, s2gpttokenizer]
---

::title::
# Context windows: what the model can use

::default::
<ContextWindowSimulator />

<!--
**Time:** ~2 min
**Objective:** Participants understand that the context window is the model's whole working view of a task, that relevant and current documents matter more than volume, and that long contexts have failure modes.
**Say:** The question: when can the new portal go live? With no documents, the model can only speak in generalities. Add the project brief and it confidently says 20 October — wrong, because a later meeting moved the date. Add the meeting note and the answer becomes current: 27 October, if the load test passes. Add the change policy and it adds the approval deadline and the freeze. Now add everything — including a long technical appendix and a long, irrelevant depot report. The bar is nearly full, and the key update now sits in the middle of a long input. In this simulation the model misses it — a risk that research has measured.
**Example:** Pasting a 60-page tender pack into a chat and asking one question about clause 14 is exactly the "buried in the middle" scenario.
**Notice:** The capacity bar fills with real token counts, in the order the documents are assembled (start to end). The darker blue sliver is the meeting note — 129 tokens among about 3,600. Hatched segments are irrelevant material. Claim tags show where each statement came from — or that it is outdated or missed.
**Ask:** "When you paste a whole folder in, how would you know what it ignored?"
**Caveat:** The 4,000-token window is a conceptual size for teaching; current models accept far more, and limits change frequently, so check your product's documentation. Answers are simulated and the "lost" result is deterministic here; in reality it is a risk, not a certainty. Liu et al. found accuracy was highest when the relevant information was at the beginning or end and dropped in the middle, even for long-context models. Shi et al. found irrelevant information markedly reduced accuracy. When input exceeds the window, products truncate, summarise or refuse — another reason to select.
**Transition:** Missing, buried and outdated information are three ways a model goes wrong. Let's map all the main ones.
**Sources:** liu2024lost — performance highest at the beginning or end of the context, degrades in the middle, even for long-context models (TACL 2024). shi2023distracted — irrelevant context dramatically decreases performance (ICML 2023). s2gpttokenizer — library computing the real token counts.
-->

---
section: 2
layout: artifact
clicks: 5
lede: "Diagnose before you fix: the cause decides the remedy."
sources: [cheng2024dated, xu2024conflicts, huang2025hallucination]
scale: 0.94
---

::title::
# Why LLMs make mistakes

::default::
<ErrorTaxonomy />

<!--
**Time:** ~1.5 min
**Objective:** Participants can sort a bad answer into one of six causes, grouped by origin — the request, the model, or the surrounding system — and pick a matching remedy.
**Say:** Not all mistakes are "the AI hallucinated". Two come from what we asked: missing information and ambiguous requests. Two come from the model: stale knowledge — it only knows the world up to its training cutoff — and reasoning slips, like confusing percentage points with percent. Two come from the system around it: a tool that failed or returned partial data, and sources that contradict each other. Each has a different fix: better input, a fresh source, a calculator, a system check, or a rule for which source wins.
**Example:** Step through the six. The 88% to 92% example is a classic: it is 4 percentage points, but a 4.5% relative improvement — the kind of slip that survives a quick read.
**Notice:** The left border shows the origin group; "What went wrong" and "What helps" on each card.
**Ask:** "Which of these six have you already met?" (Show of hands for one or two.)
**Caveat:** Real errors often combine causes. Models' effective knowledge cutoffs can differ from the cutoff their makers report [cheng2024dated]. Conflicts can be between the context and what the model learned, or between documents in the context [xu2024conflicts]. The hallucination survey groups causes into data, training and inference stages [huang2025hallucination]. Examples are fictional.
**Transition:** The most dangerous errors are the ones that read well. Let's check one.
**Sources:** cheng2024dated — knowledge cutoffs; effective cutoffs often differ from reported ones (COLM 2024). xu2024conflicts — context-memory, inter-context and intra-memory knowledge conflicts (EMNLP 2024). huang2025hallucination — taxonomy of hallucination and its causes (ACM TOIS 2025).
-->

---
section: 2
layout: artifact
clicks: 6
lede: "Fluency is not evidence. Check claims one by one against the source — numbers and references hardest."
sources: [huang2025hallucination, kalai2025hallucinate, s2mata2023]
---

::title::
# Fluent is not the same as correct

::default::
<HallucinationCheck />

<!--
**Time:** ~1.5 min
**Objective:** Participants practise claim-level verification, recognise four failure types (contradicted, unsupported, invented reference, reasoning error), and leave with a calibrated-trust rule of thumb.
**Say:** Here is a confident answer to an expenses question. It reads well. Now check it against the policy, one claim at a time. The taxi rule: supported. Meals: contradicted — the policy caps receipted meals at 40 a day and has no daily allowance. The total: even by its own number, two times 50 is 100, not 120 — a reasoning error. Receipts under 25 euros: the policy says nothing — unsupported. And "section 7.3": that section does not exist, and the real rule names a different approver. One claim in five holds up, yet nothing in the tone told us so. This is hallucination: plausible, fluent content that is not supported by facts or by the source it was given.
**Example:** In 2023 a US federal court sanctioned lawyers who filed a brief citing non-existent cases and fake quotes generated by ChatGPT, then stood by them when challenged (Mata v. Avianca). Invented references are the costliest kind.
**Notice:** Underlines turn green, amber or red per claim; the matching policy clause highlights on the right; dashed boxes show what is missing or miscalculated. The last step shows the calibrated-trust guide.
**Ask:** "Which of your tasks would be fine with a spot-check, and which need every claim checked?"
**Caveat:** Why does this happen? One recent analysis argues that training and evaluation reward guessing over saying "I don't know", so models learn to answer confidently when uncertain [kalai2025hallucinate — a 2025 preprint, not yet peer-reviewed]. The survey literature distinguishes factuality errors (wrong about the world) from faithfulness errors (not matching the given input or instructions) [huang2025hallucination]. Grounding in sources reduces but does not remove the risk — Section 3 shows how to build that in. Content on this slide is fictional.
**Transition:** We now know how the model works and how it fails. Section 3 turns that into practice: how to specify the task and supply the right context.
**Sources:** huang2025hallucination — definition and taxonomy of hallucination (factuality vs faithfulness) and causes. kalai2025hallucinate — training/evaluation reward guessing over acknowledging uncertainty (arXiv 2025). s2mata2023 — Mata v. Avianca, S.D.N.Y. 22 June 2023, sanctions for fake ChatGPT-generated citations.
-->
