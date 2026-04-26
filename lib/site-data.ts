export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type PillarSlug =
  | "foundations"
  | "math-stats"
  | "traditional-ml"
  | "deep-learning"
  | "generative-ai"
  | "llmops"
  | "ml-system-design"
  | "mlops"
  | "behavioral-storytelling";

export type QuestionCategory =
  | "Coding"
  | "SQL"
  | "ML Fundamentals"
  | "Statistics"
  | "Deep Learning"
  | "Transformers"
  | "Generative AI"
  | "RAG"
  | "LLMOps"
  | "ML System Design"
  | "MLOps"
  | "Behavioral";

export interface Pillar {
  slug: PillarSlug;
  title: string;
  navTitle: string;
  summary: string;
  interviewSignal: string;
  modules: string[];
  heroLabel: string;
}

export interface Topic {
  id: string;
  title: string;
  pillar: PillarSlug;
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
  prerequisites: string[];
  summary: string;
  learningObjectives: string[];
  interviewQuestions: string[];
  roadmapDay?: number;
  roleTags: string[];
  companyTags: string[];
}

export interface Question {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  answerOutline: string[];
  expectedSignals: string[];
  commonMistakes: string[];
  relatedTopics: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  track: "ML System Design" | "Generative AI";
  difficulty: Difficulty;
  prompt: string;
  concepts: string[];
  evaluationLens: string[];
}

export interface Resource {
  title: string;
  type: "Course" | "Guide" | "Docs" | "Paper" | "Community";
  href: string;
  description: string;
  tags: string[];
}

export const siteName = "ML Interview Roadmap";
export const siteTagline =
  "A structured roadmap to prepare for statistics, traditional ML, deep learning, MLOps, GenAI, LLMOps, and ML system design interviews in 30, 60, or 90 days.";

export const navigationLinks = [
  { href: "/", label: "Daily Plan", group: "Overview" },
  { href: "/questions", label: "Questions", group: "Reference" },
  { href: "/case-studies", label: "Case Studies", group: "Reference" },
  { href: "/resources", label: "Resources", group: "Reference" },
  { href: "/about", label: "About", group: "Reference" },
] as const;

export const navGroupOrder = ["Overview", "Reference"] as const;

export type NavGroup = (typeof navGroupOrder)[number];

export const pillars: Pillar[] = [
  {
    slug: "math-stats",
    title: "Math, Statistics, and Probability",
    navTitle: "Math & Stats",
    summary:
      "Refresh the mathematical intuition that supports metrics, optimization, uncertainty, and experimental reasoning.",
    interviewSignal:
      "Can you explain why a model behaves the way it does rather than just naming the algorithm?",
    modules: [
      "Linear algebra",
      "Probability and distributions",
      "Statistical inference",
      "Optimization basics",
      "Evaluation math",
    ],
    heroLabel: "Think with rigor",
  },
  {
    slug: "traditional-ml",
    title: "Traditional Machine Learning",
    navTitle: "Traditional ML",
    summary:
      "Cover supervised learning, feature engineering, model selection, and practical cases that still dominate many MLE screens.",
    interviewSignal:
      "Can you choose a pragmatic model, defend the trade-offs, and avoid leakage?",
    modules: [
      "Supervised learning",
      "Unsupervised learning",
      "Feature engineering",
      "Model evaluation",
      "Practical ML cases",
    ],
    heroLabel: "Win the fundamentals round",
  },
  {
    slug: "deep-learning",
    title: "Deep Learning",
    navTitle: "Deep Learning",
    summary:
      "Move from backprop and optimization into CNNs, sequence modeling, and transformer intuition.",
    interviewSignal:
      "Can you explain why the architecture works and when the training setup breaks?",
    modules: [
      "Neural network basics",
      "Optimization and regularization",
      "CNNs",
      "RNNs and sequence models",
      "Transformers",
    ],
    heroLabel: "Reason about architectures",
  },
  {
    slug: "mlops",
    title: "MLOps and Production ML",
    navTitle: "MLOps",
    summary:
      "Focus on repeatability, deployment, observability, governance, and the infrastructure decisions senior interviews often probe.",
    interviewSignal:
      "Can you operate ML reliably after the model is trained?",
    modules: [
      "Experiment tracking",
      "Model registry",
      "CI/CD for ML",
      "Deployment",
      "Observability",
      "Governance",
    ],
    heroLabel: "Operate models at scale",
  },
  {
    slug: "generative-ai",
    title: "Generative AI and LLM Engineering",
    navTitle: "Generative AI",
    summary:
      "Prepare for LLM fundamentals, RAG, evaluation, agents, and the practical systems questions now common in AI engineer loops.",
    interviewSignal:
      "Can you design a grounded, measurable, cost-aware LLM feature instead of just prompting a model?",
    modules: [
      "LLM basics",
      "Prompt engineering",
      "RAG",
      "Fine-tuning",
      "Evaluation and agents",
    ],
    heroLabel: "Build reliable GenAI products",
  },
  {
    slug: "llmops",
    title: "LLMOps and Reliable LLM Products",
    navTitle: "LLMOps",
    summary:
      "Operationalize LLM applications with prompt and model versioning, eval gates, tracing, routing, safety, cost controls, and incident response.",
    interviewSignal:
      "Can you run an LLM system as a measurable product instead of a fragile demo?",
    modules: [
      "Prompt and model versioning",
      "Evaluation datasets and regression gates",
      "Tracing and observability",
      "Cost, latency, caching, and routing",
      "Safety, privacy, and red teaming",
      "Fine-tuning operations",
    ],
    heroLabel: "Operate LLMs with discipline",
  },
  {
    slug: "ml-system-design",
    title: "ML System Design",
    navTitle: "System Design",
    summary:
      "Learn how to structure open-ended interviews around requirements, data, training, serving, monitoring, and trade-offs.",
    interviewSignal:
      "Can you turn a vague business problem into an ML architecture with clear metrics and failure modes?",
    modules: [
      "Interview framework",
      "Data pipeline",
      "Feature store",
      "Training pipeline",
      "Serving",
      "Monitoring",
      "Case studies",
    ],
    heroLabel: "Design from problem to production",
  },
  {
    slug: "foundations",
    title: "Python, SQL, and Coding Foundations",
    navTitle: "Foundations",
    summary:
      "Build the implementation speed and data fluency needed for coding, SQL, and ML-from-scratch rounds.",
    interviewSignal:
      "Can you translate an ML idea into clean code and reason under time pressure?",
    modules: [
      "Python for ML interviews",
      "Core data structures",
      "Algorithms and patterns",
      "SQL analytics",
      "ML coding from scratch",
    ],
    heroLabel: "Ship code under pressure",
  },
  {
    slug: "behavioral-storytelling",
    title: "Behavioral, Resume, and Project Storytelling",
    navTitle: "Behavioral",
    summary:
      "Frame your projects, resume bullets, decisions, and failures so the interview loop sees judgment, ownership, and communication.",
    interviewSignal:
      "Can you tell the story behind your work with metrics, constraints, and trade-offs?",
    modules: [
      "Resume optimization",
      "Project deep dives",
      "Behavioral stories",
      "Company-specific prep",
      "Mock interview scripts",
    ],
    heroLabel: "Tell a credible story",
  },

];

