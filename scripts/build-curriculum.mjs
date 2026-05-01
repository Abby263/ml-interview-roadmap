#!/usr/bin/env node
/**
 * Generate all daily-plan day JSONs from a structured curriculum definition.
 *
 * 19 weeks × 7 days = 133 days. No rest days. Behavioral only in week 19.
 *
 *  W1-2  (Days 1-14)   Math & Statistics + DSA: Arrays/Hashing, Two Pointers, Math/Geometry
 *  W3-5  (Days 15-35)  Traditional ML, OOPS  + DSA: Sliding Window, Stack, Binary Search
 *  W6-8  (Days 36-56)  Deep Learning (CV, NLP) + DSA: Linked List, Trees, Heap
 *  W9-10 (Days 57-70)  MLOps + DSA: Backtracking, Graphs, Advanced Graphs
 *  W11-13 (Days 71-91) Generative AI (LLM, RAG, Agents) + DSA: 1-D DP, 2-D DP, Greedy, Intervals
 *  W14-15 (Days 92-105) ML Infra + Training at Scale (CV/NLP/Speech/RL/RecSys/Distributed)
 *  W16-18 (Days 106-126) ML System Design (framework + cases + trade-offs)
 *  W19   (Days 127-133) Mock Interviews + Behavioral
 *
 *     node scripts/build-curriculum.mjs
 */

import fs from "node:fs";
import path from "node:path";

import { dsaQuestions } from "./build-curriculum-dsa-questions.mjs";

const root = path.join(process.cwd(), "content", "daily-plan");
const daysRoot = path.join(root, "days");
const weeksPath = path.join(root, "weeks.json");

// 1. NeetCode 150 catalog
const NC = {
  "Arrays & Hashing": ["contains-duplicate", "valid-anagram", "two-sum", "group-anagrams", "top-k-frequent-elements", "encode-and-decode-strings", "product-of-array-except-self", "valid-sudoku", "longest-consecutive-sequence"],
  "Two Pointers": ["valid-palindrome", "two-sum-ii-input-array-is-sorted", "3sum", "container-with-most-water", "trapping-rain-water"],
  "Sliding Window": ["best-time-to-buy-and-sell-stock", "longest-substring-without-repeating-characters", "longest-repeating-character-replacement", "permutation-in-string", "minimum-window-substring", "sliding-window-maximum"],
  "Stack": ["valid-parentheses", "min-stack", "evaluate-reverse-polish-notation", "generate-parentheses", "daily-temperatures", "car-fleet", "largest-rectangle-in-histogram"],
  "Binary Search": ["binary-search", "search-a-2d-matrix", "koko-eating-bananas", "find-minimum-in-rotated-sorted-array", "search-in-rotated-sorted-array", "time-based-key-value-store", "median-of-two-sorted-arrays"],
  "Linked List": ["reverse-linked-list", "merge-two-sorted-lists", "reorder-list", "remove-nth-node-from-end-of-list", "copy-list-with-random-pointer", "add-two-numbers", "linked-list-cycle", "find-the-duplicate-number", "lru-cache", "merge-k-sorted-lists", "reverse-nodes-in-k-group"],
  "Trees": ["invert-binary-tree", "maximum-depth-of-binary-tree", "diameter-of-binary-tree", "balanced-binary-tree", "same-tree", "subtree-of-another-tree", "lowest-common-ancestor-of-a-binary-search-tree", "binary-tree-level-order-traversal", "binary-tree-right-side-view", "count-good-nodes-in-binary-tree", "validate-binary-search-tree", "kth-smallest-element-in-a-bst", "construct-binary-tree-from-preorder-and-inorder-traversal", "binary-tree-maximum-path-sum", "serialize-and-deserialize-binary-tree"],
  "Tries": ["implement-trie-prefix-tree", "design-add-and-search-words-data-structure", "word-search-ii"],
  "Heap / Priority Queue": ["kth-largest-element-in-a-stream", "last-stone-weight", "k-closest-points-to-origin", "kth-largest-element-in-an-array", "task-scheduler", "design-twitter", "find-median-from-data-stream"],
  "Backtracking": ["subsets", "combination-sum", "permutations", "subsets-ii", "combination-sum-ii", "word-search", "palindrome-partitioning", "letter-combinations-of-a-phone-number", "n-queens"],
  "Graphs": ["number-of-islands", "clone-graph", "max-area-of-island", "pacific-atlantic-water-flow", "surrounded-regions", "rotting-oranges", "walls-and-gates", "course-schedule", "course-schedule-ii", "redundant-connection", "number-of-connected-components-in-an-undirected-graph", "graph-valid-tree", "word-ladder"],
  "Advanced Graphs": ["reconstruct-itinerary", "min-cost-to-connect-all-points", "network-delay-time", "swim-in-rising-water", "alien-dictionary", "cheapest-flights-within-k-stops"],
  "1-D DP": ["climbing-stairs", "min-cost-climbing-stairs", "house-robber", "house-robber-ii", "longest-palindromic-substring", "palindromic-substrings", "decode-ways", "coin-change", "maximum-product-subarray", "word-break", "longest-increasing-subsequence", "partition-equal-subset-sum"],
  "2-D DP": ["unique-paths", "longest-common-subsequence", "best-time-to-buy-and-sell-stock-with-cooldown", "coin-change-ii", "target-sum", "interleaving-string", "longest-increasing-path-in-a-matrix", "distinct-subsequences", "edit-distance", "burst-balloons", "regular-expression-matching"],
  "Greedy": ["maximum-subarray", "jump-game", "jump-game-ii", "gas-station", "hand-of-straights", "merge-triplets-to-form-target-triplet", "partition-labels", "valid-parenthesis-string"],
  "Intervals": ["insert-interval", "merge-intervals", "non-overlapping-intervals", "meeting-rooms", "meeting-rooms-ii", "minimum-interval-to-include-each-query"],
  "Math & Geometry": ["rotate-image", "spiral-matrix", "set-matrix-zeroes", "happy-number", "plus-one", "powx-n", "multiply-strings", "detect-squares"],
  "Bit Manipulation": ["single-number", "number-of-1-bits", "counting-bits", "reverse-bits", "missing-number", "sum-of-two-integers", "reverse-integer"],
};

