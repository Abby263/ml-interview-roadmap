#!/usr/bin/env node
/**
 * Add per-item interview questions to ML-concept items in
 * content/daily-plan/days/day-NNN.json files.
 *
 * Source of truth: this script's Q map. To extend a topic with more
 * questions or add questions for a new item, edit the Q map below and
 * re-run:
 *
 *     node scripts/add-item-questions.mjs
 *
 * The script:
 *   - reads each day-NNN.json
 *   - walks every track item
 *   - if item.id is in Q AND item.interviewQuestions is missing, sets it
 *   - rewrites the JSON file pretty-printed (2-space indent, trailing newline)
 *
 * Re-running is idempotent. To overwrite existing questions, pass --force.
 */

import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content", "daily-plan", "days");
const force = process.argv.includes("--force");

// ────────────────────────────────────────────────────────────────────────────
// Question map. Keys are item.id values. Each entry is 2-5 interview
// questions a candidate could be asked on that topic. The reference link
// already attached to the item is what they use to prep answers + follow-ups.
// ────────────────────────────────────────────────────────────────────────────
const Q = {
  // ── Math · Probability foundations ───────────────────────────────────────
  "stats-bayes": [
    "Walk me through Bayes on a screening test (1% prevalence, 95% sensitivity, 90% specificity). Why is positive predictive value still low?",
    "How would you use Bayes to update belief in an A/B test as data arrives?",
    "Explain the difference between the prior and the likelihood with a concrete example.",
  ],
  "stats-cond-prob": [
    "What's wrong with saying P(disease | positive test) = sensitivity?",
    "Two children: one is a girl. What is the probability the other is also a girl? Defend your answer.",
    "Explain the base-rate fallacy with a hiring example.",
  ],

  // ── Math · Distributions ─────────────────────────────────────────────────
  "stats-distributions": [
    "When does the Poisson approximation to the Binomial work, and why is it useful in interviews?",
    "Why is Gaussian a default assumption — and when is it dangerously wrong?",
    "Pick a distribution to model time-between-events. Justify your choice.",
  ],
  "stats-heavy-tail": [
    "What goes wrong when you assume Gaussian for income or latency data?",
    "How would you detect heavy tails in a dataset before modeling?",
    "Why does the central limit theorem fail to save you on heavy-tailed inputs?",
  ],

  // ── Math · Eigenvalues, SVD, PCA ─────────────────────────────────────────
  "linalg-eigen": [
    "Explain eigenvectors and eigenvalues geometrically — no formulas.",
    "Why are eigenvectors useful for PCA?",
    "When does a matrix have no real eigenvalues?",
  ],
  "linalg-svd": [
    "Walk me through SVD on a small matrix and explain what U, Σ, V represent.",
    "How are SVD and PCA related?",
    "Why is truncated SVD a useful compression technique for embeddings?",
  ],
  "linalg-pca": [
    "Explain how PCA works — what does it actually compute step by step?",
    "What information does PCA throw away, and why does that matter?",
    "How would you choose the number of components without ground truth?",
  ],

  // ── Math · Linear algebra warm-up ────────────────────────────────────────
  "linalg-vectors": [
    "What does the dot product mean geometrically?",
    "Compare cosine similarity vs Euclidean distance — when is each appropriate?",
    "Why do we transpose a matrix in y = X·θ vs y = θ·X?",
  ],
  "linalg-norms": [
    "Compare L1, L2, and L-infinity norms — when each is the right choice.",
    "How does the choice of norm change the geometry of regularization?",
    "Why is cosine similarity preferred over dot product for normalized embeddings?",
  ],

  // ── Math · Optimization + calculus ───────────────────────────────────────
  "stats-gd-intuition": [
    "Why does gradient descent sometimes get stuck in non-convex problems?",
    "How does the learning rate trade off speed vs stability?",
    "What's the intuition for momentum in gradient descent?",
  ],
  "stats-convexity": [
    "Why does logistic regression have a global optimum but a deep neural net does not?",
    "Give a real example of a non-convex loss surface.",
    "Why does convexity matter for guarantees in optimization?",
  ],
  "math-derivatives": [
    "Walk me through the chain rule on a 2-layer neural network.",
    "Why do we need partial derivatives for multivariable optimization?",
    "How are backprop and the chain rule related?",
  ],
  "math-lagrange": [
    "When are Lagrange multipliers the right tool? Give a constrained-optimization example.",
    "How does the Lagrangian relate to SVM's dual formulation?",
    "Why is constrained optimization common in production ML?",
  ],
  "math-loss-landscape": [
    "Why does GD sometimes get stuck — and what do you do about it?",
    "How does momentum help escape saddle points?",
    "What does a typical loss landscape look like for an over-parameterized model?",
  ],

  // ── Stats · Bayesian thinking ────────────────────────────────────────────
  "stats-prior-likelihood": [
    "Explain prior, likelihood, and posterior with a coin-flip example.",
    "When does the prior dominate the posterior, and when does the data?",
    "How do you choose a prior in a real Bayesian model?",
  ],
  "stats-base-rate": [
    "Walk through the cancer-test base-rate problem.",
    "How does the base-rate fallacy apply to fraud detection?",
    "Why do interviewers love base-rate questions?",
  ],

  // ── Stats · Hypothesis testing ───────────────────────────────────────────
  "stats-pvalue": [
    "Define p-value precisely — what is it the probability of?",
    "What goes wrong if you peek at A/B results before the planned end?",
    "Why is statistical significance not the same as practical significance?",
  ],
  "stats-multitest": [
    "Why does running 20 A/B tests at α=0.05 produce false positives?",
    "Compare Bonferroni vs FDR correction — when each is appropriate.",
    "How do you handle multiple comparisons in a feature-importance analysis?",
  ],

  // ── Stats · CIs ──────────────────────────────────────────────────────────
  "stats-ci-frequentist": [
    "What's wrong with saying 'there's a 95% chance the true mean is in this interval'?",
    "Explain the frequentist interpretation of a confidence interval to a PM.",
    "How does CI width scale with sample size?",
  ],
  "stats-bootstrap": [
    "Why does the bootstrap work when classical CIs don't?",
    "How would you bootstrap a CI for the median?",
    "What are the failure modes of bootstrapping?",
  ],

  // ── Stats · Experimentation ──────────────────────────────────────────────
  "stats-ab-power": [
    "How would you size an A/B test for a 1% effect on a 5% baseline conversion?",
    "Explain statistical power in one sentence.",
    "What happens to required sample size if baseline conversion doubles?",
  ],
  "stats-ab-pitfalls": [
    "What's the novelty effect, and how do you mitigate it?",
    "Why is peeking dangerous in classical A/B testing?",
    "How do network effects break A/B test independence?",
  ],

  // ── Trad ML · Bias-variance ──────────────────────────────────────────────
  "ml-bias-variance": [
    "Define bias and variance — what does each look like in a learning curve?",
    "Why does adding more training data only help one of the two?",
    "When is regularization the wrong remedy?",
  ],
  "ml-bv-curves": [
    "Walk me through a learning curve and tell me whether the model is over- or under-fitting.",
    "What does it mean when train and validation loss both plateau high?",
    "How would you debug a model with high variance?",
  ],

  // ── Trad ML · Loss functions ─────────────────────────────────────────────
  "ml-loss-mse-mae": [
    "Why is MAE more robust to outliers than MSE?",
    "When would you choose Huber loss?",
    "What's the gradient behavior near the minimum for MSE vs MAE?",
  ],
  "ml-loss-cross-entropy": [
    "Why is cross-entropy preferred over MSE for classification?",
    "Derive the gradient of binary cross-entropy by hand.",
    "What does a class-weighted loss change about gradient updates?",
  ],

  // ── Trad ML · Linear regression ──────────────────────────────────────────
  "ml-linreg-derivation": [
    "Derive the normal equation for linear regression.",
    "When does GD beat the normal equation in practice?",
    "What happens to the normal equation if features are collinear?",
  ],
  "ml-linreg-assumptions": [
    "List the assumptions of linear regression and which ones break loudly.",
    "What does heteroscedasticity do to OLS estimates?",
    "How would you detect autocorrelation in residuals?",
  ],

  // ── Trad ML · Logistic regression ────────────────────────────────────────
  "ml-logreg": [
    "Derive the gradient of binary cross-entropy with the sigmoid.",
    "Why is logistic regression a generalized linear model?",
    "When would you prefer logistic regression over a tree-based model?",
  ],
  "ml-l1-vs-l2": [
    "Why does L1 produce sparse weights and L2 doesn't?",
    "Explain L2 regularization as a Bayesian prior.",
    "When is elastic net the right call?",
  ],

  // ── Trad ML · Cross-validation ───────────────────────────────────────────
  "ml-cv-strategies": [
    "When does k-fold leak signal? Give a concrete example.",
    "Why is time-based split mandatory for forecasting?",
    "What's the difference between group k-fold and stratified k-fold?",
  ],
  "ml-cv-leakage": [
    "Why does nested CV exist?",
    "How does naive CV inflate model selection metrics?",
    "When can you skip nested CV without lying to yourself?",
  ],

  // ── Trad ML · Metrics + calibration ──────────────────────────────────────
  "ml-metrics-pr-roc": [
    "Why is ROC-AUC misleading on imbalanced data?",
    "When would you pick PR-AUC over ROC-AUC?",
    "How do you choose F1 vs F0.5 vs F2?",
  ],
  "ml-platt-isotonic": [
    "When would you choose isotonic regression over Platt scaling?",
    "Why does an auction system need calibrated probabilities, not just rankings?",
    "How does temperature scaling fit into modern deep-learning calibration?",
  ],

  // ── Trad ML · Ranking + regression metrics ───────────────────────────────
  "ml-ndcg-mrr": [
    "Why is NDCG more useful than precision@K for ranking?",
    "Compute NDCG@3 by hand for a tiny example with relevance grades [3, 2, 0].",
    "When is MRR the right metric vs MAP?",
  ],
  "ml-rmse-mae": [
    "When does R² lie? Give a counter-example.",
    "Why might MAE be the right metric for a delivery-time model?",
    "What's the practical difference between RMSE and MSE?",
  ],

  // ── Trad ML · Trees & ensembles ──────────────────────────────────────────
  "ml-gbdt-paper": [
    "Why does GBDT usually beat Random Forest on tabular data?",
    "What does shrinkage do in gradient boosting?",
    "Walk me through how XGBoost handles missing values.",
  ],
  "ml-rf-vs-gbdt": [
    "When does a single decision tree still beat XGBoost?",
    "What's the difference between bagging and boosting in one sentence each?",
    "How do you defend GBDT as your tabular default in an interview?",
  ],

  // ── Trad ML · Hyperparameter tuning ──────────────────────────────────────
  "ml-tuning-strategies": [
    "Why is random search often better than grid search?",
    "When is Bayesian optimization worth its overhead?",
    "How would you tune XGBoost on a 100M-row dataset?",
  ],
  "ml-tuning-budget": [
    "How does Hyperband / successive halving allocate budget?",
    "When is nested CV worth its compute cost?",
    "How do you avoid leaking validation signal during tuning?",
  ],

  // ── Trad ML · Imbalanced classification ──────────────────────────────────
  "ml-imbalance": [
    "Compare class weights vs SMOTE vs threshold-moving.",
    "What breaks if you SMOTE before splitting train/test?",
    "How do you tune the decision threshold for an imbalanced classifier?",
  ],
  "ml-imbalance-calibration": [
    "Why does class weighting preserve calibration but resampling does not?",
    "How would you detect that resampling broke your calibration?",
    "What's the simplest fix when calibration is destroyed by SMOTE?",
  ],

  // ── Trad ML · Unsupervised ───────────────────────────────────────────────
  "ml-kmeans": [
    "When does k-means silently fail? Give a concrete example.",
    "How would you choose K without ground truth?",
    "When does DBSCAN beat k-means?",
  ],
  "ml-pca": [
    "What does PCA throw away — and why does that matter for downstream models?",
    "How would you decide how many components to keep?",
    "When is t-SNE / UMAP a better choice than PCA?",
  ],

  // ── Trad ML · Feature engineering ────────────────────────────────────────
  "ml-leakage": [
    "Walk me through 3 ways you'd detect target leakage in a churn model.",
    "When is target encoding dangerous?",
    "How do you align offline feature logic with online serving?",
  ],
  "ml-encoding": [
    "When is one-hot encoding the wrong choice?",
    "How does target encoding work, and what are its risks?",
    "When would you reach for a learned embedding instead of one-hot?",
  ],

  // ── Trad ML · SVM, KNN, Naive Bayes ──────────────────────────────────────
  "ml-svm": [
    "Explain the kernel trick in plain language.",
    "When does SVM with an RBF kernel still beat a tree-based model?",
    "Why does SVM training scale poorly with dataset size?",
  ],
  "ml-knn": [
    "When is KNN the right baseline?",
    "Why does the curse of dimensionality kill KNN?",
    "How would you make KNN scalable for 100M points?",
  ],
  "ml-naive-bayes": [
    "Why does Naive Bayes work well on text despite the naive independence assumption?",
    "Where does Naive Bayes fail badly?",
    "Compare Naive Bayes vs logistic regression on a small text classification problem.",
  ],

  // ── ML coding · From scratch ─────────────────────────────────────────────
  "ml-code-linreg": [
    "Walk me through your gradient update for linear regression.",
    "How would you extend this to L2 regularization in 5 minutes?",
    "Why might GD diverge — and how would you detect it?",
  ],
  "ml-code-test": [
    "How do you sanity-check that your loss is decreasing for the right reasons?",
    "What does it mean if the loss curve is jagged?",
    "How would you compare convergence between SGD and full-batch GD?",
  ],
  "ml-code-logreg": [
    "Why is the cross-entropy gradient for logistic regression so clean?",
    "How would you handle numerical instability in the sigmoid?",
    "How do you extend binary logistic to multiclass?",
  ],
  "ml-code-kmeans": [
    "Walk me through Lloyd's algorithm step by step.",
    "Why does k-means++ initialization help?",
    "How would you handle empty clusters during iteration?",
  ],

  // ── Deep learning · NN basics ────────────────────────────────────────────
  "dl-forward-back": [
    "Explain backpropagation as if to an engineer who's used PyTorch but never derived gradients.",
    "Walk through forward + backward pass on a 2-layer MLP by hand.",
    "Why does the chain rule make autodiff possible?",
  ],
  "dl-activations": [
    "Why does ReLU help vs sigmoid?",
    "When would you use GELU instead of ReLU?",
    "What's the role of softmax in the cross-entropy gradient?",
  ],

  // ── Deep learning · Optimizers ───────────────────────────────────────────
  "dl-adam": [
    "When does Adam generalize worse than SGD with momentum?",
    "Walk through how Adam updates parameters.",
    "Why is bias correction needed in Adam?",
  ],
  "dl-lr-warmup": [
    "What does LR warmup actually fix?",
    "Walk me through how you'd find a good learning rate for a new model.",
    "When does cosine decay beat step decay?",
  ],

  // ── Deep learning · Regularization ───────────────────────────────────────
  "dl-dropout": [
    "Why does dropout work? Give the ensemble interpretation.",
    "What changes between training and inference with dropout?",
    "Why is dropout less common in modern transformer training?",
  ],
  "dl-weight-decay": [
    "What's the subtle difference between L2 and weight decay in Adam?",
    "Why was AdamW introduced?",
    "When is label smoothing the right call?",
  ],

  // ── Deep learning · Normalization ────────────────────────────────────────
  "dl-batchnorm": [
    "Why does batch norm help? And what's the modern critique?",
    "What goes wrong with batch norm at very small batch sizes?",
    "How does batch norm behave differently at training vs inference?",
  ],
  "dl-layernorm": [
    "Why do transformers use layer norm and not batch norm?",
    "When would you choose group norm over layer norm?",
    "What's the role of normalization in training stability?",
  ],

  // ── Deep learning · CNNs ─────────────────────────────────────────────────
  "dl-cnn-basics": [
    "What's the receptive field after 3 conv layers with kernel 3, stride 1?",
    "Why is parameter sharing in CNNs a strong inductive bias for vision?",
    "When would you choose stride over pooling for downsampling?",
  ],
  "dl-resnet": [
    "Why do residual connections help train deep nets?",
    "What is the degradation problem residuals fix?",
    "When does a CNN beat a transformer for vision today?",
  ],

  // ── Deep learning · Sequence ─────────────────────────────────────────────
  "dl-rnn-vanish": [
    "Walk through the vanishing-gradient problem in vanilla RNNs.",
    "Why don't RNNs parallelize over the time dimension?",
    "How does truncated BPTT work?",
  ],
  "dl-lstm": [
    "What does the cell state in an LSTM actually store?",
    "Compare LSTM vs GRU — when does each win?",
    "Where does a transformer still lose to an LSTM?",
  ],

  // ── Deep learning · Transformers ─────────────────────────────────────────
  "dl-attention": [
    "Walk through self-attention(Q, K, V) end-to-end.",
    "Why is multi-head attention better than one big head?",
    "What are positional encodings and why are they needed?",
  ],
  "dl-self-attention": [
    "Why do transformers scale better than RNNs for long sequences?",
    "What's the cost of self-attention in sequence length, and what mitigations exist?",
    "Compare absolute vs rotary positional embeddings.",
  ],

  // ── GenAI · LLM basics ───────────────────────────────────────────────────
  "llm-pretraining": [
    "What does pretraining actually optimize?",
    "Why is next-token prediction such a powerful objective?",
    "How does masked-LM differ from causal-LM training?",
  ],
  "llm-rlhf": [
    "Walk through RLHF at a high level — what does PPO do here?",
    "What's the practical difference between RLHF and DPO?",
    "Why do LLMs hallucinate? Give a structural explanation.",
  ],

  // ── GenAI · Tokenization ─────────────────────────────────────────────────
  "llm-bpe": [
    "Why does BPE exist instead of word-level or char-level tokenization?",
    "What multilingual edge cases break naive BPE?",
    "How would you handle a domain with lots of new vocabulary?",
  ],
  "llm-embeddings": [
    "How does an embedding model differ from an LLM?",
    "What does cosine similarity actually measure between embeddings?",
    "How would you evaluate embedding quality?",
  ],

  // ── GenAI · Prompting ────────────────────────────────────────────────────
  "llm-fewshot": [
    "When does few-shot prompting hurt vs help?",
    "How would you choose few-shot examples?",
    "Why do some models do better with zero-shot than few-shot?",
  ],
  "llm-cot": [
    "When does CoT prompting hurt vs help?",
    "How does CoT relate to reasoning models like o1?",
    "What goes wrong when you force CoT on tasks that don't need it?",
  ],

  // ── GenAI · RAG ──────────────────────────────────────────────────────────
  "rag-pipeline": [
    "Walk me through chunking trade-offs (size + overlap).",
    "How would you handle citations when the retrieved chunk doesn't actually support the claim?",
    "What's the right refusal behavior when retrieval is weak?",
  ],
  "rag-hybrid": [
    "Why does pure dense retrieval miss product names and error codes?",
    "How would you combine BM25 and dense scores?",
    "When does reciprocal rank fusion beat learned re-ranking?",
  ],

  // ── GenAI · Vector stores ────────────────────────────────────────────────
  "rag-ann": [
    "How does HNSW work at a high level — what's the trade-off vs flat search?",
    "Compare HNSW vs IVF-PQ.",
    "What's the operational cost of re-embedding when the model changes?",
  ],
  "rag-bm25": [
    "When is BM25 better than dense retrieval today?",
    "Walk me through BM25's IDF term and why it matters.",
    "How do you tune BM25 for a new corpus?",
  ],
  "rag-vdb-explain": [
    "When would you actually need a dedicated vector database vs Postgres pgvector?",
    "What's the cost model of a managed vector DB at 1B vectors?",
    "How do you handle filter + vector queries efficiently?",
  ],

  // ── GenAI · Reranking ────────────────────────────────────────────────────
  "rag-rerank": [
    "Cross-encoder vs bi-encoder reranking: cost-vs-quality breakdown.",
    "When does a reranker actually move the needle?",
    "How do you decide which top-K to rerank?",
  ],
  "rag-rerank-llm": [
    "What's the operational cost of an LLM-judge reranker at scale?",
    "When is an LLM reranker worth the latency?",
    "How would you fine-tune a smaller cross-encoder reranker?",
  ],

  // ── GenAI · Evaluation ───────────────────────────────────────────────────
  "llm-eval-faithfulness": [
    "Walk me through evaluating a RAG system end-to-end.",
    "What goes wrong if you only measure BLEU or ROUGE?",
    "How do you measure faithfulness in production?",
  ],
  "llm-eval-judge": [
    "How do you calibrate an LLM-judge against human ratings?",
    "What's the failure mode of an LLM-judge calibrated only against itself?",
    "When is an LLM-judge cheaper than human eval, and when isn't it?",
  ],

  // ── GenAI · Fine-tuning ──────────────────────────────────────────────────
  "llm-lora": [
    "What does LoRA actually update — and why is the update so small?",
    "Walk me through the LoRA matrix decomposition.",
    "When would you use QLoRA over LoRA?",
  ],
  "llm-ft-vs-rag": [
    "When would you fine-tune instead of doing prompt + RAG?",
    "How do you evaluate whether a fine-tune succeeded?",
    "What's the catastrophic-forgetting risk in fine-tuning?",
  ],

  // ── GenAI · Agents ───────────────────────────────────────────────────────
  "llm-agents": [
    "When is a multi-agent architecture justified?",
    "What's the planner / executor split, and why?",
    "How do you stop an agent from looping on a failing tool?",
  ],
  "llm-tool-use": [
    "Walk through how function-calling works at the protocol level.",
    "How do you design tool schemas that the model uses correctly?",
    "What's the right permission model for irreversible tool actions?",
  ],

  // ── GenAI · Safety ───────────────────────────────────────────────────────
  "llm-jailbreak": [
    "Walk me through 4 guardrail layers — what each catches.",
    "How do you red-team a customer-facing agent?",
    "What's the right escalation behavior for an unsure LLM in a support context?",
  ],
  "llm-guardrails": [
    "Compare input filters vs output filters — which catches what?",
    "How would you build a policy classifier for unsafe outputs?",
    "What's the role of system prompts in guardrails?",
  ],

  // ── ML system design · Framework ─────────────────────────────────────────
  "sd-framework": [
    "Walk me through your design framework on a fresh prompt.",
    "What goes wrong if you skip the metrics step?",
    "How do you decide between batch vs realtime inference?",
  ],
  "sd-halina": [
    "What's the structure Patrick Halina recommends for the design interview?",
    "Where do most candidates get stuck in design interviews — and why?",
    "How do you handle the 'I don't know' moment in a design interview?",
  ],
  "sd-scaffold": [
    "Recite the scaffold cold: clarify → metrics → data → model → serving → monitoring → trade-off close.",
    "Why does the trade-off close matter as much as the design itself?",
    "What's the one trade-off you'd defend hardest if pushed?",
  ],

  // ── ML system design · Data ──────────────────────────────────────────────
  "sd-streaming": [
    "When is streaming the right choice — and when is it just complexity?",
    "Walk me through point-in-time correctness for a backfill.",
    "How do you make a data pipeline idempotent?",
  ],
  "sd-schema-evol": [
    "How do you evolve a schema without breaking downstream models?",
    "What's the right backfill discipline for a column rename?",
    "How would you test a schema migration before rolling it out?",
  ],

  // ── ML system design · Feature stores ────────────────────────────────────
  "sd-feast": [
    "When does a feature store earn its complexity vs become overhead?",
    "How do you ensure offline / online parity over months?",
    "What's the failure mode of feature staleness in a fraud model?",
  ],
  "sd-pit-correct": [
    "Walk me through point-in-time correctness for a fraud model backfill.",
    "What goes wrong if you join features without timestamp filtering?",
    "How do you test that point-in-time correctness is preserved?",
  ],

  // ── Read · ML serving ────────────────────────────────────────────────────
  "sd-tritan": [
    "Compare Triton, KServe, and Ray Serve — when each fits.",
    "What's the role of an inference server beyond just running the model?",
    "How do you choose between serverless and dedicated GPU for inference?",
  ],
  "sd-batching": [
    "When does dynamic batching hurt latency more than it helps throughput?",
    "How do you size the max batch size for an LLM inference server?",
    "What's continuous batching and why does it matter for LLMs?",
  ],

  // ── Read · Monitoring ────────────────────────────────────────────────────
  "mlops-evidently": [
    "What metrics would you put on a production ML monitoring dashboard?",
    "How do you separate infra monitoring from model monitoring?",
    "When does drift detection actually trigger retraining?",
  ],
  "mlops-drift": [
    "Compare KS and PSI for drift detection.",
    "How do you set drift thresholds that don't alarm on noise?",
    "What's the difference between feature drift and label drift?",
  ],

  // ── Read · Recsys foundations ────────────────────────────────────────────
  "case-yt-twotower": [
    "Why does the two-tower architecture work for retrieval at YouTube scale?",
    "How does sampling-bias correction work in the two-tower paper?",
    "What are the trade-offs vs a unified ranking model?",
  ],
  "case-tiktok-mono": [
    "Walk me through Eugene Yan's recsys system-design framework.",
    "How would you stage retrieval → ranking → re-ranking with budgets?",
    "What's the role of a re-ranking layer for diversity?",
  ],

  // ── Read · Re-ranking & feedback loops ───────────────────────────────────
  "case-vid-rerank": [
    "How does diversity re-ranking change the user experience?",
    "What feedback-loop pathology would you watch for after launch?",
    "How do you measure serendipity vs accuracy?",
  ],

  // ── Read · Ads ML ────────────────────────────────────────────────────────
  "case-ads-criteo": [
    "Walk me through key ideas from Criteo's display advertising paper.",
    "Why are sparse features the dominant input in CTR models?",
    "How do you handle the cold-start ad problem?",
  ],
  "case-ads-cal": [
    "Why does a ranking-only model break in an auction?",
    "How would you detect calibration drift?",
    "What's the relationship between calibration and revenue?",
  ],

  // ── Read · Search ML ─────────────────────────────────────────────────────
  "case-search-yan": [
    "Walk me through the canonical 3-stage search ranking architecture.",
    "How do you handle query understanding for ambiguous queries?",
    "What does NDCG@10 buy you that CTR doesn't?",
  ],
  "case-search-airbnb": [
    "Why does Airbnb use listing embeddings for search?",
    "How does cold-start work for a brand-new listing?",
    "How would you debias clicks for offline training?",
  ],

  // ── Read · Fraud ML ──────────────────────────────────────────────────────
  "case-fraud-stripe": [
    "Walk me through Stripe Radar at a high level.",
    "How would you handle the cost imbalance between false positives and false negatives?",
    "How do you bootstrap labels for a brand-new fraud type?",
  ],
  "case-fraud-graph": [
    "Why are graph features useful for fraud?",
    "How would you build account-linkage features in real time?",
    "What's the trade-off between graph features and serving latency?",
  ],

  // ── Read · Enterprise RAG ────────────────────────────────────────────────
  "case-rag-langchain": [
    "Walk me through the LangChain RAG cookbook — what would you keep, what would you replace?",
    "How does LangChain's retriever abstraction help vs hurt?",
    "When would you not use a framework like LangChain?",
  ],
  "case-rag-acl": [
    "Where do you enforce ACLs — at retrieval time or after generation? Why?",
    "How do you test for permission leakage?",
    "What's the right refusal behavior when retrieval returns no permitted docs?",
  ],

  // ── Read · Production agents ─────────────────────────────────────────────
  "case-agent-anthropic": [
    "What's an example of an irreversible action that needs hard human-in-the-loop?",
    "How do you keep an agent from looping on a failing tool?",
    "What's your red-team plan for a customer-facing agent?",
  ],
  "case-agent-klarna": [
    "What signals from Klarna's deployment would tell you the agent is succeeding?",
    "What metrics would you watch to catch silent regressions?",
    "How would you handle the long tail of edge-case customer requests?",
  ],

  // ── Read · LLM eval platforms ────────────────────────────────────────────
  "case-eval-genai": [
    "How do you prevent teams from over-fitting to the eval suite (Goodhart)?",
    "How do you make releases gate-block on regressions without slowing iteration?",
    "What's the failure mode of an LLM-judge calibrated only against itself?",
  ],
  "case-eval-ragas": [
    "Walk me through Ragas's faithfulness / answer-relevance / context-precision metrics.",
    "When would you supplement Ragas with human eval?",
    "How do you handle disagreement between evaluators?",
  ],

  // ── Read · Document AI ───────────────────────────────────────────────────
  "case-doc-textract": [
    "When would you build vs buy for OCR?",
    "What's the failure mode of OCR on scanned PDFs vs digital PDFs?",
    "How do you handle layout reconstruction for tables?",
  ],
  "case-doc-layoutlm": [
    "How does LayoutLM use position information that plain LLMs ignore?",
    "When does LayoutLM beat a vision-language model?",
    "How would you fine-tune LayoutLM on a custom form?",
  ],

  // ── Read · Architectures (CV) ────────────────────────────────────────────
  "cv-cnn-fams": [
    "Compare ResNet, EfficientNet, and ConvNeXt — when would you reach for each?",
    "Why did ConvNeXt show CNNs can still match transformers?",
    "What's the role of compound scaling in EfficientNet?",
  ],
  "cv-vit": [
    "When does a ViT beat a CNN, and when doesn't it?",
    "How does the patch embedding work in a ViT?",
    "Why did ViTs need so much pretraining data to match CNNs?",
  ],
  "cv-clip": [
    "How does CLIP enable zero-shot image classification?",
    "Walk me through CLIP's contrastive training objective.",
    "When does CLIP fail catastrophically?",
  ],

  // ── Read · Tasks (CV / NLP) ──────────────────────────────────────────────
  "cv-od": [
    "Compare YOLO, DETR, and SAM — when does each fit?",
    "Why is non-max suppression still the standard post-processing for OD?",
    "How would you handle small-object detection in a custom dataset?",
  ],
  "cv-aug": [
    "Compare RandAugment, CutMix, and MixUp — when each helps.",
    "Why does augmentation help less on very large datasets?",
    "What augmentation strategy would you pick for a small medical-imaging dataset?",
  ],
  "nlp-ner": [
    "Compare BIO vs BILOU tagging — what do you gain with BILOU?",
    "How would you handle nested or overlapping entities?",
    "Why is span-based NER often better than token-level for modern models?",
  ],
  "nlp-summ": [
    "Compare abstractive vs extractive summarization — when each is the right call.",
    "How would you evaluate an abstractive summarizer without a gold reference?",
    "What's the failure mode when the model invents facts in summarization?",
  ],

  // ── Read · Architectures (NLP) ───────────────────────────────────────────
  "nlp-bert": [
    "How does BERT's masked-LM pretraining differ from GPT's causal LM?",
    "When would you use BERT for retrieval vs classification?",
    "Why is BERT no longer state-of-the-art for many NLP tasks?",
  ],
  "nlp-t5": [
    "Why is T5's text-to-text framing useful?",
    "When would you choose an encoder-decoder over a decoder-only model?",
    "How does T5 handle multi-task training?",
  ],
  "nlp-gpt": [
    "Why has the decoder-only architecture won for general LLMs?",
    "How does in-context learning emerge from autoregressive training?",
    "What's the trade-off vs encoder-decoder for tasks like translation?",
  ],

  // ── Read · Architectures (Speech) ────────────────────────────────────────
  "speech-whisper": [
    "How does Whisper handle multiple languages without a language ID input?",
    "Why does Whisper's weak-supervision data pipeline help generalization?",
    "What's Whisper's failure mode for low-resource languages?",
  ],
  "speech-wav2vec": [
    "Walk me through wav2vec 2.0's self-supervised pretraining.",
    "When would you use wav2vec features vs raw mel spectrograms?",
    "How do you fine-tune wav2vec for a new language?",
  ],
  "speech-tts": [
    "Compare VITS, Tortoise, and ElevenLabs at a high level.",
    "What's the trade-off between voice quality and inference latency in TTS?",
    "How would you evaluate TTS quality without humans?",
  ],

  // ── Read · Audio basics ──────────────────────────────────────────────────
  "speech-mel": [
    "Why are mel spectrograms preferred over raw waveforms for ASR?",
    "What's the difference between MFCCs and mel spectrograms?",
    "How does mel-spectrogram resolution affect downstream models?",
  ],
  "speech-stream": [
    "What's the latency-vs-quality trade-off for streaming ASR vs full-utterance ASR?",
    "How does endpointing work in streaming ASR?",
    "Walk me through chunking strategy for an LLM-based real-time transcriber.",
  ],

  // ── Read · RL ────────────────────────────────────────────────────────────
  "rl-mdp": [
    "Define an MDP — state, action, reward, transition, policy.",
    "When does the Markov assumption break in real-world systems?",
    "Compare value iteration vs policy iteration.",
  ],
  "rl-q-learning": [
    "Walk me through Q-learning's update rule.",
    "Why is DQN's target network needed for stability?",
    "How does experience replay help?",
  ],
  "rl-policy-grad": [
    "Walk me through the REINFORCE update.",
    "Why is the clip ratio in PPO there?",
    "Compare on-policy vs off-policy methods.",
  ],
  "rl-rlhf": [
    "Walk me through RLHF as applied RL — what's the reward, what's the policy?",
    "Why is PPO the default in RLHF?",
    "What's the practical difference between RLHF and DPO?",
  ],
  "rl-bandits": [
    "When is a contextual bandit the right model vs a full RL setup?",
    "Walk me through Thompson sampling vs UCB.",
    "How do you handle exploration in a recommender system without hurting metrics?",
  ],

  // ── Read · Recsys deep ───────────────────────────────────────────────────
  "rs-yt-mt": [
    "Walk me through the YouTube multi-task ranking paper.",
    "How does multi-task learning balance engagement vs satisfaction?",
    "How would you weigh tasks when objectives conflict?",
  ],
  "rs-pal": [
    "What is position bias and why does PAL care?",
    "How does PAL correct for position bias at training time?",
    "How would you test if your CTR model has position bias?",
  ],
  "rs-twotower": [
    "Why does the two-tower architecture work at YouTube scale?",
    "How does sampling-bias correction work?",
    "When does a two-tower model lose to a unified ranker?",
  ],
  "rs-yan-discovery": [
    "Walk me through the canonical 3-stage discovery architecture.",
    "How do you handle cold-start at each stage?",
    "What's the role of an exploration budget in discovery?",
  ],
  "rs-cf-collab": [
    "Compare two collaborative-filtering techniques and their strengths / weaknesses.",
    "When does collaborative filtering fail catastrophically?",
    "How would you combine collaborative + content-based signals?",
  ],

  // ── Read · Distributed training ──────────────────────────────────────────
  "dist-ddp": [
    "When do you actually need DDP vs single-node training?",
    "Walk me through the all-reduce step in DDP.",
    "What's the failure mode of DDP at very large model sizes?",
  ],
  "dist-fsdp": [
    "What does FSDP shard, and why does that help?",
    "Compare FSDP and ZeRO — they're related, how?",
    "When would you choose FSDP over DeepSpeed?",
  ],
  "dist-zero": [
    "Walk me through the memory layout under ZeRO-3.",
    "What's the latency cost of ZeRO-3 vs ZeRO-2?",
    "When is ZeRO-Offload actually worth it?",
  ],
  "dist-checkpt": [
    "Explain gradient checkpointing — what does it actually trade?",
    "When is gradient checkpointing worth the recompute cost?",
    "How does it interact with FSDP / mixed precision?",
  ],

  // ── Read · Distributed serving ───────────────────────────────────────────
  "dist-vllm": [
    "Compare vLLM and TensorRT-LLM — when does each fit?",
    "What is paged attention and why does it matter?",
    "How does continuous batching change throughput vs latency?",
  ],
  "dist-quant": [
    "Compare INT8, FP8, and GPTQ quantization — when each fits.",
    "What accuracy hit do you typically see at INT8 vs FP8?",
    "How do you decide if a quantized model meets your eval bar?",
  ],

  // ── Reference · Interview repos ──────────────────────────────────────────
  "sd-khangich": [
    "What's the structure khangich recommends for an ML interview prep schedule?",
    "Which sections of the repo would you prioritize for a senior MLE loop?",
    "How would you adapt the repo for an ML Architect loop?",
  ],
  "sd-alirezadir": [
    "What does alirezadir's repo cover that khangich's doesn't?",
    "Walk me through one design pattern from the repo you'd use in an interview.",
    "How do you avoid memorizing answers from these repos?",
  ],
  "sd-huyen-int": [
    "What's the most useful chapter in Chip Huyen's ML Interviews Book for design rounds?",
    "How would you use the open-ended questions in the book for self-practice?",
    "What did you learn from the book that surprised you?",
  ],
};