export const topics: Topic[] = [
  {
    id: "python-interview-patterns",
    title: "Python Interview Patterns",
    pillar: "foundations",
    difficulty: "Beginner",
    estimatedTimeMinutes: 75,
    prerequisites: [],
    summary:
      "Review Python language features that regularly appear in ML interview coding rounds.",
    learningObjectives: [
      "Use iterators, generators, and comprehensions to write concise solutions",
      "Explain typing, exceptions, and common pitfalls in production Python",
      "Recognize where object-oriented structure helps or hurts interview solutions",
    ],
    interviewQuestions: [
      "When would you use a generator instead of returning a list?",
      "How do you design a small but testable Python class for feature preprocessing?",
    ],
    roadmapDay: 78,
    roleTags: ["Beginner ML Candidate", "ML Engineer"],
    companyTags: ["Amazon", "Stripe", "OpenAI"],
  },
  {
    id: "sql-window-functions",
    title: "SQL Window Functions",
    pillar: "foundations",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 90,
    prerequisites: ["python-interview-patterns"],
    summary:
      "Solve ranking, funnels, retention, and cohort prompts with clean analytical SQL.",
    learningObjectives: [
      "Choose between joins, CTEs, and windows for readability and performance",
      "Implement ranking, rolling aggregates, and funnel analysis",
      "Avoid double-counting errors in multi-step event datasets",
    ],
    interviewQuestions: [
      "How would you compute day-7 retention for a signup cohort?",
      "What mistakes create duplicate counts in funnel queries?",
    ],
    roadmapDay: 23,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Meta", "DoorDash", "Uber"],
  },
  {
    id: "ml-from-scratch",
    title: "ML Coding From Scratch",
    pillar: "foundations",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 120,
    prerequisites: ["python-interview-patterns"],
    summary:
      "Implement classic algorithms from first principles to sharpen your understanding and whiteboard fluency.",
    learningObjectives: [
      "Write linear and logistic regression without relying on framework abstractions",
      "Explain the update rule and convergence behavior of simple optimizers",
      "Communicate assumptions and shortcuts under time pressure",
    ],
    interviewQuestions: [
      "How would you implement k-means and reason about initialization sensitivity?",
      "What simplifications are acceptable when coding logistic regression in an interview?",
    ],
    roadmapDay: 20,
    roleTags: ["ML Engineer", "Applied Scientist"],
    companyTags: ["Apple", "Google", "LinkedIn"],
  },
  {
    id: "probability-toolkit",
    title: "Probability Toolkit",
    pillar: "math-stats",
    difficulty: "Beginner",
    estimatedTimeMinutes: 80,
    prerequisites: [],
    summary:
      "Refresh conditional probability, Bayes intuition, and core distributions used in ML reasoning.",
    learningObjectives: [
      "Apply Bayes theorem to detection, diagnosis, and ranking examples",
      "Know when binomial, Poisson, and Gaussian assumptions are reasonable",
      "Explain calibration and uncertainty in plain language",
    ],
    interviewQuestions: [
      "Why can a model with strong recall still have weak positive predictive value?",
      "How does class imbalance change your probabilistic interpretation?",
    ],
    roadmapDay: 1,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Amazon", "Airbnb", "Wayfair"],
  },
  {
    id: "metrics-and-calibration",
    title: "Metrics and Calibration",
    pillar: "math-stats",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 85,
    prerequisites: ["probability-toolkit"],
    summary:
      "Learn how to select metrics that match business impact and diagnose probability quality.",
    learningObjectives: [
      "Compare precision, recall, F1, ROC-AUC, PR-AUC, NDCG, and calibration",
      "Explain why threshold tuning is not the same thing as model improvement",
      "Relate evaluation metrics to product and operational constraints",
    ],
    interviewQuestions: [
      "When would you optimize for recall over precision?",
      "How do you know if a classifier's predicted probabilities are trustworthy?",
    ],
    roadmapDay: 7,
    roleTags: ["Data Scientist", "AI Engineer"],
    companyTags: ["Google", "Uber", "Square"],
  },
  {
    id: "feature-engineering-leakage",
    title: "Feature Engineering and Leakage",
    pillar: "traditional-ml",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 95,
    prerequisites: ["metrics-and-calibration"],
    summary:
      "Build disciplined intuition around feature creation, train-serving parity, and leakage detection.",
    learningObjectives: [
      "Spot target leakage, temporal leakage, and data contamination",
      "Choose encoding, scaling, and missing-value strategies pragmatically",
      "Align offline feature logic with production feature generation",
    ],
    interviewQuestions: [
      "How would you detect leakage in a churn model?",
      "When should you avoid one-hot encoding?",
    ],
    roadmapDay: 19,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Meta", "Netflix", "Doordash"],
  },
  {
    id: "tree-ensembles",
    title: "Trees, Random Forest, and Boosting",
    pillar: "traditional-ml",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 100,
    prerequisites: ["metrics-and-calibration"],
    summary:
      "Understand why tree ensembles remain the default baseline for many tabular interview cases.",
    learningObjectives: [
      "Contrast bagging and boosting clearly",
      "Explain bias-variance trade-offs for trees and ensembles",
      "Reason about interpretability, calibration, and feature importance limitations",
    ],
    interviewQuestions: [
      "Why does gradient boosting often outperform logistic regression on tabular data?",
      "What failure mode appears when trees overfit a sparse feature space?",
    ],
    roadmapDay: 15,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Amazon", "Lyft", "Booking"],
  },
  {
    id: "anomaly-detection",
    title: "Clustering, PCA, and Anomaly Detection",
    pillar: "traditional-ml",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 90,
    prerequisites: ["probability-toolkit"],
    summary:
      "Prepare for unsupervised ML interview questions where labels are weak or delayed.",
    learningObjectives: [
      "Describe clustering choices and what distance metric assumptions imply",
      "Explain PCA as compression, denoising, and visualization rather than just a formula",
      "Choose metrics for anomaly detection when positives are rare",
    ],
    interviewQuestions: [
      "How do you evaluate an anomaly detector with few labels?",
      "What does PCA throw away and why does that matter?",
    ],
    roadmapDay: 18,
    roleTags: ["Data Scientist", "Applied Scientist"],
    companyTags: ["Stripe", "Plaid", "PayPal"],
  },
  {
    id: "backprop-and-optimization",
    title: "Backpropagation and Optimization",
    pillar: "deep-learning",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 110,
    prerequisites: ["metrics-and-calibration"],
    summary:
      "Build an interview-safe explanation for gradient flow, learning dynamics, and optimization choices.",
    learningObjectives: [
      "Explain gradient descent and backpropagation step by step",
      "Compare SGD, momentum, RMSProp, and Adam",
      "Diagnose vanishing gradients and unstable training",
    ],
    interviewQuestions: [
      "Why does Adam often converge faster but sometimes generalize worse?",
      "What role does normalization play in deep networks?",
    ],
    roadmapDay: 24,
    roleTags: ["ML Engineer", "Applied Scientist"],
    companyTags: ["NVIDIA", "Tesla", "Snap"],
  },
  {
    id: "cnn-design-patterns",
    title: "CNN Design Patterns",
    pillar: "deep-learning",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 80,
    prerequisites: ["backprop-and-optimization"],
    summary:
      "Cover convolutions, receptive fields, and architecture choices that still surface in vision-heavy roles.",
    learningObjectives: [
      "Reason about kernel size, stride, padding, and pooling",
      "Explain why residual connections improve trainability",
      "Connect architecture choices to latency and memory constraints",
    ],
    interviewQuestions: [
      "How does stride change the receptive field and compute cost?",
      "Why was ResNet a turning point for deep vision models?",
    ],
    roadmapDay: 28,
    roleTags: ["ML Engineer", "Applied Scientist"],
    companyTags: ["Apple", "Meta", "Roblox"],
  },
  {
    id: "transformers-first-principles",
    title: "Transformers From First Principles",
    pillar: "deep-learning",
    difficulty: "Advanced",
    estimatedTimeMinutes: 120,
    prerequisites: ["backprop-and-optimization"],
    summary:
      "Understand the transformer stack deeply enough to explain scaling, context handling, and attention trade-offs.",
    learningObjectives: [
      "Explain self-attention, positional encoding, and multi-head attention",
      "Contrast encoder-decoder setups with decoder-only LLMs",
      "Reason about context length, memory, and inference cost",
    ],
    interviewQuestions: [
      "Why do transformers parallelize better than RNNs?",
      "What breaks when context windows grow without retrieval support?",
    ],
    roadmapDay: 30,
    roleTags: ["AI Engineer", "Applied Scientist"],
    companyTags: ["Anthropic", "OpenAI", "Google"],
  },
  {
    id: "llm-basics",
    title: "LLM Basics and Prompt Controls",
    pillar: "generative-ai",
    difficulty: "Beginner",
    estimatedTimeMinutes: 90,
    prerequisites: ["transformers-first-principles"],
    summary:
      "Learn the vocabulary and control surfaces that power modern LLM interviews.",
    learningObjectives: [
      "Explain tokens, context windows, temperature, top-p, and log probabilities",
      "Choose between zero-shot, few-shot, and structured prompting",
      "Describe what embeddings capture and where they fail",
    ],
    interviewQuestions: [
      "What does temperature change in a decoding process?",
      "When do structured outputs matter more than free-form prompting?",
    ],
    roadmapDay: 41,
    roleTags: ["AI Engineer", "Backend Engineer"],
    companyTags: ["OpenAI", "Microsoft", "Notion"],
  },
  {
    id: "rag-architecture",
    title: "RAG Architecture",
    pillar: "generative-ai",
    difficulty: "Advanced",
    estimatedTimeMinutes: 120,
    prerequisites: ["llm-basics", "sql-window-functions"],
    summary:
      "Design grounded retrieval systems that balance recall, precision, latency, and cost.",
    learningObjectives: [
      "Choose chunking, embeddings, hybrid retrieval, and reranking strategies",
      "Separate retrieval quality from generation quality in evaluations",
      "Explain how security, freshness, and citations shape enterprise RAG design",
    ],
    interviewQuestions: [
      "How do you choose chunk size for a RAG system?",
      "When do you add reranking rather than tuning the embedding model?",
    ],
    roadmapDay: 44,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Dropbox", "Atlassian"],
  },
  {
    id: "llm-evaluation",
    title: "LLM Evaluation and Guardrails",
    pillar: "generative-ai",
    difficulty: "Advanced",
    estimatedTimeMinutes: 110,
    prerequisites: ["llm-basics", "metrics-and-calibration"],
    summary:
      "Prepare for the interview questions that separate demos from production-ready AI systems.",
    learningObjectives: [
      "Design offline and online evaluations for relevance, faithfulness, safety, latency, and cost",
      "Explain how to run regression checks for prompts, retrieval, and model routing",
      "Connect guardrails to operational risk rather than vague policy language",
    ],
    interviewQuestions: [
      "How would you evaluate a RAG assistant end to end?",
      "What signals tell you hallucination is becoming a production problem?",
    ],
    roadmapDay: 47,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Scale AI", "Perplexity"],
  },
  {
    id: "agents-and-guardrails",
    title: "Agents, Tool Use, and Guardrails",
    pillar: "generative-ai",
    difficulty: "Advanced",
    estimatedTimeMinutes: 95,
    prerequisites: ["llm-basics", "rag-architecture"],
    summary:
      "Study the patterns behind tool-using assistants, workflow agents, and safe escalation paths.",
    learningObjectives: [
      "Describe planner-executor loops and where they are overkill",
      "Add memory, tool permissions, and recovery paths responsibly",
      "Discuss guardrails, human review, and failure containment clearly",
    ],
    interviewQuestions: [
      "When should you avoid a multi-agent design?",
      "How do you stop an AI support agent from taking unsafe actions?",
    ],
    roadmapDay: 49,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["GitHub", "OpenAI", "Salesforce"],
  },
  {
    id: "system-design-framework",
    title: "ML System Design Framework",
    pillar: "ml-system-design",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 85,
    prerequisites: ["metrics-and-calibration", "feature-engineering-leakage"],
    summary:
      "Use a repeatable framework to drive an ambiguous ML system design interview from start to finish.",
    learningObjectives: [
      "Clarify product requirements, data availability, and evaluation metrics",
      "Break the system into training, inference, feedback, and monitoring layers",
      "Surface the main trade-offs before diving into component details",
    ],
    interviewQuestions: [
      "How do you scope a recommendation system interview in the first five minutes?",
      "What metrics belong at the product level versus the model level?",
    ],
    roadmapDay: 58,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Meta", "Uber", "Spotify"],
  },
  {
    id: "feature-stores",
    title: "Feature Stores and Training-Serving Consistency",
    pillar: "ml-system-design",
    difficulty: "Advanced",
    estimatedTimeMinutes: 90,
    prerequisites: ["feature-engineering-leakage", "system-design-framework"],
    summary:
      "Learn when feature stores help, where they add overhead, and how they relate to freshness and parity.",
    learningObjectives: [
      "Contrast online and offline feature stores",
      "Explain freshness, backfills, and point-in-time correctness",
      "Discuss when a feature store is unnecessary complexity",
    ],
    interviewQuestions: [
      "Why do teams adopt feature stores?",
      "What failure mode appears when offline features are not point-in-time correct?",
    ],
    roadmapDay: 60,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Airbnb", "DoorDash", "Instacart"],
  },
  {
    id: "online-serving-tradeoffs",
    title: "Online Serving, Batch Scoring, and Caching",
    pillar: "ml-system-design",
    difficulty: "Advanced",
    estimatedTimeMinutes: 100,
    prerequisites: ["system-design-framework", "feature-stores"],
    summary:
      "Reason about latency budgets, retrieval tiers, fallbacks, and cost-aware inference paths.",
    learningObjectives: [
      "Choose between online, asynchronous, and batch inference patterns",
      "Explain where caching helps and where it silently hurts freshness",
      "Connect latency budgets to feature design and model complexity",
    ],
    interviewQuestions: [
      "How do you design a low-latency fraud scoring service?",
      "When should you use a candidate generation and ranking split?",
    ],
    roadmapDay: 61,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Uber", "Pinterest", "TikTok"],
  },
  {
    id: "monitoring-drift",
    title: "Monitoring, Drift, and Retraining",
    pillar: "mlops",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 90,
    prerequisites: ["system-design-framework", "metrics-and-calibration"],
    summary:
      "Build an operational view of production models that covers data quality, drift, business outcomes, and recovery.",
    learningObjectives: [
      "Separate data drift, concept drift, and performance degradation",
      "Choose alerting thresholds that drive action rather than noise",
      "Design retraining triggers and rollback criteria",
    ],
    interviewQuestions: [
      "What do you monitor first after launching a new ranking model?",
      "How do you know when drift requires retraining versus investigation?",
    ],
    roadmapDay: 34,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Netflix", "Spotify", "Stripe"],
  },
  {
    id: "model-registry-cicd",
    title: "Model Registry and CI/CD for ML",
    pillar: "mlops",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 85,
    prerequisites: ["system-design-framework"],
    summary:
      "Cover versioning, promotion, rollback, and the differences between software CI/CD and ML release workflows.",
    learningObjectives: [
      "Track datasets, features, models, prompts, and evaluation reports together",
      "Explain shadow deployments, canaries, and rollback signals",
      "Write a clean story around ML-specific tests in CI",
    ],
    interviewQuestions: [
      "Why is model versioning more than storing weights?",
      "What should block a model from being promoted to production?",
    ],
    roadmapDay: 32,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Datadog", "Shopify", "OpenAI"],
  },
  {
    id: "statistical-inference-experimentation",
    title: "Statistical Inference and Experimentation",
    pillar: "math-stats",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 100,
    prerequisites: ["probability-toolkit"],
    summary:
      "Cover confidence intervals, hypothesis testing, power analysis, A/B testing pitfalls, and multiple comparisons.",
    learningObjectives: [
      "Explain p-values, power, confidence intervals, and effect sizes without textbook hand-waving",
      "Design trustworthy A/B tests with guardrail metrics and stopping rules",
      "Identify peeking, selection bias, novelty effects, and multiple-testing risk",
    ],
    interviewQuestions: [
      "How would you size an A/B test for a small lift on a rare event?",
      "What is the difference between statistical significance and practical significance?",
    ],
    roadmapDay: 4,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Meta", "Airbnb", "Uber"],
  },
  {
    id: "linear-models-regularization",
    title: "Linear Models and Regularization",
    pillar: "traditional-ml",
    difficulty: "Beginner",
    estimatedTimeMinutes: 90,
    prerequisites: ["statistical-inference-experimentation"],
    summary:
      "Prepare regression, logistic regression, loss functions, regularization, optimization, and coefficient interpretation.",
    learningObjectives: [
      "Derive the intuition behind MSE, log loss, L1, and L2 regularization",
      "Explain coefficient interpretation, multicollinearity, and feature scaling",
      "Connect thresholding and calibration to business decisions",
    ],
    interviewQuestions: [
      "Why does L1 regularization produce sparse weights?",
      "How do you interpret logistic regression coefficients?",
    ],
    roadmapDay: 10,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Google", "Amazon", "Microsoft"],
  },
  {
    id: "svm-knn-naive-bayes",
    title: "SVM, KNN, Naive Bayes, and Classic Baselines",
    pillar: "traditional-ml",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 80,
    prerequisites: ["linear-models-regularization"],
    summary:
      "Know the classic algorithms interviewers still use to test assumptions, distance metrics, kernels, and baseline thinking.",
    learningObjectives: [
      "Compare margin-based, distance-based, and probabilistic classifiers",
      "Explain kernel intuition and why scaling matters for SVM and KNN",
      "Choose fast baselines for text, tabular, and sparse-feature problems",
    ],
    interviewQuestions: [
      "When would Naive Bayes beat a more flexible model?",
      "Why is KNN sensitive to feature scaling and high-dimensional data?",
    ],
    roadmapDay: 17,
    roleTags: ["Data Scientist", "Applied Scientist"],
    companyTags: ["Apple", "LinkedIn", "Amazon"],
  },
  {
    id: "time-series-forecasting",
    title: "Time Series Forecasting",
    pillar: "traditional-ml",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 95,
    prerequisites: ["metrics-and-calibration", "feature-engineering-leakage"],
    summary:
      "Add forecasting coverage for trend, seasonality, leakage, backtesting, hierarchical forecasts, and anomaly-aware evaluation.",
    learningObjectives: [
      "Explain stationarity, trend, seasonality, lag features, and rolling windows",
      "Use time-based validation instead of random splits",
      "Choose metrics like MAE, RMSE, MAPE, pinball loss, and service-level error",
    ],
    interviewQuestions: [
      "Why is random cross-validation wrong for most forecasting problems?",
      "How do you evaluate forecasts for intermittent demand?",
    ],
    roadmapDay: 19,
    roleTags: ["Data Scientist", "ML Engineer"],
    companyTags: ["Amazon", "Uber", "DoorDash"],
  },
  {
    id: "causal-inference-uplift",
    title: "Causal Inference, Uplift, and Experimentation",
    pillar: "math-stats",
    difficulty: "Advanced",
    estimatedTimeMinutes: 100,
    prerequisites: ["statistical-inference-experimentation"],
    summary:
      "Prepare for causal questions around confounding, treatment effects, uplift modeling, observational data, and experiment design.",
    learningObjectives: [
      "Separate prediction from causal effect estimation",
      "Explain confounding, selection bias, matching, IVs, diff-in-diff, and uplift",
      "Know when an experiment is required instead of offline modeling",
    ],
    interviewQuestions: [
      "How would you estimate whether a notification caused higher retention?",
      "What is the difference between propensity modeling and uplift modeling?",
    ],
    roadmapDay: 6,
    roleTags: ["Data Scientist", "Applied Scientist", "Senior MLE"],
    companyTags: ["Meta", "Netflix", "Airbnb"],
  },
  {
    id: "interpretability-fairness",
    title: "Interpretability, Fairness, and Responsible ML",
    pillar: "traditional-ml",
    difficulty: "Advanced",
    estimatedTimeMinutes: 90,
    prerequisites: ["tree-ensembles", "metrics-and-calibration"],
    summary:
      "Cover model explanations, fairness metrics, bias audits, and governance trade-offs for sensitive ML products.",
    learningObjectives: [
      "Compare global and local explanations such as permutation importance and SHAP",
      "Discuss fairness metrics and why they can conflict",
      "Frame responsible AI controls as product and operational requirements",
    ],
    interviewQuestions: [
      "How would you explain a rejected loan prediction to a regulator?",
      "Why can two fairness metrics be impossible to satisfy at once?",
    ],
    roadmapDay: 38,
    roleTags: ["Data Scientist", "Senior MLE"],
    companyTags: ["Google", "Microsoft", "Stripe"],
  },
  {
    id: "data-validation-quality",
    title: "Data Validation and Data Quality",
    pillar: "mlops",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 85,
    prerequisites: ["feature-engineering-leakage"],
    summary:
      "Add production data quality coverage for schemas, ranges, missingness, freshness, outliers, and contract testing.",
    learningObjectives: [
      "Write data checks that catch schema, distribution, and freshness failures",
      "Separate hard failures from warn-only checks",
      "Connect data contracts to training pipelines and serving paths",
    ],
    interviewQuestions: [
      "What data checks would block a retraining job?",
      "How do you detect a silent upstream instrumentation change?",
    ],
    roadmapDay: 31,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Netflix", "DoorDash", "Uber"],
  },
  {
    id: "training-orchestration",
    title: "Training Pipeline Orchestration",
    pillar: "mlops",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 95,
    prerequisites: ["data-validation-quality", "model-registry-cicd"],
    summary:
      "Cover scheduled and event-driven retraining, lineage, artifact storage, reproducibility, and failure recovery.",
    learningObjectives: [
      "Design batch, streaming, and triggered training pipelines",
      "Track lineage across data, features, code, parameters, and model artifacts",
      "Handle failed jobs, bad data, and rollback cleanly",
    ],
    interviewQuestions: [
      "What should be reproducible about a training run?",
      "When should retraining be scheduled versus event-driven?",
    ],
    roadmapDay: 31,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Airbnb", "Shopify", "Datadog"],
  },
  {
    id: "model-serving-patterns",
    title: "Model Serving Patterns",
    pillar: "mlops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 100,
    prerequisites: ["model-registry-cicd"],
    summary:
      "Compare batch, online, streaming, edge, shadow, canary, blue-green, and async serving patterns.",
    learningObjectives: [
      "Choose a serving pattern from latency, freshness, cost, and reliability constraints",
      "Design fallbacks for model, feature, and dependency failures",
      "Explain canary, shadow, and A/B model rollouts",
    ],
    interviewQuestions: [
      "When should a model be served asynchronously?",
      "How do you safely canary a new ranking model?",
    ],
    roadmapDay: 33,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Uber", "Pinterest", "TikTok"],
  },
  {
    id: "llm-prompt-versioning",
    title: "Prompt, Model, Tool, and Retrieval Versioning",
    pillar: "llmops",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 80,
    prerequisites: ["llm-basics", "rag-architecture"],
    summary:
      "Treat LLM behavior as a release artifact by versioning prompts, model snapshots, tool schemas, retrieval configs, and eval sets together.",
    learningObjectives: [
      "Define the release unit for an LLM product",
      "Pin model versions and document upgrade criteria",
      "Rollback prompt, retrieval, and tool changes coherently",
    ],
    interviewQuestions: [
      "What exactly should be versioned in a production LLM app?",
      "How do you roll back a bad prompt release?",
    ],
    roadmapDay: 51,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Microsoft", "Anthropic"],
  },
  {
    id: "llm-eval-ops",
    title: "LLM Evaluation Operations",
    pillar: "llmops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 95,
    prerequisites: ["llm-evaluation", "rag-architecture"],
    summary:
      "Build operational eval suites with golden datasets, adversarial tests, trace grading, human review, and online feedback loops.",
    learningObjectives: [
      "Create eval datasets that represent real and adversarial usage",
      "Grade retrieval, tool use, reasoning traces, final answers, latency, and cost",
      "Use eval gates for prompt, model, and retrieval releases",
    ],
    interviewQuestions: [
      "How do you stop prompt changes from regressing existing customers?",
      "What belongs in a trace-level evaluation?",
    ],
    roadmapDay: 53,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Perplexity", "Scale AI"],
  },
  {
    id: "llm-observability-incidents",
    title: "LLM Observability and Incidents",
    pillar: "llmops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 90,
    prerequisites: ["llm-eval-ops"],
    summary:
      "Instrument LLM calls, traces, retrieval, tool execution, refusal rates, hallucination reports, cost, and user outcomes.",
    learningObjectives: [
      "Design logs and traces that are useful without leaking sensitive content",
      "Investigate hallucination, latency, tool, and cost incidents",
      "Create rollback and escalation playbooks",
    ],
    interviewQuestions: [
      "How do you debug a sudden rise in hallucination reports?",
      "What should be in an LLM incident postmortem?",
    ],
    roadmapDay: 54,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Datadog", "Salesforce"],
  },
  {
    id: "llm-routing-cost-latency",
    title: "LLM Cost, Latency, Caching, and Routing",
    pillar: "llmops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 95,
    prerequisites: ["llm-eval-ops"],
    summary:
      "Optimize LLM systems with model cascades, semantic caching, context budgeting, batching, fallbacks, and quality guardrails.",
    learningObjectives: [
      "Measure cost per request, feature, tenant, and user segment",
      "Route requests across model tiers without silent quality loss",
      "Trade off exact cache, semantic cache, retrieval cache, batching, and context compression",
    ],
    interviewQuestions: [
      "How would you cut LLM cost by 50% while protecting quality?",
      "When is semantic caching risky?",
    ],
    roadmapDay: 55,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Microsoft", "Notion"],
  },
  {
    id: "llm-safety-security-privacy",
    title: "LLM Safety, Security, Privacy, and Red Teaming",
    pillar: "llmops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 100,
    prerequisites: ["agents-and-guardrails", "rag-architecture"],
    summary:
      "Prepare for prompt injection, jailbreaks, data exfiltration, PII handling, policy enforcement, human review, and auditability.",
    learningObjectives: [
      "Threat model RAG, tool-using agents, and external integrations",
      "Design red-team tests and human escalation paths",
      "Balance logs, privacy, retention, and audit requirements",
    ],
    interviewQuestions: [
      "How do you defend a tool-using agent from prompt injection?",
      "What should trigger human review in a high-risk LLM workflow?",
    ],
    roadmapDay: 56,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Anthropic", "Microsoft"],
  },
  {
    id: "llm-finetuning-ops",
    title: "Fine-Tuning Operations and Adapter Management",
    pillar: "llmops",
    difficulty: "Advanced",
    estimatedTimeMinutes: 90,
    prerequisites: ["llm-basics", "llm-eval-ops"],
    summary:
      "Cover fine-tune vs RAG decisions, dataset curation, LoRA adapters, evaluation, rollout, and model governance.",
    learningObjectives: [
      "Choose between prompt changes, RAG, supervised fine-tuning, and adapters",
      "Evaluate fine-tunes for generalization, safety, and memorization",
      "Manage adapter versioning, serving, and rollback",
    ],
    interviewQuestions: [
      "When should you fine-tune instead of using RAG?",
      "How do you evaluate whether a LoRA adapter is safe to promote?",
    ],
    roadmapDay: 57,
    roleTags: ["AI Engineer", "Senior MLE"],
    companyTags: ["OpenAI", "Hugging Face", "Meta"],
  },
  {
    id: "requirements-metrics-scope",
    title: "Requirements, Metrics, and Scope in ML System Design",
    pillar: "ml-system-design",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 90,
    prerequisites: ["metrics-and-calibration", "model-serving-patterns"],
    summary:
      "Start ML system design interviews with product goals, users, constraints, labels, metrics, baselines, and failure modes.",
    learningObjectives: [
      "Clarify requirements before proposing models",
      "Separate product, model, system, and guardrail metrics",
      "Define assumptions and non-goals early",
    ],
    interviewQuestions: [
      "What do you ask in the first five minutes of an ML system design prompt?",
      "How do you choose product metrics versus model metrics?",
    ],
    roadmapDay: 58,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Meta", "Google", "Uber"],
  },
  {
    id: "ranking-retrieval-recsys",
    title: "Retrieval, Ranking, and Recommendation Systems",
    pillar: "ml-system-design",
    difficulty: "Advanced",
    estimatedTimeMinutes: 120,
    prerequisites: ["requirements-metrics-scope", "online-serving-tradeoffs"],
    summary:
      "Prepare multi-stage recommender and search designs with retrieval, ranking, reranking, diversity, freshness, and feedback loops.",
    learningObjectives: [
      "Design candidate generation, ranking, reranking, and exploration layers",
      "Handle cold start, position bias, diversity, and delayed labels",
      "Connect offline ranking metrics to online product outcomes",
    ],
    interviewQuestions: [
      "How do you design a short-video recommender end to end?",
      "How do you handle position bias in click logs?",
    ],
    roadmapDay: 63,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Netflix", "TikTok", "YouTube"],
  },
  {
    id: "real-time-fraud-risk",
    title: "Real-Time Fraud, Risk, and Abuse Systems",
    pillar: "ml-system-design",
    difficulty: "Advanced",
    estimatedTimeMinutes: 110,
    prerequisites: ["requirements-metrics-scope", "model-serving-patterns"],
    summary:
      "Cover low-latency risk scoring, graph features, rules plus ML, delayed labels, investigation queues, and adversarial adaptation.",
    learningObjectives: [
      "Design real-time feature generation and low-latency inference",
      "Use rules, ML, graph signals, and human review together",
      "Monitor adversarial drift and label delay",
    ],
    interviewQuestions: [
      "How would you design real-time card fraud detection?",
      "How do you evaluate a fraud model when labels arrive weeks later?",
    ],
    roadmapDay: 70,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Stripe", "PayPal", "Plaid"],
  },
  {
    id: "search-ads-feed-design",
    title: "Search, Ads, and Feed Ranking Design",
    pillar: "ml-system-design",
    difficulty: "Advanced",
    estimatedTimeMinutes: 120,
    prerequisites: ["ranking-retrieval-recsys"],
    summary:
      "Prepare for high-frequency ranking systems with query understanding, auctions, personalization, calibration, and latency budgets.",
    learningObjectives: [
      "Compare search, ads, and feed ranking architectures",
      "Reason about retrieval, auction, relevance, calibration, and business constraints",
      "Design feedback loops without amplifying bias or spam",
    ],
    interviewQuestions: [
      "How does ads ranking differ from organic feed ranking?",
      "What metrics would you use for search quality?",
    ],
    roadmapDay: 68,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Google", "Meta", "Amazon"],
  },
  {
    id: "project-storytelling",
    title: "Project Deep Dives and Storytelling",
    pillar: "behavioral-storytelling",
    difficulty: "Beginner",
    estimatedTimeMinutes: 70,
    prerequisites: [],
    summary:
      "Convert your best project into a narrative with scope, constraints, metrics, and trade-offs.",
    learningObjectives: [
      "Structure a project story using context, action, result, and reflection",
      "Quantify impact without overstating certainty",
      "Anticipate follow-up questions on architecture and failure cases",
    ],
    interviewQuestions: [
      "Tell me about a model that underperformed after launch.",
      "How would you explain your project to a skeptical engineering manager?",
    ],
    roadmapDay: 86,
    roleTags: ["Beginner ML Candidate", "Senior MLE"],
    companyTags: ["Google", "Meta", "OpenAI"],
  },
  {
    id: "behavioral-ownership",
    title: "Behavioral: Ownership, Conflict, and Ambiguity",
    pillar: "behavioral-storytelling",
    difficulty: "Intermediate",
    estimatedTimeMinutes: 60,
    prerequisites: ["project-storytelling"],
    summary:
      "Prepare concise stories that show judgment, prioritization, and leadership in messy situations.",
    learningObjectives: [
      "Frame conflict around trade-offs rather than personalities",
      "Show how you handled ambiguity with structured decision-making",
      "Speak clearly about failure and what changed afterward",
    ],
    interviewQuestions: [
      "Tell me about a time you disagreed with a product decision.",
      "Describe a project where the data quality was much worse than expected.",
    ],
    roadmapDay: 89,
    roleTags: ["Data Scientist", "Senior MLE"],
    companyTags: ["Amazon", "Microsoft", "Stripe"],
  },
];

