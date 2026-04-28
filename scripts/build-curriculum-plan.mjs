// Curriculum: 19 weeks × 7 days = 133 days. No rest days.

export async function build({ TOPICS }) {
  // Week titles
  // Short, scannable week titles. Detailed coverage is conveyed via the
  // per-week tag chips (pillars + DSA categories) in HomeRoadmap.
  const WEEKS = [
    { week: 1,  title: "Probability & inference" },
    { week: 2,  title: "Linear algebra & optimization" },
    { week: 3,  title: "Linear & logistic regression" },
    { week: 4,  title: "Trees, GBDT, classification" },
    { week: 5,  title: "Clustering, features, OOPS" },
    { week: 6,  title: "Neural network foundations" },
    { week: 7,  title: "Computer Vision" },
    { week: 8,  title: "NLP & Transformers" },
    { week: 9,  title: "MLOps foundations" },
    { week: 10, title: "MLOps at scale" },
    { week: 11, title: "LLM foundations" },
    { week: 12, title: "RAG" },
    { week: 13, title: "Agents, fine-tuning, alignment" },
    { week: 14, title: "Distributed training & inference" },
    { week: 15, title: "Specializations: Speech, RL, RecSys" },
    { week: 16, title: "ML system design — classics" },
    { week: 17, title: "ML system design — GenAI" },
    { week: 18, title: "Trade-offs & self-mocks" },
    { week: 19, title: "Mocks & behavioral" },
  ];

  // Curriculum: each entry produces one day JSON
  // Schema: { day, title, focus, pillar, dsa?, dsa2?, topics, references? }
  const C = [];

  // ─── Week 1: Probability, distributions, hypothesis testing + DSA Arrays/Hashing & Two Pointers ───
  C.push({
    day: 1, title: "Probability fundamentals + DSA Arrays/Hashing kickoff",
    focus: "Open the loop: probability axioms, conditional probability, Bayes' theorem; ease into the easiest NeetCode pattern.",
    pillar: "math-stats",
    dsa: ["Arrays & Hashing", 0, 3],
    topics: ["probability-fundamentals"],
    references: ["loganRoadmap", "neetcode", "ncVideos", "lcPatterns", "yuanMeng", "andrewNg", "statQuest", "khanProb", "seeingTheory"],
  });
  C.push({
    day: 2, title: "Distributions you'll see in interviews + DSA Arrays/Hashing",
    focus: "Bernoulli/Binomial/Poisson/Normal/Exponential. CLT intuition. More NeetCode arrays/hashing.",
    pillar: "math-stats",
    dsa: ["Arrays & Hashing", 3, 3],
    topics: ["distributions"],
    references: ["statQuest", "seeingTheory", "andrewNg", "neetcode", "ncVideos"],
  });
  C.push({
    day: 3, title: "Hypothesis testing + DSA Arrays/Hashing finish",
    focus: "p-values, t/z/chi-squared/ANOVA, type I/II error, multiple testing.",
    pillar: "math-stats",
    dsa: ["Arrays & Hashing", 6, 3],
    topics: ["hypothesis-testing"],
    references: ["statQuest", "seeingTheory", "evanMillerAB", "neetcode"],
  });
  C.push({
    day: 4, title: "Confidence intervals + bootstrapping + DSA Two Pointers",
    focus: "CIs, bootstrap, frequentist vs Bayesian; start the Two Pointers pattern.",
    pillar: "math-stats",
    dsa: ["Two Pointers", 0, 3],
    topics: ["confidence-intervals"],
    references: ["statQuest", "seeingTheory", "neetcode", "ncVideos"],
  });
  C.push({
    day: 5, title: "A/B testing in production + DSA Two Pointers finish",
    focus: "MDE, sample size, SRM, peeking, CUPED — the four things that ruin tests.",
    pillar: "math-stats",
    dsa: ["Two Pointers", 3, 2],
    topics: ["ab-testing"],
    references: ["evanMillerAB", "statQuest", "neetcode"],
  });
  C.push({
    day: 6, title: "Sampling, bias, resampling — and pattern review",
    focus: "Random/stratified/cluster/importance sampling. Selection/survivorship bias.",
    pillar: "math-stats",
    dsa: ["Sliding Window", 0, 2],
    topics: ["sampling"],
    references: ["statQuest", "imbalancedLearn", "neetcode"],
  });
  C.push({
    day: 7, title: "Stats consolidation + DSA Sliding Window kickoff",
    focus: "Quick recap of week 1 stats; rehearse Bayes, CLT, p-values, A/B; start Sliding Window.",
    pillar: "math-stats",
    dsa: ["Sliding Window", 2, 2],
    topics: ["probability-fundamentals", "ab-testing"],
    references: ["statQuest", "seeingTheory", "evanMillerAB"],
  });

  // ─── Week 2: Linear algebra, calculus, optimization + DSA Math & Geometry ───
  C.push({
    day: 8, title: "Linear algebra essentials + DSA Math & Geometry",
    focus: "Vectors, matrices, dot product, norms — the operations under everything.",
    pillar: "math-stats",
    dsa: ["Math & Geometry", 0, 3],
    topics: ["linear-algebra"],
    references: ["threeBlueLinalg", "khanLinalg", "strang", "neetcode"],
  });
  C.push({
    day: 9, title: "Eigenvalues & condition number + DSA Math & Geometry",
    focus: "Eigen-decompositions, spectral theorem, why condition number matters in training.",
    pillar: "math-stats",
    dsa: ["Math & Geometry", 3, 3],
    topics: ["eigen"],
    references: ["threeBlueLinalg", "strang", "khanLinalg"],
  });
  C.push({
    day: 10, title: "SVD, PCA, t-SNE, UMAP + DSA Math & Geometry finish",
    focus: "Workhorse decomposition, dimensionality reduction, when to read which plot.",
    pillar: "math-stats",
    dsa: ["Math & Geometry", 6, 2],
    topics: ["svd-pca"],
    references: ["threeBlueLinalg", "statQuest", "strang"],
  });
  C.push({
    day: 11, title: "Calculus & gradients + DSA Bit Manipulation kickoff",
    focus: "Chain rule, partial derivatives, Jacobians, Hessians — what backprop will use.",
    pillar: "math-stats",
    dsa: ["Bit Manipulation", 0, 3],
    topics: ["calculus"],
    references: ["threeBlueCalc", "khanLinalg", "neetcode"],
  });
  C.push({
    day: 12, title: "Optimization for ML: SGD → Adam → AdamW",
    focus: "Convexity, momentum, adaptive optimizers, schedulers. The interview classic.",
    pillar: "math-stats",
    dsa: ["Bit Manipulation", 3, 2],
    topics: ["optimization"],
    references: ["threeBlueCalc", "andrewNg", "googleMlCrash"],
  });
  C.push({
    day: 13, title: "Bias-variance, double descent, learning curves",
    focus: "The framing every model debugging conversation falls back on.",
    pillar: "math-stats",
    dsa: ["Bit Manipulation", 5, 2],
    topics: ["bias-variance"],
    references: ["statQuest", "andrewNg", "googleMlCrash"],
  });
  C.push({
    day: 14, title: "Math/stats consolidation + DSA Sliding Window finish",
    focus: "Recap weeks 1-2 with rehearsed answers. Wrap Sliding Window pattern.",
    pillar: "math-stats",
    dsa: ["Sliding Window", 4, 2],
    topics: ["bias-variance", "optimization"],
    references: ["statQuest", "andrewNg", "neetcode"],
  });

  // ─── Week 3: Linear/Logistic regression + DSA Sliding Window ───
  C.push({
    day: 15, title: "Linear regression deep dive + DSA Stack kickoff",
    focus: "OLS derivation, MLE under Gaussian noise, assumptions, loss choice.",
    pillar: "traditional-ml",
    dsa: ["Stack", 0, 3],
    topics: ["linear-regression"],
    references: ["andrewNg", "statQuest", "sklearnUg", "neetcode"],
  });
  C.push({
    day: 16, title: "Logistic regression + classification metrics + DSA Stack",
    focus: "Cross-entropy, ROC vs PR, calibration, threshold selection.",
    pillar: "traditional-ml",
    dsa: ["Stack", 3, 2],
    topics: ["logistic-regression"],
    references: ["andrewNg", "statQuest", "sklearnUg"],
  });
  C.push({
    day: 17, title: "Regularization (L1, L2, ElasticNet) + DSA Stack finish",
    focus: "Sparsity geometry, Bayesian priors, why ElasticNet exists.",
    pillar: "traditional-ml",
    dsa: ["Stack", 5, 2],
    topics: ["regularization"],
    references: ["andrewNg", "statQuest", "sklearnUg"],
  });
  C.push({
    day: 18, title: "Cross-validation & data leakage + DSA Binary Search",
    focus: "k-fold, stratified, time-series CV, nested CV, leak prevention.",
    pillar: "traditional-ml",
    dsa: ["Binary Search", 0, 3],
    topics: ["cross-validation"],
    references: ["sklearnUg", "andrewNg", "neetcode"],
  });
  C.push({
    day: 19, title: "Decision trees + DSA Binary Search",
    focus: "Splits (Gini/entropy), pruning, why trees are high-variance.",
    pillar: "traditional-ml",
    dsa: ["Binary Search", 3, 2],
    topics: ["decision-trees"],
    references: ["statQuest", "sklearnUg", "andrewNg"],
  });
  C.push({
    day: 20, title: "Bagging, Random Forest, boosting intuition + DSA Binary Search finish",
    focus: "Variance reduction vs bias reduction; bagging vs boosting.",
    pillar: "traditional-ml",
    dsa: ["Binary Search", 5, 2],
    topics: ["ensembles"],
    references: ["statQuest", "sklearnUg"],
  });
  C.push({
    day: 21, title: "Hyperparameter tuning — random > grid; Bayes / Hyperband",
    focus: "Search spaces, pruning bad runs early.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 0, 2],
    topics: ["hyperparam-tuning"],
    references: ["sklearnUg", "xgboostDocs"],
  });

  // ─── Week 4: Trees, GBDT, imbalance, SVM/kNN + DSA Linked List ───
  C.push({
    day: 22, title: "Gradient boosting (XGBoost, LightGBM, CatBoost) + DSA Linked List",
    focus: "Why GBDT beats RF on tabular. XGBoost tricks. Pick one and tune.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 2, 2],
    topics: ["gbdt"],
    references: ["xgboostDocs", "lightgbmDocs", "statQuest"],
  });
  C.push({
    day: 23, title: "Imbalanced classification + DSA Linked List",
    focus: "SMOTE / class weights / focal loss. PR-AUC, F-beta, MCC.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 4, 2],
    topics: ["imbalance"],
    references: ["imbalancedLearn", "sklearnUg", "yan"],
  });
  C.push({
    day: 24, title: "SVM, kNN, Naive Bayes + DSA Linked List",
    focus: "Kernel trick, curse of dimensionality, generative vs discriminative.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 6, 2],
    topics: ["svm-knn"],
    references: ["statQuest", "sklearnUg"],
  });
  C.push({
    day: 25, title: "Clustering: k-means, DBSCAN, hierarchical + DSA Linked List",
    focus: "Lloyd's algorithm, cluster count selection, when DBSCAN beats k-means.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 8, 2],
    topics: ["clustering"],
    references: ["statQuest", "sklearnUg"],
  });
  C.push({
    day: 26, title: "Feature engineering deep dive + DSA Linked List finish",
    focus: "Scaling, encoding, missing values, feature interactions.",
    pillar: "traditional-ml",
    dsa: ["Linked List", 10, 1],
    topics: ["feature-engineering"],
    references: ["sklearnUg", "yan"],
  });
  C.push({
    day: 27, title: "Feature selection (filter / wrapper / embedded / SHAP)",
    focus: "Mutual information, L1, permutation, SHAP — fair attributions.",
    pillar: "traditional-ml",
    dsa: ["Tries", 0, 3],
    topics: ["feature-selection"],
    references: ["sklearnUg", "yan"],
  });
  C.push({
    day: 28, title: "ML coding from scratch — k-means, kNN, logistic regression",
    focus: "Implement, time, debug. The most-skipped form of practice.",
    pillar: "traditional-ml",
    dsa: ["Heap / Priority Queue", 0, 2],
    topics: ["ml-coding"],
    references: ["alirezadir", "khangich", "chipHuyenInt"],
  });

  // ─── Week 5: OOPS / SOLID / patterns / concurrency + DSA Heap ───
  C.push({
    day: 29, title: "OOPS pillars & SOLID principles + DSA Heap",
    focus: "SRP, OCP, LSP, ISP, DIP — pick the one you violate most and refactor.",
    pillar: "foundations",
    dsa: ["Heap / Priority Queue", 2, 2],
    topics: ["oops-solid"],
    references: ["solid", "refactoringGuru"],
  });
  C.push({
    day: 30, title: "Design patterns — creational / structural / behavioral + DSA Heap",
    focus: "Factory, builder, adapter, strategy, observer — and when each is wrong.",
    pillar: "foundations",
    dsa: ["Heap / Priority Queue", 4, 2],
    topics: ["design-patterns"],
    references: ["refactoringGuru"],
  });
  C.push({
    day: 31, title: "Concurrency in Python: GIL, asyncio, multiprocessing + DSA Heap finish",
    focus: "When threads help, when they don't; futures and queues for ML pipelines.",
    pillar: "foundations",
    dsa: ["Heap / Priority Queue", 6, 1],
    topics: ["concurrency"],
    references: ["realPython"],
  });
  C.push({
    day: 32, title: "ML coding consolidation + design pattern review",
    focus: "Re-implement one classifier with a clean OO API. Reflect on SOLID violations.",
    pillar: "traditional-ml",
    dsa: ["Two Pointers", 4, 1],
    topics: ["ml-coding", "design-patterns"],
    references: ["alirezadir", "refactoringGuru"],
  });
  C.push({
    day: 33, title: "Trad-ML breadth review (regression, trees, ensembles, clustering)",
    focus: "60-min self-quiz on weeks 3-4. Note the questions you fumble.",
    pillar: "traditional-ml",
    dsa: ["Stack", 4, 1],
    topics: ["linear-regression", "gbdt"],
    references: ["statQuest", "sklearnUg"],
  });
  C.push({
    day: 34, title: "Trad-ML pitfall drills (leakage, imbalance, calibration)",
    focus: "The three failure modes that show up in nearly every ML interview.",
    pillar: "traditional-ml",
    dsa: ["Binary Search", 5, 1],
    topics: ["cross-validation", "imbalance"],
    references: ["sklearnUg", "yan"],
  });
  C.push({
    day: 35, title: "Trad-ML consolidation + week-5 wrap",
    focus: "Wrap classical ML; record yourself answering the 5 hardest questions.",
    pillar: "traditional-ml",
    dsa: ["Heap / Priority Queue", 5, 1],
    topics: ["regularization", "feature-engineering"],
    references: ["statQuest", "andrewNg"],
  });

  // ─── Week 6: NN foundations + DSA Trees ───
  C.push({
    day: 36, title: "NN basics: perceptron, MLP, activations + DSA Trees",
    focus: "Forward pass, why XOR needs hidden layers, ReLU vs sigmoid vs GELU.",
    pillar: "deep-learning",
    dsa: ["Trees", 0, 3],
    topics: ["nn-basics"],
    references: ["dlaiSpec", "fastAi", "udlBook", "karpathyMakemore", "neetcode"],
  });
  C.push({
    day: 37, title: "Backpropagation & autograd + DSA Trees",
    focus: "Backprop as the chain rule on a computation graph. PyTorch autograd basics.",
    pillar: "deep-learning",
    dsa: ["Trees", 3, 3],
    topics: ["backprop"],
    references: ["karpathyMakemore", "dlaiSpec", "fastAi"],
  });
  C.push({
    day: 38, title: "DL optimizers in practice + DSA Trees",
    focus: "Adam vs AdamW vs SGD+momentum. Warmup, cosine, OneCycle.",
    pillar: "deep-learning",
    dsa: ["Trees", 6, 2],
    topics: ["dl-optimizers"],
    references: ["fastAi", "dlaiSpec", "d2l"],
  });
  C.push({
    day: 39, title: "DL regularization (dropout, BN/LN/RMSNorm, augmentation) + DSA Trees",
    focus: "Why transformers prefer LayerNorm. Mixup. When dropout hurts.",
    pillar: "deep-learning",
    dsa: ["Trees", 8, 2],
    topics: ["dl-regularization"],
    references: ["dlaiSpec", "d2l", "fastAi"],
  });
  C.push({
    day: 40, title: "DL loss functions + DSA Trees",
    focus: "Cross-entropy, label smoothing, focal, contrastive (InfoNCE), CTC.",
    pillar: "deep-learning",
    dsa: ["Trees", 10, 2],
    topics: ["dl-losses"],
    references: ["dlaiSpec", "d2l", "fastAi"],
  });
  C.push({
    day: 41, title: "DL training tricks (clipping, accum, mixed precision, checkpointing) + DSA Trees",
    focus: "How real teams fit big models on small GPUs.",
    pillar: "deep-learning",
    dsa: ["Trees", 12, 2],
    topics: ["dl-training"],
    references: ["dlaiSpec", "fastAi", "mitMlEff"],
  });
  C.push({
    day: 42, title: "DL foundations consolidation + DSA Trees finish",
    focus: "Run 60-min concept self-quiz on weeks 6 so far; finalize Trees pattern.",
    pillar: "deep-learning",
    dsa: ["Trees", 14, 1],
    topics: ["nn-basics", "backprop"],
    references: ["dlaiSpec", "fastAi", "udlBook"],
  });

  // ─── Week 7: CV deep dive + DSA Heap (continued) / Tries ───
  C.push({
    day: 43, title: "CNN basics: conv, pool, receptive field + DSA Heap",
    focus: "Compute output shapes. Receptive field of stacked 3×3 vs one 7×7.",
    pillar: "deep-learning",
    dsa: ["Heap / Priority Queue", 5, 2],
    topics: ["cnn-basics"],
    references: ["cs231n", "fastAi", "kaggleCv"],
  });
  C.push({
    day: 44, title: "CNN architectures (AlexNet → ResNet → EfficientNet) + DSA Tries",
    focus: "What problem each generation solved. Residuals, 1×1 convs, depthwise separable.",
    pillar: "deep-learning",
    dsa: ["Tries", 0, 2],
    topics: ["cnn-architectures"],
    references: ["cs231n", "resnet", "fastAi"],
  });
  C.push({
    day: 45, title: "Transfer learning for vision + DSA Tries finish",
    focus: "Freeze vs fine-tune; AutoAugment vs RandAugment.",
    pillar: "deep-learning",
    dsa: ["Tries", 2, 1],
    topics: ["cnn-transfer"],
    references: ["fastAi", "kaggleCv", "cs231n"],
  });
  C.push({
    day: 46, title: "Object detection (R-CNN family, YOLO, DETR)",
    focus: "Two-stage vs one-stage; how DETR removes anchors and NMS.",
    pillar: "deep-learning",
    dsa: ["Backtracking", 0, 2],
    topics: ["detection-segmentation"],
    references: ["cs231n", "paperWithCode", "kaggleCv"],
  });
  C.push({
    day: 47, title: "ViT, CLIP, multimodal LLMs",
    focus: "Patch tokenization, [CLS] token, contrastive image-text training.",
    pillar: "deep-learning",
    dsa: ["Backtracking", 2, 2],
    topics: ["vit-clip"],
    references: ["vit", "clip", "paperWithCode"],
  });
  C.push({
    day: 48, title: "Generative vision (VAE, GAN, Diffusion / Stable Diffusion)",
    focus: "ELBO, mode collapse, DDPM forward/reverse, latent diffusion.",
    pillar: "deep-learning",
    dsa: ["Backtracking", 4, 2],
    topics: ["generative-vision"],
    references: ["paperWithCode", "fastAi", "d2l"],
  });
  C.push({
    day: 49, title: "CV consolidation + DSA Backtracking",
    focus: "Run 60-min CV breadth quiz; rehearse mAP, IoU, U-Net, DETR.",
    pillar: "deep-learning",
    dsa: ["Backtracking", 6, 1],
    topics: ["cnn-architectures", "vit-clip"],
    references: ["cs231n", "paperWithCode"],
  });

  // ─── Week 8: NLP, Transformers, BERT/T5/GPT + DSA Backtracking finish ───
  C.push({
    day: 50, title: "NLP foundations: tokenization & embeddings",
    focus: "BPE/WordPiece/SentencePiece. word2vec → BERT contextual embeddings.",
    pillar: "deep-learning",
    dsa: ["Backtracking", 7, 2],
    topics: ["nlp-foundations"],
    references: ["hfNlp", "cs224n", "illustratedTransformer"],
  });
  C.push({
    day: 51, title: "RNN, LSTM, GRU — and why we left them",
    focus: "Vanishing gradients, LSTM gates, why transformers won.",
    pillar: "deep-learning",
    dsa: ["Graphs", 0, 2],
    topics: ["rnn-lstm"],
    references: ["dlaiSpec", "cs224n", "d2l"],
  });
  C.push({
    day: 52, title: "Attention & Transformer (Q,K,V) + Graphs",
    focus: "Self-attention end-to-end; multi-head, RoPE, FlashAttention, MQA/GQA.",
    pillar: "deep-learning",
    dsa: ["Graphs", 2, 2],
    topics: ["attention-transformer"],
    references: ["attentionPaper", "illustratedTransformer", "cs224n"],
  });
  C.push({
    day: 53, title: "Pretrained models — BERT, T5, GPT + DSA Graphs",
    focus: "Encoder-only vs encoder-decoder vs decoder-only; MLM vs causal LM.",
    pillar: "deep-learning",
    dsa: ["Graphs", 4, 2],
    topics: ["bert-t5-gpt"],
    references: ["bert", "hfNlp", "illustratedTransformer"],
  });
  C.push({
    day: 54, title: "NLP practical tasks: NER, summarization, MT + DSA Graphs",
    focus: "BIO tagging vs span-based; ROUGE / BERTScore / LLM-as-judge; beam search.",
    pillar: "deep-learning",
    dsa: ["Graphs", 6, 2],
    topics: ["nlp-tasks-deep"],
    references: ["hfNlp", "cs224n"],
  });
  C.push({
    day: 55, title: "DL/NLP consolidation + DSA Graphs",
    focus: "60-min DL breadth quiz; rehearse self-attention, BERT, T5, transfer learning.",
    pillar: "deep-learning",
    dsa: ["Graphs", 8, 2],
    topics: ["attention-transformer", "bert-t5-gpt"],
    references: ["illustratedTransformer", "cs224n"],
  });
  C.push({
    day: 56, title: "Deep learning wrap + DSA Graphs finish",
    focus: "Re-record CV + NLP breadth answers; identify shaky topics for re-study.",
    pillar: "deep-learning",
    dsa: ["Graphs", 10, 3],
    topics: ["nn-basics", "vit-clip", "attention-transformer"],
    references: ["dlaiSpec", "cs224n", "cs231n"],
  });

  // ─── Week 9: MLOps foundations + DSA Advanced Graphs ───
  C.push({
    day: 57, title: "ML lifecycle, roles, team topology + DSA Adv Graphs",
    focus: "End-to-end map of failure modes; researcher vs MLE vs MLOps.",
    pillar: "mlops",
    dsa: ["Advanced Graphs", 0, 2],
    topics: ["ml-lifecycle"],
    references: ["madeWithMl", "chipHuyenDesign", "yan", "fsdl"],
  });
  C.push({
    day: 58, title: "Feature stores (Feast, Tecton) + point-in-time correctness + DSA Adv Graphs",
    focus: "Training/serving skew, offline/online stores, PIT joins.",
    pillar: "mlops",
    dsa: ["Advanced Graphs", 2, 2],
    topics: ["feature-stores"],
    references: ["feast", "yan", "madeWithMl"],
  });
  C.push({
    day: 59, title: "Model registry, versioning, lineage + DSA Adv Graphs finish",
    focus: "MLflow stages; data + code + model versioning; model cards.",
    pillar: "mlops",
    dsa: ["Advanced Graphs", 4, 2],
    topics: ["model-registry"],
    references: ["mlflow", "madeWithMl"],
  });
  C.push({
    day: 60, title: "Training pipelines & experiment tracking",
    focus: "Airflow vs Kubeflow vs Prefect; MLflow / W&B; reproducibility traps.",
    pillar: "mlops",
    dsa: ["1-D DP", 0, 2],
    topics: ["training-pipelines"],
    references: ["mlflow", "madeWithMl", "fsdl"],
  });
  C.push({
    day: 61, title: "CI/CD for ML (CD4ML) + DSA 1-D DP",
    focus: "Code + data + model + deployment pipelines; tests for ML.",
    pillar: "mlops",
    dsa: ["1-D DP", 2, 2],
    topics: ["ci-cd-ml"],
    references: ["yan", "madeWithMl", "fsdl"],
  });
  C.push({
    day: 62, title: "Deployment patterns: batch / real-time / streaming / edge + DSA 1-D DP",
    focus: "Latency budgets, async inference, when to push to device.",
    pillar: "mlops",
    dsa: ["1-D DP", 4, 2],
    topics: ["deployment-patterns"],
    references: ["chipHuyenDesign", "fsdl"],
  });
  C.push({
    day: 63, title: "Serving infrastructure: Triton / TorchServe / BentoML / k8s + DSA 1-D DP",
    focus: "Dynamic batching, KServe, autoscaling, safe rollback.",
    pillar: "mlops",
    dsa: ["1-D DP", 6, 2],
    topics: ["serving-infra"],
    references: ["fsdl", "yan"],
  });

  // ─── Week 10: MLOps - serving, monitoring, cost, privacy + DSA Greedy/Intervals ───
  C.push({
    day: 64, title: "Monitoring & drift (data / concept / label) + DSA 1-D DP",
    focus: "PSI / KS / JS for drift; closed-loop retraining; delayed labels.",
    pillar: "mlops",
    dsa: ["1-D DP", 8, 2],
    topics: ["monitoring-drift"],
    references: ["evidently", "arizeAi", "yan"],
  });
  C.push({
    day: 65, title: "Online experimentation for ML + DSA 1-D DP finish",
    focus: "A/B for models vs UI; shadow / canary / interleaving / off-policy.",
    pillar: "mlops",
    dsa: ["1-D DP", 10, 2],
    topics: ["ab-prod"],
    references: ["yan", "evanMillerAB"],
  });
  C.push({
    day: 66, title: "Cost & scaling (autoscaling, spot, distillation) + DSA 2-D DP",
    focus: "Unit-cost-per-prediction; KEDA scaling; spot training without losing work.",
    pillar: "mlops",
    dsa: ["2-D DP", 0, 2],
    topics: ["cost-scale"],
    references: ["chipHuyenDesign", "fsdl", "yan"],
  });
  C.push({
    day: 67, title: "Privacy & security: PII, DP, federated, attacks + DSA 2-D DP",
    focus: "K-anonymity, ε in DP, model-extraction defenses.",
    pillar: "mlops",
    dsa: ["2-D DP", 2, 2],
    topics: ["privacy-security"],
    references: ["fsdl", "yan"],
  });
  C.push({
    day: 68, title: "Multi-tenant & multi-region serving + DSA 2-D DP",
    focus: "Per-tenant LoRA vs base+adapter; data residency; noisy neighbors.",
    pillar: "mlops",
    dsa: ["2-D DP", 4, 2],
    topics: ["multi-tenant"],
    references: ["fsdl", "vllm"],
  });
  C.push({
    day: 69, title: "Observability for ML systems + DSA 2-D DP",
    focus: "Logs / metrics / traces; LLM-specific dimensions; SLOs and alerts.",
    pillar: "mlops",
    dsa: ["2-D DP", 6, 2],
    topics: ["observability"],
    references: ["langsmith", "arizeAi", "yan"],
  });
  C.push({
    day: 70, title: "Build vs buy + MLOps consolidation + DSA 2-D DP",
    focus: "Decision framework + vendor evaluation; finish a 60-min MLOps quiz.",
    pillar: "mlops",
    dsa: ["2-D DP", 8, 2],
    topics: ["build-vs-buy", "monitoring-drift"],
    references: ["yan", "fsdl", "chipHuyenDesign"],
  });

  // ─── Week 11: GenAI — LLM foundations + DSA 2-D DP finish / Greedy ───
  C.push({
    day: 71, title: "LLM foundations: pretraining, scaling laws, KV cache + DSA 2-D DP",
    focus: "Chinchilla scaling, decoder-only at inference, emergent abilities debate.",
    pillar: "generative-ai",
    dsa: ["2-D DP", 10, 1],
    topics: ["llm-basics"],
    references: ["karpathyLlm", "labonneLlm", "hfLlm", "illustratedTransformer"],
  });
  C.push({
    day: 72, title: "Tokenization deep dive (BPE step-by-step) + DSA Greedy",
    focus: "Why tokenization breaks math; vocab size trade-offs.",
    pillar: "generative-ai",
    dsa: ["Greedy", 0, 2],
    topics: ["tokenization-deep"],
    references: ["hfLlm", "labonneLlm"],
  });
  C.push({
    day: 73, title: "Decoding strategies + speculative decoding + JSON mode + DSA Greedy",
    focus: "Greedy/beam/top-k/top-p/temperature; constrained generation.",
    pillar: "generative-ai",
    dsa: ["Greedy", 2, 2],
    topics: ["llm-decoding"],
    references: ["hfLlm", "vllm", "oaiDocs"],
  });
  C.push({
    day: 74, title: "Prompt engineering + CoT + ReAct + DSA Greedy",
    focus: "Few-shot vs zero-shot; CoT; jailbreak defense.",
    pillar: "generative-ai",
    dsa: ["Greedy", 4, 2],
    topics: ["prompting"],
    references: ["anthropicPrompt", "dlaiGenai"],
  });
  C.push({
    day: 75, title: "Function calling, tool use, MCP + DSA Greedy finish",
    focus: "Schemas, retries, hallucinated args; MCP architecture.",
    pillar: "generative-ai",
    dsa: ["Greedy", 6, 2],
    topics: ["function-calling"],
    references: ["oaiDocs", "anthropicAgents", "mcp"],
  });
  C.push({
    day: 76, title: "Reasoning models (o1/o3, Claude thinking) + DSA Intervals",
    focus: "Test-time compute; CoT vs ToT vs self-consistency.",
    pillar: "generative-ai",
    dsa: ["Intervals", 0, 2],
    topics: ["reasoning-models"],
    references: ["oaiReason", "anthropicAgents"],
  });
  C.push({
    day: 77, title: "LLM evaluation + benchmarks + LLM-as-judge + DSA Intervals",
    focus: "Perplexity vs MMLU vs GPQA vs SWE-bench; judge calibration.",
    pillar: "generative-ai",
    dsa: ["Intervals", 2, 2],
    topics: ["llm-eval"],
    references: ["paperWithCode", "anthropicEval"],
  });

  // ─── Week 12: GenAI — RAG + DSA Intervals ───
  C.push({
    day: 78, title: "RAG foundations: pipeline + chunking + DSA Intervals",
    focus: "When RAG vs FT; latency in retrieve→rerank→generate; chunk strategies.",
    pillar: "generative-ai",
    dsa: ["Intervals", 4, 2],
    topics: ["rag-basics"],
    references: ["langchainRag", "pinecone", "ragas"],
  });
  C.push({
    day: 79, title: "Embeddings + vector DBs + ANN indexes",
    focus: "MTEB; pgvector vs Pinecone vs Weaviate vs Qdrant; HNSW vs IVF.",
    pillar: "generative-ai",
    dsa: ["1-D DP", 11, 1],
    topics: ["embeddings-vectors"],
    references: ["pinecone", "hfLlm", "langchainRag"],
  });
  C.push({
    day: 80, title: "Retrieval strategies: dense / sparse / hybrid / HyDE",
    focus: "BM25 + dense fusion; HyDE; multi-query; multi-hop.",
    pillar: "generative-ai",
    dsa: ["2-D DP", 9, 1],
    topics: ["retrieval-strategies"],
    references: ["pinecone", "langchainRag"],
  });
  C.push({
    day: 81, title: "Reranking: cross-encoders, Cohere/BGE rerank, MMR",
    focus: "Bi-encoder retrieve + cross-encoder rerank — the two-stage pattern.",
    pillar: "generative-ai",
    dsa: ["2-D DP", 7, 1],
    topics: ["reranking"],
    references: ["pinecone", "langchainRag"],
  });
  C.push({
    day: 82, title: "RAG evaluation: Ragas + LLM-as-judge + DSA Heap review",
    focus: "Faithfulness, context precision/recall, answer relevance.",
    pillar: "generative-ai",
    dsa: ["Heap / Priority Queue", 6, 1],
    topics: ["rag-eval"],
    references: ["ragas", "evidently", "anthropicEval"],
  });
  C.push({
    day: 83, title: "Advanced RAG: parent-child, GraphRAG, fine-tuned embeddings",
    focus: "Auto-merging retrievers; GraphRAG for multi-hop; when to fine-tune embeddings.",
    pillar: "generative-ai",
    dsa: ["Trees", 13, 1],
    topics: ["advanced-rag"],
    references: ["langchainRag", "pinecone"],
  });
  C.push({
    day: 84, title: "Long-context vs RAG; agentic RAG; prompt caching",
    focus: "1M+ contexts; agent loops over retrieval; cost via caching.",
    pillar: "generative-ai",
    dsa: ["Backtracking", 8, 1],
    topics: ["long-context-rag"],
    references: ["anthropicPrompt", "langchainRag"],
  });

  // ─── Week 13: GenAI — agents, FT, alignment, guardrails, MCP ───
  C.push({
    day: 85, title: "LLM agents: ReAct, Plan-and-Execute, memory + DSA review",
    focus: "When to use an agent; designing memory for long-running agents.",
    pillar: "generative-ai",
    dsa: ["Linked List", 9, 1],
    topics: ["agents"],
    references: ["anthropicAgents", "labonneLlm"],
  });
  C.push({
    day: 86, title: "Multi-agent systems: orchestration patterns + DSA review",
    focus: "Supervisor / swarm / hierarchical; AutoGen / CrewAI / LangGraph.",
    pillar: "generative-ai",
    dsa: ["Stack", 6, 1],
    topics: ["multi-agent"],
    references: ["anthropicAgents", "labonneLlm"],
  });
  C.push({
    day: 87, title: "Fine-tuning: full vs LoRA vs QLoRA + DSA review",
    focus: "When FT beats RAG; LoRA decomposition; data curation for FT.",
    pillar: "generative-ai",
    dsa: ["Sliding Window", 5, 1],
    topics: ["fine-tuning"],
    references: ["loraPaper", "hfPeft", "labonneLlm"],
  });
  C.push({
    day: 88, title: "Alignment: SFT, RLHF, DPO/IPO/KTO/ORPO + DSA review",
    focus: "RLHF three stages; reward hacking; why DPO is simpler.",
    pillar: "generative-ai",
    dsa: ["Heap / Priority Queue", 4, 1],
    topics: ["alignment"],
    references: ["hfPeft", "labonneLlm", "anthropicAgents"],
  });
  C.push({
    day: 89, title: "Guardrails & safety: input/output filters, jailbreaks, red-teaming",
    focus: "Defense-in-depth; classify the major jailbreak categories.",
    pillar: "generative-ai",
    dsa: ["Greedy", 7, 1],
    topics: ["guardrails"],
    references: ["anthropicEval", "anthropicAgents"],
  });
  C.push({
    day: 90, title: "Agent protocols: MCP & A2A deep dive",
    focus: "MCP host/client/server; A2A; shared tool registries.",
    pillar: "generative-ai",
    dsa: ["Intervals", 5, 1],
    topics: ["agent-protocols"],
    references: ["mcp", "anthropicAgents"],
  });
  C.push({
    day: 91, title: "LLMOps: caching, routing, vLLM serving",
    focus: "Exact vs semantic caching; cascade routing; PagedAttention.",
    pillar: "llmops",
    dsa: ["Intervals", 4, 1],
    topics: ["llmops"],
    references: ["vllm", "langsmith", "anthropicPrompt"],
  });

  // ─── Week 14: ML Infra ───
  C.push({
    day: 92, title: "Distributed training: DDP, FSDP, ZeRO + DSA review",
    focus: "Gradient sync; sharding strategies; NCCL.",
    pillar: "mlops",
    dsa: ["Trees", 11, 1],
    topics: ["distributed-training"],
    references: ["pytorchDdp", "mitMlEff", "vllm"],
  });
  C.push({
    day: 93, title: "Training efficiency: mixed precision, accumulation, checkpointing",
    focus: "fp16 vs bf16 vs fp8; activation checkpointing math.",
    pillar: "mlops",
    dsa: ["Heap / Priority Queue", 3, 1],
    topics: ["training-efficiency"],
    references: ["mitMlEff", "vllm", "pytorchDdp"],
  });
  C.push({
    day: 94, title: "Hardware: GPUs, TPUs, NVLink, IB + DSA review",
    focus: "A100 vs H100 vs B200; HBM bandwidth; interconnect bottlenecks.",
    pillar: "mlops",
    dsa: ["Backtracking", 4, 1],
    topics: ["hardware"],
    references: ["mitMlEff", "vllm"],
  });
  C.push({
    day: 95, title: "Inference optimization: quantization, distillation, pruning, batching",
    focus: "PTQ vs QAT, GPTQ/AWQ, continuous batching.",
    pillar: "mlops",
    dsa: ["Math & Geometry", 5, 1],
    topics: ["inference-opt"],
    references: ["vllm", "mitMlEff"],
  });
  C.push({
    day: 96, title: "ML Infra consolidation + 3D parallelism review",
    focus: "Compose DP + TP + PP. Walk through Megatron-style training.",
    pillar: "mlops",
    dsa: ["1-D DP", 9, 1],
    topics: ["distributed-training", "training-efficiency"],
    references: ["pytorchDdp", "mitMlEff"],
  });
  C.push({
    day: 97, title: "Infra mocks: pick a serving design + answer cost / SLO trade-offs",
    focus: "Self-mock 30-min: 'serve a 70B model at 100 QPS, $X budget, P99 < Y'.",
    pillar: "mlops",
    dsa: ["2-D DP", 5, 1],
    topics: ["serving-infra", "inference-opt"],
    references: ["vllm", "fsdl"],
  });
  C.push({
    day: 98, title: "Infra wrap + LLMOps consolidation",
    focus: "Cross-link distributed training + serving + cost questions.",
    pillar: "llmops",
    dsa: ["Greedy", 5, 1],
    topics: ["llmops", "cost-scale"],
    references: ["vllm", "yan"],
  });

  // ─── Week 15: Specializations: Speech / RL / RecSys ───
  C.push({
    day: 99, title: "Speech: ASR (Whisper) + TTS + streaming",
    focus: "Encoder-decoder vs CTC; Tacotron / FastSpeech; streaming latency.",
    pillar: "deep-learning",
    dsa: ["Trees", 7, 1],
    topics: ["speech-spec"],
    references: ["whisper", "paperWithCode"],
  });
  C.push({
    day: 100, title: "CV deep dive: production detection, video, multimodal",
    focus: "YOLO production pipeline; video transformers; CLIP fusion.",
    pillar: "deep-learning",
    dsa: ["Graphs", 9, 1],
    topics: ["cv-spec"],
    references: ["paperWithCode", "vit", "clip"],
  });
  C.push({
    day: 101, title: "NLP deep dive: IE, multilingual, code generation",
    focus: "Span-based IE; XLM-R; StarCoder / Code Llama.",
    pillar: "deep-learning",
    dsa: ["Advanced Graphs", 5, 1],
    topics: ["nlp-spec"],
    references: ["hfNlp", "paperWithCode"],
  });
  C.push({
    day: 102, title: "RL basics: MDP, value, policy, exploration",
    focus: "Bellman; on-policy vs off-policy; Thompson sampling for bandits.",
    pillar: "deep-learning",
    dsa: ["Linked List", 1, 1],
    topics: ["rl-basics"],
    references: ["openaiRl", "paperWithCode"],
  });
  C.push({
    day: 103, title: "Deep RL: DQN, policy gradients, PPO, GRPO",
    focus: "Replay buffer; clipped surrogate; DeepSeek-R1's GRPO.",
    pillar: "deep-learning",
    dsa: ["Trees", 9, 1],
    topics: ["deep-rl"],
    references: ["openaiRl", "paperWithCode"],
  });
  C.push({
    day: 104, title: "RLHF & RLAIF deep dive",
    focus: "Reward modeling pipeline; Constitutional AI; reward hacking detection.",
    pillar: "generative-ai",
    dsa: ["Tries", 1, 1],
    topics: ["rlhf-deep"],
    references: ["anthropicAgents", "paperWithCode"],
  });
  C.push({
    day: 105, title: "RecSys foundations + two-tower + ranking + sequential",
    focus: "MF, two-tower, MMoE/PLE, position bias (PAL), SASRec / BERT4Rec.",
    pillar: "deep-learning",
    dsa: ["Heap / Priority Queue", 1, 1],
    topics: ["recsys-foundations", "two-tower", "ranking-mt", "seq-recsys"],
    references: ["ytTwoTower", "ytMultiTask", "yan"],
  });

  // ─── Week 16: ML System Design framework + classic cases ───
  C.push({
    day: 106, title: "ML System Design framework (7 steps)",
    focus: "The reusable scaffold for every design round: clarify → metrics → data → model → infra → eval → edges.",
    pillar: "ml-system-design",
    dsa: ["Sliding Window", 5, 1],
    topics: ["sd-framework"],
    references: ["patrickHalina", "khangich", "alirezadir", "chipHuyenDesign", "yan"],
  });
  C.push({
    day: 107, title: "Design TikTok / YouTube feed recommendations",
    focus: "Two-stage architecture; cold start; candidate-generation strategies.",
    pillar: "ml-system-design",
    dsa: ["Stack", 1, 1],
    topics: ["sd-recsys"],
    references: ["khangich", "alirezadir", "yan", "ytTwoTower"],
  });
  C.push({
    day: 108, title: "Design search ranking (Amazon/Google) + DSA review",
    focus: "Relevance vs freshness vs diversity; LTR; long-tail queries.",
    pillar: "ml-system-design",
    dsa: ["Binary Search", 1, 1],
    topics: ["sd-search"],
    references: ["yan", "khangich", "alirezadir"],
  });
  C.push({
    day: 109, title: "Design ads CTR prediction at scale + DSA review",
    focus: "Billion-cardinality features; cross features; calibration.",
    pillar: "ml-system-design",
    dsa: ["Heap / Priority Queue", 0, 1],
    topics: ["sd-ads"],
    references: ["khangich", "alirezadir", "yan"],
  });
  C.push({
    day: 110, title: "Design real-time fraud detection (Stripe Radar) + DSA review",
    focus: "Velocity / graph / behavioral features; delayed labels; cost-sensitive thresholds.",
    pillar: "ml-system-design",
    dsa: ["Backtracking", 1, 1],
    topics: ["sd-fraud"],
    references: ["khangich", "alirezadir", "yan"],
  });
  C.push({
    day: 111, title: "Design Uber ETA + dynamic pricing + DSA review",
    focus: "DeepETA features; surge pricing optimization.",
    pillar: "ml-system-design",
    dsa: ["Greedy", 1, 1],
    topics: ["sd-eta"],
    references: ["khangich", "alirezadir"],
  });
  C.push({
    day: 112, title: "Design news feed / social ranking + DSA review",
    focus: "Social-graph signals; chronological vs algorithmic; diversity vs engagement.",
    pillar: "ml-system-design",
    dsa: ["Intervals", 1, 1],
    topics: ["sd-feed"],
    references: ["khangich", "alirezadir", "yan"],
  });

  // ─── Week 17: ML System Design — GenAI cases ───
  C.push({
    day: 113, title: "Design enterprise RAG (Glean-style) + DSA review",
    focus: "Multi-source ingestion; permission-aware retrieval; offline+online eval.",
    pillar: "ml-system-design",
    dsa: ["Trees", 1, 1],
    topics: ["sd-rag"],
    references: ["langchainRag", "pinecone", "ragas"],
  });
  C.push({
    day: 114, title: "Design AI customer-support agent + DSA review",
    focus: "Tool catalog; escalation policy; quality eval offline/online.",
    pillar: "ml-system-design",
    dsa: ["Graphs", 1, 1],
    topics: ["sd-support-agent"],
    references: ["anthropicAgents", "yan"],
  });
  C.push({
    day: 115, title: "Design LLM eval platform (Braintrust/LangSmith) + DSA review",
    focus: "Slicing dimensions; PII redaction; continuous online eval.",
    pillar: "ml-system-design",
    dsa: ["Advanced Graphs", 1, 1],
    topics: ["sd-llm-eval"],
    references: ["langsmith", "ragas", "anthropicEval"],
  });
  C.push({
    day: 116, title: "Design document intelligence (OCR + LLM extraction) + DSA review",
    focus: "Hybrid OCR + vision-LM extraction; confidence scoring; HITL review.",
    pillar: "ml-system-design",
    dsa: ["1-D DP", 1, 1],
    topics: ["sd-doc-intel"],
    references: ["anthropicAgents", "yan"],
  });
  C.push({
    day: 117, title: "Design code assistant (GitHub Copilot / Cursor) + DSA review",
    focus: "Context construction; acceptance / retention metrics; latency budget.",
    pillar: "ml-system-design",
    dsa: ["2-D DP", 1, 1],
    topics: ["sd-code"],
    references: ["anthropicAgents", "yan"],
  });
  C.push({
    day: 118, title: "Design image generation product (DALL-E / Midjourney scale) + DSA review",
    focus: "GPU capacity & queueing; cost; safety filters (NSFW/IP/deepfake).",
    pillar: "ml-system-design",
    dsa: ["Math & Geometry", 6, 1],
    topics: ["sd-imggen"],
    references: ["paperWithCode", "yan"],
  });
  C.push({
    day: 119, title: "Design real-time voice agent (ASR → LLM → TTS) + DSA review",
    focus: "Turn-taking; barge-in; first-audio-out latency budget.",
    pillar: "ml-system-design",
    dsa: ["Heap / Priority Queue", 6, 1],
    topics: ["sd-voice"],
    references: ["whisper", "anthropicAgents"],
  });

  // ─── Week 18: ML System Design — cross-cutting trade-offs + self-mocks ───
  C.push({
    day: 120, title: "Latency vs accuracy: caching, distillation, cascades + DSA review",
    focus: "What you actually do when accuracy is great but P99 is too high.",
    pillar: "ml-system-design",
    dsa: ["Trees", 4, 1],
    topics: ["sd-tradeoffs"],
    references: ["yan", "vllm", "anthropicPrompt"],
  });
  C.push({
    day: 121, title: "Multi-model routing & cascades + DSA review",
    focus: "Cheap-then-expensive; verifier models; budget-aware routing.",
    pillar: "ml-system-design",
    dsa: ["Backtracking", 5, 1],
    topics: ["sd-tradeoffs", "llmops"],
    references: ["vllm", "yan"],
  });
  C.push({
    day: 122, title: "Cold-start strategies (recsys, search, ads) + DSA review",
    focus: "New users vs new items; content-based bridges; bandits.",
    pillar: "ml-system-design",
    dsa: ["Greedy", 6, 1],
    topics: ["sd-tradeoffs", "recsys-foundations"],
    references: ["yan", "khangich"],
  });
  C.push({
    day: 123, title: "Privacy-preserving ML (federated, DP, on-device) + DSA review",
    focus: "When each is the right answer; cost in accuracy.",
    pillar: "ml-system-design",
    dsa: ["Intervals", 2, 1],
    topics: ["sd-tradeoffs", "privacy-security"],
    references: ["fsdl", "yan"],
  });
  C.push({
    day: 124, title: "Self-mock 1: pick a Week-16 case and rework + DSA review",
    focus: "Run a 60-min self-mock on a classic case (recsys/search/ads/fraud/ETA/feed).",
    pillar: "ml-system-design",
    dsa: ["Linked List", 4, 1],
    topics: ["sd-framework", "sd-recsys"],
    references: ["patrickHalina", "khangich", "alirezadir"],
  });
  C.push({
    day: 125, title: "Self-mock 2: pick a Week-17 GenAI case and rework + DSA review",
    focus: "Run a 60-min self-mock on a GenAI case (RAG/agent/eval/doc/code/img/voice).",
    pillar: "ml-system-design",
    dsa: ["Trees", 8, 1],
    topics: ["sd-framework", "sd-rag"],
    references: ["patrickHalina", "anthropicAgents"],
  });
  C.push({
    day: 126, title: "Self-mock 3: 60-min full ML system design (your hardest case)",
    focus: "Pick the case you're least comfortable with. Record. Self-debrief.",
    pillar: "ml-system-design",
    dsa: ["Stack", 5, 1],
    topics: ["sd-framework", "sd-tradeoffs"],
    references: ["patrickHalina", "yan", "khangich"],
  });

  // ─── Week 19: Mock Interviews + Behavioral ───
  C.push({
    day: 127, title: "Behavioral framework + TMABY + 'why us' stories",
    focus: "STAR / CAR; 90-second TMABY; tailored 'why this company'.",
    pillar: "behavioral-storytelling",
    dsa: ["Two Pointers", 4, 1],
    topics: ["behavioral-framework"],
    references: ["alirezadir", "khangich"],
  });
  C.push({
    day: 128, title: "Behavioral: conflict, failure, leadership stories",
    focus: "Five rehearsed STAR stories — record them, listen back, cut filler.",
    pillar: "behavioral-storytelling",
    dsa: ["Sliding Window", 4, 1],
    topics: ["behavioral-stories"],
    references: ["alirezadir", "khangich"],
  });
  C.push({
    day: 129, title: "Behavioral: tech leadership + project deep-dive",
    focus: "Walk through your hardest ML system. Trade-offs you considered AND rejected.",
    pillar: "behavioral-storytelling",
    dsa: ["Stack", 2, 1],
    topics: ["behavioral-tech"],
    references: ["alirezadir", "khangich"],
  });
  C.push({
    day: 130, title: "Mock interview: DSA round (45 min, 2 problems)",
    focus: "Time-boxed mock — write code, talk through complexity, debrief.",
    pillar: "behavioral-storytelling",
    dsa: ["Binary Search", 2, 1],
    topics: ["mock-dsa"],
    references: ["neetcode", "ncVideos"],
  });
  C.push({
    day: 131, title: "Mock interview: ML breadth + ML coding round",
    focus: "6 ML concept questions in 45 min + implement k-means or logreg in 30 min.",
    pillar: "behavioral-storytelling",
    dsa: ["Heap / Priority Queue", 2, 1],
    topics: ["mock-ml-coding"],
    references: ["alirezadir", "chipHuyenInt"],
  });
  C.push({
    day: 132, title: "Mock interview: ML system design round (60 min)",
    focus: "Pick one case, run a clean 60-min mock, write down 5 follow-ups.",
    pillar: "behavioral-storytelling",
    dsa: ["Backtracking", 3, 1],
    topics: ["mock-system-design"],
    references: ["patrickHalina", "khangich", "alirezadir"],
  });
  C.push({
    day: 133, title: "Mock interview: behavioral round + on-site simulation + day-of prep",
    focus: "5 STAR stories back-to-back. Plan logistics for the actual onsite.",
    pillar: "behavioral-storytelling",
    dsa: ["Greedy", 3, 1],
    topics: ["mock-behavioral"],
    references: ["alirezadir", "khangich"],
  });

  return { CURRICULUM: C, WEEKS };
}