// ────────────────────────────────────────────────────────────────────────────

const files = fs
  .readdirSync(root)
  .filter((f) => /^day-\d{3}\.json$/.test(f))
  .sort();

let updated = 0;
let unchanged = 0;
let itemsTouched = 0;
let itemsTotal = 0;
const missing = new Set();

for (const f of files) {
  const filePath = path.join(root, f);
  const day = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let dirty = false;

  for (const track of day.tracks) {
    for (const item of track.items) {
      itemsTotal++;
      if (Q[item.id]) {
        if (
          force ||
          item.interviewQuestions === undefined ||
          item.interviewQuestions.length === 0
        ) {
          item.interviewQuestions = Q[item.id];
          dirty = true;
          itemsTouched++;
        }
      }
    }
  }

  // Identify ML-concept items that DON'T have a question entry, so the
  // user can see what's still missing.
  for (const track of day.tracks) {
    for (const item of track.items) {
      const trackLabel = track.label;
      const looksMl =
        trackLabel.startsWith("Math · ") ||
        trackLabel.startsWith("Stats · ") ||
        trackLabel.startsWith("Trad ML · ") ||
        trackLabel.startsWith("ML coding · ") ||
        trackLabel.startsWith("ML fundamentals · ") ||
        trackLabel.startsWith("Deep learning · ") ||
        trackLabel.startsWith("GenAI · ") ||
        trackLabel.startsWith("ML system design · ") ||
        trackLabel.startsWith("Read · ") ||
        trackLabel.startsWith("Reference · ");
      if (looksMl && !Q[item.id] && !item.interviewQuestions) {
        missing.add(`${item.id}  |  ${item.label}  |  ${trackLabel}`);
      }
    }
  }

  if (dirty) {
    fs.writeFileSync(filePath, JSON.stringify(day, null, 2) + "\n", "utf8");
    updated++;
  } else {
    unchanged++;
  }
}

console.log(`\nFiles updated: ${updated}`);
console.log(`Files unchanged: ${unchanged}`);
console.log(`Items touched: ${itemsTouched}`);
console.log(`Items total across all days: ${itemsTotal}`);
console.log(`Distinct ids in question map: ${Object.keys(Q).length}`);

if (missing.size > 0) {
  console.log(`\nML-looking items NOT in question map (${missing.size}):`);
  for (const m of [...missing].sort()) console.log(`  ${m}`);
}