export const readinessWeights = [
  { label: "Traditional ML", weight: 15 },
  { label: "Math & Statistics", weight: 10 },
  { label: "Coding + SQL", weight: 10 },
  { label: "Deep Learning", weight: 10 },
  { label: "MLOps", weight: 10 },
  { label: "Generative AI", weight: 15 },
  { label: "LLMOps", weight: 10 },
  { label: "ML System Design", weight: 15 },
  { label: "Behavioral", weight: 5 },
];

export const readinessPillarMap: Record<string, PillarSlug> = {
  "Traditional ML": "traditional-ml",
  "Math & Statistics": "math-stats",
  "Coding + SQL": "foundations",
  "Deep Learning": "deep-learning",
  MLOps: "mlops",
  "Generative AI": "generative-ai",
  LLMOps: "llmops",
  "ML System Design": "ml-system-design",
  Behavioral: "behavioral-storytelling",
};

export const featureCards = [
  {
    title: "Interactive daily plan",
    description:
      "Navigate the prep surface through checkable days, linked pillars, and topic detail pages.",
  },
  {
    title: "30, 60, and 90-day planner",
    description:
      "Pick a time horizon and get a day-by-day emphasis rather than a flat reading list.",
  },
  {
    title: "Question bank with signals",
    description:
      "Study by category, difficulty, expected signals, and common interviewer traps.",
  },
  {
    title: "Case-study library",
    description:
      "Practice design prompts for recommendation, fraud, RAG, and evaluation systems.",
  },
  {
    title: "Readiness scoring",
    description:
      "See where your preparation is already strong and where interview risk remains concentrated.",
  },
  {
    title: "Personalized prep mix",
    description:
      "Generate a lightweight role-based plan from your background, timeline, and weak areas.",
  },
];

