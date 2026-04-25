export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type PillarSlug =
  | "foundations"
  | "math-stats"
  | "traditional-ml"
  | "deep-learning"
  | "generative-ai"
  | "ml-system-design"
  | "mlops"
  | "behavioral-storytelling";

export type RoadmapSlug =
  | "90-day"
  | "60-day"
  | "30-day"
  | "data-scientist"
  | "ml-engineer"
  | "ai-engineer"
  | "senior-mle"
  | "ml-architect";

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

export interface RoadmapPhase {
  title: string;
  startDay?: number;
  endDay?: number;
  label?: string;
  focus: string;
  topics: string[];
}

export interface Roadmap {
  slug: RoadmapSlug;
  title: string;
  headline: string;
  durationLabel: string;
  description: string;
  audience: string[];
  targetRoles: string[];
  dailyCommitment: string;
  phases: RoadmapPhase[];
  focusMix: Array<{ label: string; weight: number }>;
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

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedOn: string;
  readTime: string;
  tags: string[];
}

export const siteName = "ML Interview Roadmap";
export const siteTagline =
  "A structured roadmap to prepare for ML, deep learning, GenAI, and ML system design interviews in 30, 60, or 90 days.";

export const navigationLinks = [
  { href: "/", label: "Roadmap", group: "Overview" },
  { href: "/blog", label: "Blog", group: "Reference" },
] as const;

export const navGroupOrder = ["Overview", "Reference"] as const;

export type NavGroup = (typeof navGroupOrder)[number];

export const pillars: Pillar[] = [
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
      "LLMOps",
    ],
    heroLabel: "Build reliable GenAI products",
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
    roadmapDay: 2,
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
    roadmapDay: 5,
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
    roadmapDay: 14,
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
    roadmapDay: 8,
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
    roadmapDay: 15,
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
    roadmapDay: 26,
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
    roadmapDay: 20,
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
    roadmapDay: 23,
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
    roadmapDay: 33,
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
    roadmapDay: 38,
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
    roadmapDay: 44,
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
    roadmapDay: 47,
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
    roadmapDay: 56,
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
    roadmapDay: 59,
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
    roadmapDay: 60,
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
    roadmapDay: 62,
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
    roadmapDay: 65,
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
    roadmapDay: 69,
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
    roadmapDay: 71,
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
    roadmapDay: 66,
    roleTags: ["ML Engineer", "Senior MLE"],
    companyTags: ["Datadog", "Shopify", "OpenAI"],
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
    roadmapDay: 88,
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

export const roadmaps: Roadmap[] = [
  {
    slug: "90-day",
    title: "90-Day AI/ML Interview Roadmap",
    headline: "The flagship path for candidates who want full-spectrum ML, DL, GenAI, and system design coverage.",
    durationLabel: "90 days",
    description:
      "Best for career transitions or candidates who want a structured ramp that includes fundamentals, hands-on coding, system design, and mock interview simulation.",
    audience: [
      "Beginner ML candidate",
      "Data Scientist moving to MLE",
      "Backend engineer moving to AI",
    ],
    targetRoles: ["ML Engineer", "AI Engineer", "Data Scientist"],
    dailyCommitment: "90 to 150 minutes per day",
    phases: [
      {
        title: "Foundations",
        startDay: 1,
        endDay: 15,
        focus: "Python, SQL, math refresh, and evaluation framing.",
        topics: [
          "Python for interviews",
          "SQL joins, CTEs, windows",
          "Probability and statistics",
          "Linear algebra and optimization",
          "Metrics and ML problem framing",
        ],
      },
      {
        title: "Traditional ML",
        startDay: 16,
        endDay: 30,
        focus: "Core ML algorithms, feature engineering, and case practice.",
        topics: [
          "Linear and logistic regression",
          "Trees, random forest, boosting",
          "Clustering and anomaly detection",
          "Feature engineering and leakage",
          "Case study review",
        ],
      },
      {
        title: "Deep Learning",
        startDay: 31,
        endDay: 45,
        focus: "Neural networks, optimization, CNNs, and transformer foundations.",
        topics: [
          "Backpropagation",
          "Regularization and normalization",
          "CNNs",
          "Sequence models and attention",
          "Transformers",
        ],
      },
      {
        title: "Generative AI",
        startDay: 46,
        endDay: 60,
        focus: "LLM basics, prompt design, embeddings, RAG, evaluation, and agents.",
        topics: [
          "LLM fundamentals",
          "Prompt engineering",
          "Embeddings and vector search",
          "RAG architecture",
          "Evaluation, safety, cost",
        ],
      },
      {
        title: "ML System Design and MLOps",
        startDay: 61,
        endDay: 75,
        focus: "Architecture, feature stores, serving, monitoring, and production trade-offs.",
        topics: [
          "Interview framework",
          "Feature store and training pipeline",
          "Online serving and caching",
          "Monitoring and retraining",
          "Recommendation, fraud, search, and RAG cases",
        ],
      },
      {
        title: "Simulation and Storytelling",
        startDay: 76,
        endDay: 90,
        focus: "Mock interviews, weak-area revision, project walkthroughs, and behavioral practice.",
        topics: [
          "ML theory mocks",
          "System design mocks",
          "GenAI and RAG mocks",
          "Resume and project storytelling",
          "Behavioral practice",
        ],
      },
    ],
    focusMix: [
      { label: "Foundations", weight: 18 },
      { label: "Traditional ML", weight: 18 },
      { label: "Deep Learning", weight: 14 },
      { label: "Generative AI", weight: 17 },
      { label: "ML System Design", weight: 18 },
      { label: "MLOps", weight: 10 },
      { label: "Behavioral", weight: 5 },
    ],
  },
  {
    slug: "60-day",
    title: "60-Day AI/ML Interview Roadmap",
    headline: "A compressed plan for candidates who already know the basics and need sharp prioritization.",
    durationLabel: "60 days",
    description:
      "Best for candidates with hands-on ML exposure who need to rebalance toward weak areas, especially deep learning, GenAI, and system design.",
    audience: ["Current ML practitioners", "Data scientists", "Software engineers pivoting into AI"],
    targetRoles: ["ML Engineer", "AI Engineer"],
    dailyCommitment: "2 to 3 hours per day",
    phases: [
      {
        title: "Refresh",
        startDay: 1,
        endDay: 10,
        focus: "ML fundamentals, evaluation, and statistics.",
        topics: ["Regression and trees", "Metrics", "Bias-variance", "Experimentation"],
      },
      {
        title: "Coding and SQL",
        startDay: 11,
        endDay: 20,
        focus: "Sharpen implementation and analytical query speed.",
        topics: ["Python patterns", "SQL windows", "ML from scratch", "Debugging trade-offs"],
      },
      {
        title: "DL and GenAI",
        startDay: 21,
        endDay: 35,
        focus: "Deep learning, transformers, LLMs, and RAG.",
        topics: ["Backpropagation", "Transformers", "Embeddings", "RAG and evals"],
      },
      {
        title: "System Design and MLOps",
        startDay: 36,
        endDay: 50,
        focus: "Production pipelines, serving, monitoring, and case studies.",
        topics: ["Framework", "Feature stores", "Serving", "Monitoring", "Case walkthroughs"],
      },
      {
        title: "Final Loop Prep",
        startDay: 51,
        endDay: 60,
        focus: "Mocks, revision, storytelling, and targeted weak-area repair.",
        topics: ["Mocks", "Resume", "Behavioral", "Target-company drills"],
      },
    ],
    focusMix: [
      { label: "Traditional ML", weight: 16 },
      { label: "Coding + SQL", weight: 18 },
      { label: "Deep Learning", weight: 14 },
      { label: "Generative AI", weight: 18 },
      { label: "ML System Design", weight: 20 },
      { label: "MLOps", weight: 9 },
      { label: "Behavioral", weight: 5 },
    ],
  },
  {
    slug: "30-day",
    title: "30-Day Crash Plan",
    headline: "An urgent prep loop for candidates with interviews already on the calendar.",
    durationLabel: "30 days",
    description:
      "Use this when the interview window is near. It prioritizes the concepts most likely to affect interview performance quickly.",
    audience: ["Candidates with urgent interview dates", "Practitioners doing final revision"],
    targetRoles: ["ML Engineer", "AI Engineer", "Data Scientist"],
    dailyCommitment: "2 to 4 focused hours per day",
    phases: [
      {
        title: "Week 1",
        label: "Days 1-7",
        focus: "ML fundamentals, metrics, SQL, and Python review.",
        topics: ["Metrics", "SQL", "Regression", "Trees", "Feature leakage"],
      },
      {
        title: "Week 2",
        label: "Days 8-14",
        focus: "Deep learning, transformers, GenAI, and RAG.",
        topics: ["Backprop", "Transformers", "Prompting", "RAG", "Evaluation"],
      },
      {
        title: "Week 3",
        label: "Days 15-21",
        focus: "ML system design case studies and production trade-offs.",
        topics: ["Recommendation", "Fraud", "Search ranking", "Serving", "Monitoring"],
      },
      {
        title: "Week 4",
        label: "Days 22-30",
        focus: "Mock interviews, project storytelling, and weak-area repair.",
        topics: ["Theory mocks", "System design mocks", "Resume", "Behavioral"],
      },
    ],
    focusMix: [
      { label: "Coding + SQL", weight: 18 },
      { label: "Traditional ML", weight: 20 },
      { label: "Deep Learning", weight: 12 },
      { label: "Generative AI", weight: 18 },
      { label: "ML System Design", weight: 20 },
      { label: "Behavioral", weight: 12 },
    ],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist to MLE Roadmap",
    headline: "Rebalance from modeling depth toward systems, deployment, and production ownership.",
    durationLabel: "Role-based track",
    description:
      "Ideal for candidates who already know experimentation and supervised learning but need stronger ML systems, serving, and platform instincts.",
    audience: ["Experienced data scientists", "Analytics practitioners"],
    targetRoles: ["ML Engineer"],
    dailyCommitment: "90 to 120 minutes per day",
    phases: [
      {
        title: "Modeling Refresh",
        label: "Block 1",
        focus: "Revisit metrics, trees, leakage, and business framing.",
        topics: ["Evaluation", "Feature engineering", "Experimentation"],
      },
      {
        title: "Production Transition",
        label: "Block 2",
        focus: "Move into feature stores, training pipelines, deployment, and monitoring.",
        topics: ["Feature stores", "Registry", "Serving", "Monitoring"],
      },
      {
        title: "Interview Simulation",
        label: "Block 3",
        focus: "System design cases and project storytelling.",
        topics: ["Recommendation", "Fraud", "Project walkthroughs"],
      },
    ],
    focusMix: [
      { label: "Traditional ML", weight: 22 },
      { label: "Math & Stats", weight: 12 },
      { label: "Coding + SQL", weight: 12 },
      { label: "ML System Design", weight: 24 },
      { label: "MLOps", weight: 20 },
      { label: "Behavioral", weight: 10 },
    ],
  },
  {
    slug: "ml-engineer",
    title: "ML Engineer Roadmap",
    headline: "Balance coding, production ML, and architecture depth across the full stack of interview loops.",
    durationLabel: "Role-based track",
    description:
      "Center the plan on coding, training and serving pipelines, feature consistency, evaluation, and end-to-end case studies.",
    audience: ["Generalist MLE candidates", "Backend engineers with applied ML exposure"],
    targetRoles: ["ML Engineer"],
    dailyCommitment: "2 hours per day",
    phases: [
      {
        title: "Core Foundations",
        label: "Block 1",
        focus: "Python, SQL, ML baselines, and metrics.",
        topics: ["Coding", "SQL", "Regression", "Metrics"],
      },
      {
        title: "Production Systems",
        label: "Block 2",
        focus: "Feature stores, deployment, CI/CD, and observability.",
        topics: ["Feature stores", "Deployment", "CI/CD", "Monitoring"],
      },
      {
        title: "Design Depth",
        label: "Block 3",
        focus: "System design cases and trade-offs at scale.",
        topics: ["Recommendation", "Ranking", "Serving paths", "Retraining"],
      },
    ],
    focusMix: [
      { label: "Coding + SQL", weight: 20 },
      { label: "Traditional ML", weight: 18 },
      { label: "Deep Learning", weight: 10 },
      { label: "ML System Design", weight: 25 },
      { label: "MLOps", weight: 17 },
      { label: "Behavioral", weight: 10 },
    ],
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer Roadmap",
    headline: "Shift system thinking toward LLM apps, retrieval, evaluation, agents, and cost-aware deployment.",
    durationLabel: "Role-based track",
    description:
      "Best for engineers targeting GenAI-heavy roles where LLM fundamentals, RAG architecture, and operational evaluation matter most.",
    audience: ["Backend engineers", "Platform engineers", "Applied AI candidates"],
    targetRoles: ["AI Engineer"],
    dailyCommitment: "2 hours per day",
    phases: [
      {
        title: "LLM Foundations",
        label: "Block 1",
        focus: "Transformers, prompting, embeddings, and context management.",
        topics: ["Transformers", "Prompting", "Embeddings"],
      },
      {
        title: "Reliable GenAI Systems",
        label: "Block 2",
        focus: "RAG, evaluation, guardrails, routing, and LLMOps.",
        topics: ["RAG", "Faithfulness", "Latency", "Cost", "Prompt versioning"],
      },
      {
        title: "Applied Architecture",
        label: "Block 3",
        focus: "Design AI support agents, document pipelines, and evaluation platforms.",
        topics: ["Case studies", "Tool use", "Fallbacks", "Monitoring"],
      },
    ],
    focusMix: [
      { label: "Generative AI", weight: 30 },
      { label: "Deep Learning", weight: 15 },
      { label: "Coding + SQL", weight: 10 },
      { label: "ML System Design", weight: 20 },
      { label: "MLOps / LLMOps", weight: 15 },
      { label: "Behavioral", weight: 10 },
    ],
  },
  {
    slug: "ml-architect",
    title: "ML Architect Roadmap",
    headline: "Lead with systems thinking: platform design, reliability, cost, governance, and cross-team influence.",
    durationLabel: "Architect track",
    description:
      "For candidates interviewing for ML Architect, Principal ML Engineer, or Staff-level roles where the loop tests architecture judgment, trade-off reasoning, platform thinking, and stakeholder alignment.",
    audience: ["ML Architects", "Principal/Staff MLEs", "Platform leads moving into ML"],
    targetRoles: ["ML Architect", "Principal ML Engineer", "Staff AI Engineer"],
    dailyCommitment: "60 to 120 minutes per day",
    phases: [
      {
        title: "Platform Frameworks",
        label: "Block 1",
        focus: "Master the design interview scaffolding — requirements, metrics, data, serving, monitoring — then apply it under ambiguity.",
        topics: ["Design framework", "Requirement clarification", "Success metrics", "Capacity planning"],
      },
      {
        title: "Trade-off Fluency",
        label: "Block 2",
        focus: "Rehearse the architect-level trade-offs: build vs buy, batch vs streaming, fine-tune vs RAG, centralize vs federate.",
        topics: ["Latency/cost/quality", "Freshness vs reliability", "Centralization", "Multi-tenant isolation"],
      },
      {
        title: "Production & Governance",
        label: "Block 3",
        focus: "Feature stores, model registry, CI/CD, observability, incident response, and compliance boundaries.",
        topics: ["Feature platforms", "Serving paths", "Monitoring", "Privacy", "Governance"],
      },
      {
        title: "Influence & Communication",
        label: "Block 4",
        focus: "Architecture review decks, RFC narratives, cross-org trade-off storytelling, and leadership behavioral depth.",
        topics: ["RFC patterns", "Postmortems", "Stakeholder alignment", "Roadmap storytelling"],
      },
    ],
    focusMix: [
      { label: "ML System Design", weight: 32 },
      { label: "MLOps / Reliability", weight: 20 },
      { label: "Generative AI", weight: 14 },
      { label: "Traditional ML", weight: 8 },
      { label: "Coding + SQL", weight: 6 },
      { label: "Behavioral / Leadership", weight: 20 },
    ],
  },
  {
    slug: "senior-mle",
    title: "Senior MLE Roadmap",
    headline: "Prioritize architecture, trade-offs, reliability, leadership, and case-study fluency.",
    durationLabel: "Role-based track",
    description:
      "Built for senior candidates whose loops will test ownership, scale, strategy, platform choices, and communication under ambiguity.",
    audience: ["Senior MLEs", "Staff-level AI candidates"],
    targetRoles: ["Senior ML Engineer", "Staff AI Engineer"],
    dailyCommitment: "90 to 120 minutes per day",
    phases: [
      {
        title: "Architecture Review",
        label: "Block 1",
        focus: "Refresh design frameworks, metrics, and infrastructure patterns.",
        topics: ["Framework", "Serving", "Monitoring", "Cost"],
      },
      {
        title: "High-Impact Cases",
        label: "Block 2",
        focus: "Practice recommendation, ranking, fraud, RAG, and evaluation system designs.",
        topics: ["Recommendation", "Search", "Fraud", "RAG", "Evaluation"],
      },
      {
        title: "Leadership Signals",
        label: "Block 3",
        focus: "Narratives on ownership, prioritization, cross-functional leadership, and postmortems.",
        topics: ["Leadership stories", "Project deep dives", "Trade-off decisions"],
      },
    ],
    focusMix: [
      { label: "ML System Design", weight: 30 },
      { label: "MLOps / Reliability", weight: 18 },
      { label: "Generative AI", weight: 15 },
      { label: "Traditional ML", weight: 10 },
      { label: "Coding + SQL", weight: 10 },
      { label: "Behavioral / Leadership", weight: 17 },
    ],
  },
];

export const readinessWeights = [
  { label: "Traditional ML", weight: 15 },
  { label: "Math & Statistics", weight: 10 },
  { label: "Coding + SQL", weight: 15 },
  { label: "Deep Learning", weight: 10 },
  { label: "Generative AI", weight: 15 },
  { label: "ML System Design", weight: 20 },
  { label: "MLOps", weight: 10 },
  { label: "Behavioral", weight: 5 },
];

