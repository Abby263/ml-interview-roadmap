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
  | "ML Coding"
  | "ML Debugging"
  | "ML Fundamentals"
  | "Statistics"
  | "Deep Learning"
  | "Transformers"
  | "Generative AI"
  | "RAG"
  | "LLMOps"
  | "ML System Design"
  | "MLOps"
  | "Production ML"
  | "Architect Trade-offs"
  | "Company Loop"
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
  { href: "/", label: "Dashboard", group: "Overview" },
  { href: "/study-plan", label: "Study Plan", group: "Overview" },
  { href: "/questions", label: "Question Bank", group: "Reference" },
  { href: "/case-studies", label: "Case Studies", group: "Reference" },
  { href: "/resources", label: "Resources", group: "Reference" },
  { href: "/about", label: "About", group: "Reference" },
] as const;

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
  {
    id: "ml-coding-logreg-numpy",
    question: "Implement logistic regression with NumPy, mini-batch SGD, L2 regularization, and numerically stable binary cross entropy.",
    category: "ML Coding",
    difficulty: "Intermediate",
    answerOutline: [
      "Vectorize logits, sigmoid, loss, and gradient computation",
      "Use stable sigmoid/log-loss branches or clipping to avoid overflow",
      "Add tests against sklearn or a finite-difference gradient checker",
    ],
    expectedSignals: [
      "Writes vectorized code instead of loops over examples",
      "Mentions numerical stability and reproducibility",
      "Explains train-time and inference-time complexity",
    ],
    commonMistakes: [
      "Computing log(sigmoid(x)) naively for extreme logits",
      "Forgetting the intercept term",
      "No validation that gradients are correct",
    ],
    relatedTopics: ["ml-from-scratch", "linear-models-regularization"],
  },
  {
    id: "ml-coding-kmeans-edge-cases",
    question: "Code k-means from scratch and handle empty clusters, duplicate points, convergence tolerance, and memory pressure.",
    category: "ML Coding",
    difficulty: "Intermediate",
    answerOutline: [
      "Initialize centroids, assign points, update means, and stop on tolerance",
      "Handle empty clusters by reseeding or keeping the previous centroid",
      "Discuss vectorized distance computation and memory trade-offs",
    ],
    expectedSignals: [
      "Names empty-cluster and duplicate-point edge cases",
      "Explains k-means++ and convergence criteria",
      "Can reason about O(nkd) cost and batching",
    ],
    commonMistakes: [
      "Ignoring empty clusters",
      "Building an n by k distance matrix when it does not fit memory",
      "Stopping only after a fixed number of iterations",
    ],
    relatedTopics: ["ml-from-scratch", "anomaly-detection"],
  },
  {
    id: "ml-coding-gradient-checker",
    question: "How would you verify a hand-coded model gradient using finite differences, and what failures would you expect?",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Compare analytical gradients to central finite differences",
      "Choose epsilon carefully and use relative error",
      "Isolate failing parameter groups and check broadcasting or regularization terms",
    ],
    expectedSignals: [
      "Uses central difference instead of only forward difference",
      "Mentions relative error and floating-point limits",
      "Knows how to narrow a gradient bug",
    ],
    commonMistakes: [
      "Using epsilon values that are too small or too large",
      "Checking only one parameter",
      "Forgetting regularization in either analytical or numerical loss",
    ],
    relatedTopics: ["ml-from-scratch", "backprop-and-optimization"],
  },
  {
    id: "ml-coding-data-pipeline",
    question: "Build a pandas/NumPy training dataset from messy event logs while avoiding leakage, duplicate events, and bad joins.",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Define the prediction timestamp and label window first",
      "Deduplicate events and perform point-in-time joins",
      "Add tests for missingness, row counts, leakage, and label construction",
    ],
    expectedSignals: [
      "Starts with the prediction moment and label definition",
      "Uses point-in-time thinking for joins",
      "Treats data tests as part of the deliverable",
    ],
    commonMistakes: [
      "Joining future data into features",
      "Counting events instead of entities",
      "Returning a notebook with no reproducibility or tests",
    ],
    relatedTopics: ["feature-engineering-leakage", "data-validation-quality"],
  },
  {
    id: "ml-coding-pytorch-training-loop",
    question: "Write a PyTorch training loop with validation, checkpointing, early stopping, gradient accumulation, and mixed precision.",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Use train/eval modes, zero_grad, backward, optimizer step, scheduler, and no_grad validation",
      "Save model, optimizer, scheduler, scaler, epoch, and random state",
      "Handle gradient accumulation and AMP loss scaling carefully",
    ],
    expectedSignals: [
      "Knows where train/eval and no_grad matter",
      "Saves enough state to resume exactly",
      "Explains accumulation side effects on batch norm and schedulers",
    ],
    commonMistakes: [
      "Validating with dropout still enabled",
      "Not dividing loss during gradient accumulation",
      "Saving only model weights and losing optimizer state",
    ],
    relatedTopics: ["backprop-and-optimization", "training-orchestration"],
  },
  {
    id: "ml-debugging-suspicious-auc",
    question: "A notebook reports 0.99 validation AUC on messy behavioral data. How do you debug whether it is real?",
    category: "ML Debugging",
    difficulty: "Advanced",
    answerOutline: [
      "Check split strategy, leakage, duplicates, label timing, and entity overlap",
      "Recompute metrics independently and inspect score distributions",
      "Run simple baselines and remove suspicious features",
    ],
    expectedSignals: [
      "Suspects leakage before model genius",
      "Checks time/entity splits and label construction",
      "Uses baselines and ablations to isolate the signal",
    ],
    commonMistakes: [
      "Trusting a single metric from the notebook",
      "Changing model architecture before validating data",
      "Ignoring duplicate users or post-outcome features",
    ],
    relatedTopics: ["feature-engineering-leakage", "metrics-and-calibration"],
  },
  {
    id: "ml-coding-topk-topp-sampling",
    question: "Implement temperature scaling, top-k filtering, and top-p nucleus sampling from model logits.",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Scale logits by temperature and subtract max before softmax",
      "Filter to top-k or smallest cumulative top-p token set",
      "Renormalize probabilities and sample with reproducible randomness",
    ],
    expectedSignals: [
      "Understands rescaling versus truncation",
      "Handles numerical stability and edge cases",
      "Can test that excluded tokens are never sampled",
    ],
    commonMistakes: [
      "Applying top-p before sorting",
      "Forgetting to renormalize after filtering",
      "Confusing lower temperature with top-k",
    ],
    relatedTopics: ["llm-basics", "transformers-first-principles"],
  },
  {
    id: "llm-kv-cache-debugging",
    question: "How do you reason about KV-cache shapes, prefill versus decode latency, and long-context memory pressure?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Track batch, layers, heads, sequence length, and head dimension",
      "Separate prefill compute from decode token-by-token generation",
      "Discuss memory pressure, fragmentation, and eviction or paging strategies",
    ],
    expectedSignals: [
      "Can name why KV cache dominates long-context serving memory",
      "Separates time-to-first-token from tokens-per-second",
      "Knows how cache bugs can break attention to prior context",
    ],
    commonMistakes: [
      "Treating all latency as model compute",
      "Ignoring sequence length in memory estimates",
      "Not distinguishing prefill and decode phases",
    ],
    relatedTopics: ["llm-routing-cost-latency", "transformers-first-principles"],
  },
  {
    id: "llm-eval-dataset-design",
    question: "Design an LLM eval dataset that catches regressions across quality, safety, faithfulness, latency, and cost.",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Define task slices, metadata, expected behavior, rubrics, and pass/fail thresholds",
      "Include golden cases, adversarial cases, and production failure cases",
      "Track aggregate and slice-level regressions before release",
    ],
    expectedSignals: [
      "Avoids one aggregate score as the only gate",
      "Includes real incidents and adversarial cases",
      "Connects eval cases to release decisions",
    ],
    commonMistakes: [
      "Only using generic benchmark questions",
      "No slice metadata or high-risk workflow coverage",
      "No owner for maintaining the dataset",
    ],
    relatedTopics: ["llm-eval-ops", "llm-evaluation"],
  },
  {
    id: "llm-judge-calibration",
    question: "How would you calibrate an LLM-as-judge system against human reviewers and reduce judge bias?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Collect human labels on representative and adversarial examples",
      "Measure agreement, disagreement slices, and rubric sensitivity",
      "Use pairwise comparisons and periodic human revalidation",
    ],
    expectedSignals: [
      "Treats the judge as a model that needs evaluation",
      "Mentions verbosity, position, and self-preference biases",
      "Keeps humans in the loop for critical workflows",
    ],
    commonMistakes: [
      "Assuming LLM judge scores are ground truth",
      "No calibration set",
      "Ignoring disagreement by task type or user segment",
    ],
    relatedTopics: ["llm-eval-ops", "llm-evaluation"],
  },
  {
    id: "llm-redteam-regression-suite",
    question: "How do you turn prompt-injection, jailbreak, and data-exfiltration failures into repeatable release-blocking tests?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Capture the failing trace, expected safe behavior, and risk category",
      "Add adversarial variants and run them on prompt, model, retrieval, and tool changes",
      "Track pass/fail by severity and ownership",
    ],
    expectedSignals: [
      "Converts incidents into regression tests",
      "Covers retrieval and tool-call paths, not just final answers",
      "Uses severity to define release gates",
    ],
    commonMistakes: [
      "Treating red teaming as a one-time exercise",
      "Only testing exact prompt strings",
      "No mapping from failures to controls",
    ],
    relatedTopics: ["llm-safety-security-privacy", "llm-eval-ops"],
  },
  {
    id: "llm-agent-excessive-agency",
    question: "How do you prevent a tool-using agent from taking excessive or irreversible actions?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Define tool allowlists, scopes, rate limits, and risk tiers",
      "Require human approval for irreversible or high-value actions",
      "Log tool plans, arguments, outputs, and policy decisions",
    ],
    expectedSignals: [
      "Separates planning from execution control",
      "Mentions permissions and auditability",
      "Uses human approval where risk justifies it",
    ],
    commonMistakes: [
      "Letting the model decide its own permissions",
      "No action risk tiers",
      "No audit trail for tool calls",
    ],
    relatedTopics: ["agents-and-guardrails", "llm-safety-security-privacy"],
  },
  {
    id: "llm-vector-embedding-security",
    question: "What security and reliability failures are specific to embeddings, vector search, and RAG indexes?",
    category: "RAG",
    difficulty: "Advanced",
    answerOutline: [
      "Discuss data poisoning, stale permissions, embedding inversion risk, and retrieval manipulation",
      "Use ACL-aware indexing, metadata filters, and re-embedding policies",
      "Monitor retrieval anomalies and high-risk query slices",
    ],
    expectedSignals: [
      "Does not treat the vector DB as a neutral cache",
      "Connects permissions to index lifecycle",
      "Mentions poisoned or adversarial documents",
    ],
    commonMistakes: [
      "Filtering retrieved text after it is already in context",
      "No reindexing after permission changes",
      "Ignoring adversarial documents",
    ],
    relatedTopics: ["rag-architecture", "llm-safety-security-privacy"],
  },
  {
    id: "llm-semantic-cache-risk",
    question: "When is semantic caching useful for LLM systems, and when is it unsafe?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Use semantic caching for repeatable low-risk queries with stable permissions",
      "Measure false-hit risk, freshness, tenant boundaries, and personalization sensitivity",
      "Disable or narrow caching for high-risk, user-specific, or permissioned answers",
    ],
    expectedSignals: [
      "Balances latency/cost gains against correctness risk",
      "Mentions tenant and permission boundaries",
      "Defines an eval for false cache hits",
    ],
    commonMistakes: [
      "Caching personalized or permissioned answers globally",
      "Only measuring hit rate",
      "No invalidation or freshness policy",
    ],
    relatedTopics: ["llm-routing-cost-latency", "llm-safety-security-privacy"],
  },
  {
    id: "llm-routing-cost-quality-simulator",
    question: "Design a model-routing simulator that estimates blended quality, latency, and cost for a cheap-to-expensive cascade.",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Use traffic slices, router confidence, verifier outcomes, and fallback rate",
      "Compute expected cost, p95 latency, and quality by slice",
      "Gate rollout on hard-query performance and safety regressions",
    ],
    expectedSignals: [
      "Measures routing by segment, not only global average",
      "Includes verifier cost and latency",
      "Defines fallback and rollback behavior",
    ],
    commonMistakes: [
      "Ignoring the cost of the verifier",
      "Optimizing easy questions while hurting hard ones",
      "No online monitoring after rollout",
    ],
    relatedTopics: ["llm-routing-cost-latency", "llm-eval-ops"],
  },
  {
    id: "prod-data-contracts-schema-evolution",
    question: "What belongs in a data contract for production ML, and how do you handle schema evolution without breaking models?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Specify owners, schema, semantics, freshness, nullability, and change process",
      "Separate backward-compatible changes from breaking changes",
      "Add validation, alerting, versioning, and migration windows",
    ],
    expectedSignals: [
      "Distinguishes schema from semantic meaning",
      "Names ownership and compatibility policy",
      "Connects upstream changes to model release safety",
    ],
    commonMistakes: [
      "Only validating column names",
      "No semantic ownership",
      "Breaking online inference with an offline-only migration",
    ],
    relatedTopics: ["data-validation-quality", "feature-stores"],
  },
  {
    id: "prod-feature-lineage-audit",
    question: "How do you trace a production prediction back to the data, features, code, model, prompt, and deployment that produced it?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Capture lineage across raw data, feature views, training job, model registry, and deployment version",
      "Log prediction context and request metadata without leaking sensitive data",
      "Use lineage for audits, incident response, and reproducibility",
    ],
    expectedSignals: [
      "Covers both offline training and online serving artifacts",
      "Mentions privacy-aware logging",
      "Explains why lineage matters during incidents",
    ],
    commonMistakes: [
      "Tracking only model version",
      "No feature or data snapshot identifier",
      "Logging sensitive data without retention controls",
    ],
    relatedTopics: ["model-registry-cicd", "training-orchestration"],
  },
  {
    id: "prod-rto-rpo-training-pipeline",
    question: "What are RTO and RPO for ML training pipelines, and how do they change your retry, checkpoint, and alerting strategy?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Define recovery time objective and recovery point objective for training and feature jobs",
      "Use idempotent jobs, checkpoints, retry policies, and backfills",
      "Choose paging versus silent retry based on business impact",
    ],
    expectedSignals: [
      "Applies reliability terms to ML workflows correctly",
      "Understands partial failures and duplicate writes",
      "Links alerting to user or business impact",
    ],
    commonMistakes: [
      "Treating batch pipelines as non-critical by default",
      "No checkpointing or idempotency",
      "Paging on every transient failure",
    ],
    relatedTopics: ["training-orchestration", "model-registry-cicd"],
  },
  {
    id: "prod-release-gates-ml-cicd",
    question: "What checks should block a production ML release before canary traffic?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Run code, data, feature, model quality, security, latency, and rollback checks",
      "Compare candidate against champion across key slices",
      "Require artifacts for rollback and owner sign-off for risky changes",
    ],
    expectedSignals: [
      "Separates data tests from model tests and service tests",
      "Mentions slices and guardrails",
      "Requires rollback readiness before launch",
    ],
    commonMistakes: [
      "Only checking unit tests",
      "No latency or cost gate",
      "No champion/challenger comparison",
    ],
    relatedTopics: ["model-registry-cicd", "monitoring-drift"],
  },
  {
    id: "prod-load-shedding-backpressure",
    question: "How would you design load shedding, backpressure, queues, and graceful degradation for an overloaded ML inference service?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Define priorities and deadlines for request classes",
      "Use bounded queues, timeouts, circuit breakers, and fallback models",
      "Monitor rejected requests, queue delay, p99 latency, and business impact",
    ],
    expectedSignals: [
      "Prioritizes user-visible deadlines over infinite queues",
      "Has degraded modes such as cached results or smaller models",
      "Knows how overload can create retry storms",
    ],
    commonMistakes: [
      "Letting queues grow without bound",
      "Retrying every failed request immediately",
      "No differentiated treatment for critical traffic",
    ],
    relatedTopics: ["online-serving-tradeoffs", "model-serving-patterns"],
  },
  {
    id: "prod-incident-response-model-regression",
    question: "A newly deployed model hurts one cohort while aggregate metrics look fine. How do you run the incident?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Freeze ramp, inspect cohort slices, compare champion and candidate traces",
      "Decide rollback, threshold change, feature disablement, or traffic segmentation",
      "Write a postmortem and add cohort-specific monitoring/evals",
    ],
    expectedSignals: [
      "Looks past aggregate metrics",
      "Takes immediate mitigation before root-cause perfection",
      "Adds a permanent regression guard",
    ],
    commonMistakes: [
      "Waiting for statistical certainty while users are harmed",
      "Only looking at average quality",
      "No postmortem or eval update",
    ],
    relatedTopics: ["monitoring-drift", "model-registry-cicd"],
  },
  {
    id: "prod-finops-unit-cost",
    question: "How do you model and control cost per prediction, training run, eval suite, tenant, and feature?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Instrument compute, storage, network, vector DB, and third-party API costs",
      "Attribute spend by tenant, feature, request class, and model path",
      "Set cost budgets and regression gates alongside quality gates",
    ],
    expectedSignals: [
      "Measures before optimizing",
      "Knows unit cost varies by traffic mix and route",
      "Connects cost controls to release management",
    ],
    commonMistakes: [
      "Only looking at total cloud bill",
      "Cutting model quality uniformly",
      "No per-tenant or per-feature attribution",
    ],
    relatedTopics: ["llm-routing-cost-latency", "online-serving-tradeoffs"],
  },
  {
    id: "rag-acl-permission-freshness",
    question: "How do you enforce enterprise RAG permissions when documents and user access change continuously?",
    category: "RAG",
    difficulty: "Advanced",
    answerOutline: [
      "Filter at retrieval time using user identity, source ACLs, and metadata",
      "Track permission freshness and reindex or invalidate affected chunks",
      "Audit retrieved documents and citations per request",
    ],
    expectedSignals: [
      "Enforces ACLs before context construction",
      "Accounts for permission changes after embedding",
      "Separates index freshness from document freshness",
    ],
    commonMistakes: [
      "Filtering only after generation",
      "No strategy for permission revocation",
      "No audit log for retrieved sources",
    ],
    relatedTopics: ["rag-architecture", "llm-safety-security-privacy"],
  },
  {
    id: "architect-follow-up-ladder",
    question: "Use an architect follow-up ladder for any ML system design case: requirements, metrics, data, model, serving, monitoring, rollback, cost, and risk.",
    category: "Architect Trade-offs",
    difficulty: "Advanced",
    answerOutline: [
      "Start with product requirements, scale, constraints, and metric hierarchy",
      "Defend data, labels, baseline, model choice, feature freshness, and serving path",
      "Close with rollout, monitoring, rollback, cost, security, and failure modes",
    ],
    expectedSignals: [
      "Keeps the answer structured under pressure",
      "Connects model choices to product and operational constraints",
      "Anticipates senior-level follow-ups before being asked",
    ],
    commonMistakes: [
      "Jumping straight to model architecture",
      "No business metric or guardrails",
      "No launch or rollback plan",
    ],
    relatedTopics: ["system-design-framework", "requirements-metrics-scope"],
  },
  {
    id: "company-loop-meta-mle",
    question: "How would you prepare for a Meta-style MLE loop covering coding, ML fundamentals, product ML design, and behavioral signals?",
    category: "Company Loop",
    difficulty: "Advanced",
    answerOutline: [
      "Prepare fast coding and ML-from-scratch implementation",
      "Practice feed, recommendations, ranking, and integrity system design",
      "Use product metrics, experimentation, and launch trade-offs in every design answer",
    ],
    expectedSignals: [
      "Knows the loop is not only theory",
      "Can convert product prompts into ML systems",
      "Uses clear trade-offs and metrics",
    ],
    commonMistakes: [
      "Only studying LeetCode",
      "Ignoring product metric framing",
      "No behavioral stories about ambiguity or cross-functional work",
    ],
    relatedTopics: ["ranking-retrieval-recsys", "system-design-framework"],
  },
  {
    id: "company-loop-openai-technical-depth",
    question: "How do you prepare for an AI-lab style technical loop with pair coding, deep project review, evals, and safety trade-offs?",
    category: "Company Loop",
    difficulty: "Advanced",
    answerOutline: [
      "Prepare to code, test, and explain implementation choices live",
      "Know one project deeply across data, model, evals, incidents, and trade-offs",
      "Practice communicating uncertainty and reasoning clearly",
    ],
    expectedSignals: [
      "Can go deep without hand-waving",
      "Uses tests and performance reasoning",
      "Connects model behavior to evals and safety",
    ],
    commonMistakes: [
      "Over-indexing on memorized questions",
      "Not knowing the details of your own project",
      "No evidence of testing or code quality",
    ],
    relatedTopics: ["llm-eval-ops", "project-storytelling"],
  },
  {
    id: "company-loop-startup-practical",
    question: "What does a startup ML interview loop test that big-tech loops often do not?",
    category: "Company Loop",
    difficulty: "Intermediate",
    answerOutline: [
      "Expect messy notebooks, take-homes, product ambiguity, and rapid build-vs-buy decisions",
      "Show pragmatic MVP thinking and the ability to ship safely",
      "Discuss what you would do in week one with limited data and infra",
    ],
    expectedSignals: [
      "Prioritizes useful systems over elegant platforms",
      "Can debug messy data and unclear requirements",
      "Knows when a managed API is the right first step",
    ],
    commonMistakes: [
      "Designing a big-company platform too early",
      "Ignoring customer feedback loops",
      "No plan for evals or monitoring in the MVP",
    ],
    relatedTopics: ["project-storytelling", "llm-eval-ops"],
  },
  {
    id: "startup-rag-api-60-min",
    question: "Ship a minimal RAG API in 60 minutes. What do you build, what do you skip, and what do you test?",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Build ingestion, chunking, embeddings, retrieval, generation, and one smoke eval",
      "Use a managed model/vector store if speed matters",
      "Call out production gaps: ACLs, evals, monitoring, cost, and retries",
    ],
    expectedSignals: [
      "Scopes a credible MVP",
      "Knows the risks of demo shortcuts",
      "Adds at least one task-specific eval",
    ],
    commonMistakes: [
      "Building a polished UI before proving retrieval works",
      "No citations or source visibility",
      "No distinction between demo and production requirements",
    ],
    relatedTopics: ["rag-architecture", "llm-eval-ops"],
  },
  {
    id: "startup-messy-notebook-debug",
    question: "A startup gives you a messy ML notebook as a take-home. How do you turn it into a reliable result?",
    category: "ML Debugging",
    difficulty: "Intermediate",
    answerOutline: [
      "Clarify the product target and label definition",
      "Check leakage, splits, missingness, duplicates, and metric code",
      "Refactor into reproducible steps with tests and a short decision memo",
    ],
    expectedSignals: [
      "Finds data issues before tuning models",
      "Communicates assumptions and trade-offs",
      "Produces something another engineer can rerun",
    ],
    commonMistakes: [
      "Only improving notebook accuracy",
      "No tests or environment notes",
      "Not stating uncertainty or next steps",
    ],
    relatedTopics: ["feature-engineering-leakage", "project-storytelling"],
  },
  {
    id: "behavioral-technical-deep-dive",
    question: "Walk through your hardest ML system project at senior depth: rejected alternatives, incidents, metrics, and stakeholder trade-offs.",
    category: "Behavioral",
    difficulty: "Advanced",
    answerOutline: [
      "Explain context, constraints, and why the problem mattered",
      "Describe alternatives considered and rejected with evidence",
      "Cover launch, monitoring, incidents, communication, and what changed afterward",
    ],
    expectedSignals: [
      "Shows ownership beyond model training",
      "Can defend trade-offs with metrics",
      "Communicates cross-functional impact clearly",
    ],
    commonMistakes: [
      "Only describing model architecture",
      "No rejected alternatives",
      "No measurable impact or operational lesson",
    ],
    relatedTopics: ["project-storytelling", "behavioral-ownership"],
  },
  {
    id: "company-loop-tiktok-youtube-ranking",
    question: "What follow-ups should you expect after designing a TikTok or YouTube-style recommendation feed?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Discuss candidate generation, ranking, re-ranking, freshness, diversity, and exploration",
      "Handle cold start, delayed labels, feedback loops, and creator ecosystem guardrails",
      "Plan latency budgets, fallbacks, and A/B test guardrails",
    ],
    expectedSignals: [
      "Understands multi-stage ranking systems",
      "Balances engagement with diversity and safety",
      "Names online and offline metrics",
    ],
    commonMistakes: [
      "Optimizing watch time only",
      "Ignoring cold start or filter bubbles",
      "No p99 latency or fallback plan",
    ],
    relatedTopics: ["ranking-retrieval-recsys", "search-ads-feed-design"],
  },
  {
    id: "case-content-moderation-design",
    question: "Design a content moderation and trust-and-safety ML system for user-generated text, images, or video.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Clarify policy taxonomy, action types, latency, appeals, and reviewer capacity",
      "Combine classifiers, rules, human review, active learning, and adversarial monitoring",
      "Track precision/recall by policy, fairness, reviewer load, and false-positive harm",
    ],
    expectedSignals: [
      "Treats policy and product action as first-class requirements",
      "Includes human review and appeals",
      "Anticipates adversarial adaptation",
    ],
    commonMistakes: [
      "Only proposing a classifier",
      "No policy/versioning or appeals path",
      "Ignoring reviewer capacity and false-positive harm",
    ],
    relatedTopics: ["model-serving-patterns", "interpretability-fairness"],
  },
  {
    id: "case-notification-ranking",
    question: "Design a notification ranking system that maximizes useful engagement without spamming users.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Define candidate triggers, frequency caps, send-time optimization, and user value metrics",
      "Rank notifications with relevance, fatigue, urgency, and channel constraints",
      "Use experiments with unsubscribe, mute, churn, and long-term retention guardrails",
    ],
    expectedSignals: [
      "Balances short-term clicks with long-term trust",
      "Includes suppression and frequency controls",
      "Knows metrics can create spammy behavior",
    ],
    commonMistakes: [
      "Optimizing open rate only",
      "No fatigue or opt-out guardrail",
      "Ignoring timezone and send-time constraints",
    ],
    relatedTopics: ["search-ads-feed-design", "causal-inference-uplift"],
  },
  {
    id: "case-marketplace-matching",
    question: "Design a marketplace matching system for buyers and sellers, riders and drivers, or candidates and jobs.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Clarify objective, two-sided constraints, supply/demand balance, and fairness concerns",
      "Use retrieval, ranking, constraints, and online feedback loops",
      "Evaluate match quality, conversion, liquidity, latency, and ecosystem health",
    ],
    expectedSignals: [
      "Recognizes two-sided marketplace trade-offs",
      "Includes constraints and fairness, not only relevance",
      "Handles cold-start and feedback loops",
    ],
    commonMistakes: [
      "Optimizing one side of the marketplace only",
      "No exploration for new supply",
      "Ignoring delayed conversion labels",
    ],
    relatedTopics: ["ranking-retrieval-recsys", "causal-inference-uplift"],
  },
  {
    id: "case-demand-forecasting-platform",
    question: "Design a demand forecasting platform for sparse marketplace items with seasonality and business-critical decisions.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Define forecast horizon, granularity, hierarchy, and cost of over/under prediction",
      "Use time-series backtesting, baselines, covariates, and segment-specific metrics",
      "Monitor drift, holiday effects, sparse items, and downstream decision quality",
    ],
    expectedSignals: [
      "Avoids random splits",
      "Connects metric choice to inventory or staffing cost",
      "Handles hierarchy and sparse segments",
    ],
    commonMistakes: [
      "Reporting aggregate RMSE only",
      "Ignoring seasonality or intermittent demand",
      "No backtesting protocol",
    ],
    relatedTopics: ["time-series-forecasting", "metrics-and-calibration"],
  },
  {
    id: "case-anomaly-detection-platform",
    question: "Design an anomaly detection platform for metrics, logs, transactions, or infrastructure events.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Clarify anomaly definition, action, alert budget, and label availability",
      "Use statistical baselines, unsupervised models, supervised feedback, and suppression logic",
      "Evaluate precision at alert budget, time to detect, false positives, and incident usefulness",
    ],
    expectedSignals: [
      "Starts with actionability and alert budget",
      "Handles weak or delayed labels",
      "Includes feedback from responders",
    ],
    commonMistakes: [
      "Equating rare with important",
      "No alert suppression or deduplication",
      "No plan for concept drift",
    ],
    relatedTopics: ["anomaly-detection", "monitoring-drift"],
  },
  {
    id: "case-zero-downtime-migration",
    question: "How would you migrate a legacy model service to a new feature store and serving platform with zero downtime?",
    category: "Production ML",
    difficulty: "Advanced",
    answerOutline: [
      "Run old and new paths in shadow mode and compare features, predictions, and latency",
      "Ramp traffic gradually with rollback thresholds",
      "Keep old artifacts and feature snapshots until parity is proven",
    ],
    expectedSignals: [
      "Does not big-bang cut over",
      "Defines parity metrics before migration",
      "Plans rollback and ownership",
    ],
    commonMistakes: [
      "Only comparing offline predictions",
      "No shadow traffic or dual writes",
      "No plan for feature parity debugging",
    ],
    relatedTopics: ["feature-stores", "model-registry-cicd"],
  },
  {
    id: "case-multitenant-ai-platform",
    question: "Design a multi-tenant enterprise AI platform with shared models, tenant-specific data, isolation, cost controls, and auditability.",
    category: "Architect Trade-offs",
    difficulty: "Advanced",
    answerOutline: [
      "Separate tenant identity, data boundaries, compute isolation, key management, and audit trails",
      "Choose shared base models, adapters, per-tenant indexes, quotas, and policy layers",
      "Monitor noisy neighbors, cost by tenant, security incidents, and quality by tenant",
    ],
    expectedSignals: [
      "Separates data, compute, and policy isolation",
      "Balances hard isolation against cost",
      "Includes audit logs and per-tenant quotas",
    ],
    commonMistakes: [
      "Treating tenancy as just a database column",
      "No rate limits or cost controls",
      "No audit trail for cross-tenant access",
    ],
    relatedTopics: ["system-design-framework", "llm-safety-security-privacy"],
  },
  {
    id: "case-personalization-cold-start-marketplace",
    question: "How would you solve cold start in a marketplace personalization system for new users, new items, and new sellers?",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Use content features, onboarding signals, popularity priors, exploration, and bandits",
      "Separate new user, new item, and new seller strategies",
      "Evaluate early conversion, diversity, long-term retention, and marketplace fairness",
    ],
    expectedSignals: [
      "Does not give one generic cold-start answer",
      "Balances exploration and exploitation",
      "Considers marketplace ecosystem health",
    ],
    commonMistakes: [
      "Only recommending popular items",
      "No exploration budget",
      "Ignoring seller-side fairness or liquidity",
    ],
    relatedTopics: ["ranking-retrieval-recsys", "causal-inference-uplift"],
  },
  {
    id: "ml-coding-transformer-block",
    question: "Implement a minimal transformer block and explain the tensor shapes through attention, MLP, residuals, and layer norm.",
    category: "ML Coding",
    difficulty: "Advanced",
    answerOutline: [
      "Implement QKV projections, scaled dot-product attention, masking, output projection, MLP, residuals, and normalization",
      "Track batch, sequence, hidden, heads, and head dimension shapes",
      "Discuss numerical stability, masking, and memory complexity",
    ],
    expectedSignals: [
      "Can reason through shapes without guessing",
      "Knows where causal masking applies",
      "Mentions O(n squared) attention memory",
    ],
    commonMistakes: [
      "Mixing batch and sequence axes",
      "Applying softmax over the wrong dimension",
      "Forgetting residual connections or layer norm placement",
    ],
    relatedTopics: ["transformers-first-principles", "backprop-and-optimization"],
  },
  {
    id: "ml-coding-embedding-search",
    question: "Implement a simple embedding search pipeline with cosine similarity, top-k retrieval, and evaluation for recall.",
    category: "ML Coding",
    difficulty: "Intermediate",
    answerOutline: [
      "Normalize embeddings and compute cosine similarity",
      "Return top-k results with metadata and source identifiers",
      "Evaluate recall@k and inspect false positives by query type",
    ],
    expectedSignals: [
      "Knows normalization changes dot-product behavior",
      "Returns traceable sources, not only text",
      "Uses retrieval metrics instead of answer quality only",
    ],
    commonMistakes: [
      "Forgetting to normalize vectors",
      "No tie-breaking or source metadata",
      "Evaluating only the final generated answer",
    ],
    relatedTopics: ["rag-architecture", "llm-evaluation"],
  },
  {
    id: "llm-tool-call-debugging",
    question: "An LLM agent is calling the wrong tool with plausible-looking arguments. How do you debug and prevent it?",
    category: "LLMOps",
    difficulty: "Advanced",
    answerOutline: [
      "Inspect traces for prompt, tool schema, retrieved context, arguments, validation errors, and retries",
      "Tighten tool descriptions, schemas, argument validation, and policy gates",
      "Add eval cases for ambiguous tools and high-risk actions",
    ],
    expectedSignals: [
      "Uses trace-level evidence",
      "Treats schemas and validators as controls",
      "Adds regression tests for tool behavior",
    ],
    commonMistakes: [
      "Only rewriting the prompt",
      "No schema validation or dry-run mode",
      "No separation between planner and executor",
    ],
    relatedTopics: ["agents-and-guardrails", "llm-observability-incidents"],
  },
  {
    id: "company-loop-google-ml-fundamentals",
    question: "How would you prepare for a Google-style ML loop that emphasizes fundamentals, scalable design, experimentation, and responsible AI?",
    category: "Company Loop",
    difficulty: "Advanced",
    answerOutline: [
      "Prepare rigorous ML/statistics explanations and clean coding",
      "Practice scalable data, training, serving, and monitoring designs",
      "Discuss fairness, privacy, data quality, and launch guardrails",
    ],
    expectedSignals: [
      "Shows mathematical rigor and production judgment",
      "Connects offline metrics to online experiments",
      "Includes responsible AI and monitoring concerns",
    ],
    commonMistakes: [
      "Only studying algorithm trivia",
      "No experiment or launch framework",
      "Ignoring data governance or fairness",
    ],
    relatedTopics: ["statistical-inference-experimentation", "system-design-framework"],
  },
  {
    id: "company-loop-amazon-aws-operational",
    question: "How would you prepare for an Amazon/AWS-style ML loop focused on operational ownership, cloud deployment, monitoring, and security?",
    category: "Company Loop",
    difficulty: "Advanced",
    answerOutline: [
      "Prepare examples of owning production failures and trade-offs",
      "Know cloud ML workflows for data preparation, model deployment, monitoring, and governance",
      "Discuss security, access control, cost, and rollback in every design",
    ],
    expectedSignals: [
      "Uses operational language and ownership stories",
      "Can map ML lifecycle stages to cloud services or platform components",
      "Includes security and cost controls",
    ],
    commonMistakes: [
      "Only describing model training",
      "No incident or rollback ownership",
      "Ignoring access control and data protection",
    ],
    relatedTopics: ["model-registry-cicd", "monitoring-drift"],
  },
  {
    id: "case-code-assistant-design",
    question: "Design an AI coding assistant that retrieves repository context, suggests edits, evaluates correctness, and controls latency and privacy risk.",
    category: "ML System Design",
    difficulty: "Advanced",
    answerOutline: [
      "Build context construction from repo search, open files, symbols, and user intent",
      "Use model routing, tool execution, tests, and edit validation",
      "Monitor acceptance, retention, latency, cost, security, and regression quality",
    ],
    expectedSignals: [
      "Treats context construction as the core system problem",
      "Includes test execution or validation loops",
      "Discusses privacy and source-code handling",
    ],
    commonMistakes: [
      "Only describing a chat UI over code",
      "No eval beyond user thumbs-up",
      "Ignoring latency and repository scale",
    ],
    relatedTopics: ["rag-architecture", "llm-eval-ops"],
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
  {
    title: "OpenAI Interview Guide",
    type: "Guide",
    href: "https://openai.com/interview-guide",
    description:
      "Official guidance on skills assessments, pair coding, deep technical discussions, communication, and interview expectations.",
    tags: ["Company Loop", "ML Coding", "Behavioral"],
  },
  {
    title: "OpenAI Evaluation Best Practices",
    type: "Docs",
    href: "https://platform.openai.com/docs/guides/evaluation-best-practices",
    description:
      "Practical guidance for creating evals, release gates, regression datasets, and model-quality checks.",
    tags: ["LLMOps", "Generative AI", "Evaluation"],
  },
  {
    title: "AWS Machine Learning Engineer Associate Exam Guide",
    type: "Guide",
    href: "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html",
    description:
      "Role-oriented coverage of data preparation, model development, deployment, monitoring, security, and governance.",
    tags: ["MLOps", "Production ML", "Cloud"],
  },
  {
    title: "Google Cloud Professional ML Engineer Guide",
    type: "Guide",
    href: "https://cloud.google.com/learn/certification/guides/machine-learning-engineer",
    description:
      "Coverage guide for production ML workflows, responsible AI, model deployment, monitoring, and operationalization.",
    tags: ["MLOps", "Production ML", "Responsible AI"],
  },
  {
    title: "OWASP Top 10 for LLM Applications Mapping",
    type: "Guide",
    href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/owasp-top-ten.html",
    description:
      "Security risks and mitigations for LLM applications, including prompt injection, data leakage, excessive agency, and vector weaknesses.",
    tags: ["LLMOps", "Security", "Generative AI"],
  },
  {
    title: "Machine Learning Interviews by alirezadir",
    type: "Community",
    href: "https://github.com/alirezadir/Machine-Learning-Interviews",
    description:
      "Community question bank covering ML theory, ML coding, and ML system design prompts.",
    tags: ["ML Coding", "ML System Design", "Question Bank"],
  },
  {
    title: "Reddit ML Coding Interview Discussion",
    type: "Community",
    href: "https://www.reddit.com/r/MachineLearning/comments/1958jbm/d_good_ml_eng_question_banks_for_interviews/",
    description:
      "Candidate discussion highlighting practical ML coding prompts such as NumPy, PyTorch, sampling, and model-debugging tasks.",
    tags: ["ML Coding", "Company Loop", "Community"],
  },
  {
    title: "Google ML System Design Mock Interview",
    type: "Community",
    href: "https://www.youtube.com/watch?v=uF1V2MqX2U0",
    description:
      "A mock interview useful for practicing recommendation-system structure, metrics, trade-offs, and follow-up handling.",
    tags: ["ML System Design", "Mock Interview"],
  },
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