export const questions: Question[] = [
  {
    id: "bias-variance",
    question: "Explain the bias-variance trade-off and how you would detect which side of the problem you are on.",
    category: "ML Fundamentals",
    difficulty: "Beginner",
    answerOutline: [
      "Define bias and variance in terms of underfitting and sensitivity",
      "Use train-validation patterns to diagnose each failure mode",
      "Mention how model complexity, data size, and regularization shift the trade-off",
    ],
    expectedSignals: [
      "Ties the answer to observable validation behavior",
      "Avoids reducing the answer to a single metric",
      "Mentions remedies, not just definitions",
    ],
    commonMistakes: [
      "Answering only with textbook definitions",
      "Ignoring data quantity and feature quality",
      "Treating regularization as a universal fix",
    ],
    relatedTopics: ["tree-ensembles", "feature-engineering-leakage"],
  },
  {
    id: "window-functions",
    question: "Write a query to compute day-7 retention by signup cohort and explain how you avoid double-counting.",
    category: "SQL",
    difficulty: "Intermediate",
    answerOutline: [
      "Build a signup cohort table",
      "Join or aggregate activity at the user-day level",
      "Use distinct user logic and a retention denominator defined at signup time",
    ],
    expectedSignals: [
      "Separates cohort creation from activity aggregation",
      "Talks about denominator discipline",
      "Calls out event duplication risk",
    ],
    commonMistakes: [
      "Counting events instead of users",
      "Forgetting users with zero follow-up activity",
      "Mixing timestamp granularity",
    ],
    relatedTopics: ["sql-window-functions"],
  },
  {
    id: "confidence-interval",
    question: "What is a confidence interval, and how is it different from a probability that the true mean lies in the interval?",
    category: "Statistics",
    difficulty: "Intermediate",
    answerOutline: [
      "State the frequentist interpretation clearly",
      "Explain repeated sampling intuition",
      "Contrast with a Bayesian posterior interval at a high level",
    ],
    expectedSignals: [
      "Uses precise language about the parameter being fixed",
      "Avoids saying the parameter is random in a frequentist setup",
      "Connects the idea to A/B testing or experiments",
    ],
    commonMistakes: [
      "Saying there is a 95% chance the true mean lies in this realized interval",
      "Ignoring sampling assumptions",
      "Overcomplicating the answer with formulas only",
    ],
    relatedTopics: ["probability-toolkit"],
  },
  {
    id: "backprop",
    question: "Explain backpropagation as if you were teaching it to an engineer who has used PyTorch but never derived gradients by hand.",
    category: "Deep Learning",
    difficulty: "Intermediate",
    answerOutline: [
      "Describe forward pass, loss computation, and chain rule",
      "Show how local gradients compose from output to earlier layers",
      "Mention why automatic differentiation is useful but not magical",
    ],
    expectedSignals: [
      "Uses layer-wise intuition instead of symbols only",
      "Mentions chain rule and gradient flow",
      "Connects the math to optimization behavior",
    ],
    commonMistakes: [
      "Reciting formulas with no intuition",
      "Skipping the role of the loss function",
      "Not explaining why vanishing gradients happen",
    ],
    relatedTopics: ["backprop-and-optimization"],
  },
  {
    id: "self-attention",
    question: "Why do transformers scale better than RNNs for many language tasks, and what trade-off do they introduce?",
    category: "Transformers",
    difficulty: "Advanced",
    answerOutline: [
      "Compare sequential recurrence with parallel attention computation",
      "Explain global context access",
      "Note quadratic memory and compute pressure with long contexts",
    ],
    expectedSignals: [
      "Mentions parallelism and context modeling together",
      "Calls out the long-context cost problem",
      "Avoids saying transformers are simply always better",
    ],
    commonMistakes: [
      "Ignoring compute complexity",
      "Confusing attention with recurrence",
      "Not addressing inference or memory limits",
    ],
    relatedTopics: ["transformers-first-principles"],
  },
  {
    id: "temperature-top-p",
    question: "What is the difference between temperature and top-p sampling?",
    category: "Generative AI",
    difficulty: "Beginner",
    answerOutline: [
      "Temperature reshapes the probability distribution",
      "Top-p truncates the candidate set to a cumulative mass threshold",
      "Explain how the two settings interact in practice",
    ],
    expectedSignals: [
      "Makes the distinction between rescaling and filtering",
      "Connects sampling choices to output diversity",
      "Notes that lower randomness can improve consistency but hurt exploration",
    ],
    commonMistakes: [
      "Treating both settings as identical randomness knobs",
      "Ignoring the prompt or task context",
      "Claiming there is a universally best setting",
    ],
    relatedTopics: ["llm-basics"],
  },
  {
    id: "rag-eval",
    question: "How would you evaluate a RAG system end to end?",
    category: "RAG",
    difficulty: "Advanced",
    answerOutline: [
      "Measure retrieval quality and generation quality separately",
      "Track faithfulness, citation accuracy, relevance, latency, and cost",
      "Add regression datasets and human review for critical workflows",
    ],
    expectedSignals: [
      "Separates retrieval from answer generation",
      "Mentions groundedness or faithfulness",
      "Includes online metrics or user feedback loops",
    ],
    commonMistakes: [
      "Only reporting BLEU or ROUGE",
      "Ignoring latency and cost",
      "Treating hallucination as only a model problem instead of a system problem",
    ],
    relatedTopics: ["rag-architecture", "llm-evaluation"],
  },
  {
    id: "agent-architecture",
    question: "When is a multi-agent architecture justified, and when is it unnecessary complexity?",
    category: "Generative AI",
    difficulty: "Advanced",
    answerOutline: [
      "State the workload characteristics that benefit from decomposition",
      "Compare a single orchestrated workflow against multiple specialized agents",
      "Discuss observability, reliability, and debugging costs",
    ],
    expectedSignals: [
      "Acknowledges orchestration overhead",
      "Connects architecture choice to task decomposition and failure isolation",
      "Discusses tool permissions and guardrails",
    ],
    commonMistakes: [
      "Assuming more agents always improves reasoning",
      "Ignoring latency and coordination costs",
      "Skipping monitoring and rollback plans",
    ],
    relatedTopics: ["agents-and-guardrails"],
  },
  {
    id: "recommendation-design",
    question: "Design a video recommendation system for the home feed.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Clarify product goal, user segments, and constraints",
      "Split retrieval, ranking, and re-ranking stages",
      "Describe feedback loops, freshness, diversity, latency, and monitoring",
    ],
    expectedSignals: [
      "Defines product metrics before models",
      "Uses multi-stage ranking architecture",
      "Talks about exploration and feedback loops",
    ],
    commonMistakes: [
      "Jumping to model choice with no problem framing",
      "Ignoring latency budgets and diversity",
      "Skipping post-launch monitoring",
    ],
    relatedTopics: ["system-design-framework", "online-serving-tradeoffs"],
  },
  {
    id: "feature-store-purpose",
    question: "Why do teams adopt feature stores, and what problems can they create if used poorly?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Explain training-serving consistency and reuse of feature logic",
      "Discuss freshness, online-offline parity, and governance",
      "Mention operational overhead and over-centralization risks",
    ],
    expectedSignals: [
      "Describes both value and complexity",
      "Mentions point-in-time correctness",
      "Avoids framing feature stores as mandatory for all teams",
    ],
    commonMistakes: [
      "Pitching a feature store as a generic database",
      "Ignoring ownership and freshness complexity",
      "Skipping the build-vs-buy trade-off",
    ],
    relatedTopics: ["feature-stores"],
  },
  {
    id: "monitoring-production",
    question: "How do you monitor a model in production after launch?",
    category: "MLOps",
    difficulty: "Intermediate",
    answerOutline: [
      "Track system metrics, data quality, model quality, and business KPIs",
      "Separate leading indicators from lagging labels",
      "Define alert thresholds, playbooks, retraining, and rollback options",
    ],
    expectedSignals: [
      "Separates infrastructure monitoring from model monitoring",
      "Mentions delayed labels and proxy signals",
      "Discusses actionability rather than dashboards only",
    ],
    commonMistakes: [
      "Only mentioning accuracy",
      "Ignoring feature drift or schema breaks",
      "No remediation plan after an alert",
    ],
    relatedTopics: ["monitoring-drift", "model-registry-cicd"],
  },
  {
    id: "story-failure",
    question: "Tell me about a project where your model failed after deployment. What did you do?",
    category: "Behavioral",
    difficulty: "Intermediate",
    answerOutline: [
      "Describe the context and why the launch looked reasonable at the time",
      "Explain the failure signal and investigation path",
      "Show what you changed in the system, process, or metrics afterward",
    ],
    expectedSignals: [
      "Owns the outcome without dramatizing blame",
      "Mentions metrics and corrective action",
      "Shows learning and better operational discipline",
    ],
    commonMistakes: [
      "Turning the story into a blame narrative",
      "Hiding the impact or uncertainty",
      "Ending the story with no lesson or process change",
    ],
    relatedTopics: ["project-storytelling", "behavioral-ownership"],
  },
  {
    id: "architect-capacity-planning",
    question: "Walk me through how you would size infrastructure for a ranking system expected to serve 10k queries per second with a 100ms p99 latency budget.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Start with request shape, feature fetch, and model inference budgets",
      "Separate retrieval, feature lookup, and model scoring latency components",
      "Plan for headroom, cache hit rates, and degraded modes under load",
    ],
    expectedSignals: [
      "Breaks the latency budget into named components",
      "Plans cache strategy and feature TTLs explicitly",
      "Names a graceful fallback when the primary path overloads",
    ],
    commonMistakes: [
      "Quoting throughput without latency decomposition",
      "Ignoring feature fetch and network hops",
      "No fallback plan when the model tier saturates",
    ],
    relatedTopics: ["online-serving-tradeoffs", "system-design-framework"],
  },
  {
    id: "architect-build-vs-buy",
    question: "A VP asks whether to build or buy a vector database for a new RAG product. How do you structure the recommendation?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Frame differentiation vs. undifferentiated heavy lifting",
      "Compare integration cost, vendor risk, scale trajectory, and team bandwidth",
      "Propose a reversible path: start with a managed service, revisit at a defined usage threshold",
    ],
    expectedSignals: [
      "Ties the decision to strategy, not engineering preference",
      "Quantifies the decision with cost and scale triggers",
      "Proposes a reversible plan with milestones",
    ],
    commonMistakes: [
      "Defaulting to build out of engineering pride",
      "Ignoring the team's current ops capacity",
      "Picking a vendor without a revisit trigger",
    ],
    relatedTopics: ["rag-architecture", "system-design-framework"],
  },
  {
    id: "architect-cost-optimization",
    question: "An LLM feature is blowing its infrastructure budget. Walk me through how you would reduce cost without destroying user experience.",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Instrument cost per request, per feature, and per user segment",
      "Apply a small-first cascade, route easy traffic to cheap models",
      "Tune context size, caching, batching, and retrieval before cutting quality",
    ],
    expectedSignals: [
      "Measures cost before cutting",
      "Separates structural savings from quality cuts",
      "Adds guardrails so cost optimization cannot silently hurt users",
    ],
    commonMistakes: [
      "Lowering quality uniformly across users",
      "Skipping caching and batching",
      "No rollback when the cheaper path degrades evals",
    ],
    relatedTopics: ["llm-evaluation", "rag-architecture"],
  },
  {
    id: "architect-multi-tenant-isolation",
    question: "Your ML platform must serve three product teams with shared models but separate data boundaries. How do you design isolation?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Separate compute isolation from data isolation from policy isolation",
      "Use per-tenant feature namespaces, credentials, and audit trails",
      "Choose between hard boundaries (separate stacks) and soft ones (policy + key scoping) based on risk",
    ],
    expectedSignals: [
      "Names three isolation layers: compute, data, policy",
      "Discusses cost-vs-risk for hard vs soft isolation",
      "Calls out audit, access, and key management explicitly",
    ],
    commonMistakes: [
      "Collapsing isolation into a single VPC answer",
      "Ignoring audit and compliance paths",
      "Skipping per-tenant rate limits and key scoping",
    ],
    relatedTopics: ["system-design-framework", "feature-stores"],
  },
  {
    id: "architect-migration-plan",
    question: "Describe how you would migrate a legacy XGBoost service to a new feature store and serving platform with zero downtime.",
    category: "MLOps",
    difficulty: "Advanced",
    answerOutline: [
      "Shadow the new path with the old one serving live traffic",
      "Compare feature parity, predictions, and latency before any cutover",
      "Roll over by percent traffic with a clearly defined rollback trigger",
    ],
    expectedSignals: [
      "Keeps the old system live during validation",
      "Defines parity checks concretely",
      "Has a documented rollback threshold, not a vibe",
    ],
    commonMistakes: [
      "Cutting over without traffic ramping",
      "Skipping feature parity checks",
      "No rollback plan or owner",
    ],
    relatedTopics: ["model-registry-cicd", "monitoring-drift"],
  },
  {
    id: "ab-test-design",
    question: "Design an A/B test for a new ranking model and explain how you would choose success, guardrail, and stopping criteria.",
    category: "Statistics",
    difficulty: "Intermediate",
    answerOutline: [
      "Define unit of randomization, hypothesis, power, and minimum detectable effect",
      "Separate primary metric from guardrails and diagnostic metrics",
      "Discuss peeking, novelty effects, interference, and rollback criteria",
    ],
    expectedSignals: [
      "Frames the experiment before discussing p-values",
      "Mentions guardrails and stopping rules",
      "Recognizes network effects and multiple comparisons",
    ],
    commonMistakes: [
      "Only optimizing CTR with no guardrails",
      "Ignoring sample size and power",
      "Peeking until results look significant",
    ],
    relatedTopics: ["statistical-inference-experimentation", "causal-inference-uplift"],
  },
  {
    id: "forecasting-validation",
    question: "How would you validate a demand forecasting model for a marketplace with seasonality and sparse items?",
    category: "ML Fundamentals",
    difficulty: "Intermediate",
    answerOutline: [
      "Use time-based backtesting and avoid leakage from future windows",
      "Segment evaluation by item volume, geography, and seasonality",
      "Choose metrics that match inventory or staffing decisions",
    ],
    expectedSignals: [
      "Avoids random cross-validation",
      "Mentions hierarchy and sparse segments",
      "Connects forecast error to business cost",
    ],
    commonMistakes: [
      "Using random splits",
      "Only reporting aggregate RMSE",
      "Ignoring cold-start or intermittent demand",
    ],
    relatedTopics: ["time-series-forecasting"],
  },
  {
    id: "causal-vs-predictive",
    question: "A retention model says push notifications predict retention. How do you determine whether notifications cause retention?",
    category: "Statistics",
    difficulty: "Advanced",
    answerOutline: [
      "Separate predictive correlation from causal effect",
      "Look for randomized experiments first",
      "If observational, discuss confounding, matching, IVs, diff-in-diff, and sensitivity analysis",
    ],
    expectedSignals: [
      "Does not claim causality from model feature importance",
      "Prioritizes randomization when feasible",
      "Names assumptions behind observational methods",
    ],
    commonMistakes: [
      "Using SHAP as causal evidence",
      "Ignoring selection bias",
      "Not defining the treatment and counterfactual",
    ],
    relatedTopics: ["causal-inference-uplift", "interpretability-fairness"],
  },
  {
    id: "data-quality-gates",
    question: "What data quality checks would you add before retraining a production model?",
    category: "MLOps",
    difficulty: "Intermediate",
    answerOutline: [
      "Check schema, types, ranges, missingness, freshness, volume, and label availability",
      "Compare train data distributions against reference windows",
      "Define blocking versus warning thresholds and ownership",
    ],
    expectedSignals: [
      "Names concrete checks, not just dashboards",
      "Separates blocking failures from warnings",
      "Connects checks to retraining and rollback",
    ],
    commonMistakes: [
      "Only checking row counts",
      "No freshness or schema validation",
      "No owner for broken upstream data",
    ],
    relatedTopics: ["data-validation-quality", "training-orchestration"],
  },
  {
    id: "serving-pattern-selection",
    question: "When would you choose batch scoring, online inference, streaming inference, or edge inference?",
    category: "MLOps",
    difficulty: "Advanced",
    answerOutline: [
      "Start from latency, freshness, cost, privacy, and reliability constraints",
      "Map examples to each serving pattern",
      "Discuss fallback paths and operational complexity",
    ],
    expectedSignals: [
      "Uses constraints to choose architecture",
      "Discusses cost and failure modes",
      "Knows batch can be the right answer",
    ],
    commonMistakes: [
      "Defaulting to online inference for everything",
      "Ignoring feature freshness",
      "No degraded mode",
    ],
    relatedTopics: ["model-serving-patterns", "online-serving-tradeoffs"],
  },
  {
    id: "llm-release-gates",
    question: "What checks should block a prompt, model, retrieval, or tool change from being released?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Run regression evals for task quality, safety, faithfulness, tool use, latency, and cost",
      "Compare behavior by segment and high-risk workflow",
      "Require owner approval and rollback artifacts for risky changes",
    ],
    expectedSignals: [
      "Treats the LLM app as a versioned system",
      "Separates eval dimensions",
      "Mentions rollback and ownership",
    ],
    commonMistakes: [
      "Only testing happy-path prompts",
      "Ignoring tool-call regressions",
      "No cost or latency gate",
    ],
    relatedTopics: ["llm-prompt-versioning", "llm-eval-ops"],
  },
  {
    id: "llm-observability-debug",
    question: "A production assistant suddenly hallucinates more often. How do you debug it?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Check recent changes to prompts, model versions, retrieval, tools, traffic mix, and source documents",
      "Inspect traces to separate retrieval failure from generation failure",
      "Roll back or route traffic while creating a regression case",
    ],
    expectedSignals: [
      "Uses traces and release history",
      "Separates retrieval, generation, and tool failures",
      "Adds the incident to future eval coverage",
    ],
    commonMistakes: [
      "Only blaming the model",
      "No trace-level evidence",
      "No immediate mitigation path",
    ],
    relatedTopics: ["llm-observability-incidents", "llm-eval-ops"],
  },
  {
    id: "prompt-injection-defense",
    question: "How do you defend an enterprise RAG assistant against prompt injection and data exfiltration?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Apply retrieval-time authorization and document-level access control",
      "Constrain tools, schemas, and side effects",
      "Red-team malicious instructions and monitor exfiltration attempts",
    ],
    expectedSignals: [
      "Does not rely on prompting alone",
      "Separates data access from generation",
      "Mentions red teaming and audit logs",
    ],
    commonMistakes: [
      "Trusting retrieved text as instructions",
      "No per-user authorization in retrieval",
      "No tool permission model",
    ],
    relatedTopics: ["llm-safety-security-privacy", "rag-architecture"],
  },
  {
    id: "fraud-system-design",
    question: "Design a real-time fraud detection system with delayed labels and expensive false positives.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Clarify latency, action types, false-positive cost, and review capacity",
      "Combine rules, model scoring, graph features, thresholds, and human review",
      "Monitor drift, adversarial behavior, and delayed-label performance",
    ],
    expectedSignals: [
      "Handles class imbalance and delayed labels",
      "Includes analyst workflow",
      "Uses real-time feature and fallback thinking",
    ],
    commonMistakes: [
      "Only proposing a classifier",
      "Ignoring false positive cost",
      "No feedback loop from investigations",
    ],
    relatedTopics: ["real-time-fraud-risk", "model-serving-patterns"],
  },
  {
    id: "search-ads-ranking",
    question: "How would you design a search or ads ranking system and evaluate whether it improved user experience?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Describe retrieval, ranking, calibration, and business constraints",
      "Use offline ranking metrics plus online experiments",
      "Discuss position bias, freshness, diversity, and latency",
    ],
    expectedSignals: [
      "Knows ranking is multi-stage",
      "Separates offline and online evaluation",
      "Mentions bias and latency",
    ],
    commonMistakes: [
      "Using only CTR",
      "Ignoring auctions or business constraints for ads",
      "No query or user segmentation",
    ],
    relatedTopics: ["search-ads-feed-design", "ranking-retrieval-recsys"],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "video-recommendation",
    title: "Design a Netflix-style Recommendation System",
    track: "ML System Design",
    difficulty: "Advanced",
    prompt:
      "Design a personalized home feed that recommends videos with strong watch time, diversity, and freshness while keeping latency low.",
    concepts: [
      "Candidate generation",
      "Ranking",
      "Embeddings",
      "Exploration vs exploitation",
      "Online feedback loops",
    ],
    evaluationLens: ["Watch time", "Retention", "Freshness", "Diversity", "Latency"],
  },
  {
    slug: "fraud-detection",
    title: "Design a Real-Time Fraud Detection System",
    track: "ML System Design",
    difficulty: "Advanced",
    prompt:
      "Detect payment fraud in real time with tight latency constraints, high class imbalance, and expensive false positives.",
    concepts: [
      "Imbalanced classification",
      "Feature freshness",
      "Online inference",
      "Threshold tuning",
      "Human review flows",
    ],
    evaluationLens: ["Fraud recall", "False positive rate", "Latency", "Analyst workload"],
  },
  {
    slug: "search-ranking",
    title: "Design a Search Ranking System",
    track: "ML System Design",
    difficulty: "Advanced",
    prompt:
      "Build search ranking for a marketplace and balance query understanding, retrieval quality, relevance, and latency.",
    concepts: [
      "Candidate retrieval",
      "Ranking features",
      "Learning to rank",
      "Query understanding",
      "Online metrics",
    ],
    evaluationLens: ["NDCG", "CTR", "Latency", "Query coverage"],
  },
  {
    slug: "ad-click-prediction",
    title: "Design Ad Click Prediction",
    track: "ML System Design",
    difficulty: "Advanced",
    prompt:
      "Predict click-through rate for ad ranking while handling sparse features, calibration, and revenue trade-offs.",
    concepts: [
      "Calibration",
      "Feature stores",
      "Delayed labels",
      "Online serving",
      "Auction trade-offs",
    ],
    evaluationLens: ["CTR lift", "Calibration", "Revenue", "Latency"],
  },
  {
    slug: "enterprise-rag-chatbot",
    title: "Design an Enterprise RAG Chatbot",
    track: "Generative AI",
    difficulty: "Advanced",
    prompt:
      "Design an internal knowledge assistant that retrieves trusted documents, cites sources, and respects security boundaries.",
    concepts: [
      "Chunking",
      "Hybrid retrieval",
      "Reranking",
      "Security filtering",
      "Citation UX",
    ],
    evaluationLens: ["Faithfulness", "Answer relevance", "Citation accuracy", "Latency", "Cost"],
  },
  {
    slug: "llm-evaluation-platform",
    title: "Design an LLM Evaluation Platform",
    track: "Generative AI",
    difficulty: "Advanced",
    prompt:
      "Build a platform that runs offline evals, prompt regressions, and release gates for multiple LLM-powered products.",
    concepts: [
      "Golden datasets",
      "Prompt versioning",
      "Rubrics",
      "Human review",
      "Regression dashboards",
    ],
    evaluationLens: ["Pass rate", "Regression detection", "Evaluator agreement", "Cost"],
  },
  {
    slug: "customer-support-agent",
    title: "Design an AI Customer Support Agent",
    track: "Generative AI",
    difficulty: "Advanced",
    prompt:
      "Create a support agent that can answer, refund, escalate, and log actions safely with tool-use permissions.",
    concepts: [
      "Tool use",
      "Guardrails",
      "Escalation",
      "Memory",
      "Fallback handling",
    ],
    evaluationLens: ["Resolution rate", "Unsafe action rate", "Escalation quality", "Latency"],
  },
  {
    slug: "document-intelligence",
    title: "Design a Document Intelligence Pipeline",
    track: "Generative AI",
    difficulty: "Intermediate",
    prompt:
      "Extract structured information from messy enterprise documents and route low-confidence outputs for review.",
    concepts: [
      "OCR",
      "Extraction",
      "Validation",
      "Confidence scoring",
      "Human-in-the-loop",
    ],
    evaluationLens: ["Field accuracy", "Coverage", "Manual review rate", "Turnaround time"],
  },
];