function titleizeSlug(slug) {
  return slug.split("-").map((p) => {
    if (/^\d/.test(p)) return p;
    if (p.length <= 2) return p.toUpperCase();
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join(" ");
}

function nc(category, start, count) {
  const list = NC[category];
  if (!list) throw new Error(`Unknown NeetCode category: ${category}`);
  return list.slice(start, start + count).map((slug) => {
    const item = {
      id: `lc-${slug}`,
      label: titleizeSlug(slug),
      href: `https://leetcode.com/problems/${slug}/`,
      meta: category,
    };
    const qs = dsaQuestions(slug, category);
    if (qs && qs.length >= 2) item.interviewQuestions = qs.slice(0, 5);
    return item;
  });
}

function ncTrack(category, start, count, label) {
  return { label: label ?? `DSA · NeetCode ${category}`, items: nc(category, start, count) };
}

// 2. Reference shelf
const R = {
  neetcode: { label: "NeetCode roadmap (full 250)", href: "https://neetcode.io/roadmap", source: "NeetCode" },
  neetcodeMl: { label: "NeetCode Machine Learning practice", href: "https://neetcode.io/practice/machine-learning", source: "NeetCode" },
  ncVideos: { label: "NeetCode YouTube playlists", href: "https://www.youtube.com/c/NeetCode/playlists", source: "NeetCode" },
  lcPatterns: { label: "14 patterns to ace any coding interview", href: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed", source: "HackerNoon" },
  yuanMeng: { label: "Prepare in a Hurry (Yuan Meng)", href: "https://www.yuan-meng.com/posts/mle_interviews_2.0/", source: "Yuan Meng" },
  andrewNg: { label: "Andrew Ng — Machine Learning Specialization", href: "https://www.coursera.org/specializations/machine-learning-introduction", source: "Coursera" },
  statQuest: { label: "StatQuest — Statistics & ML playlists", href: "https://www.youtube.com/@statquest/playlists", source: "YouTube" },
  threeBlueLinalg: { label: "3Blue1Brown — Essence of Linear Algebra", href: "https://www.3blue1brown.com/topics/linear-algebra", source: "3Blue1Brown" },
  threeBlueCalc: { label: "3Blue1Brown — Essence of Calculus", href: "https://www.3blue1brown.com/topics/calculus", source: "3Blue1Brown" },
  strang: { label: "Gilbert Strang — Linear Algebra (MIT 18.06)", href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "MIT OCW" },
  khanLinalg: { label: "Khan Academy — Linear Algebra", href: "https://www.khanacademy.org/math/linear-algebra", source: "Khan Academy" },
  khanProb: { label: "CS50 AI — Probability week", href: "https://cs50.harvard.edu/ai/2024/weeks/2/", source: "Harvard" },
  cs50: { label: "CS50 — intro to programming", href: "https://cs50.harvard.edu/x/2024/weeks/0/", source: "Harvard" },
  googlePython: { label: "Google's Python Class", href: "https://developers.google.com/edu/python", source: "Google" },
  numpy: { label: "NumPy quickstart tutorial", href: "https://numpy.org/doc/stable/user/quickstart.html", source: "NumPy" },
  kagglePandas: { label: "Kaggle — Pandas course", href: "https://www.kaggle.com/learn/pandas", source: "Kaggle" },
  googleMlCrash: { label: "Google ML Crash Course", href: "https://developers.google.com/machine-learning/crash-course", source: "Google" },
  udlBook: { label: "Understanding Deep Learning (free PDF)", href: "https://udlbook.github.io/udlbook/", source: "UDL Book" },
  fastAi: { label: "fast.ai — Practical Deep Learning", href: "https://course.fast.ai/", source: "fast.ai" },
  dlaiSpec: { label: "DeepLearning.AI Deep Learning Specialization", href: "https://www.deeplearning.ai/courses/deep-learning-specialization/", source: "DeepLearning.AI" },
  dlaiGenai: { label: "DeepLearning.AI — short courses on GenAI / LLMs", href: "https://www.deeplearning.ai/short-courses/", source: "DeepLearning.AI" },
  hfLlm: { label: "Hugging Face LLM course", href: "https://huggingface.co/learn/llm-course", source: "Hugging Face" },
  hfNlp: { label: "Hugging Face NLP course", href: "https://huggingface.co/learn/nlp-course/chapter1/1", source: "Hugging Face" },
  kaggleCv: { label: "Kaggle — Computer Vision", href: "https://www.kaggle.com/learn/computer-vision", source: "Kaggle" },
  karpathyLlm: { label: "Karpathy — Intro to LLMs", href: "https://www.youtube.com/watch?v=zjkBMFhNj_g", source: "YouTube" },
  labonneLlm: { label: "Maxime Labonne — LLM Course", href: "https://github.com/mlabonne/llm-course", source: "GitHub" },
  illustratedTransformer: { label: "Illustrated Transformer (Jay Alammar)", href: "https://jalammar.github.io/illustrated-transformer/", source: "Jay Alammar" },
  pinecone: { label: "Pinecone — Vector Databases Explained", href: "https://www.pinecone.io/learn/vector-database/", source: "Pinecone" },
  langchainRag: { label: "LangChain — RAG concepts", href: "https://python.langchain.com/docs/concepts/rag/", source: "LangChain" },
  anthropicPrompt: { label: "Anthropic — Prompt Engineering Guide", href: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", source: "Anthropic" },
  anthropicAgents: { label: "Anthropic — Building Effective Agents", href: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems", source: "Anthropic" },
  anthropicEval: { label: "Anthropic — Testing & Evaluation", href: "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests", source: "Anthropic" },
  hfPeft: { label: "Hugging Face — LoRA & PEFT", href: "https://huggingface.co/learn/smol-course/en/unit1/3a", source: "Hugging Face" },
  madeWithMl: { label: "Made with ML — full MLOps course", href: "https://madewithml.com/", source: "Goku Mohandas" },
  mitMlEff: { label: "MIT — ML Efficiency playlist", href: "https://www.youtube.com/playlist?list=PL80kAHvQbh-pT4lCkDT53zT8DKmhE0idB", source: "MIT" },
  openaiRl: { label: "OpenAI — Spinning Up in RL", href: "https://spinningup.openai.com/en/latest/", source: "OpenAI" },
  oaiReason: { label: "OpenAI — Learning to reason with LLMs", href: "https://openai.com/index/learning-to-reason-with-llms/", source: "OpenAI" },
  mcp: { label: "Model Context Protocol", href: "https://modelcontextprotocol.io/", source: "MCP" },
  loganRoadmap: { label: "Logan Thorneloe — ML Road Map", href: "https://github.com/loganthorneloe/ml-road-map", source: "GitHub" },
  ai4Swes: { label: "AI for Software Engineers newsletter", href: "https://aiforswes.com", source: "AI for SWEs" },
  chipHuyenDesign: { label: "Chip Huyen — ML Systems Design", href: "https://huyenchip.com/machine-learning-systems-design/toc.html", source: "Chip Huyen" },
  chipHuyenInt: { label: "Chip Huyen — ML Interviews Book (free)", href: "https://huyenchip.com/ml-interviews-book/", source: "Chip Huyen" },
  fsdl: { label: "Full Stack Deep Learning", href: "https://fullstackdeeplearning.com/", source: "FSDL" },
  patrickHalina: { label: "Patrick Halina — ML Systems Design Interview Guide", href: "http://patrickhalina.com/posts/ml-systems-design-interview-guide/", source: "Patrick Halina" },
  khangich: { label: "khangich — Machine Learning Interview", href: "https://github.com/khangich/machine-learning-interview", source: "GitHub" },
  alirezadir: { label: "alirezadir — Machine Learning Interviews", href: "https://github.com/alirezadir/Machine-Learning-Interviews", source: "GitHub" },
  paperWithCode: { label: "Papers with Code — SOTA leaderboards", href: "https://paperswithcode.com/sota", source: "Papers with Code" },
  d2l: { label: "Dive into Deep Learning (d2l.ai)", href: "https://d2l.ai/", source: "d2l.ai" },
  evidently: { label: "Evidently AI — monitoring metrics catalog", href: "https://docs.evidentlyai.com/reference/all-metrics", source: "Evidently" },
  oaiDocs: { label: "OpenAI platform docs", href: "https://platform.openai.com/docs", source: "OpenAI" },
  ragas: { label: "Ragas metrics catalog", href: "https://docs.ragas.io/", source: "Ragas" },
  yan: { label: "Eugene Yan — applied ML writing", href: "https://eugeneyan.com/", source: "Eugene Yan" },
  vllm: { label: "vLLM docs", href: "https://docs.vllm.ai/", source: "vLLM" },
  pytorchDdp: { label: "PyTorch DDP tutorial", href: "https://pytorch.org/tutorials/intermediate/ddp_tutorial.html", source: "PyTorch" },
  refactoringGuru: { label: "Refactoring.guru — design patterns", href: "https://refactoring.guru/design-patterns", source: "Refactoring.guru" },
  solid: { label: "SOLID principles", href: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design", source: "DigitalOcean" },
  realPython: { label: "Real Python — Python GIL", href: "https://realpython.com/python-gil/", source: "Real Python" },
  whisper: { label: "Whisper paper (ASR)", href: "https://arxiv.org/abs/2212.04356", source: "OpenAI" },
  vit: { label: "Vision Transformer (ViT) paper", href: "https://arxiv.org/abs/2010.11929", source: "Google" },
  clip: { label: "CLIP paper", href: "https://arxiv.org/abs/2103.00020", source: "OpenAI" },
  resnet: { label: "ResNet paper", href: "https://arxiv.org/abs/1512.03385", source: "He et al." },
  bert: { label: "BERT paper", href: "https://arxiv.org/abs/1810.04805", source: "Google" },
  attentionPaper: { label: "Attention Is All You Need", href: "https://arxiv.org/abs/1706.03762", source: "Vaswani et al." },
  ytTwoTower: { label: "YouTube two-tower (sampling-bias-corrected)", href: "https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/", source: "Google" },
  ytMultiTask: { label: "YouTube multi-task ranking", href: "https://daiwk.github.io/assets/youtube-multitask.pdf", source: "Google" },
  loraPaper: { label: "LoRA paper", href: "https://arxiv.org/abs/2106.09685", source: "Microsoft" },
  seeingTheory: { label: "Seeing Theory — visual probability + stats", href: "https://seeing-theory.brown.edu/", source: "Brown" },
  evanMillerAB: { label: "Evan Miller — A/B testing pitfalls", href: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html", source: "Evan Miller" },
  xgboostDocs: { label: "XGBoost docs (parameters + tuning)", href: "https://xgboost.readthedocs.io/en/stable/", source: "XGBoost" },
  lightgbmDocs: { label: "LightGBM docs", href: "https://lightgbm.readthedocs.io/", source: "Microsoft" },
  imbalancedLearn: { label: "imbalanced-learn user guide", href: "https://imbalanced-learn.org/stable/user_guide.html", source: "scikit-learn-contrib" },
  sklearnUg: { label: "scikit-learn user guide", href: "https://scikit-learn.org/stable/user_guide.html", source: "scikit-learn" },
  karpathyMakemore: { label: "Karpathy — Neural Networks: Zero to Hero", href: "https://karpathy.ai/zero-to-hero.html", source: "Karpathy" },
  cs231n: { label: "CS231n — CNNs for visual recognition", href: "https://cs231n.github.io/", source: "Stanford" },
  cs224n: { label: "CS224n — NLP with deep learning", href: "https://web.stanford.edu/class/cs224n/", source: "Stanford" },
  mlflow: { label: "MLflow docs", href: "https://mlflow.org/docs/latest/index.html", source: "MLflow" },
  feast: { label: "Feast feature store docs", href: "https://docs.feast.dev/", source: "Feast" },
  whyLabs: { label: "WhyLabs — drift detection guide", href: "https://docs.whylabs.ai/docs/", source: "WhyLabs" },
  arizeAi: { label: "Arize AI — ML observability", href: "https://docs.arize.com/", source: "Arize" },
  langsmith: { label: "LangSmith — LLM tracing & eval", href: "https://docs.smith.langchain.com/", source: "LangChain" },
};

console.log("Curriculum builder loaded.");
console.log("References:", Object.keys(R).length, "  NeetCode categories:", Object.keys(NC).length);

// Continue in next file: topics + curriculum + generator
import("./build-curriculum-data.mjs").then((m) => m.run({ NC, R, nc, ncTrack, daysRoot, weeksPath, root }));