export const readinessPillarMap: Record<string, PillarSlug> = {
  "Traditional ML": "traditional-ml",
  "Math & Statistics": "math-stats",
  "Coding + SQL": "foundations",
  "Deep Learning": "deep-learning",
  "Generative AI": "generative-ai",
  "ML System Design": "ml-system-design",
  MLOps: "mlops",
  Behavioral: "behavioral-storytelling",
};

export const featureCards = [
  {
    title: "Interactive roadmap graph",
    description:
      "Navigate the prep surface through linked pillars, roadmap phases, and topic detail pages.",
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

export const blogPosts: BlogPost[] = [
  {
    slug: "90-day-machine-learning-interview-roadmap",
    title: "90-Day Machine Learning Interview Roadmap",
    description:
      "A week-by-week study path that covers coding, ML, GenAI, system design, and behavioral prep.",
    publishedOn: "April 2026",
    readTime: "9 min read",
    tags: ["Roadmap", "ML Interview"],
  },
  {
    slug: "how-to-prepare-for-ml-system-design-interviews",
    title: "How to Prepare for ML System Design Interviews",
    description:
      "A framework for turning business problems into training, serving, and monitoring architectures.",
    publishedOn: "April 2026",
    readTime: "7 min read",
    tags: ["System Design", "MLE"],
  },
  {
    slug: "rag-interview-questions-for-ai-engineers",
    title: "Top RAG Interview Questions for AI Engineers",
    description:
      "The questions most likely to appear in GenAI interview loops, with the signals interviewers look for.",
    publishedOn: "April 2026",
    readTime: "8 min read",
    tags: ["RAG", "AI Engineer"],
  },
  {
    slug: "feature-store-interview-questions",
    title: "Feature Store Interview Questions for ML Engineers",
    description:
      "Why feature stores exist, when to skip them, and what design trade-offs matter in interviews.",
    publishedOn: "April 2026",
    readTime: "6 min read",
    tags: ["Feature Store", "MLOps"],
  },
  {
    slug: "llm-evaluation-in-interviews",
    title: "How to Talk About LLM Evaluation in Interviews",
    description:
      "Separate retrieval quality, answer quality, groundedness, and operational metrics the right way.",
    publishedOn: "April 2026",
    readTime: "8 min read",
    tags: ["LLMOps", "Evaluation"],
  },
  {
    slug: "ai-engineer-interview-preparation-roadmap-2026",
    title: "AI Engineer Interview Preparation Roadmap",
    description:
      "A role-based plan for engineers targeting prompt engineering, RAG, agents, and LLMOps loops.",
    publishedOn: "April 2026",
    readTime: "10 min read",
    tags: ["AI Engineer", "Roadmap"],
  },
];

export const homeHighlights = [
  "8 content pillars from coding foundations to LLMOps",
  "Roadmaps for 30, 60, and 90-day preparation windows",
  "Role-based paths for Data Scientist, ML Engineer, AI Engineer, and Senior MLE",
  "Question bank, case studies, readiness scoring, and resource curation",
];

export function getPillarBySlug(slug: PillarSlug) {
  return pillars.find((pillar) => pillar.slug === slug);
}

export function getRoadmapBySlug(slug: RoadmapSlug) {
  return roadmaps.find((roadmap) => roadmap.slug === slug);
}

export function getTopicById(topicId: string) {
  return topics.find((topic) => topic.id === topicId);
}

export function getTopicsByPillar(pillar: PillarSlug) {
  return topics.filter((topic) => topic.pillar === pillar);
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
  { label: "Content pillars", value: "8" },
  { label: "Topic cards", value: "40+" },
  { label: "Case studies", value: "8" },
  { label: "Practice questions", value: "12+" },
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

/**
 * NeetCode 150 catalog by category, in roadmap order.
 * Each entry is a LeetCode problem slug — the title is derived from the slug
 * and the URL is `https://leetcode.com/problems/${slug}/`.
 *
 * If you complete the full 150, work the additional NeetCode 250 problems
 * directly from https://neetcode.io/roadmap.
 */
export const NEETCODE_150: Record<string, string[]> = {
  "Arrays & Hashing": [
    "contains-duplicate",
    "valid-anagram",
    "two-sum",
    "group-anagrams",
    "top-k-frequent-elements",
    "encode-and-decode-strings",
    "product-of-array-except-self",
    "valid-sudoku",
    "longest-consecutive-sequence",
  ],
  "Two Pointers": [
    "valid-palindrome",
    "two-sum-ii-input-array-is-sorted",
    "3sum",
    "container-with-most-water",
    "trapping-rain-water",
  ],
  "Sliding Window": [
    "best-time-to-buy-and-sell-stock",
    "longest-substring-without-repeating-characters",
    "longest-repeating-character-replacement",
    "permutation-in-string",
    "minimum-window-substring",
    "sliding-window-maximum",
  ],
  "Stack": [
    "valid-parentheses",
    "min-stack",
    "evaluate-reverse-polish-notation",
    "generate-parentheses",
    "daily-temperatures",
    "car-fleet",
    "largest-rectangle-in-histogram",
  ],
  "Binary Search": [
    "binary-search",
    "search-a-2d-matrix",
    "koko-eating-bananas",
    "find-minimum-in-rotated-sorted-array",
    "search-in-rotated-sorted-array",
    "time-based-key-value-store",
    "median-of-two-sorted-arrays",
  ],
  "Linked List": [
    "reverse-linked-list",
    "merge-two-sorted-lists",
    "reorder-list",
    "remove-nth-node-from-end-of-list",
    "copy-list-with-random-pointer",
    "add-two-numbers",
    "linked-list-cycle",
    "find-the-duplicate-number",
    "lru-cache",
    "merge-k-sorted-lists",
    "reverse-nodes-in-k-group",
  ],
  "Trees": [
    "invert-binary-tree",
    "maximum-depth-of-binary-tree",
    "diameter-of-binary-tree",
    "balanced-binary-tree",
    "same-tree",
    "subtree-of-another-tree",
    "lowest-common-ancestor-of-a-binary-search-tree",
    "binary-tree-level-order-traversal",
    "binary-tree-right-side-view",
    "count-good-nodes-in-binary-tree",
    "validate-binary-search-tree",
    "kth-smallest-element-in-a-bst",
    "construct-binary-tree-from-preorder-and-inorder-traversal",
    "binary-tree-maximum-path-sum",
    "serialize-and-deserialize-binary-tree",
  ],
  "Tries": [
    "implement-trie-prefix-tree",
    "design-add-and-search-words-data-structure",
    "word-search-ii",
  ],
  "Heap / Priority Queue": [
    "kth-largest-element-in-a-stream",
    "last-stone-weight",
    "k-closest-points-to-origin",
    "kth-largest-element-in-an-array",
    "task-scheduler",
    "design-twitter",
    "find-median-from-data-stream",
  ],
  "Backtracking": [
    "subsets",
    "combination-sum",
    "permutations",
    "subsets-ii",
    "combination-sum-ii",
    "word-search",
    "palindrome-partitioning",
    "letter-combinations-of-a-phone-number",
    "n-queens",
  ],
  "Graphs": [
    "number-of-islands",
    "clone-graph",
    "max-area-of-island",
    "pacific-atlantic-water-flow",
    "surrounded-regions",
    "rotting-oranges",
    "walls-and-gates",
    "course-schedule",
    "course-schedule-ii",
    "redundant-connection",
    "number-of-connected-components-in-an-undirected-graph",
    "graph-valid-tree",
    "word-ladder",
  ],
  "Advanced Graphs": [
    "reconstruct-itinerary",
    "min-cost-to-connect-all-points",
    "network-delay-time",
    "swim-in-rising-water",
    "alien-dictionary",
    "cheapest-flights-within-k-stops",
  ],
  "1-D Dynamic Programming": [
    "climbing-stairs",
    "min-cost-climbing-stairs",
    "house-robber",
    "house-robber-ii",
    "longest-palindromic-substring",
    "palindromic-substrings",
    "decode-ways",
    "coin-change",
    "maximum-product-subarray",
    "word-break",
    "longest-increasing-subsequence",
    "partition-equal-subset-sum",
  ],
  "2-D Dynamic Programming": [
    "unique-paths",
    "longest-common-subsequence",
    "best-time-to-buy-and-sell-stock-with-cooldown",
    "coin-change-ii",
    "target-sum",
    "interleaving-string",
    "longest-increasing-path-in-a-matrix",
    "distinct-subsequences",
    "edit-distance",
    "burst-balloons",
    "regular-expression-matching",
  ],
  "Greedy": [
    "maximum-subarray",
    "jump-game",
    "jump-game-ii",
    "gas-station",
    "hand-of-straights",
    "merge-triplets-to-form-target-triplet",
    "partition-labels",
    "valid-parenthesis-string",
  ],
  "Intervals": [
    "insert-interval",
    "merge-intervals",
    "non-overlapping-intervals",
    "meeting-rooms",
    "meeting-rooms-ii",
    "minimum-interval-to-include-each-query",
  ],
  "Math & Geometry": [
    "rotate-image",
    "spiral-matrix",
    "set-matrix-zeroes",
    "happy-number",
    "plus-one",
    "powx-n",
    "multiply-strings",
    "detect-squares",
  ],
  "Bit Manipulation": [
    "single-number",
    "number-of-1-bits",
    "counting-bits",
    "reverse-bits",
    "missing-number",
    "sum-of-two-integers",
    "reverse-integer",
  ],
};

/** Convert a problem slug into a display label (e.g. "two-sum" → "Two Sum"). */
function titleizeSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => {
      if (/^\d/.test(part)) return part;
      if (part.length <= 2) return part.toUpperCase(); // ii, iii, iv
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

/** Pull `count` problems from `category` starting at `start` (0-indexed). */
export function nc(category: string, start: number, count: number): DayItem[] {
  const list = NEETCODE_150[category];
  if (!list) return [];
  return list.slice(start, start + count).map((slug) => ({
    id: `lc-${slug}`,
    label: titleizeSlug(slug),
    href: `https://leetcode.com/problems/${slug}/`,
    meta: category,
  }));
}

// ────────────────────────────────────────────────────────────────────────────
// 120-day study plan
// Each day is intentionally MIXED: a DSA track, a concept track, and reading.
// Inspired by Yuan Meng's "Prepare in a Hurry" guide
// (https://www.yuan-meng.com/posts/mle_interviews_2.0/), expanded so the work
// is realistic — DSA, ML fundamentals, design depth, MLOps, and behavioral
// don't fit in 1 week.
// ────────────────────────────────────────────────────────────────────────────

const REF_NEETCODE_VIDEOS: DayReference = { label: "NeetCode YouTube playlists by category", href: "https://www.youtube.com/c/NeetCode/playlists", source: "NeetCode" };
const REF_LC_PATTERNS: DayReference = { label: "14 patterns to ace any coding interview", href: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed", source: "HackerNoon" };
const REF_UDL_BOOK: DayReference = { label: "Understanding Deep Learning (Simon Prince) — free PDF", href: "https://udlbook.github.io/udlbook/", source: "UDL Book" };
const REF_CHIP_HUYEN_DESIGN: DayReference = { label: "ML Systems Design — interview book", href: "https://huyenchip.com/machine-learning-systems-design/toc.html", source: "Chip Huyen" };
const REF_YUAN_MENG_HURRY: DayReference = { label: "Prepare in a Hurry (MLE 2.0)", href: "https://www.yuan-meng.com/posts/mle_interviews_2.0/", source: "Yuan Meng" };
const REF_GOOGLE_ML_CRASH: DayReference = { label: "Google Machine Learning Crash Course", href: "https://developers.google.com/machine-learning/crash-course", source: "Google" };
const REF_FSDL: DayReference = { label: "Full Stack Deep Learning", href: "https://fullstackdeeplearning.com/", source: "Full Stack Deep Learning" };
const REF_HF_LLM: DayReference = { label: "Hugging Face LLM course", href: "https://huggingface.co/learn/llm-course", source: "Hugging Face" };
const REF_OAI_DOCS: DayReference = { label: "OpenAI platform docs", href: "https://platform.openai.com/docs", source: "OpenAI" };
const REF_LANGCHAIN_RAG: DayReference = { label: "RAG concepts", href: "https://python.langchain.com/docs/concepts/rag/", source: "LangChain" };
// Canonical learning + interview-prep resources requested by the user.
const REF_ANDREW_NG_ML: DayReference = { label: "Andrew Ng — Machine Learning Specialization (Coursera)", href: "https://www.coursera.org/specializations/machine-learning-introduction", source: "Coursera" };
const REF_STATQUEST: DayReference = { label: "StatQuest — Statistics & ML playlists", href: "https://www.youtube.com/@statquest/playlists", source: "YouTube" };
const REF_3B1B_LINALG: DayReference = { label: "3Blue1Brown — Essence of Linear Algebra", href: "https://www.3blue1brown.com/topics/linear-algebra", source: "3Blue1Brown" };
const REF_3B1B_CALCULUS: DayReference = { label: "3Blue1Brown — Essence of Calculus", href: "https://www.3blue1brown.com/topics/calculus", source: "3Blue1Brown" };
const REF_GILBERT_STRANG: DayReference = { label: "Gilbert Strang — Linear Algebra (MIT 18.06)", href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "MIT OCW" };
const REF_DLAI_SPEC: DayReference = { label: "DeepLearning.AI Deep Learning Specialization", href: "https://www.deeplearning.ai/courses/deep-learning-specialization/", source: "DeepLearning.AI" };
const REF_FAST_AI: DayReference = { label: "fast.ai — Practical Deep Learning for Coders", href: "https://course.fast.ai/", source: "fast.ai" };
const REF_DLAI_GENAI: DayReference = { label: "DeepLearning.AI — short courses on GenAI / LLMs", href: "https://www.deeplearning.ai/short-courses/", source: "DeepLearning.AI" };
const REF_HUYEN_INT_BOOK: DayReference = { label: "Chip Huyen — ML Interviews Book (free)", href: "https://huyenchip.com/ml-interviews-book/", source: "Chip Huyen" };
const REF_KHANGICH_REPO: DayReference = { label: "Khangich — Machine Learning Interview repo", href: "https://github.com/khangich/machine-learning-interview", source: "GitHub" };
const REF_ALIREZADIR_REPO: DayReference = { label: "alirezadir — Machine Learning Interviews", href: "https://github.com/alirezadir/Machine-Learning-Interviews", source: "GitHub" };
const REF_PATRICK_HALINA: DayReference = { label: "Patrick Halina — ML Systems Design Interview Guide", href: "http://patrickhalina.com/posts/ml-systems-design-interview-guide/", source: "Patrick Halina" };
const REF_D2L: DayReference = { label: "Dive into Deep Learning (d2l.ai) — interactive book", href: "https://d2l.ai/", source: "d2l.ai" };
const REF_ILLUSTRATED_TRANSFORMER: DayReference = { label: "Illustrated Transformer (Jay Alammar)", href: "https://jalammar.github.io/illustrated-transformer/", source: "Jay Alammar" };
const REF_PAPERS_WITH_CODE: DayReference = { label: "Papers with Code — SOTA leaderboards", href: "https://paperswithcode.com/sota", source: "Papers with Code" };
const REF_GOOGLE_AI_BLOG: DayReference = { label: "Google AI Blog", href: "https://blog.google/technology/ai/", source: "Google" };
const REF_DATASCIENCE_JAY: DayReference = { label: "DataScienceJay — interview walkthroughs", href: "https://www.youtube.com/c/DataScienceJay/videos", source: "YouTube" };
const REF_HF_SPACES: DayReference = { label: "Hugging Face Spaces — deploy demos for free", href: "https://huggingface.co/spaces", source: "Hugging Face" };
const REF_STREAMLIT: DayReference = { label: "Streamlit — quick ML-app deployment", href: "https://docs.streamlit.io/", source: "Streamlit" };

export const dailyPlan: DayPlan[] = [
  // ───── PHASE 1: Coding & ML basics in parallel (Days 1-50) ─────
  // DSA via NeetCode 150 (≈ 5/day → ~30 days) + ML fundamentals woven in.

  // ───── PHASE 1A: Statistics + Arrays/Two Pointers/Sliding Window (Days 1-7) ─────
  {
    day: 1, title: "Arrays & Hashing + Probability + Linear algebra refresh", pillar: "math-stats",
    focus: "Open the loop: easiest NeetCode pattern, probability fundamentals, vectors / matrices warm-up.",
    tracks: [
      { label: "DSA · NeetCode Arrays & Hashing", items: nc("Arrays & Hashing", 0, 4) },
      { label: "Math · Probability foundations", items: [
        { id: "stats-bayes", label: "Bayes intuition: detection / diagnosis / ranking examples", href: "https://seeing-theory.brown.edu/bayesian-inference/index.html", meta: "Interactive" },
        { id: "stats-cond-prob", label: "Conditional probability traps in interviews", href: "https://en.wikipedia.org/wiki/Conditional_probability#Common_fallacies", meta: "Read" },
      ]},
      { label: "Math · Linear algebra warm-up", items: [
        { id: "linalg-vectors", label: "Vectors, matrices, dot product, transpose", href: "https://www.3blue1brown.com/lessons/vectors", meta: "Watch" },
        { id: "linalg-norms", label: "Norms + cosine similarity (used everywhere in ML)", href: "https://machinelearningmastery.com/vector-norms-machine-learning/", meta: "Read" },
      ]},
      { label: "Setup", items: [
        { id: "setup-leetcode", label: "Create LeetCode account; pick 1-2 target companies", href: "https://leetcode.com/", meta: "5 min" },
        { id: "setup-neetcode", label: "Bookmark NeetCode roadmap", href: "https://neetcode.io/roadmap", meta: "1 min" },
        { id: "setup-andrew-ng", label: "Enroll in Andrew Ng's ML Specialization (skim Course 1 syllabus)", href: "https://www.coursera.org/specializations/machine-learning-introduction", meta: "Setup" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through Bayes on a screening test (1% prevalence, 95% sensitivity, 90% specificity).",
      "Why can a model with strong recall still have weak positive predictive value?",
      "What is the dot product geometrically — and how does that relate to cosine similarity?",
    ],
    references: [REF_NEETCODE_VIDEOS, REF_LC_PATTERNS, REF_YUAN_MENG_HURRY, REF_ANDREW_NG_ML, REF_3B1B_LINALG, REF_STATQUEST],
    topicId: "probability-toolkit",
  },
  {
    day: 2, title: "Arrays & Hashing (cont.) + Distributions + Eigenvalues / SVD / PCA", pillar: "math-stats",
    focus: "Finish arrays + connect distributions to assumptions + the linear-algebra trio interviewers test.",
    tracks: [
      { label: "DSA · NeetCode Arrays & Hashing", items: nc("Arrays & Hashing", 4, 5) },
      { label: "Math · Distributions", items: [
        { id: "stats-distributions", label: "Binomial / Poisson / Gaussian — when each fits", href: "https://www.probabilitycourse.com/chapter3/3_2_3_pmf_examples.php", meta: "Read" },
        { id: "stats-heavy-tail", label: "Heavy tails and how they bite (income, latency)", href: "https://en.wikipedia.org/wiki/Heavy-tailed_distribution", meta: "Read" },
      ]},
      { label: "Math · Eigenvalues, SVD, PCA", items: [
        { id: "linalg-eigen", label: "Eigenvectors / eigenvalues — the visual intuition", href: "https://www.3blue1brown.com/lessons/eigenvectors", meta: "Watch" },
        { id: "linalg-svd", label: "SVD walkthrough (the algorithm behind embeddings + PCA)", href: "https://en.wikipedia.org/wiki/Singular_value_decomposition", meta: "Read" },
        { id: "linalg-pca", label: "PCA as compression + denoising + visualization", href: "https://towardsdatascience.com/a-one-stop-shop-for-principal-component-analysis-5582fb7e0a9c/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Explain how PCA works — what does it actually compute?",
      "How are word embeddings related to SVD?",
      "When is the Poisson approximation to the Binomial a useful interview move?",
    ],
    references: [REF_GOOGLE_ML_CRASH, REF_3B1B_LINALG, REF_GILBERT_STRANG],
  },
  {
    day: 3, title: "Two Pointers + Bayesian thinking", pillar: "math-stats",
    focus: "Two-pointer template + Bayes for screening / ranking / uncertainty.",
    tracks: [
      { label: "DSA · Two Pointers", items: nc("Two Pointers", 0, 3) },
      { label: "Stats · Bayesian thinking", items: [
        { id: "stats-prior-likelihood", label: "Priors, likelihoods, posteriors in plain language", href: "https://seeing-theory.brown.edu/bayesian-inference/index.html", meta: "Interactive" },
        { id: "stats-base-rate", label: "Base-rate fallacy — the most common interview trap", href: "https://en.wikipedia.org/wiki/Base_rate_fallacy", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through the cancer-test base-rate problem.",
      "When does choosing a different prior change a hiring or screening decision?",
      "Posterior intervals vs. confidence intervals — what's the difference?",
    ],
    references: [],
  },
  {
    day: 4, title: "Two Pointers (cont.) + Hypothesis testing", pillar: "math-stats",
    focus: "Finish two-pointers + frame experiments rigorously.",
    tracks: [
      { label: "DSA · Two Pointers", items: nc("Two Pointers", 3, 2) },
      { label: "Stats · Hypothesis testing", items: [
        { id: "stats-pvalue", label: "Null, alternative, p-value, power — fast refresher", href: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html", meta: "Read" },
        { id: "stats-multitest", label: "Multiple-testing correction (Bonferroni / FDR)", href: "https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "What goes wrong if you peek at A/B results before the planned end?",
      "Define statistical power in one sentence.",
      "When is FDR correction more appropriate than Bonferroni?",
    ],
    references: [],
  },
  {
    day: 5, title: "Sliding Window + Confidence intervals", pillar: "math-stats",
    focus: "Sliding-window template + frequentist CI without sliding into Bayesian language.",
    tracks: [
      { label: "DSA · Sliding Window", items: nc("Sliding Window", 0, 3) },
      { label: "Stats · CIs", items: [
        { id: "stats-ci-frequentist", label: "Frequentist interpretation done right", href: "https://en.wikipedia.org/wiki/Confidence_interval#Misunderstandings", meta: "Read" },
        { id: "stats-bootstrap", label: "Bootstrap CIs — when they save you", href: "https://www.statsmodels.org/stable/generated/statsmodels.stats.weightstats.DescrStatsW.html", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "What's wrong with saying 'there's a 95% chance the true mean is in this interval'?",
      "Why does the bootstrap work when classical CIs don't?",
      "How does sample size affect the width of a CI quadratically?",
    ],
    references: [],
    questionIds: ["confidence-interval"],
  },
  {
    day: 6, title: "Sliding Window (cont.) + A/B testing math", pillar: "math-stats",
    focus: "Finish sliding-window + sample sizing + multiple testing.",
    tracks: [
      { label: "DSA · Sliding Window", items: nc("Sliding Window", 3, 3) },
      { label: "Stats · Experimentation", items: [
        { id: "stats-ab-power", label: "Power analysis & sample size calculator", href: "https://www.evanmiller.org/ab-testing/sample-size.html", meta: "Tool" },
        { id: "stats-ab-pitfalls", label: "Common A/B test pitfalls (peeking, novelty, network effects)", href: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "How do you size an A/B test for a 1% effect on a 5% baseline conversion?",
      "What's the novelty effect, and how do you mitigate it?",
      "When does a sequential test beat a fixed-horizon test?",
    ],
    references: [],
  },
  {
    day: 7, title: "Catch-up + Optimization basics", pillar: "math-stats",
    focus: "Re-attempt the 3 hardest problems of the week + optimization vocabulary.",
    tracks: [
      { label: "DSA review", items: [
        { id: "review-week-1-1", label: "Re-solve your slowest problem from days 1-6, cold", meta: "30 min" },
        { id: "review-week-1-2", label: "Re-solve the second-slowest", meta: "30 min" },
        { id: "review-week-1-3", label: "Re-solve a third (any pattern)", meta: "30 min" },
      ]},
      { label: "Math · Optimization + calculus", items: [
        { id: "stats-gd-intuition", label: "Gradient descent intuition (convex vs non-convex)", href: "https://www.deeplearningbook.org/contents/optimization.html", meta: "Read" },
        { id: "stats-convexity", label: "Why convexity matters for guarantees", href: "https://web.stanford.edu/~boyd/cvxbook/", meta: "Reference" },
        { id: "math-derivatives", label: "Derivatives + chain rule (the only calculus you need)", href: "https://www.3blue1brown.com/lessons/derivatives", meta: "Watch" },
        { id: "math-lagrange", label: "Lagrange multipliers — basics + when they matter", href: "https://en.wikipedia.org/wiki/Lagrange_multiplier", meta: "Read" },
        { id: "math-loss-landscape", label: "Loss landscapes — why GD gets stuck", href: "https://losslandscape.com/", meta: "Visual" },
      ]},
    ],
    interviewQuestions: [
      "What does it mean that a loss is convex — and which losses are?",
      "Why does logistic regression have a global optimum but neural nets do not?",
      "Why does gradient descent sometimes get stuck — and what do you do about it?",
      "Walk me through the chain rule using a 2-layer neural net.",
    ],
    references: [REF_UDL_BOOK, REF_3B1B_CALCULUS, REF_NEETCODE_VIDEOS],
  },

  // ───── PHASE 1B: Traditional ML basics (Days 8-14) ─────
  {
    day: 8, title: "Stack + Bias-variance trade-off", pillar: "traditional-ml",
    focus: "Stack patterns + the most-asked ML diagnostic.",
    tracks: [
      { label: "DSA · Stack", items: nc("Stack", 0, 4) },
      { label: "Trad ML · Bias-variance", items: [
        { id: "ml-bias-variance", label: "Read: bias-variance trade-off (then explain it cold)", href: "https://scott.fortmann-roe.com/docs/BiasVariance.html", meta: "Concept" },
        { id: "ml-bv-curves", label: "Diagnose under- vs over-fitting from learning curves", href: "https://scikit-learn.org/stable/modules/learning_curve.html", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "Define bias and variance — what does each look like in a learning curve?",
      "Why does adding more training data only help one of the two?",
      "When is regularization the wrong remedy?",
    ],
    references: [REF_GOOGLE_ML_CRASH, REF_UDL_BOOK],
    questionIds: ["bias-variance"],
  },
  {
    day: 9, title: "Stack (cont.) + Loss functions", pillar: "traditional-ml",
    focus: "Finish stack + connect losses to gradients + when each fits.",
    tracks: [
      { label: "DSA · Stack", items: nc("Stack", 4, 3) },
      { label: "Trad ML · Loss functions", items: [
        { id: "ml-loss-mse-mae", label: "MSE vs MAE vs Huber — when each", href: "https://towardsdatascience.com/common-loss-functions-in-machine-learning-46af0ffc4d23/", meta: "Read" },
        { id: "ml-loss-cross-entropy", label: "Binary & categorical cross-entropy (derive the gradient)", href: "https://gombru.github.io/2018/05/23/cross_entropy_loss/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why is cross-entropy preferred over MSE for classification?",
      "When would you choose MAE or Huber over MSE?",
      "What does a class-weighted loss change about gradient updates?",
    ],
    references: [REF_GOOGLE_ML_CRASH],
  },
  {
    day: 10, title: "Binary Search + Linear regression", pillar: "traditional-ml",
    focus: "Master binary search variants + the linear baseline you must defend.",
    tracks: [
      { label: "DSA · Binary Search", items: nc("Binary Search", 0, 4) },
      { label: "Trad ML · Linear regression", items: [
        { id: "ml-linreg-derivation", label: "Derive normal equation + GD update", href: "https://web.stanford.edu/~jurafsky/slp3/5.pdf", meta: "Read" },
        { id: "ml-linreg-assumptions", label: "Five assumptions (and which ones fail loudly)", href: "https://www.statisticssolutions.com/free-resources/directory-of-statistical-analyses/assumptions-of-linear-regression/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "When does linear regression break? Walk through 3 failure modes.",
      "Why is L2 a Bayesian prior on coefficients?",
      "What does heteroscedasticity do to OLS estimates?",
    ],
    references: [REF_GOOGLE_ML_CRASH],
  },
  {
    day: 11, title: "Binary Search (cont.) + Logistic regression + regularization", pillar: "traditional-ml",
    focus: "Finish binary search + logistic regression + L1 vs L2.",
    tracks: [
      { label: "DSA · Binary Search", items: nc("Binary Search", 4, 3) },
      { label: "Trad ML · Logistic regression", items: [
        { id: "ml-logreg", label: "Derive logistic loss + gradient by hand", href: "https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf", meta: "Read" },
        { id: "ml-l1-vs-l2", label: "L1 vs L2 — sparsity vs shrinkage intuition", href: "https://towardsdatascience.com/l1-and-l2-regularization-methods-ce25e7fc831c/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why does L1 produce sparse weights and L2 doesn't?",
      "What does multicollinearity do to logistic regression coefficients?",
      "Walk me through how you would calibrate a logistic-regression model.",
    ],
    references: [REF_UDL_BOOK, REF_GOOGLE_ML_CRASH],
  },
  {
    day: 12, title: "Linked List + Cross-validation", pillar: "traditional-ml",
    focus: "LL templates + a CV strategy that mirrors production leakage.",
    tracks: [
      { label: "DSA · Linked List", items: nc("Linked List", 0, 4) },
      { label: "Trad ML · Cross-validation", items: [
        { id: "ml-cv-strategies", label: "k-fold vs stratified vs time-based vs group", href: "https://scikit-learn.org/stable/modules/cross_validation.html", meta: "Docs" },
        { id: "ml-cv-leakage", label: "Why nested CV exists", href: "https://machinelearningmastery.com/nested-cross-validation-for-machine-learning-with-python/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "When does k-fold leak signal? Give a concrete example.",
      "Why is time-based split mandatory for forecasting?",
      "What's the difference between group k-fold and stratified k-fold?",
    ],
    references: [REF_GOOGLE_ML_CRASH],
  },
  {
    day: 13, title: "Linked List (cont.) + Classification metrics + calibration", pillar: "traditional-ml",
    focus: "Pick metrics matching the business decision + calibration deep dive.",
    tracks: [
      { label: "DSA · Linked List", items: nc("Linked List", 4, 4) },
      { label: "Trad ML · Metrics + calibration", items: [
        { id: "ml-metrics-pr-roc", label: "Precision, recall, F1, ROC-AUC, PR-AUC", href: "https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall", meta: "Read" },
        { id: "ml-platt-isotonic", label: "Platt vs isotonic vs temperature scaling", href: "https://scikit-learn.org/stable/modules/calibration.html#calibration", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "Why is ROC-AUC misleading on imbalanced data?",
      "When would you choose isotonic regression over Platt scaling?",
      "Why does an auction system need calibrated probabilities, not just rankings?",
    ],
    references: [REF_GOOGLE_ML_CRASH, REF_UDL_BOOK],
    topicId: "metrics-and-calibration",
  },
  {
    day: 14, title: "Linked List finish + Ranking & regression metrics", pillar: "traditional-ml",
    focus: "Wrap LL patterns (LRU, merge-K) + NDCG / MRR / RMSE.",
    tracks: [
      { label: "DSA · Linked List", items: nc("Linked List", 8, 3) },
      { label: "Trad ML · Ranking + regression metrics", items: [
        { id: "ml-ndcg-mrr", label: "NDCG, MRR, MAP — by hand on a tiny example", href: "https://en.wikipedia.org/wiki/Discounted_cumulative_gain", meta: "Read" },
        { id: "ml-rmse-mae", label: "RMSE vs MAE vs R² — when each", href: "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "Why is NDCG more useful than precision@K for ranking?",
      "When does R² lie? Give a counter-example.",
      "How do you sanity-check that your validation metric tracks the production one?",
    ],
    references: [],
  },

  // ───── PHASE 1C: Traditional ML practical (Days 15-21) ─────
  {
    day: 15, title: "Trees DFS + Trees & ensembles (GBDT)", pillar: "traditional-ml",
    focus: "Tree DFS templates + the tabular default (XGBoost / LightGBM).",
    tracks: [
      { label: "DSA · Trees", items: nc("Trees", 0, 5) },
      { label: "Trad ML · Trees & ensembles", items: [
        { id: "ml-gbdt-paper", label: "Read: XGBoost paper (skim sections 1-3)", href: "https://arxiv.org/abs/1603.02754", meta: "Paper" },
        { id: "ml-rf-vs-gbdt", label: "Random Forest vs GBDT — defend a default", href: "https://towardsdatascience.com/random-forest-vs-xgboost-comparing-tree-based-algorithms-with-codes-c8a4d18d3e74/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why does GBDT usually beat Random Forest on tabular data?",
      "When does a single decision tree still beat XGBoost?",
      "What's the difference between bagging and boosting in one sentence each?",
    ],
    references: [REF_GOOGLE_ML_CRASH],
    topicId: "tree-ensembles",
  },
  {
    day: 16, title: "Trees BFS + Hyperparameter tuning", pillar: "traditional-ml",
    focus: "Level-order patterns + tune efficiently without overfitting CV.",
    tracks: [
      { label: "DSA · Trees", items: nc("Trees", 5, 4) },
      { label: "Trad ML · Hyperparameter tuning", items: [
        { id: "ml-tuning-strategies", label: "Grid vs random vs Bayesian search", href: "https://machinelearningmastery.com/hyperparameter-optimization-with-random-search-and-grid-search/", meta: "Read" },
        { id: "ml-tuning-budget", label: "Hyperband / successive halving — why they work", href: "https://research.google/pubs/google-vizier-a-service-for-black-box-optimization/", meta: "Paper" },
      ]},
    ],
    interviewQuestions: [
      "Why is random search often better than grid search?",
      "How do you avoid leaking validation signal during tuning?",
      "When is nested CV worth its compute cost?",
    ],
    references: [],
  },
  {
    day: 17, title: "Trees BST + Imbalanced classification + SVM / KNN", pillar: "traditional-ml",
    focus: "BST validation + handle rare positives without breaking calibration + the other classic models.",
    tracks: [
      { label: "DSA · Trees", items: nc("Trees", 9, 3) },
      { label: "Trad ML · Imbalanced classification", items: [
        { id: "ml-imbalance", label: "Class weights vs SMOTE vs threshold-moving", href: "https://machinelearningmastery.com/what-is-imbalanced-classification/", meta: "Read" },
        { id: "ml-imbalance-calibration", label: "Why resampling breaks calibration", href: "https://scikit-learn.org/stable/auto_examples/calibration/plot_calibration.html", meta: "Read" },
      ]},
      { label: "Trad ML · SVM, KNN, Naive Bayes", items: [
        { id: "ml-svm", label: "SVM intuition + kernel trick — when SVM still wins", href: "https://scikit-learn.org/stable/modules/svm.html", meta: "Docs" },
        { id: "ml-knn", label: "KNN — when it's the right baseline (small data, low dim)", href: "https://scikit-learn.org/stable/modules/neighbors.html", meta: "Docs" },
        { id: "ml-naive-bayes", label: "Naive Bayes — fast, calibrated, surprisingly strong on text", href: "https://scikit-learn.org/stable/modules/naive_bayes.html", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "What breaks if you SMOTE before splitting train/test?",
      "When does SVM with an RBF kernel still beat a tree-based model?",
      "Why does Naive Bayes work well on text despite the naive independence assumption?",
      "How do you tune the decision threshold for an imbalanced classifier?",
    ],
    references: [REF_GOOGLE_ML_CRASH, REF_ANDREW_NG_ML, REF_STATQUEST],
  },
  {
    day: 18, title: "Trees hard + Clustering / PCA / anomaly detection", pillar: "traditional-ml",
    focus: "Trickier tree problems + the unsupervised toolkit.",
    tracks: [
      { label: "DSA · Trees", items: nc("Trees", 12, 3) },
      { label: "Trad ML · Unsupervised", items: [
        { id: "ml-kmeans", label: "k-means vs hierarchical vs DBSCAN — assumptions each makes", href: "https://scikit-learn.org/stable/modules/clustering.html", meta: "Docs" },
        { id: "ml-pca", label: "PCA as compression / denoising / visualization", href: "https://towardsdatascience.com/a-one-stop-shop-for-principal-component-analysis-5582fb7e0a9c/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "When does k-means silently fail? (Hint: shape of clusters.)",
      "What does PCA throw away — and why does that matter for downstream models?",
      "How do you choose K for k-means without ground truth?",
    ],
    references: [REF_GOOGLE_ML_CRASH],
    topicId: "anomaly-detection",
  },
  {
    day: 19, title: "Tries + Feature engineering & leakage", pillar: "traditional-ml",
    focus: "Trie implementation + spot leakage in features.",
    tracks: [
      { label: "DSA · Tries", items: nc("Tries", 0, 3) },
      { label: "Trad ML · Feature engineering", items: [
        { id: "ml-leakage", label: "Target / temporal / contamination leakage", href: "https://machinelearningmastery.com/data-leakage-machine-learning/", meta: "Read" },
        { id: "ml-encoding", label: "Encoding choices — one-hot, target, embedding", href: "https://contrib.scikit-learn.org/category_encoders/", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through 3 ways you'd detect target leakage in a churn model.",
      "When is target encoding dangerous?",
      "How do you align offline feature logic with serving?",
    ],
    references: [REF_CHIP_HUYEN_DESIGN],
    topicId: "feature-engineering-leakage",
  },
  {
    day: 20, title: "Heap + ML coding from scratch (linear)", pillar: "traditional-ml",
    focus: "Top-K patterns + implement linear regression from scratch.",
    tracks: [
      { label: "DSA · Heap", items: nc("Heap / Priority Queue", 0, 4) },
      { label: "ML coding · From scratch", items: [
        { id: "ml-code-linreg", label: "Implement linear regression with GD (NumPy only)", meta: "Code" },
        { id: "ml-code-test", label: "Fit on toy data; plot loss curve; reason about convergence", meta: "Code" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through your gradient update for linear regression.",
      "How would you extend this to L2 regularization in 5 minutes?",
      "Why might GD diverge — and how would you detect it?",
    ],
    references: [],
    topicId: "ml-from-scratch",
  },
  {
    day: 21, title: "Heap finish + ML coding (logistic + k-means)", pillar: "traditional-ml",
    focus: "Median stream + logistic regression + k-means from scratch.",
    tracks: [
      { label: "DSA · Heap", items: nc("Heap / Priority Queue", 4, 3) },
      { label: "ML coding · From scratch", items: [
        { id: "ml-code-logreg", label: "Implement logistic regression with binary cross-entropy", meta: "Code" },
        { id: "ml-code-kmeans", label: "Implement k-means (Lloyd's) + k-means++ init", meta: "Code" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through 'find median from data stream' with two heaps.",
      "What's the failure mode of softmax + cross-entropy with class imbalance?",
      "When does k-means fail catastrophically?",
    ],
    references: [],
  },
  {
    day: 22, title: "Backtracking + SQL fundamentals", pillar: "foundations",
    focus: "Backtracking template + joins, GROUP BY, CTEs.",
    tracks: [
      { label: "DSA · Backtracking", items: nc("Backtracking", 0, 4) },
      { label: "SQL · Fundamentals", items: [
        { id: "sql-joins", label: "Joins, GROUP BY, HAVING — solve 3 LC SQL Easy", href: "https://leetcode.com/problemset/database/", meta: "Practice" },
        { id: "sql-ctes", label: "CTEs and recursive CTEs", href: "https://learnsql.com/blog/sql-recursive-cte/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Generic backtracking template: state, choice, undo — what does each look like?",
      "When does INNER vs LEFT join silently change your answer?",
      "Why are recursive CTEs the right tool for graph traversal in SQL?",
    ],
    references: [REF_LC_PATTERNS],
  },
  {
    day: 23, title: "Backtracking (cont.) + SQL window functions", pillar: "foundations",
    focus: "Word search / palindrome partitioning + windows for cohort queries.",
    tracks: [
      { label: "DSA · Backtracking", items: nc("Backtracking", 4, 3) },
      { label: "SQL · Windows", items: [
        { id: "sql-windows", label: "ROW_NUMBER, RANK, LAG/LEAD — solve 3 LC SQL Medium", href: "https://leetcode.com/problemset/database/?topicSlugs=window-function", meta: "Practice" },
        { id: "sql-cohort", label: "Cohort retention pattern", href: "https://www.metabase.com/learn/grow-your-data-skills/data-fundamentals/cohort-analysis", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Compute day-7 retention by signup cohort. How do you avoid double-counting?",
      "When is LAG cleaner than a self-join?",
      "What's the difference between PARTITION BY and GROUP BY?",
    ],
    references: [],
    topicId: "sql-window-functions",
    questionIds: ["window-functions"],
  },
  {
    day: 24, title: "Backtracking finish + NN basics", pillar: "deep-learning",
    focus: "N-Queens / Letter Combinations + forward + backward pass on a 2-layer net.",
    tracks: [
      { label: "DSA · Backtracking", items: nc("Backtracking", 7, 2) },
      { label: "Deep learning · NN basics", items: [
        { id: "dl-forward-back", label: "Walk through forward + backward pass on paper", href: "https://cs231n.github.io/optimization-2/", meta: "Read" },
        { id: "dl-activations", label: "Activation functions: ReLU, GELU, sigmoid, softmax", href: "https://en.wikipedia.org/wiki/Activation_function", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Explain backprop as if to an engineer who's used PyTorch but never derived gradients.",
      "Why does ReLU help vs sigmoid?",
      "What's the role of softmax in the cross-entropy gradient?",
    ],
    references: [REF_UDL_BOOK],
    topicId: "backprop-and-optimization",
    questionIds: ["backprop"],
  },
  {
    day: 25, title: "Graphs DFS/BFS + Optimizers", pillar: "foundations",
    focus: "Grid DFS/BFS + SGD vs Adam + LR schedules.",
    tracks: [
      { label: "DSA · Graphs", items: nc("Graphs", 0, 4) },
      { label: "Deep learning · Optimizers", items: [
        { id: "dl-adam", label: "Adam vs SGD with momentum — when each generalizes better", href: "https://ruder.io/optimizing-gradient-descent/", meta: "Read" },
        { id: "dl-lr-warmup", label: "LR warmup + cosine decay — why it stabilizes early training", href: "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "When does Adam generalize worse than SGD with momentum?",
      "What does LR warmup actually fix?",
      "Walk me through how you'd find a good LR for a new model.",
    ],
    references: [REF_UDL_BOOK],
  },
  {
    day: 26, title: "Graphs (cont.) + Regularization in DL", pillar: "foundations",
    focus: "Course Schedule / Connected Components + dropout / weight decay.",
    tracks: [
      { label: "DSA · Graphs", items: nc("Graphs", 4, 4) },
      { label: "Deep learning · Regularization", items: [
        { id: "dl-dropout", label: "Dropout as ensemble approximation", href: "https://jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf", meta: "Paper" },
        { id: "dl-weight-decay", label: "Weight decay vs L2 in modern optimizers (AdamW)", href: "https://arxiv.org/abs/1711.05101", meta: "Paper" },
      ]},
    ],
    interviewQuestions: [
      "Why does dropout work? Give the ensemble interpretation.",
      "What's the subtle difference between L2 and weight decay in Adam?",
      "When is label smoothing the right call?",
    ],
    references: [REF_UDL_BOOK],
  },
  {
    day: 27, title: "Graphs finish + Normalization", pillar: "foundations",
    focus: "Word Ladder / Topo sort + batch / layer / group norm.",
    tracks: [
      { label: "DSA · Graphs", items: nc("Graphs", 8, 5) },
      { label: "Deep learning · Normalization", items: [
        { id: "dl-batchnorm", label: "Why batch norm stabilizes training", href: "https://arxiv.org/abs/1502.03167", meta: "Paper" },
        { id: "dl-layernorm", label: "Layer norm — why transformers prefer it", href: "https://arxiv.org/abs/1607.06450", meta: "Paper" },
      ]},
    ],
    interviewQuestions: [
      "Why does batch norm help? And what's the modern critique?",
      "Why do transformers use layer norm and not batch norm?",
      "What goes wrong with batch norm at very small batch sizes?",
    ],
    references: [REF_UDL_BOOK],
  },
  {
    day: 28, title: "Advanced Graphs + CNNs + project: CIFAR-10 classifier", pillar: "foundations",
    focus: "Dijkstra / Network Delay + CNN intuition + ship a small image classifier you can demo.",
    tracks: [
      { label: "DSA · Advanced Graphs", items: nc("Advanced Graphs", 0, 3) },
      { label: "Deep learning · CNNs", items: [
        { id: "dl-cnn-basics", label: "Kernels, stride, padding, pooling", href: "https://cs231n.github.io/convolutional-networks/", meta: "Read" },
        { id: "dl-resnet", label: "Why residual connections fix degradation", href: "https://arxiv.org/abs/1512.03385", meta: "Paper" },
      ]},
      { label: "Project · Image classifier", items: [
        { id: "proj-cifar", label: "Train a small CNN on CIFAR-10 / Fashion-MNIST", href: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", meta: "Build" },
        { id: "proj-cifar-deploy", label: "Deploy as a Streamlit demo or Hugging Face Space", href: "https://huggingface.co/spaces", meta: "Deploy" },
      ]},
    ],
    interviewQuestions: [
      "What's the receptive field after 3 conv layers with kernel 3, stride 1?",
      "Why do residual connections help train deep nets?",
      "Walk me through the training loop for your CIFAR classifier — where would it overfit?",
      "When does a CNN beat a transformer for vision today?",
    ],
    references: [REF_UDL_BOOK, REF_DLAI_SPEC, REF_FAST_AI, REF_STREAMLIT, REF_HF_SPACES],
    topicId: "cnn-design-patterns",
  },
  {
    day: 29, title: "Advanced Graphs (cont.) + RNN / LSTM + project: sentiment analysis", pillar: "foundations",
    focus: "Cheapest Flights + sequential modeling pre-transformers + ship a tiny NLP demo.",
    tracks: [
      { label: "DSA · Advanced Graphs", items: nc("Advanced Graphs", 3, 3) },
      { label: "Deep learning · Sequence", items: [
        { id: "dl-rnn-vanish", label: "Vanilla RNN vanishing-gradient problem", href: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", meta: "Read (canonical)" },
        { id: "dl-lstm", label: "LSTM gating — why it helps gradient flow", href: "https://distill.pub/2019/memorization-in-rnns/", meta: "Read" },
      ]},
      { label: "Project · Sentiment analysis", items: [
        { id: "proj-sent-finetune", label: "Fine-tune DistilBERT on IMDb reviews (HF Trainer)", href: "https://huggingface.co/learn/llm-course/chapter3/3", meta: "Build" },
        { id: "proj-sent-deploy", label: "Deploy as Streamlit / HF Space", href: "https://huggingface.co/spaces", meta: "Deploy" },
      ]},
    ],
    interviewQuestions: [
      "What does the cell state in an LSTM actually store?",
      "How would you handle out-of-vocabulary tokens in your sentiment classifier?",
      "Where does a transformer still lose to an LSTM?",
      "Why don't RNNs parallelize over the time dimension?",
    ],
    references: [REF_DLAI_SPEC, REF_FAST_AI, REF_HF_SPACES],
  },
  {
    day: 30, title: "1-D DP + Transformers from first principles", pillar: "deep-learning",
    focus: "Climbing Stairs / House Robber + self-attention math.",
    tracks: [
      { label: "DSA · 1-D DP", items: nc("1-D Dynamic Programming", 0, 4) },
      { label: "Deep learning · Transformers", items: [
        { id: "dl-attention", label: "The Annotated Transformer", href: "http://nlp.seas.harvard.edu/2018/04/03/attention.html", meta: "Read (canonical)" },
        { id: "dl-self-attention", label: "Walk through attention(Q, K, V) end to end", href: "https://jalammar.github.io/illustrated-transformer/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why do transformers scale better than RNNs for long sequences?",
      "What's the cost of self-attention in sequence length, and what mitigations exist?",
      "Why does multi-head attention help vs one big head?",
    ],
    references: [REF_UDL_BOOK],
    topicId: "transformers-first-principles",
    questionIds: ["self-attention"],
  },
  {
    day: 31, title: "1-D DP (cont.) + LLM basics", pillar: "deep-learning",
    focus: "Coin Change / Word Break + pretraining → instruction tuning → RLHF.",
    tracks: [
      { label: "DSA · 1-D DP", items: nc("1-D Dynamic Programming", 4, 4) },
      { label: "GenAI · LLM basics", items: [
        { id: "llm-pretraining", label: "What pretraining actually optimizes", href: "https://huggingface.co/learn/llm-course/chapter1/4", meta: "Read" },
        { id: "llm-rlhf", label: "RLHF / DPO at a high level", href: "https://huyenchip.com/2023/05/02/rlhf.html", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "What's the difference between pretraining, instruction tuning, and RLHF?",
      "Why do LLMs hallucinate? Give a structural explanation.",
      "Temperature vs top-p — what does each control?",
    ],
    references: [REF_HF_LLM],
    topicId: "llm-basics",
    questionIds: ["temperature-top-p"],
  },
  {
    day: 32, title: "1-D DP finish + Tokenization & embeddings", pillar: "generative-ai",
    focus: "LIS / Partition Equal Subset + BPE intuition + embedding space.",
    tracks: [
      { label: "DSA · 1-D DP", items: nc("1-D Dynamic Programming", 8, 4) },
      { label: "GenAI · Tokenization", items: [
        { id: "llm-bpe", label: "Byte-pair encoding (BPE)", href: "https://huggingface.co/learn/llm-course/chapter6/5", meta: "Read" },
        { id: "llm-embeddings", label: "What embeddings encode", href: "https://jalammar.github.io/illustrated-word2vec/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why does BPE exist instead of word-level or char-level tokenization?",
      "What multilingual edge cases break naive BPE?",
      "How does an embedding model differ from an LLM?",
    ],
    references: [REF_HF_LLM],
  },
  {
    day: 33, title: "2-D DP + Prompt engineering", pillar: "generative-ai",
    focus: "Unique Paths / LCS + few-shot + CoT + structured output.",
    tracks: [
      { label: "DSA · 2-D DP", items: nc("2-D Dynamic Programming", 0, 4) },
      { label: "GenAI · Prompting", items: [
        { id: "llm-fewshot", label: "Few-shot vs zero-shot — when each helps", href: "https://www.promptingguide.ai/techniques/fewshot", meta: "Read" },
        { id: "llm-cot", label: "Chain-of-thought (CoT) prompting", href: "https://arxiv.org/abs/2201.11903", meta: "Paper" },
      ]},
    ],
    interviewQuestions: [
      "When does CoT prompting hurt vs help?",
      "How would you enforce structured JSON output reliably?",
      "What's the difference between system prompt and user prompt?",
    ],
    references: [REF_OAI_DOCS],
  },
  {
    day: 34, title: "2-D DP (cont.) + RAG architecture + project: RAG chatbot", pillar: "generative-ai",
    focus: "Edit Distance / Coin Change II + end-to-end RAG + ship a chatbot over your own docs.",
    tracks: [
      { label: "DSA · 2-D DP", items: nc("2-D Dynamic Programming", 4, 4) },
      { label: "GenAI · RAG", items: [
        { id: "rag-pipeline", label: "Chunking → retrieval → reranking → generation → citations", href: "https://python.langchain.com/docs/concepts/rag/", meta: "Read" },
        { id: "rag-hybrid", label: "Why hybrid (dense + sparse) usually wins", href: "https://www.pinecone.io/learn/hybrid-search-intro/", meta: "Read" },
      ]},
      { label: "Project · Build a RAG chatbot", items: [
        { id: "proj-rag-build", label: "Chatbot over a custom knowledge base (LangChain + OpenAI)", href: "https://python.langchain.com/docs/tutorials/rag/", meta: "Build" },
        { id: "proj-rag-local", label: "Run the same chatbot fully locally with Ollama", href: "https://ollama.com/", meta: "Build" },
        { id: "proj-rag-deploy", label: "Deploy it as a Streamlit / HF Space demo", href: "https://huggingface.co/spaces", meta: "Deploy" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through chunking trade-offs (size + overlap).",
      "Why does pure dense retrieval miss product names and error codes?",
      "Walk me through the architecture of YOUR RAG chatbot — where would it fail under load?",
      "How would you handle citations when the retrieved chunk doesn't actually support the claim?",
    ],
    references: [REF_LANGCHAIN_RAG, REF_DLAI_GENAI, REF_OAI_DOCS, REF_STREAMLIT],
    topicId: "rag-architecture",
  },
  {
    day: 35, title: "2-D DP finish + Vector stores", pillar: "generative-ai",
    focus: "Distinct Subsequences / Regex Match + HNSW / IVF.",
    tracks: [
      { label: "DSA · 2-D DP", items: nc("2-D Dynamic Programming", 8, 3) },
      { label: "GenAI · Vector stores", items: [
        { id: "rag-ann", label: "HNSW vs IVF vs flat — trade-offs", href: "https://www.pinecone.io/learn/series/faiss/hnsw/", meta: "Read" },
        { id: "rag-bm25", label: "When BM25 still wins", href: "https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "How does HNSW work at a high level — what's the trade-off vs flat search?",
      "When is BM25 better than dense retrieval today?",
      "What's the operational cost of re-embedding when the model changes?",
    ],
    references: [],
  },
  {
    day: 36, title: "Greedy + Reranking", pillar: "generative-ai",
    focus: "Maximum Subarray / Jump Game + cross-encoder rerankers.",
    tracks: [
      { label: "DSA · Greedy", items: nc("Greedy", 0, 4) },
      { label: "GenAI · Reranking", items: [
        { id: "rag-rerank", label: "Bi-encoder vs cross-encoder rerankers", href: "https://www.sbert.net/examples/applications/cross-encoder/README.html", meta: "Read" },
        { id: "rag-rerank-llm", label: "LLM-based rerankers — when worth the cost", href: "https://www.pinecone.io/learn/series/rag/rerankers/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Cross-encoder vs bi-encoder reranking: cost-vs-quality breakdown.",
      "When does a reranker actually move the needle?",
      "What's the operational cost of an LLM-judge reranker at scale?",
    ],
    references: [],
  },
  {
    day: 37, title: "Greedy (cont.) + LLM evaluation", pillar: "generative-ai",
    focus: "Gas Station / Hand of Straights + faithfulness, calibration, LLM-as-judge.",
    tracks: [
      { label: "DSA · Greedy", items: nc("Greedy", 4, 4) },
      { label: "GenAI · Evaluation", items: [
        { id: "llm-eval-faithfulness", label: "Faithfulness vs answer relevance vs citation accuracy (Ragas)", href: "https://docs.ragas.io/en/stable/concepts/metrics/index.html", meta: "Docs" },
        { id: "llm-eval-judge", label: "LLM-as-judge calibration against humans", href: "https://huyenchip.com/2024/07/25/genai-platform.html", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through evaluating a RAG system end-to-end.",
      "What goes wrong if you only measure BLEU or ROUGE?",
      "How do you calibrate an LLM-judge against human ratings?",
    ],
    references: [],
    topicId: "llm-evaluation",
    questionIds: ["rag-eval"],
  },
  {
    day: 38, title: "Intervals + Fine-tuning + project: resume analyzer", pillar: "generative-ai",
    focus: "Insert / Merge intervals + fine-tune-only-when-prompt+RAG-plateaus + ship a resume analyzer.",
    tracks: [
      { label: "DSA · Intervals", items: nc("Intervals", 0, 4) },
      { label: "GenAI · Fine-tuning", items: [
        { id: "llm-lora", label: "LoRA / PEFT — what changes are made", href: "https://huggingface.co/docs/peft/index", meta: "Docs" },
        { id: "llm-ft-vs-rag", label: "When fine-tuning beats RAG (and when it doesn't)", href: "https://huyenchip.com/2023/04/11/llm-engineering.html", meta: "Read" },
      ]},
      { label: "Project · Resume analyzer", items: [
        { id: "proj-resume-extract", label: "Build resume → structured-output extractor (LLM + JSON schema)", href: "https://platform.openai.com/docs/guides/structured-outputs", meta: "Build" },
        { id: "proj-resume-match", label: "Match resume to job description with embeddings (cosine sim)", href: "https://platform.openai.com/docs/guides/embeddings", meta: "Build" },
        { id: "proj-resume-deploy", label: "Deploy as Streamlit demo", href: "https://docs.streamlit.io/", meta: "Deploy" },
      ]},
    ],
    interviewQuestions: [
      "When would you fine-tune instead of doing prompt + RAG?",
      "What does LoRA actually update — and why is the update so small?",
      "Walk me through how YOUR resume analyzer scores job fit — what could go wrong?",
      "How do you evaluate whether a fine-tune succeeded?",
    ],
    references: [REF_DLAI_GENAI, REF_OAI_DOCS],
  },
  {
    day: 39, title: "Intervals finish + Agents", pillar: "generative-ai",
    focus: "Meeting Rooms / Min-interval + planner / executor split.",
    tracks: [
      { label: "DSA · Intervals", items: nc("Intervals", 4, 2) },
      { label: "GenAI · Agents", items: [
        { id: "llm-agents", label: "Anthropic: Building effective agents", href: "https://www.anthropic.com/engineering/building-effective-agents", meta: "Read (canonical)" },
        { id: "llm-tool-use", label: "Tool-use schemas + permissions", href: "https://platform.openai.com/docs/guides/function-calling", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "When is a multi-agent architecture justified?",
      "What's the planner / executor split, and why?",
      "How do you stop an agent from looping on a failing tool?",
    ],
    references: [REF_OAI_DOCS],
    topicId: "agents-and-guardrails",
    questionIds: ["agent-architecture"],
  },
  {
    day: 40, title: "Math & Geometry + Guardrails", pillar: "generative-ai",
    focus: "Rotate Image / Spiral Matrix + layered guardrails (input → schema → policy → output).",
    tracks: [
      { label: "DSA · Math & Geometry", items: nc("Math & Geometry", 0, 4) },
      { label: "GenAI · Safety", items: [
        { id: "llm-jailbreak", label: "Prompt injection & jailbreaks (OWASP LLM Top 10)", href: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", meta: "Reference" },
        { id: "llm-guardrails", label: "Layered guardrail patterns (NeMo Guardrails)", href: "https://github.com/NVIDIA/NeMo-Guardrails", meta: "Reference" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through 4 guardrail layers — what each catches.",
      "How do you red-team a customer-facing agent?",
      "What's the right escalation behavior for an unsure LLM in a support context?",
    ],
    references: [],
  },
  {
    day: 41, title: "Math (cont.) + System design framework + interview-prep canon", pillar: "ml-system-design",
    focus: "Happy Number / Plus One + the reusable design scaffold + the canonical interview repos.",
    tracks: [
      { label: "DSA · Math & Geometry", items: nc("Math & Geometry", 4, 4) },
      { label: "ML system design · Framework", items: [
        { id: "sd-framework", label: "Read: Chip Huyen — ML systems design TOC", href: "https://huyenchip.com/machine-learning-systems-design/toc.html", meta: "Read" },
        { id: "sd-halina", label: "Patrick Halina — ML Systems Design Interview Guide", href: "http://patrickhalina.com/posts/ml-systems-design-interview-guide/", meta: "Read" },
        { id: "sd-scaffold", label: "Memorize the scaffold: clarify → metrics → data → model → serving → monitoring → trade-off close", meta: "Concept" },
      ]},
      { label: "Reference · Interview repos to bookmark", items: [
        { id: "sd-khangich", label: "khangich/machine-learning-interview — full prep guide", href: "https://github.com/khangich/machine-learning-interview", meta: "Repo" },
        { id: "sd-alirezadir", label: "alirezadir/Machine-Learning-Interviews — companion repo", href: "https://github.com/alirezadir/Machine-Learning-Interviews", meta: "Repo" },
        { id: "sd-huyen-int", label: "Chip Huyen — ML Interviews Book (free)", href: "https://huyenchip.com/ml-interviews-book/", meta: "Book" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through your design framework on a fresh prompt.",
      "What goes wrong if you skip the metrics step?",
      "How do you decide between batch vs realtime inference?",
    ],
    references: [REF_CHIP_HUYEN_DESIGN, REF_FSDL, REF_HUYEN_INT_BOOK, REF_KHANGICH_REPO, REF_ALIREZADIR_REPO, REF_PATRICK_HALINA, REF_DATASCIENCE_JAY],
    topicId: "system-design-framework",
  },
  {
    day: 42, title: "Bit Manipulation + Data pipelines", pillar: "ml-system-design",
    focus: "Single Number / 1-bits + batch vs streaming + idempotency.",
    tracks: [
      { label: "DSA · Bit Manipulation", items: nc("Bit Manipulation", 0, 4) },
      { label: "ML system design · Data", items: [
        { id: "sd-streaming", label: "When streaming beats batch", href: "https://www.confluent.io/learn/data-streaming/", meta: "Read" },
        { id: "sd-schema-evol", label: "Schema evolution & backfill discipline", href: "https://docs.databricks.com/en/delta/update-schema.html", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "When is streaming the right choice — and when is it just complexity?",
      "Walk me through point-in-time correctness for a backfill.",
      "How do you make a data pipeline idempotent?",
    ],
    references: [],
  },
  {
    day: 43, title: "Bit (cont.) + Feature stores", pillar: "ml-system-design",
    focus: "Counting Bits / XOR + online/offline parity, feature TTLs.",
    tracks: [
      { label: "DSA · Bit Manipulation", items: nc("Bit Manipulation", 4, 3) },
      { label: "ML system design · Feature stores", items: [
        { id: "sd-feast", label: "Feast / Tecton overview — what a feature store actually does", href: "https://docs.feast.dev/", meta: "Docs" },
        { id: "sd-pit-correct", label: "Point-in-time correctness — the canonical bug", href: "https://www.tecton.ai/blog/time-travel-in-ml/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "When does a feature store earn its complexity vs become overhead?",
      "Walk me through point-in-time correctness for a fraud model backfill.",
      "How do you ensure offline / online parity over months?",
    ],
    references: [],
    topicId: "feature-stores",
    questionIds: ["feature-store-purpose"],
  },
  {
    day: 44, title: "Reading + Online serving", pillar: "ml-system-design",
    focus: "No new DSA today — read deeply + design serving for a 100ms p99 budget.",
    tracks: [
      { label: "Read · ML serving", items: [
        { id: "sd-tritan", label: "Triton / KServe / Ray Serve — what each is for", href: "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html", meta: "Docs" },
        { id: "sd-batching", label: "Dynamic batching for inference", href: "https://www.databricks.com/blog/dynamic-batching-llm-inference", meta: "Read" },
      ]},
      { label: "Design exercise", items: [
        { id: "sd-design-100ms", label: "Sketch a serving path for a ranking model under 100ms p99", meta: "Whiteboard" },
        { id: "sd-fallback", label: "Add a graceful-degradation fallback", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "Decompose a 100ms latency budget across feature fetch, model inference, and post-processing.",
      "When does dynamic batching hurt latency more than it helps throughput?",
      "What's a graceful-degradation strategy when the model tier saturates?",
    ],
    references: [REF_CHIP_HUYEN_DESIGN, REF_FSDL],
    topicId: "online-serving-tradeoffs",
    questionIds: ["architect-capacity-planning"],
  },
  {
    day: 45, title: "Monitoring & drift", pillar: "mlops",
    focus: "Separate infra / data / model monitoring; alerts that map to actions.",
    tracks: [
      { label: "Read · Monitoring", items: [
        { id: "mlops-evidently", label: "Evidently AI — monitoring metrics catalog", href: "https://docs.evidentlyai.com/reference/all-metrics", meta: "Docs" },
        { id: "mlops-drift", label: "KS / PSI for drift detection", href: "https://towardsdatascience.com/population-stability-index-psi-and-characteristic-stability-index-csi-for-machine-learning-2c1f15823e94/", meta: "Read" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-design-monitor", label: "Design a monitoring stack for a fraud model with delayed labels", meta: "Whiteboard" },
        { id: "mlops-playbook", label: "Write a playbook for one alert type", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "Separate infra monitoring, data monitoring, and model monitoring — what's in each?",
      "Walk me through monitoring a fraud model with 30-day label lag.",
      "What's an example of an alert that doesn't map to an action — and how do you fix it?",
    ],
    references: [],
    topicId: "monitoring-drift",
    questionIds: ["monitoring-production"],
  },
  {
    day: 46, title: "Case: Short-video recommendations (part 1)", pillar: "ml-system-design",
    focus: "Read Yuan Meng's example doc + write your own framing on paper.",
    tracks: [
      { label: "Read · Recsys foundations", items: [
        { id: "case-yt-twotower", label: "YouTube two-tower paper (Sampling-bias-corrected)", href: "https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/", meta: "Paper" },
        { id: "case-tiktok-mono", label: "Eugene Yan: System design for recommendations", href: "https://eugeneyan.com/writing/system-design-for-discovery/", meta: "Read" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-vid-clarify", label: "Clarification step: watch time vs retention vs creator diversity", meta: "Whiteboard" },
        { id: "case-vid-stage-budgets", label: "Sketch the 3-stage architecture with latency budgets", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What product metric would you optimize for — watch time, retention, both?",
      "How do you handle cold-start for new creators?",
      "What's the role of an exploration budget in a feed?",
    ],
    references: [REF_YUAN_MENG_HURRY, REF_CHIP_HUYEN_DESIGN],
    caseStudySlug: "video-recommendation",
    questionIds: ["recommendation-design"],
  },
  {
    day: 47, title: "Case: Short-video recommendations (part 2)", pillar: "ml-system-design",
    focus: "Walk the case end-to-end out loud against the framework.",
    tracks: [
      { label: "Practice · Out loud", items: [
        { id: "case-vid-mock", label: "Time yourself: 50-min mock on the prompt", meta: "Mock" },
        { id: "case-vid-feedback", label: "Compare to the case page; note 3 gaps", href: "/case-studies/video-recommendation", meta: "Compare" },
      ]},
      { label: "Read · Re-ranking & feedback loops", items: [
        { id: "case-vid-rerank", label: "Diversity in re-ranking (Eugene Yan)", href: "https://eugeneyan.com/writing/serendipity-and-accuracy-in-recommender-systems/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "What's the one trade-off you'd defend hardest in this design?",
      "How does your design degrade if the catalog 10x's overnight?",
      "What feedback-loop pathology would you watch for after launch?",
    ],
    references: [],
    caseStudySlug: "video-recommendation",
  },
  {
    day: 48, title: "Case: Ads conversion (CTR) — part 1", pillar: "ml-system-design",
    focus: "Frame the auction; calibration is the architect's word.",
    tracks: [
      { label: "Read · Ads ML", items: [
        { id: "case-ads-criteo", label: "Criteo paper on display advertising (skim)", href: "https://arxiv.org/abs/1410.0696", meta: "Paper" },
        { id: "case-ads-cal", label: "Why pCTR must be calibrated for an auction", href: "https://eugeneyan.com/writing/uncertainty-in-recommender-systems/", meta: "Read" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-ads-clarify", label: "Auction integration: bid × pCTR with quality adjustment", meta: "Whiteboard" },
        { id: "case-ads-features", label: "Feature plan: user / ad / context / cross", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "Why does a ranking-only model break in an auction?",
      "Walk me through how you'd detect calibration drift.",
      "How do you handle delayed conversion labels?",
    ],
    references: [REF_YUAN_MENG_HURRY],
    caseStudySlug: "ad-click-prediction",
  },
  {
    day: 49, title: "Case: Ads conversion (CTR) — part 2", pillar: "ml-system-design",
    focus: "End-to-end mock + position bias + exploration slots.",
    tracks: [
      { label: "Practice · Out loud", items: [
        { id: "case-ads-mock", label: "Time a 50-min mock on this prompt", meta: "Mock" },
        { id: "case-ads-rollout", label: "Rollout plan: shadow → 1% → 5% → 25% with auto-rollback", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How do you mitigate position bias at training time?",
      "What's a sane exploration budget for a new advertiser?",
      "How would you split A/B traffic so you don't fool yourself with selection bias?",
    ],
    references: [],
    caseStudySlug: "ad-click-prediction",
  },
  {
    day: 50, title: "Catch-up · half DSA review, half ML review", pillar: "foundations",
    focus: "Re-attempt 3 hardest LC problems + revisit the 3 weakest ML topics.",
    tracks: [
      { label: "DSA review", items: [
        { id: "review-50-1", label: "Re-solve a previously stuck problem (any pattern)", meta: "30 min" },
        { id: "review-50-2", label: "Re-solve another", meta: "30 min" },
        { id: "review-50-3", label: "Re-solve a third", meta: "30 min" },
      ]},
      { label: "ML review", items: [
        { id: "review-50-ml-1", label: "Pick 3 ML topics where you stalled — re-explain each cold", meta: "Concept" },
        { id: "review-50-ml-2", label: "Update your gap list", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "What pattern is still slowest for you, and why?",
      "Which ML topic do you avoid in mocks? Confront it now.",
    ],
    references: [],
  },
  {
    day: 51, title: "Case: Search ranking (part 1)", pillar: "ml-system-design",
    focus: "Three-stage architecture: query understanding → retrieval → ranking.",
    tracks: [
      { label: "Read · Search ML", items: [
        { id: "case-search-yan", label: "Eugene Yan — search ranking architecture", href: "https://eugeneyan.com/writing/search-query-matching/", meta: "Read" },
        { id: "case-search-airbnb", label: "Airbnb listing embeddings paper", href: "https://www.kdd.org/kdd2018/accepted-papers/view/real-time-personalization-using-embeddings-for-search-ranking-at-airbnb", meta: "Paper" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-search-stages", label: "Sketch query understanding + retrieval + ranking with budgets", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How do you handle query understanding for ambiguous queries?",
      "When does learning-to-rank beat a simple linear scoring function?",
      "How would you cold-start search for a new geographic market?",
    ],
    references: [],
    caseStudySlug: "search-ranking",
  },
  {
    day: 52, title: "Case: Search ranking (part 2)", pillar: "ml-system-design",
    focus: "End-to-end mock + cold-start + selection bias.",
    tracks: [
      { label: "Practice · Out loud", items: [
        { id: "case-search-mock", label: "Time a 50-min mock", meta: "Mock" },
        { id: "case-search-eval", label: "Write your offline + online eval plan", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What does NDCG@10 buy you that CTR doesn't?",
      "How do you debias clicks for offline training?",
      "What's an exposure-fairness metric, and when do you need one?",
    ],
    references: [],
    caseStudySlug: "search-ranking",
  },
  {
    day: 53, title: "Case: Fraud detection (part 1)", pillar: "ml-system-design",
    focus: "Real-time scoring with imbalanced labels + reviewer queue capacity.",
    tracks: [
      { label: "Read · Fraud ML", items: [
        { id: "case-fraud-stripe", label: "Stripe Radar overview", href: "https://stripe.com/radar", meta: "Read" },
        { id: "case-fraud-graph", label: "Graph features for fraud", href: "https://www.tigergraph.com/solutions/fraud-detection/", meta: "Read" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-fraud-arch", label: "Sketch sync features + cached aggregates + slower enrichment", meta: "Whiteboard" },
        { id: "case-fraud-threshold", label: "Per-segment threshold logic", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How do you handle the cost imbalance between false positives and false negatives?",
      "When would you separate the model from the rules engine vs combine them?",
      "How do you bootstrap labels for a brand-new fraud type?",
    ],
    references: [],
    caseStudySlug: "fraud-detection",
  },
  {
    day: 54, title: "Case: Fraud detection (part 2)", pillar: "ml-system-design",
    focus: "End-to-end mock + delayed labels + reviewer SLA.",
    tracks: [
      { label: "Practice · Out loud", items: [
        { id: "case-fraud-mock", label: "Time a 50-min mock", meta: "Mock" },
        { id: "case-fraud-monitor", label: "Monitoring: score distribution, queue length, fraud-recall@FPR", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How do you keep the reviewer queue from blowing up after a model swap?",
      "What's the corrective action when fraud-recall@FPR drops 2pp?",
      "Survivorship bias in fraud labels — how do you mitigate?",
    ],
    references: [],
    caseStudySlug: "fraud-detection",
  },
  {
    day: 55, title: "Case: Enterprise RAG chatbot", pillar: "generative-ai",
    focus: "Permissioned retrieval + citations + faithfulness.",
    tracks: [
      { label: "Read · Enterprise RAG", items: [
        { id: "case-rag-langchain", label: "LangChain RAG cookbook", href: "https://python.langchain.com/docs/tutorials/rag/", meta: "Tutorial" },
        { id: "case-rag-acl", label: "Permissioned retrieval patterns", href: "https://arxiv.org/abs/2305.13631", meta: "Paper" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-rag-arch", label: "Sketch ingest → ACL chunks → hybrid retrieval → rerank → cite", meta: "Whiteboard" },
        { id: "case-rag-mock", label: "Time a 50-min mock", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Where do you enforce ACLs — at retrieval time or after generation? Why?",
      "How do you test for permission leakage?",
      "What's the right refusal behavior when retrieval is weak?",
    ],
    references: [REF_LANGCHAIN_RAG],
    caseStudySlug: "enterprise-rag-chatbot",
  },
  {
    day: 56, title: "Case: AI customer-support agent", pillar: "generative-ai",
    focus: "Tool use + layered guardrails + tiered rollout.",
    tracks: [
      { label: "Read · Production agents", items: [
        { id: "case-agent-anthropic", label: "Anthropic: building effective agents", href: "https://www.anthropic.com/engineering/building-effective-agents", meta: "Read" },
        { id: "case-agent-klarna", label: "Klarna's customer-service AI assistant — public reports", href: "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/", meta: "Read" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-agent-arch", label: "Sketch action allowlist + planner/executor split", meta: "Whiteboard" },
        { id: "case-agent-tiered", label: "Tiered rollout: shadow → read-only → tier-1 → tier-2", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What's an example of an irreversible action that needs hard human-in-the-loop?",
      "How do you keep the agent from looping on a failing tool?",
      "What's your red-team plan for a customer-facing agent?",
    ],
    references: [REF_OAI_DOCS],
    caseStudySlug: "customer-support-agent",
  },
  {
    day: 57, title: "Case: LLM evaluation platform", pillar: "generative-ai",
    focus: "Suites, runs, gates, regression detection across teams.",
    tracks: [
      { label: "Read · LLM eval platforms", items: [
        { id: "case-eval-genai", label: "Chip Huyen — building a GenAI platform", href: "https://huyenchip.com/2024/07/25/genai-platform.html", meta: "Read" },
        { id: "case-eval-ragas", label: "Ragas metrics catalog", href: "https://docs.ragas.io/", meta: "Docs" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-eval-arch", label: "Suite / run / gate object model + scoring layer", meta: "Whiteboard" },
        { id: "case-eval-mock", label: "Time a 50-min mock", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "How do you prevent teams from over-fitting to the eval suite (Goodhart)?",
      "What's the failure mode of an LLM-judge calibrated only against itself?",
      "How do you make releases gate-block on regressions without slowing iteration?",
    ],
    references: [],
    caseStudySlug: "llm-evaluation-platform",
  },
  {
    day: 58, title: "Case: Document intelligence", pillar: "generative-ai",
    focus: "OCR + extraction + calibrated confidence + reviewer queue.",
    tracks: [
      { label: "Read · Document AI", items: [
        { id: "case-doc-textract", label: "AWS Textract overview", href: "https://aws.amazon.com/textract/", meta: "Docs" },
        { id: "case-doc-layoutlm", label: "LayoutLM family — what it does", href: "https://huggingface.co/docs/transformers/model_doc/layoutlmv3", meta: "Docs" },
      ]},
      { label: "Design · On paper", items: [
        { id: "case-doc-arch", label: "Sketch ingest → OCR → layout → extract → validate → confidence → route", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How do you compute a calibrated per-field confidence?",
      "When do you build vs buy for OCR?",
      "What's the right routing rule between auto-accept and manual review?",
    ],
    references: [],
    caseStudySlug: "document-intelligence",
  },
  {
    day: 59, title: "Cross-case design rehearsal", pillar: "ml-system-design",
    focus: "Pick one case you haven't drilled. Time a 60-min mock cold.",
    tracks: [
      { label: "Mock", items: [
        { id: "case-cross-pick", label: "Pick a fresh case study", href: "/case-studies", meta: "Pick" },
        { id: "case-cross-mock", label: "60-min mock with a peer or solo", meta: "Mock" },
        { id: "case-cross-score", label: "Self-score against the framework", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "What did you skip under time pressure?",
      "Where did you wave hands?",
      "What's the one trade-off you'd defend hardest if pushed?",
    ],
    references: [REF_CHIP_HUYEN_DESIGN],
  },
  {
    day: 60, title: "Architect trade-off playbook drill", pillar: "ml-system-design",
    focus: "Memorize the 6 architect trade-offs you'll be asked to defend.",
    tracks: [
      { label: "Read & rehearse", items: [
        { id: "tradeoff-batch-realtime", label: "Batch vs real-time inference", meta: "Concept" },
        { id: "tradeoff-ft-rag-prompt", label: "Fine-tune vs RAG vs prompt", meta: "Concept" },
        { id: "tradeoff-build-buy", label: "Build vs buy", meta: "Concept" },
        { id: "tradeoff-central-fed", label: "Centralized platform vs team-owned", meta: "Concept" },
        { id: "tradeoff-acc-cost-lat", label: "Accuracy vs cost vs latency cascade", meta: "Concept" },
        { id: "tradeoff-retrain-monitor", label: "Retrain cadence vs monitoring", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "When do you default to streaming vs batch?",
      "When does fine-tuning beat RAG?",
      "How do you make a build-vs-buy decision reversible?",
    ],
    references: [REF_CHIP_HUYEN_DESIGN],
    questionIds: ["architect-build-vs-buy", "architect-multi-tenant-isolation"],
  },
  {
    day: 61, title: "Training pipelines", pillar: "mlops",
    focus: "Reliable, reproducible training from data to artifact.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-airflow", label: "Pipeline orchestration: Airflow / Prefect / Dagster", href: "https://www.dagster.io/blog/dagster-airflow-prefect", meta: "Read" },
        { id: "mlops-distributed", label: "Distributed training (DDP, FSDP, ZeRO)", href: "https://pytorch.org/tutorials/intermediate/ddp_tutorial.html", meta: "Tutorial" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-trigger", label: "Write retraining triggers (drift, time, label volume)", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "When do you actually need DDP / FSDP vs single-node?",
      "What's a sane retraining trigger that isn't just calendar-based?",
      "How do you ensure pipeline lineage end-to-end?",
    ],
    references: [REF_FSDL],
  },
  {
    day: 62, title: "Model registry + CI/CD", pillar: "mlops",
    focus: "Promote models like code: tests gate promotion, rollback is first-class.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-mlflow", label: "MLflow Model Registry — what it stores", href: "https://mlflow.org/docs/latest/model-registry.html", meta: "Docs" },
        { id: "mlops-cicd", label: "CI/CD for ML — what's different from app CI", href: "https://martinfowler.com/articles/cd4ml.html", meta: "Read" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-gate", label: "Define promotion gates (offline metric, fairness, calibration)", meta: "Whiteboard" },
        { id: "mlops-rollback", label: "Define rollback playbook", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What gates the promotion from dev → staging → prod?",
      "How do you make rollback deterministic?",
      "Why is auto-promote dangerous?",
    ],
    references: [],
    topicId: "model-registry-cicd",
  },
  {
    day: 63, title: "Deployment strategies", pillar: "mlops",
    focus: "Shadow → canary → progressive rollout that protects users.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-shadow", label: "Shadow mode vs canary vs blue-green", href: "https://martinfowler.com/bliki/CanaryRelease.html", meta: "Read" },
        { id: "mlops-multi-region", label: "Multi-region ML deployment patterns", href: "https://aws.amazon.com/blogs/machine-learning/", meta: "Read" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-rollout-trigger", label: "Auto-rollback triggers (SLO breach, regression on guardrail)", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What's the difference between shadow mode and canary?",
      "When does blue-green not work for ML?",
      "How do you handle model state during a region failover?",
    ],
    references: [],
  },
  {
    day: 64, title: "Observability for ML", pillar: "mlops",
    focus: "Logs, metrics, traces — and the model-specific overlay.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-otel", label: "OpenTelemetry overview", href: "https://opentelemetry.io/docs/concepts/", meta: "Docs" },
        { id: "mlops-prom-grafana", label: "Prometheus + Grafana for ML serving", href: "https://prometheus.io/docs/practices/instrumentation/", meta: "Docs" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-trace", label: "Trace propagation through inference (request → features → model → response)", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What's the model-specific overlay on top of standard observability?",
      "How do you correlate a slow request to a specific model version?",
      "Walk me through a dashboard you'd actually use in an incident.",
    ],
    references: [],
  },
  {
    day: 65, title: "Incident response & rollback", pillar: "mlops",
    focus: "Run a model incident the way SRE runs a service incident.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-postmortem", label: "Google SRE: blameless postmortems", href: "https://sre.google/sre-book/postmortem-culture/", meta: "Read" },
        { id: "mlops-incident-ml", label: "ML-specific incident patterns", href: "https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/", meta: "Read" },
      ]},
      { label: "Design exercise", items: [
        { id: "mlops-pm-template", label: "Write a 1-page postmortem template for an ML incident", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "What's the difference between a fix-forward and a rollback decision?",
      "Walk me through your first 10 minutes of a model regression incident.",
      "How do you make sure a postmortem actually changes behavior?",
    ],
    references: [],
  },
  {
    day: 66, title: "Cost & capacity planning", pillar: "mlops",
    focus: "Per-request cost decomposition + small-first cascade routing.",
    tracks: [
      { label: "Read", items: [
        { id: "mlops-llm-cost", label: "Reducing LLM cost: caching, routing, batching", href: "https://blog.langchain.dev/reducing-the-cost-of-llm-applications/", meta: "Read" },
        { id: "mlops-gpu-util", label: "GPU utilization + batch sizing", href: "https://www.databricks.com/blog/optimize-gpu-utilization-llm-inference", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through cost decomposition for a single LLM request.",
      "When does a small-first cascade beat a single large model?",
      "How do you make a cost dashboard actionable for product teams?",
    ],
    references: [],
    questionIds: ["architect-cost-optimization"],
  },
  {
    day: 67, title: "LLMOps specifics", pillar: "generative-ai",
    focus: "Prompt versioning, model routing, regression gating.",
    tracks: [
      { label: "Read", items: [
        { id: "llmops-versioning", label: "Versioning prompts + models + retrieval together", href: "https://huyenchip.com/2024/07/25/genai-platform.html", meta: "Read" },
        { id: "llmops-routing", label: "Model routing by uncertainty / cost / risk", href: "https://eugeneyan.com/writing/llm-patterns/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Why version prompt + model + retrieval as one artifact?",
      "How do you decide a request goes to GPT-4o vs a smaller model?",
      "What's a release-time regression gate look like for an LLM feature?",
    ],
    references: [REF_OAI_DOCS],
  },
  {
    day: 68, title: "Multi-tenant ML systems", pillar: "ml-system-design",
    focus: "Compute / data / policy isolation by risk tier.",
    tracks: [
      { label: "Read", items: [
        { id: "mt-isolation", label: "Multi-tenant SaaS isolation patterns", href: "https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/", meta: "Read" },
        { id: "mt-cost-attr", label: "Cost attribution across tenants", href: "https://www.kubecost.com/blog/multi-tenancy/", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Compute / data / policy isolation — when does each level apply?",
      "How do you do per-tenant quotas without starving small tenants?",
      "What's the simplest audit log that catches cross-tenant leakage?",
    ],
    references: [],
    questionIds: ["architect-multi-tenant-isolation"],
  },
  {
    day: 69, title: "Privacy + compliance", pillar: "mlops",
    focus: "Bake privacy in, not after.",
    tracks: [
      { label: "Read", items: [
        { id: "priv-min", label: "Data minimization & retention windows (GDPR)", href: "https://gdpr.eu/data-minimization/", meta: "Read" },
        { id: "priv-dp", label: "Differential privacy in ML — quick intro", href: "https://github.com/google/differential-privacy", meta: "Reference" },
      ]},
    ],
    interviewQuestions: [
      "How do you minimize PII flow through an ML pipeline?",
      "When is differential privacy worth the accuracy cost?",
      "What goes into an audit log for inference?",
    ],
    references: [],
  },
  {
    day: 70, title: "Build vs buy + migration planning", pillar: "ml-system-design",
    focus: "Vector stores, feature platforms, eval tooling — when each.",
    tracks: [
      { label: "Read", items: [
        { id: "bvb-framework", label: "Build vs buy framework", href: "https://martinfowler.com/articles/build-or-buy.html", meta: "Read" },
        { id: "mig-zero-down", label: "Zero-downtime migration patterns (Stripe)", href: "https://stripe.com/blog/online-migrations", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "Frame a build-vs-buy answer as a reversible decision with explicit triggers.",
      "Walk me through a zero-downtime migration with shadow + parity + ramp.",
      "What's the rollback trigger you'd commit to for the migration?",
    ],
    references: [],
    questionIds: ["architect-build-vs-buy", "architect-migration-plan"],
  },
  {
    day: 71, title: "ML infra design mock", pillar: "ml-system-design",
    focus: "60-minute infra-flavored design round.",
    tracks: [
      { label: "Mock", items: [
        { id: "infra-mock-pick", label: "Pick a serving + monitoring + retraining prompt", meta: "Pick" },
        { id: "infra-mock-run", label: "60-min mock", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Defend latency budgets, scaling, fallback paths.",
      "Trade-off close: which axis would you protect hardest?",
      "What's your incident playbook for this system?",
    ],
    references: [],
  },
  {
    day: 72, title: "OOP fundamentals + design patterns", pillar: "foundations",
    focus: "Classes, inheritance, polymorphism + Singleton / Factory / Observer / Strategy.",
    tracks: [
      { label: "Read", items: [
        { id: "oop-solid", label: "SOLID principles — short reference", href: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design", meta: "Read" },
        { id: "oop-patterns", label: "Refactoring.guru — design patterns catalog", href: "https://refactoring.guru/design-patterns", meta: "Reference" },
      ]},
      { label: "Practice", items: [
        { id: "oop-impl-singleton", label: "Implement Singleton + Factory in your language", meta: "Code" },
        { id: "oop-impl-observer", label: "Implement Observer + Strategy", meta: "Code" },
      ]},
    ],
    interviewQuestions: [
      "Explain Liskov Substitution and Single Responsibility in 30 seconds each.",
      "When does Factory beat direct construction?",
      "Where would Observer fit in an ML system?",
    ],
    references: [],
  },
  {
    day: 73, title: "Concurrency basics", pillar: "foundations",
    focus: "Threads, locks, async — what each is for.",
    tracks: [
      { label: "Read", items: [
        { id: "conc-gil", label: "Python GIL: threading vs asyncio vs multiprocessing", href: "https://realpython.com/python-gil/", meta: "Read" },
        { id: "conc-pat", label: "Producer / consumer pattern", href: "https://en.wikipedia.org/wiki/Producer-consumer_problem", meta: "Read" },
      ]},
      { label: "Practice", items: [
        { id: "conc-impl-pc", label: "Implement bounded producer/consumer with a queue + lock", meta: "Code" },
      ]},
    ],
    interviewQuestions: [
      "When does asyncio beat threading in Python? When does it lose?",
      "Why is GIL not a problem for ML training but is one for ML serving?",
      "Walk through a deadlock scenario you'd avoid.",
    ],
    references: [],
  },
  {
    day: 74, title: "OOP design problems", pillar: "foundations",
    focus: "Walk an OOP design problem end to end (Parking Lot, Cache, Rate Limiter).",
    tracks: [
      { label: "Practice · Out loud", items: [
        { id: "oop-parking", label: "Design Parking Lot — classes, methods, edge cases, scale-up", meta: "Whiteboard" },
        { id: "oop-cache", label: "Design Cache (LRU + TTL)", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through requirements → classes → methods for a parking lot.",
      "How would you extend your cache to be thread-safe?",
      "What's the right way to handle concurrent updates to the LRU?",
    ],
    references: [],
  },
  {
    day: 75, title: "AI-assisted coding round practice", pillar: "foundations",
    focus: "Practice the new AI-pair-programming round style.",
    tracks: [
      { label: "Practice", items: [
        { id: "ai-pair-pick", label: "Pick a medium-hard problem you haven't seen", meta: "Pick" },
        { id: "ai-pair-do", label: "Solve with AI assistance (Cursor / Copilot / chat); narrate your decisions", meta: "Code" },
        { id: "ai-pair-reflect", label: "Reflect: where did you over-trust the AI? Where did you correctly override?", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "When did the AI suggestion match what you'd have written?",
      "Where did you override it and why?",
      "How would you describe your AI workflow to an interviewer in 60 seconds?",
    ],
    references: [REF_YUAN_MENG_HURRY],
  },
  {
    day: 76, title: "Company-tag drilling — target #1", pillar: "foundations",
    focus: "5-7 problems from your highest-priority company tag.",
    tracks: [
      { label: "Practice", items: [
        { id: "tag1-1", label: "Solve 5-7 from your top company's LC tag", href: "https://leetcode.com/problemset/", meta: "Practice" },
        { id: "tag1-notes", label: "After each, write the 'pattern + trick' in 1 line", meta: "Notes" },
      ]},
    ],
    interviewQuestions: [
      "What pattern recurs in this company's questions?",
      "What tricks come up that don't come up elsewhere?",
    ],
    references: [REF_YUAN_MENG_HURRY],
  },
  {
    day: 77, title: "Company-tag drilling — target #2", pillar: "foundations",
    focus: "Switch to second company; compare styles.",
    tracks: [
      { label: "Practice", items: [
        { id: "tag2-1", label: "Solve 5-7 from a second company's tag", href: "https://leetcode.com/problemset/", meta: "Practice" },
        { id: "tag2-compare", label: "Compare: how does this company's style differ?", meta: "Notes" },
      ]},
    ],
    interviewQuestions: [
      "What patterns are common to both companies — drill those first.",
      "Which tag was harder, and why?",
    ],
    references: [],
  },
  {
    day: 78, title: "ML model design mock", pillar: "ml-system-design",
    focus: "60-min full case from cold-start to monitoring.",
    tracks: [
      { label: "Mock", items: [
        { id: "model-mock-pick", label: "Pick a fresh case study", href: "/case-studies", meta: "Pick" },
        { id: "model-mock-run", label: "60-min mock", meta: "Mock" },
        { id: "model-mock-score", label: "Trade-off close: name the one trade-off you'd defend hardest", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "What's the one trade-off you'd defend hardest?",
      "Where did you wave hands?",
      "What's your residual risk monitoring plan?",
    ],
    references: [],
  },
  {
    day: 79, title: "Catch-up + DSA hard practice", pillar: "foundations",
    focus: "Tackle 2 LC Hards from your weakest category.",
    tracks: [
      { label: "Practice", items: [
        { id: "hard-1", label: "Pick 1 Hard from your weakest pattern; spend up to 60 min", meta: "Mock" },
        { id: "hard-2", label: "Pick another Hard from a different weak pattern", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "What stalled you?",
      "What's the simplification you'd verbalize next time?",
    ],
    references: [],
  },
  {
    day: 80, title: "Behavioral · Resume rewrite", pillar: "behavioral-storytelling",
    focus: "Quantify outcomes; lead with the decision you owned.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-resume", label: "Rewrite each bullet as 'I decided X under Y constraints; result was Z'", meta: "Doc" },
        { id: "beh-resume-cut", label: "Cut anything you can't defend in 60 seconds", meta: "Doc" },
        { id: "beh-resume-verify", label: "Verify every metric you cite — interviewers will ask", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "What's the decision behind each top-line bullet?",
      "Which bullet would you remove if asked to cut to 5?",
    ],
    references: [REF_YUAN_MENG_HURRY],
  },
  {
    day: 81, title: "Behavioral · Career story", pillar: "behavioral-storytelling",
    focus: "3-minute version that lands the arc.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-career-3m", label: "Write the 3-minute version: what got you in, the pivots, what you want next", meta: "Doc" },
        { id: "beh-career-mock", label: "Practice with a peer; ask for the part that felt slow", meta: "Mock" },
        { id: "beh-career-trim", label: "Tighten until it lands in under 4 minutes", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "Why ML, why now, why this team?",
      "Tell me about your most recent decision to switch focus.",
    ],
    references: [],
  },
  {
    day: 82, title: "Behavioral · Most complex project deep dive", pillar: "behavioral-storytelling",
    focus: "Be ready for follow-ups two layers deep.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-proj-brief", label: "Write a one-page brief: problem, decision, alternatives, outcome, what you'd change", meta: "Doc" },
        { id: "beh-proj-followups", label: "Anticipate 3 follow-ups: technical, organizational, hindsight", meta: "Doc" },
        { id: "beh-proj-time", label: "Practice the 90-second + the 5-minute versions", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "What was the riskiest decision you made in this project?",
      "What would you change if you ran it again?",
      "How did you measure success — and was that the right metric?",
    ],
    references: [REF_YUAN_MENG_HURRY],
    topicId: "project-storytelling",
  },
  {
    day: 83, title: "Behavioral · Ownership / failure story", pillar: "behavioral-storytelling",
    focus: "Show learning without minimizing impact.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-fail-star", label: "Write one failure story in STAR format", meta: "Doc" },
        { id: "beh-fail-action", label: "Make sure the corrective action is concrete (process / metric / system)", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "Tell me about a project where your model failed after deployment.",
      "What process changed because of this?",
      "What would you do earlier next time?",
    ],
    references: [],
    topicId: "behavioral-ownership",
    questionIds: ["story-failure"],
  },
  {
    day: 84, title: "Behavioral · Conflict / disagreement story", pillar: "behavioral-storytelling",
    focus: "Demonstrate disagreement without making the other side look bad.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-conflict", label: "Pick a real disagreement (technical or cross-functional)", meta: "Doc" },
        { id: "beh-conflict-frame", label: "Frame as 'we wanted different things, here's how we aligned'", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "Tell me about a time you disagreed with your manager.",
      "How do you decide when to escalate vs let it go?",
    ],
    references: [],
  },
  {
    day: 85, title: "Behavioral · Leadership / influence story", pillar: "behavioral-storytelling",
    focus: "Cross-team alignment without inflating your title.",
    tracks: [
      { label: "Practice", items: [
        { id: "beh-lead", label: "Pick a moment you influenced a decision outside your reporting line", meta: "Doc" },
        { id: "beh-lead-rfc", label: "Show the framing / RFC / data you used", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through a time you influenced a decision outside your team.",
      "What's an RFC you've written that changed direction?",
    ],
    references: [],
  },
  {
    day: 86, title: "Behavioral · Company-specific prep", pillar: "behavioral-storytelling",
    focus: "Tailor stories to each target company's value rubric.",
    tracks: [
      { label: "Research", items: [
        { id: "beh-company-read", label: "Read recent posts / blog / RFCs from your top companies", meta: "Read" },
        { id: "beh-company-map", label: "Map your existing stories to their stated values", meta: "Doc" },
        { id: "beh-company-q", label: "Prepare 2 questions per round per interviewer", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "Why this company, specifically?",
      "What's your strongest value-match story for this company?",
    ],
    references: [],
  },
  {
    day: 87, title: "Coding mock — Meta style", pillar: "foundations",
    focus: "Fast classic mediums; you must finish without stalling.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-meta-1", label: "Solve 2 fresh mediums in under 22 minutes each", meta: "Timed" },
        { id: "mock-meta-talk", label: "Verbalize trade-offs continuously", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "Why this approach over alternatives?",
      "What's your test plan?",
      "How would you scale this if input is 10x?",
    ],
    references: [],
  },
  {
    day: 88, title: "Coding mock — Google style", pillar: "foundations",
    focus: "Hard LC: graph or DP, with elegant simplification.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-google-1", label: "Pick a Hard from your weak pattern", meta: "Pick" },
        { id: "mock-google-design", label: "Spend 5 minutes designing before coding", meta: "Concept" },
        { id: "mock-google-iterate", label: "If you stall, talk through alternatives — Google rewards reasoning", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through your design before any code.",
      "What invariant does your solution preserve?",
      "What's a slower-but-clearer alternative?",
    ],
    references: [],
  },
  {
    day: 89, title: "Coding mock — OpenAI / OOP style", pillar: "foundations",
    focus: "Object-modeling design problem under interview pressure.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-oai-pick", label: "Pick an OOP design problem (Cache, Queue, Rate Limiter)", meta: "Pick" },
        { id: "mock-oai-walk", label: "Walk requirements → classes → methods → extension question", meta: "Whiteboard" },
        { id: "mock-oai-prep", label: "Be ready for a non-standard behavior round + project presentation", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "What classes would you need? What's the interface for each?",
      "How would you extend this to be distributed?",
      "What test cases would you write first?",
    ],
    references: [REF_YUAN_MENG_HURRY],
  },
  {
    day: 90, title: "ML model design mock — full case", pillar: "ml-system-design",
    focus: "60-min full case round, scored honestly.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-model-pick", label: "Pick a fresh case study you haven't drilled in this round", href: "/case-studies", meta: "Pick" },
        { id: "mock-model-run", label: "Use the framework start to finish in 60 min", meta: "Mock" },
        { id: "mock-model-score", label: "Trade-off close: name the one trade-off you'd defend hardest", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "What's your one-sentence framing of the problem?",
      "What's the metric you'd put on the team's wall?",
      "What would you cut from this design if you only had 4 weeks to ship?",
    ],
    references: [],
  },
  {
    day: 91, title: "ML infra design mock — full case", pillar: "ml-system-design",
    focus: "60-min infra-flavored design (serving + monitoring + retraining).",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-infra-prompt", label: "Use a prompt focused on serving / scale / cost", meta: "Pick" },
        { id: "mock-infra-run", label: "60-min mock with a peer or solo", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Defend latency budgets, scaling, fallback paths.",
      "What's your incident playbook for this system?",
    ],
    references: [REF_YUAN_MENG_HURRY],
  },
  {
    day: 92, title: "GenAI / RAG design mock", pillar: "generative-ai",
    focus: "Architecture round with evals + guardrails included.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-genai-pick", label: "Pick an enterprise GenAI prompt", meta: "Pick" },
        { id: "mock-genai-run", label: "60-min mock", meta: "Mock" },
        { id: "mock-genai-cover", label: "Cover RAG, evals, cost, safety — end to end", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "What's your faithfulness eval design?",
      "How do you cap cost per request?",
      "What's the rollback trigger?",
    ],
    references: [REF_LANGCHAIN_RAG],
  },
  {
    day: 93, title: "Behavioral mock — 6 prompts back to back", pillar: "behavioral-storytelling",
    focus: "Behavioral stamina + opener variations.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-beh-6", label: "Run 6 behavioral prompts in 45 min, recorded", meta: "Mock" },
        { id: "mock-beh-review", label: "Watch back; trim filler; sharpen openers", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "Tell me about a time you owned an ambiguous problem.",
      "Tell me about a time you disagreed with data.",
      "Tell me about a project that didn't ship.",
    ],
    references: [],
  },
  {
    day: 94, title: "Cross-pillar weak-area repair (round 1)", pillar: "foundations",
    focus: "Spend the full session on the gap list, nothing else.",
    tracks: [
      { label: "Practice", items: [
        { id: "gap-pick", label: "Pick 3 weakest prompts from your gap list", meta: "Pick" },
        { id: "gap-redo", label: "Re-answer cold, then revisit notes", meta: "Mock" },
        { id: "gap-confirm", label: "Confirm they leave the gap list", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "What pattern is still slowest for you?",
      "Which ML topic do you avoid in mocks?",
    ],
    references: [],
  },
  {
    day: 95, title: "End-to-end design rehearsal", pillar: "ml-system-design",
    focus: "One unfamiliar design prompt, performed cleanly.",
    tracks: [
      { label: "Mock", items: [
        { id: "rehearse-pick", label: "Use a prompt you haven't drilled", meta: "Pick" },
        { id: "rehearse-run", label: "Frame, design, trade off in 60 minutes", meta: "Mock" },
        { id: "rehearse-peer", label: "Have a peer score against signals", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "What's your trade-off close?",
      "Where did you wave hands?",
      "What's your residual risk plan?",
    ],
    references: [],
  },
  {
    day: 96, title: "Story rehearsal & timing", pillar: "behavioral-storytelling",
    focus: "Time every story, kill filler, sharpen openers.",
    tracks: [
      { label: "Practice", items: [
        { id: "story-trim", label: "Trim each story to 2-4 minutes", meta: "Doc" },
        { id: "story-decision", label: "Lead with the decision, not setup", meta: "Concept" },
        { id: "story-openers", label: "Drill 3 opener variations per story", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Walk me through your shortest story.",
      "What's the strongest version of your failure story?",
    ],
    references: [],
  },
  {
    day: 97, title: "Coding mock — fresh medium under 25 min", pillar: "foundations",
    focus: "Speed, not novelty.",
    tracks: [
      { label: "Mock", items: [
        { id: "mock-fast-1", label: "Solve a fresh medium in under 25 minutes", meta: "Timed" },
        { id: "mock-fast-2", label: "Repeat with a different pattern", meta: "Timed" },
      ]},
    ],
    interviewQuestions: [
      "What slowed you down?",
      "Which step were you over-thinking?",
    ],
    references: [],
  },
  {
    day: 98, title: "Cross-pillar weak-area repair (round 2)", pillar: "foundations",
    focus: "Tighten the gap list one more pass.",
    tracks: [
      { label: "Practice", items: [
        { id: "gap2-1", label: "Re-attempt 2 weakest concept prompts cold", meta: "Mock" },
        { id: "gap2-2", label: "Re-attempt 2 weakest LC patterns", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "What's left on the gap list?",
      "What's the cheapest move that closes it?",
    ],
    references: [],
  },
  {
    day: 99, title: "Read deeply: 1 paper + 1 case", pillar: "ml-system-design",
    focus: "Build context for follow-up questions you might get.",
    tracks: [
      { label: "Read", items: [
        { id: "deep-paper", label: "Pick 1 paper relevant to your target team's work; skim", meta: "Read" },
        { id: "deep-case", label: "Re-read 1 case study and write 5 follow-up questions you'd expect", href: "/case-studies", meta: "Read" },
      ]},
    ],
    interviewQuestions: [
      "What does this paper get right?",
      "What's a critique you could voice?",
    ],
    references: [],
  },
  {
    day: 100, title: "Mock sprint — DSA Hard + ML design", pillar: "foundations",
    focus: "60 min DSA Hard then 60 min ML design back to back.",
    tracks: [
      { label: "Mock", items: [
        { id: "sprint-hard", label: "DSA Hard, 60 min", meta: "Timed" },
        { id: "sprint-design", label: "ML design, 60 min", meta: "Mock" },
        { id: "sprint-review", label: "Capture residual gaps for tomorrow", meta: "Review" },
      ]},
    ],
    interviewQuestions: [
      "Where did fatigue cost you?",
      "Did the design quality drop after the coding round?",
    ],
    references: [],
  },
  {
    day: 101, title: "Mock sprint — GenAI design + behavioral", pillar: "generative-ai",
    focus: "60 min GenAI design then 30 min behavioral.",
    tracks: [
      { label: "Mock", items: [
        { id: "sprint-genai", label: "GenAI design, 60 min", meta: "Mock" },
        { id: "sprint-beh", label: "Behavioral, 30 min, 5 prompts", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Did the behavioral feel rote after the design round?",
      "Where can you tighten?",
    ],
    references: [],
  },
  {
    day: 102, title: "Cost / latency / quality cascade — mini design", pillar: "ml-system-design",
    focus: "Drill the cascade trade-off until it's automatic.",
    tracks: [
      { label: "Practice", items: [
        { id: "cascade-pick", label: "Pick a system where cascading would help; sketch it", meta: "Whiteboard" },
        { id: "cascade-num", label: "Estimate cost / quality across 3 tiers", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "When does a cascade hurt instead of help?",
      "How do you keep the cascade from drifting silently?",
    ],
    references: [],
    questionIds: ["architect-cost-optimization"],
  },
  {
    day: 103, title: "Read & rehearse: monitoring playbooks", pillar: "mlops",
    focus: "Make 'what would you alert on' an automatic answer.",
    tracks: [
      { label: "Read", items: [
        { id: "monit-yan", label: "Practical guide to maintaining ML (Eugene Yan)", href: "https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/", meta: "Read" },
      ]},
      { label: "Practice", items: [
        { id: "monit-write", label: "Write a 1-page monitoring playbook for one of your case studies", meta: "Doc" },
      ]},
    ],
    interviewQuestions: [
      "What's the alert that maps directly to a known action?",
      "How do you avoid alert fatigue?",
    ],
    references: [],
  },
  {
    day: 104, title: "Project deep dive practice — recorded", pillar: "behavioral-storytelling",
    focus: "Record yourself, watch back, kill filler.",
    tracks: [
      { label: "Practice", items: [
        { id: "rec-proj", label: "Record the 5-minute project deep dive", meta: "Mock" },
        { id: "rec-review", label: "Watch back; mark every filler word", meta: "Review" },
        { id: "rec-redo", label: "Re-record without the filler", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "What's the riskiest decision you made?",
      "What would you change?",
    ],
    references: [],
  },
  {
    day: 105, title: "Mid-funnel rest day (light review)", pillar: "behavioral-storytelling",
    focus: "Don't add new content. Recovery compounds.",
    tracks: [
      { label: "Light review", items: [
        { id: "rest-resume", label: "Skim your resume and 1-page project brief", meta: "Read" },
        { id: "rest-walk", label: "Do something physical — walk, run, gym", meta: "Recovery" },
        { id: "rest-sleep", label: "Sleep 8+ hours tonight", meta: "Recovery" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 106, title: "Cross-loop simulation: morning coding + afternoon design", pillar: "foundations",
    focus: "Simulate a real onsite cadence.",
    tracks: [
      { label: "Mock", items: [
        { id: "sim-am", label: "AM: 2 coding rounds (45 min each)", meta: "Timed" },
        { id: "sim-pm", label: "PM: 1 model design + 1 infra design (60 min each)", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Where did stamina fail?",
      "What would you eat / drink to fix it?",
    ],
    references: [],
  },
  {
    day: 107, title: "Cross-loop simulation: behavioral + GenAI", pillar: "generative-ai",
    focus: "Simulate the second half of an onsite.",
    tracks: [
      { label: "Mock", items: [
        { id: "sim2-beh", label: "AM: 1 behavioral round (45 min, 5 prompts)", meta: "Mock" },
        { id: "sim2-genai", label: "PM: 1 GenAI design + 1 trade-off discussion", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "What story did you over-explain?",
      "Where did the GenAI design feel formulaic?",
    ],
    references: [],
  },
  {
    day: 108, title: "Final weak-area repair", pillar: "foundations",
    focus: "Last pass on the gap list.",
    tracks: [
      { label: "Practice", items: [
        { id: "final-gap-1", label: "Pick the single weakest item; spend 60 min", meta: "Mock" },
        { id: "final-gap-2", label: "Pick the second weakest; spend 30 min", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Is the gap list short enough to walk in?",
    ],
    references: [],
  },
  {
    day: 109, title: "Story polishing — final pass", pillar: "behavioral-storytelling",
    focus: "Land every story without notes.",
    tracks: [
      { label: "Practice", items: [
        { id: "polish-3", label: "Run through 3 stories cold; time each", meta: "Mock" },
        { id: "polish-followup", label: "Practice the 3 most likely follow-ups for each", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Which story still needs work?",
    ],
    references: [],
  },
  {
    day: 110, title: "Final design rehearsal — fresh prompt", pillar: "ml-system-design",
    focus: "One last cold design.",
    tracks: [
      { label: "Mock", items: [
        { id: "final-design-pick", label: "Pick a prompt you haven't seen this whole round", meta: "Pick" },
        { id: "final-design-run", label: "60-min mock", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [
      "Was the framework muscle memory or did you have to think about it?",
      "Where would a senior interviewer push you next?",
    ],
    references: [],
  },
  {
    day: 111, title: "Taper: light review only", pillar: "behavioral-storytelling",
    focus: "No new material. Skim what's already strong.",
    tracks: [
      { label: "Light review", items: [
        { id: "taper-resume", label: "Re-read resume + 1-page project brief", meta: "Read" },
        { id: "taper-tradeoffs", label: "Skim the trade-off playbook once", meta: "Read" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 112, title: "Taper: 1 light coding mock + walk", pillar: "foundations",
    focus: "Stay sharp without burning out.",
    tracks: [
      { label: "Light", items: [
        { id: "taper-mock", label: "1 medium LC, 25 min, no Hard", meta: "Timed" },
        { id: "taper-walk", label: "Walk 30 min — let it absorb", meta: "Recovery" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 113, title: "Taper: 1 design rehearsal — favorite case", pillar: "ml-system-design",
    focus: "Run a familiar case to stay in flow.",
    tracks: [
      { label: "Light", items: [
        { id: "taper-fav", label: "Pick a case you know well; run it cleanly in 45 min", meta: "Mock" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 114, title: "Taper: behavioral skim + sleep", pillar: "behavioral-storytelling",
    focus: "Read your stories once. Sleep early.",
    tracks: [
      { label: "Light", items: [
        { id: "taper-beh-read", label: "Read each story once. No re-recording.", meta: "Read" },
        { id: "taper-sleep", label: "Sleep 8+ hours", meta: "Recovery" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 115, title: "Logistics + setup", pillar: "behavioral-storytelling",
    focus: "Set up the week-of-interview the way athletes taper.",
    tracks: [
      { label: "Logistics", items: [
        { id: "log-cal", label: "Calendar holds for sleep + meals + walks", meta: "Setup" },
        { id: "log-tools", label: "Verify hardware: webcam, mic, charger, IDE setup", meta: "Setup" },
        { id: "log-mental", label: "One mental rehearsal of the worst case", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 116, title: "Light: 5 quick LC easy + skim resume", pillar: "foundations",
    focus: "Warm up without strain.",
    tracks: [
      { label: "Light", items: [
        { id: "warm-easy", label: "5 LC Easy, no time pressure", meta: "Practice" },
        { id: "warm-resume", label: "Skim resume. Memorize bullet decisions.", meta: "Read" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 117, title: "Light: 1 short design + behavioral skim", pillar: "ml-system-design",
    focus: "Stay loose.",
    tracks: [
      { label: "Light", items: [
        { id: "light-design-30", label: "30-min design rehearsal — your strongest case", meta: "Mock" },
        { id: "light-beh-skim", label: "Read each story silently", meta: "Read" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 118, title: "Off day — full rest", pillar: "behavioral-storytelling",
    focus: "No prep. Full reset.",
    tracks: [
      { label: "Off", items: [
        { id: "off-fun", label: "Do something fun — not interview-related", meta: "Recovery" },
        { id: "off-sleep", label: "Sleep 8+ hours", meta: "Recovery" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 119, title: "Final glance: framework + trade-offs + 1 story", pillar: "ml-system-design",
    focus: "5-minute scan of the framework + 5-minute scan of trade-offs + 1 story.",
    tracks: [
      { label: "5-min reads", items: [
        { id: "scan-frame", label: "Scan the design framework once", meta: "Read" },
        { id: "scan-trade", label: "Scan the 6 trade-offs once", meta: "Read" },
        { id: "scan-story", label: "Run through your strongest story silently", meta: "Read" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },
  {
    day: 120, title: "Walk in — trust the prep", pillar: "behavioral-storytelling",
    focus: "Don't add new content. Listen, breathe, perform.",
    tracks: [
      { label: "Day-of", items: [
        { id: "go-water", label: "Hydrate, eat something, do not over-caffeinate", meta: "Day-of" },
        { id: "go-listen", label: "Listen first; clarify before designing", meta: "Concept" },
        { id: "go-trust", label: "Trust the prep — the gap list is short enough", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [],
    references: [],
  },

  // ───── PHASE 5: Optional specialization days (121-126) ─────
  // Pick the subdomains you'll be tested on. Even one in-depth day per
  // domain dramatically raises the floor on a domain-specific round.
  {
    day: 121, title: "Specialization · Computer Vision (deep dive)", pillar: "deep-learning",
    focus: "CV-specific architectures, augmentation, OD/segmentation, modern foundation models.",
    tracks: [
      { label: "Read · Architectures", items: [
        { id: "cv-cnn-fams", label: "CNN families: ResNet → EfficientNet → ConvNeXt", href: "https://paperswithcode.com/area/computer-vision", meta: "Read" },
        { id: "cv-vit", label: "Vision Transformer (ViT) paper", href: "https://arxiv.org/abs/2010.11929", meta: "Paper" },
        { id: "cv-clip", label: "CLIP — image-text contrastive pretraining", href: "https://arxiv.org/abs/2103.00020", meta: "Paper" },
      ]},
      { label: "Read · Tasks", items: [
        { id: "cv-od", label: "Object detection: YOLO / DETR / SAM", href: "https://lilianweng.github.io/posts/2017-12-31-object-recognition-part-3/", meta: "Read" },
        { id: "cv-aug", label: "Image augmentation patterns (RandAugment, CutMix, MixUp)", href: "https://albumentations.ai/", meta: "Docs" },
      ]},
      { label: "Practice", items: [
        { id: "cv-design", label: "Design a content-moderation system for user-uploaded images", meta: "Whiteboard" },
        { id: "cv-finetune", label: "Fine-tune CLIP / ResNet on a small custom dataset", href: "https://huggingface.co/docs/transformers/training", meta: "Build" },
      ]},
    ],
    interviewQuestions: [
      "When does a ViT beat a CNN, and when doesn't it?",
      "How does CLIP enable zero-shot image classification?",
      "Walk me through how you'd build an image moderation system end-to-end.",
      "What augmentation strategy would you pick for a small medical-imaging dataset?",
    ],
    references: [REF_PAPERS_WITH_CODE, REF_FAST_AI, REF_D2L, REF_GOOGLE_AI_BLOG],
  },
  {
    day: 122, title: "Specialization · NLP / NLU (deep dive)", pillar: "generative-ai",
    focus: "Tokenization, encoder vs decoder vs encoder-decoder, NER, classification, summarization.",
    tracks: [
      { label: "Read · Architectures", items: [
        { id: "nlp-bert", label: "BERT (encoder) — masked LM", href: "https://arxiv.org/abs/1810.04805", meta: "Paper" },
        { id: "nlp-t5", label: "T5 (encoder-decoder) — text-to-text", href: "https://arxiv.org/abs/1910.10683", meta: "Paper" },
        { id: "nlp-gpt", label: "GPT family (decoder) — autoregressive", href: "https://lilianweng.github.io/posts/2018-06-24-attention/", meta: "Read" },
      ]},
      { label: "Read · Tasks", items: [
        { id: "nlp-ner", label: "Named entity recognition (NER) tagging schemes (BIO, BILOU)", href: "https://huggingface.co/docs/transformers/tasks/token_classification", meta: "Docs" },
        { id: "nlp-summ", label: "Abstractive vs extractive summarization", href: "https://huggingface.co/docs/transformers/tasks/summarization", meta: "Docs" },
      ]},
      { label: "Practice", items: [
        { id: "nlp-design", label: "Design a multilingual customer support classifier", meta: "Whiteboard" },
        { id: "nlp-eval", label: "Pick an evaluation suite for your NLP system (BLEU / ROUGE / BERTScore / human)", href: "https://huggingface.co/docs/evaluate", meta: "Docs" },
      ]},
    ],
    interviewQuestions: [
      "Encoder vs decoder vs encoder-decoder — when do you pick each?",
      "How do transformers handle different modalities (text → image → audio)?",
      "Walk me through how you'd evaluate a summarization system.",
      "Why is tokenization the most common cause of multilingual NLP bugs?",
    ],
    references: [REF_HF_LLM, REF_ILLUSTRATED_TRANSFORMER, REF_PAPERS_WITH_CODE],
  },
  {
    day: 123, title: "Specialization · Speech & Audio (deep dive)", pillar: "deep-learning",
    focus: "ASR, TTS, audio embeddings, streaming inference.",
    tracks: [
      { label: "Read · Architectures", items: [
        { id: "speech-whisper", label: "Whisper paper — ASR with weak supervision", href: "https://arxiv.org/abs/2212.04356", meta: "Paper" },
        { id: "speech-wav2vec", label: "wav2vec 2.0 — self-supervised audio representations", href: "https://arxiv.org/abs/2006.11477", meta: "Paper" },
        { id: "speech-tts", label: "Modern TTS: VITS / Tortoise / ElevenLabs overview", href: "https://github.com/jaywalnut310/vits", meta: "Repo" },
      ]},
      { label: "Read · Audio basics", items: [
        { id: "speech-mel", label: "Mel spectrograms + MFCC features", href: "https://librosa.org/doc/latest/feature.html", meta: "Docs" },
        { id: "speech-stream", label: "Streaming ASR — chunking + endpointing", href: "https://nvidia.github.io/NeMo/blogs/streaming.html", meta: "Read" },
      ]},
      { label: "Practice", items: [
        { id: "speech-design", label: "Design a real-time meeting transcription + summarization system", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "How does Whisper handle multiple languages without a language ID input?",
      "What's the latency-vs-quality trade-off for streaming ASR vs full-utterance ASR?",
      "Walk me through your end-to-end real-time transcription system.",
      "When do you use mel spectrograms vs raw audio inputs?",
    ],
    references: [REF_PAPERS_WITH_CODE, REF_HF_LLM],
  },
  {
    day: 124, title: "Specialization · Reinforcement Learning (deep dive)", pillar: "deep-learning",
    focus: "MDP basics, value vs policy methods, exploration-exploitation, RLHF.",
    tracks: [
      { label: "Read · Foundations", items: [
        { id: "rl-mdp", label: "MDPs, value functions, policy iteration", href: "http://incompleteideas.net/book/the-book-2nd.html", meta: "Book" },
        { id: "rl-q-learning", label: "Q-learning + DQN intuition", href: "https://lilianweng.github.io/posts/2018-04-08-policy-gradient/", meta: "Read" },
        { id: "rl-policy-grad", label: "Policy gradient (REINFORCE → PPO)", href: "https://spinningup.openai.com/en/latest/algorithms/ppo.html", meta: "Docs" },
      ]},
      { label: "Read · Modern", items: [
        { id: "rl-rlhf", label: "RLHF as applied RL (PPO over LLM rewards)", href: "https://huyenchip.com/2023/05/02/rlhf.html", meta: "Read" },
        { id: "rl-bandits", label: "Multi-armed bandits: contextual bandits in production", href: "https://eugeneyan.com/writing/bandits/", meta: "Read" },
      ]},
      { label: "Practice", items: [
        { id: "rl-design", label: "Design a content-recommendation system using bandits", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "When is a contextual bandit the right model vs a full RL setup?",
      "Walk me through PPO at a high level — why is the clip ratio there?",
      "How do you handle exploration in a recommender system without hurting metrics?",
      "What's the practical difference between RLHF and DPO?",
    ],
    references: [REF_PAPERS_WITH_CODE, REF_GOOGLE_AI_BLOG],
  },
  {
    day: 125, title: "Specialization · RecSys deep dive (Ranking / Predictions)", pillar: "ml-system-design",
    focus: "Two-tower retrieval, multi-task ranking, position bias, key papers.",
    tracks: [
      { label: "Read · Canonical papers", items: [
        { id: "rs-yt-mt", label: "YouTube multi-task ranking system (canonical)", href: "https://daiwk.github.io/assets/youtube-multitask.pdf", meta: "Paper" },
        { id: "rs-pal", label: "PAL — position-bias aware learning for CTR", href: "https://dl.acm.org/doi/10.1145/3298689.3347033", meta: "Paper" },
        { id: "rs-twotower", label: "Sampling-bias-corrected two-tower (Google)", href: "https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/", meta: "Paper" },
      ]},
      { label: "Read · Patterns", items: [
        { id: "rs-yan-discovery", label: "Eugene Yan — System design for discovery", href: "https://eugeneyan.com/writing/system-design-for-discovery/", meta: "Read" },
        { id: "rs-cf-collab", label: "Two common collaborative-filtering techniques + trade-offs", href: "https://en.wikipedia.org/wiki/Collaborative_filtering", meta: "Read" },
      ]},
      { label: "Practice", items: [
        { id: "rs-design", label: "Design a 3-stage recommender for short-form video", meta: "Whiteboard" },
        { id: "rs-multitask", label: "Sketch a multi-task head (engagement + satisfaction + diversity)", meta: "Whiteboard" },
      ]},
    ],
    interviewQuestions: [
      "Compare two collaborative-filtering techniques and their strengths / weaknesses.",
      "How do you correct for position bias when training on click logs?",
      "How would a multi-task head balance watch-time vs satisfaction signals?",
      "Walk me through cold-start handling for a brand-new creator.",
    ],
    references: [REF_CHIP_HUYEN_DESIGN, REF_KHANGICH_REPO],
  },
  {
    day: 126, title: "Specialization · Distributed ML / ML Infrastructure", pillar: "mlops",
    focus: "DDP, FSDP / ZeRO, model + pipeline parallelism, gradient checkpointing, large-scale serving.",
    tracks: [
      { label: "Read · Training", items: [
        { id: "dist-ddp", label: "DistributedDataParallel (DDP) — the default", href: "https://pytorch.org/tutorials/intermediate/ddp_tutorial.html", meta: "Tutorial" },
        { id: "dist-fsdp", label: "FSDP — what it shards and why", href: "https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html", meta: "Tutorial" },
        { id: "dist-zero", label: "DeepSpeed ZeRO — the canonical staged sharding", href: "https://www.deepspeed.ai/training/", meta: "Docs" },
        { id: "dist-checkpt", label: "Gradient checkpointing — trade compute for memory", href: "https://pytorch.org/docs/stable/checkpoint.html", meta: "Docs" },
      ]},
      { label: "Read · Serving", items: [
        { id: "dist-vllm", label: "vLLM / TensorRT-LLM — high-throughput LLM serving", href: "https://docs.vllm.ai/", meta: "Docs" },
        { id: "dist-quant", label: "Quantization at serving (INT8, FP8, GPTQ)", href: "https://huggingface.co/docs/transformers/quantization", meta: "Docs" },
      ]},
      { label: "Practice", items: [
        { id: "dist-design", label: "Design infra to train a 70B-param LLM on 256 H100s", meta: "Whiteboard" },
        { id: "dist-debug", label: "Debug a slow training run: comms vs compute vs IO", meta: "Concept" },
      ]},
    ],
    interviewQuestions: [
      "When do you actually need FSDP / ZeRO vs single-node DDP?",
      "Walk me through the memory layout under ZeRO-3.",
      "Walk me through diagnosing a sudden 50% drop in training throughput.",
      "What's the highest-leverage inference-time optimization for a Transformer?",
    ],
    references: [REF_PAPERS_WITH_CODE, REF_GOOGLE_AI_BLOG],
  },
];

export function getDayPlan(day: number) {
  return dailyPlan.find((entry) => entry.day === day);
}

export function dayItemCount(plan: DayPlan) {
  return plan.tracks.reduce((sum, t) => sum + t.items.length, 0);
}

export function dayItemIds(plan: DayPlan) {
  return plan.tracks.flatMap((t) => t.items.map((i) => i.id));
}

export function getRoadmapHref(slug: RoadmapSlug) {
  const shortcutMap: Record<RoadmapSlug, string> = {
    "90-day": "/90-day-roadmap",
    "60-day": "/60-day-roadmap",
    "30-day": "/30-day-crash-plan",
    "data-scientist": "/roadmaps#data-scientist",
    "ml-engineer": "/roadmaps#ml-engineer",
    "ai-engineer": "/roadmaps#ai-engineer",
    "senior-mle": "/roadmaps#senior-mle",
    "ml-architect": "/roadmaps#ml-architect",
  };

  return shortcutMap[slug];
}