export const resources: Resource[] = [
  {
    title: "Google Machine Learning Crash Course",
    type: "Course",
    href: "https://developers.google.com/machine-learning/crash-course",
    description:
      "A fast refresher for supervised learning, embeddings, evaluation, and practical ML concepts.",
    tags: ["Traditional ML", "Math & Stats"],
  },
  {
    title: "Full Stack Deep Learning",
    type: "Course",
    href: "https://fullstackdeeplearning.com/",
    description:
      "Excellent bridge between modeling, deep learning, MLOps, and real-world AI system concerns.",
    tags: ["Deep Learning", "MLOps", "System Design"],
  },
  {
    title: "Hugging Face LLM Course",
    type: "Course",
    href: "https://huggingface.co/learn/llm-course",
    description:
      "A practical path through transformers, tokenization, fine-tuning, and modern LLM workflows.",
    tags: ["Generative AI", "Transformers"],
  },
  {
    title: "Made With ML",
    type: "Guide",
    href: "https://madewithml.com/",
    description:
      "Hands-on production ML guides covering data quality, experimentation, serving, and monitoring.",
    tags: ["MLOps", "System Design"],
  },
  {
    title: "Stanford CS229",
    type: "Course",
    href: "https://cs229.stanford.edu/",
    description:
      "Theory-heavy material for linear models, probabilistic thinking, optimization, and ML fundamentals.",
    tags: ["Traditional ML", "Math & Stats"],
  },
  {
    title: "Chip Huyen Blog",
    type: "Guide",
    href: "https://huyenchip.com/blog/",
    description:
      "Useful writing on ML systems, inference, latency, evaluation, and production trade-offs.",
    tags: ["ML System Design", "MLOps"],
  },
  {
    title: "OpenAI Platform Docs",
    type: "Docs",
    href: "https://platform.openai.com/docs",
    description:
      "Reference for structured outputs, evaluation workflows, tool use, and production LLM patterns.",
    tags: ["Generative AI", "LLMOps"],
  },
  {
    title: "Weights & Biases Reports",
    type: "Community",
    href: "https://wandb.ai/site/articles",
    description:
      "Good field notes on experiment tracking, model evaluation, and production workflows.",
    tags: ["MLOps", "Experiment Tracking"],
  },
];

export const homeHighlights = [
  "9 content pillars ordered from statistics to ML system design",
  "Roadmaps for 30, 60, and 90-day preparation windows",
  "Role-based paths for Data Scientist, ML Engineer, AI Engineer, and Senior MLE",
  "Question bank, case studies, readiness scoring, and resource curation",
];

export function getPillarBySlug(slug: PillarSlug) {
  return pillars.find((pillar) => pillar.slug === slug);
}

export function getTopicById(topicId: string) {
  return topics.find((topic) => topic.id === topicId);
}

export function getTopicsByPillar(pillar: PillarSlug) {
  return topics
    .filter((topic) => topic.pillar === pillar)
    .sort((a, b) => {
      const dayA = a.roadmapDay ?? Number.POSITIVE_INFINITY;
      const dayB = b.roadmapDay ?? Number.POSITIVE_INFINITY;
      return dayA === dayB ? a.title.localeCompare(b.title) : dayA - dayB;
    });
}

export function getRelatedTopics(topicIds: string[]) {
  return topicIds
    .map((topicId) => getTopicById(topicId))
    .filter((topic): topic is Topic => Boolean(topic));
}

export function getPillarHref(slug: PillarSlug) {
  const map: Record<PillarSlug, string> = {
    foundations: "/foundations",
    "math-stats": "/math-stats",
    "traditional-ml": "/traditional-ml",
    "deep-learning": "/deep-learning",
    "generative-ai": "/generative-ai",
    llmops: "/llmops",
    "ml-system-design": "/ml-system-design",
    mlops: "/mlops",
    "behavioral-storytelling": "/behavioral",
  };

  return map[slug];
}

export interface StudyStep {
  step: number;
  title: string;
  goal: string;
  actions: string[];
  output: string;
  timeHint: string;
}

export const studyMethodSteps: StudyStep[] = [
  {
    step: 1,
    title: "Orient",
    goal: "Pick a realistic timeline and a role target so your mix is not random.",
    actions: [
      "Choose a 30, 60, or 90-day roadmap based on your interview date",
      "Select a role track (MLE, AI Engineer, Senior MLE, ML Architect)",
      "Log your current strengths and the two or three pillars that scare you most",
    ],
    output: "A one-page plan with daily time, timeline, and weighted pillar mix.",
    timeHint: "1 to 2 hours once",
  },
  {
    step: 2,
    title: "Learn",
    goal: "Go deep on the pillars where your interview signal is weakest.",
    actions: [
      "Work through topic cards in the recommended order",
      "Summarize each topic in your own words, not copied notes",
      "Drop concepts you already know instead of rereading them",
    ],
    output: "Topic-by-topic notes, each no longer than one screen.",
    timeHint: "60 to 90 minutes per topic",
  },
  {
    step: 3,
    title: "Practice",
    goal: "Convert knowledge into interview answers with the right signals.",
    actions: [
      "Answer questions from the question bank out loud, timed",
      "Walk through a case study every week, writing the framework on paper first",
      "Compare your answer against the expected signals and close the gap",
    ],
    output: "A list of the prompts you can answer cold and the ones you still fumble.",
    timeHint: "30 to 60 minutes per session",
  },
  {
    step: 4,
    title: "Mock & Review",
    goal: "Simulate real loops, then repair weak areas instead of rereading strong ones.",
    actions: [
      "Run mock interviews with a peer or AI at least once a week",
      "Record yourself explaining a system design end to end",
      "Update your readiness score and rebalance study time toward lagging pillars",
    ],
    output: "Shorter gap list, sharper stories, more confident delivery.",
    timeHint: "Weekly, 60 to 90 minutes",
  },
];

export interface ArchitectCompetency {
  id: string;
  title: string;
  prompt: string;
  signals: string[];
  preparationCue: string;
}

export const architectCompetencies: ArchitectCompetency[] = [
  {
    id: "problem-framing",
    title: "Problem framing under ambiguity",
    prompt: "Can you turn a vague business goal into an ML problem with measurable success criteria?",
    signals: [
      "Identifies the decision the model supports, not just the label",
      "Proposes leading and lagging metrics that tie to revenue or risk",
      "Makes assumptions explicit and checks them with the interviewer",
    ],
    preparationCue: "Practice writing a one-page problem brief before drawing any boxes.",
  },
  {
    id: "architecture-tradeoffs",
    title: "Architecture trade-offs at scale",
    prompt: "Can you defend serving, training, and feature pipeline decisions against latency, cost, and reliability constraints?",
    signals: [
      "Picks batch, online, or streaming based on freshness budgets",
      "Chooses serving tier per request class (realtime vs near-real-time)",
      "Shows where the system degrades gracefully under load",
    ],
    preparationCue: "Keep a running matrix of trade-offs: latency × cost × freshness × quality.",
  },
  {
    id: "data-platform",
    title: "Data and feature platform judgment",
    prompt: "Can you design feature generation, storage, and retrieval so training and serving stay in sync?",
    signals: [
      "Talks about point-in-time correctness and feature TTLs",
      "Separates raw events, feature logic, and model inputs cleanly",
      "Knows when a feature store is helpful and when it is overhead",
    ],
    preparationCue: "Rehearse feature pipeline diagrams end-to-end with failure modes.",
  },
  {
    id: "reliability-governance",
    title: "Reliability, governance, and cost",
    prompt: "Can you make your system safe, observable, and affordable over months, not just at launch?",
    signals: [
      "Defines SLOs, rollback plans, and retraining triggers",
      "Adds privacy, access control, and auditability into the design",
      "Budgets inference cost per request and per user",
    ],
    preparationCue: "Always close a design with ops, compliance, and a cost estimate.",
  },
  {
    id: "genai-production",
    title: "GenAI architecture in production",
    prompt: "Can you design an LLM feature that is grounded, measurable, and cost-aware, not just a prompt?",
    signals: [
      "Separates retrieval, generation, evaluation, and guardrails",
      "Defines faithfulness, relevance, and safety metrics explicitly",
      "Shows routing, fallbacks, and cost tiers across model options",
    ],
    preparationCue: "Every GenAI design should show RAG, evals, guardrails, and rollout gates.",
  },
  {
    id: "influence-communication",
    title: "Influence and stakeholder communication",
    prompt: "Can you get platform, product, and leadership aligned on a proposal under ambiguity?",
    signals: [
      "Frames decisions as RFCs with options and trade-offs, not mandates",
      "Anticipates pushback from security, compliance, and infra",
      "Tells the story with metrics, risk, and a clear decision ask",
    ],
    preparationCue: "Rehearse a three-minute architecture narrative for a non-ML audience.",
  },
];

export interface TradeoffFramework {
  title: string;
  whenItAppears: string;
  axes: string[];
  defaultStance: string;
}

export const tradeoffFrameworks: TradeoffFramework[] = [
  {
    title: "Batch vs. real-time inference",
    whenItAppears: "Recommendations, fraud, ranking, personalization",
    axes: ["Freshness budget", "Latency SLO", "Infra cost", "Label delay"],
    defaultStance: "Default to batch precomputation for heavy features, use real-time only where freshness changes the decision.",
  },
  {
    title: "Fine-tune vs. RAG vs. prompt",
    whenItAppears: "Enterprise LLM features, support agents, document Q&A",
    axes: ["Data freshness", "Domain shift", "Latency", "Cost", "Control"],
    defaultStance: "Start with prompt + RAG, fine-tune only when retrieval plus prompting plateaus on evals.",
  },
  {
    title: "Centralized platform vs. team-owned stack",
    whenItAppears: "Feature stores, model registry, evaluation, serving platforms",
    axes: ["Time to value", "Consistency", "Team autonomy", "Ops burden"],
    defaultStance: "Centralize when multiple teams duplicate the same pain, federate until that pain is real.",
  },
  {
    title: "Build vs. buy",
    whenItAppears: "Vector stores, evaluation tooling, observability, orchestration",
    axes: ["Strategic differentiation", "Integration cost", "Vendor risk", "Pace"],
    defaultStance: "Buy anything that is not a differentiator and has a credible vendor; build what encodes your unfair advantage.",
  },
  {
    title: "Accuracy vs. cost vs. latency",
    whenItAppears: "LLM routing, model cascades, ranking stages, real-time ML",
    axes: ["Quality gain", "Cost per call", "Tail latency", "Failure impact"],
    defaultStance: "Use a small-first cascade: cheap model handles most traffic, escalate only on uncertainty or high stakes.",
  },
  {
    title: "Retrain cadence vs. monitoring",
    whenItAppears: "Drift-sensitive models, fraud, ranking, content recommendations",
    axes: ["Label latency", "Drift speed", "Ops cost", "Business impact"],
    defaultStance: "Monitor first, retrain on a trigger — schedule-based retraining is a symptom of weak monitoring.",
  },
];

export interface HowToUseStep {
  phase: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
}

export const howToUseSteps: HowToUseStep[] = [
  {
    phase: "1 · Plan",
    title: "Start with a roadmap, not a reading list",
    description:
      "Pick the timeline that matches your interview date, then layer a role track. The roadmap tells you what to study and in what order.",
    cta: { label: "Open the start-here guide", href: "/start-here" },
  },
  {
    phase: "2 · Learn",
    title: "Go deep by pillar, skimming what you know",
    description:
      "Topic cards include objectives, questions, and a recommended day. Skip what you already own and spend the savings on weak pillars.",
    cta: { label: "Browse the 90-day roadmap", href: "/" },
  },
  {
    phase: "3 · Practice",
    title: "Turn knowledge into signals",
    description:
      "Answer question-bank prompts out loud. Work case studies on paper first. Grade yourself against the expected signals, not vibes.",
    cta: { label: "Open the question bank", href: "/questions" },
  },
  {
    phase: "4 · Mock & Review",
    title: "Rebalance toward the gaps, not the comforts",
    description:
      "Run a weekly mock, update your readiness score, and move study time to whatever is lagging. Progress comes from gap repair.",
    cta: { label: "Work through a case study", href: "/case-studies" },
  },
];

export const homeHeroStats = [
  { label: "Content pillars", value: "9" },
  { label: "Topic cards", value: "40+" },
  { label: "Case studies", value: "8" },
  { label: "Practice questions", value: "20+" },
];

export interface DayItem {
  /** Stable id used for per-day check tracking (must be unique within a day). */
  id: string;
  label: string;
  /** Optional external link (LeetCode, blog, paper, docs). */
  href?: string;
  /** Optional small badge — e.g. "Easy", "LeetCode", "30 min". */
  meta?: string;
}

export interface DayTrack {
  /** Track label like "DSA practice", "ML fundamentals", "Reading". */
  label: string;
  items: DayItem[];
}

export interface DayReference {
  label: string;
  href: string;
  source?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  pillar: PillarSlug;
  focus: string;
  tracks: DayTrack[];
  /** Concept-oriented interview questions tied to this day's content. */
  interviewQuestions: string[];
  /** External reading: blogs, papers, docs. */
  references: DayReference[];
  topicId?: string;
  caseStudySlug?: string;
  questionIds?: string[];
}

export function dayItemCount(plan: DayPlan) {
  return plan.tracks.reduce((sum, t) => sum + t.items.length, 0);
}

export function dayItemIds(plan: DayPlan) {
  return plan.tracks.flatMap((t) => t.items.map((i) => i.id));
}
