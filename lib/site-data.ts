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
  { href: "/", label: "Home", group: "Overview" },
  { href: "/start-here", label: "Start Here", group: "Overview" },
  { href: "/roadmaps", label: "Roadmaps", group: "Plan" },
  { href: "/questions", label: "Question Bank", group: "Practice" },
  { href: "/case-studies", label: "Case Studies", group: "Practice" },
  { href: "/dashboard", label: "Dashboard", group: "Track" },
  { href: "/resources", label: "Resources", group: "Reference" },
  { href: "/blog", label: "Blog", group: "Reference" },
  { href: "/about", label: "About", group: "Reference" },
] as const;

export const navGroupOrder = ["Overview", "Plan", "Practice", "Track", "Reference"] as const;

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

export interface DayPlan {
  day: number;
  title: string;
  pillar: PillarSlug;
  focus: string;
  studyItems: string[];
  topicId?: string;
  caseStudySlug?: string;
  questionIds?: string[];
}

// Distribution inspired by Yuan Meng's "Prepare in a Hurry" guide
// (https://www.yuan-meng.com/posts/mle_interviews_2.0/), expanded across
// 90 days because DSA, ML fundamentals, and design depth simply don't fit
// in the 1-week version.
export const dailyPlan: DayPlan[] = [
  // Week 1 — LeetCode foundations: arrays, hashing, two pointers, sliding window (Days 1-7)
  { day: 1, title: "LC setup + Arrays & Hashing (part 1)", pillar: "foundations", focus: "Get your LeetCode workflow going and crank through the easiest NeetCode pattern.", studyItems: ["Set up LeetCode account, pick a target company, install NeetCode tracker", "Solve 6-8 NeetCode arrays-and-hashing problems (Two Sum, Valid Anagram, Group Anagrams, Top K Frequent)", "After each problem write a one-line note: which pattern, what tripped you up"], topicId: "python-interview-patterns" },
  { day: 2, title: "Arrays & Hashing (part 2) + Two Pointers", pillar: "foundations", focus: "Finish the NeetCode arrays bucket and start two-pointers.", studyItems: ["Finish remaining NeetCode arrays-and-hashing problems", "Solve 4-5 two-pointer problems (Valid Palindrome, 3Sum, Container With Most Water)", "Practice explaining the in-place vs extra-space trade-off out loud"] },
  { day: 3, title: "Sliding Window", pillar: "foundations", focus: "Drill the sliding-window template until it's automatic.", studyItems: ["Solve all 6 NeetCode sliding-window problems (Best Time to Buy/Sell Stock, Longest Substring Without Repeating, Min Window Substring)", "Write the generic sliding-window template from memory", "Note the two failure modes: wrong shrink condition, wrong window state"] },
  { day: 4, title: "Stack problems", pillar: "foundations", focus: "Reach for a stack the moment you see balanced / monotonic patterns.", studyItems: ["Solve all 7 NeetCode stack problems (Valid Parentheses, Min Stack, Daily Temperatures, Largest Rectangle in Histogram)", "Internalize the monotonic-stack template", "Stack vs recursion: when each is the cleaner answer"] },
  { day: 5, title: "Binary Search", pillar: "foundations", focus: "Master the rotated-array and search-on-answer variants.", studyItems: ["Solve all 7 NeetCode binary-search problems (Search Rotated Sorted Array, Find Min in Rotated Sorted Array, Median of Two Sorted Arrays)", "Write the half-open and closed-interval templates and pick one to standardize on", "Practice 'binary search on the answer space' on Koko Eating Bananas"] },
  { day: 6, title: "Linked Lists", pillar: "foundations", focus: "Slow/fast pointer, in-place reversal, merge-K patterns.", studyItems: ["Solve 8-10 NeetCode linked-list problems (Reverse Linked List, Merge Two Sorted Lists, Reorder List, LRU Cache)", "Code the iterative reversal and the recursive reversal — explain both", "LRU Cache: do the full implementation including dict + doubly-linked list"] },
  { day: 7, title: "Catch-up + weak-area drill", pillar: "foundations", focus: "Re-attempt the 3 problems that took you longest this week, cold.", studyItems: ["Pick 3 problems from days 1-6 that needed hints — re-solve from scratch", "Time yourself: target 25 minutes per medium", "Update your gap list — patterns to revisit before the loop"] },

  // Week 2 — Trees, tries, heaps, backtracking (Days 8-14)
  { day: 8, title: "Trees: DFS fundamentals", pillar: "foundations", focus: "Recursive tree DFS until the templates are muscle memory.", studyItems: ["Solve 8 NeetCode tree problems (Invert Binary Tree, Max Depth, Same Tree, Subtree, Lowest Common Ancestor)", "Write inorder/preorder/postorder iteratively at least once", "Practice converting any 'process every node' problem to a single DFS skeleton"] },
  { day: 9, title: "Trees: BFS + level-order", pillar: "foundations", focus: "BFS, level-order traversal, right-side view.", studyItems: ["Solve Binary Tree Level Order, Right Side View, Zig-zag Traversal", "Decide when DFS vs BFS is the cleaner answer", "Note: when level info matters, default to BFS"] },
  { day: 10, title: "Trees: BST + validation", pillar: "foundations", focus: "BST invariants, validation, kth element.", studyItems: ["Solve Validate BST, Kth Smallest in BST, Construct Binary Tree from Preorder + Inorder", "Practice the in-order BST traversal pattern", "Word out loud why a 'check left subtree max < node' single-level check is wrong"] },
  { day: 11, title: "Tries", pillar: "foundations", focus: "Implement a trie cleanly under interview pressure.", studyItems: ["Implement Trie (Prefix Tree) from scratch", "Solve Design Add and Search Words, Word Search II", "Articulate when a trie beats a hash set (prefix queries, autocomplete)"] },
  { day: 12, title: "Heap / Priority Queue", pillar: "foundations", focus: "Top-K, merge-K, scheduling-style problems.", studyItems: ["Solve Kth Largest Element in Stream, Last Stone Weight, K Closest Points to Origin, Merge K Sorted Lists, Find Median From Data Stream", "Internalize when to use a min-heap vs max-heap (and the negate trick in Python)", "Compare heap vs sort runtime trade-offs out loud"] },
  { day: 13, title: "Backtracking", pillar: "foundations", focus: "Subsets, permutations, combination-sum, n-queens.", studyItems: ["Solve 6-8 backtracking problems (Subsets, Combination Sum, Permutations, Word Search, N-Queens)", "Write the generic backtracking template; identify state, choice, undo", "Acknowledge the exponential cost — never claim better complexity"] },
  { day: 14, title: "Mock + reflection", pillar: "foundations", focus: "One full timed mock, then a brutally honest review.", studyItems: ["Pick a fresh medium you haven't seen — solve it in 30 minutes, talking out loud the whole time", "Review the recording or your notes: where did you stall, where did you over-explain", "Promote 1-2 weak patterns into next week's catch-up day"] },

  // Week 3 — Graphs, DP, greedy (Days 15-21)
  { day: 15, title: "Graphs: DFS + BFS", pillar: "foundations", focus: "Grid traversal, connected components, flood fill.", studyItems: ["Solve Number of Islands, Clone Graph, Pacific Atlantic Water Flow, Course Schedule", "Write the visited-set boilerplate and stop forgetting it", "Identify when adjacency list vs grid is implicit"] },
  { day: 16, title: "Graphs: topo sort, Dijkstra, union-find", pillar: "foundations", focus: "The graph patterns that actually appear in interviews.", studyItems: ["Solve Course Schedule II (topological sort), Network Delay Time (Dijkstra)", "Implement union-find from scratch + Number of Connected Components", "When each algorithm fits — articulate it cold"] },
  { day: 17, title: "1-D Dynamic Programming", pillar: "foundations", focus: "House Robber, Climbing Stairs, Longest Increasing Subsequence.", studyItems: ["Solve 6-8 NeetCode 1D DP problems", "For each, derive the recurrence on paper before coding", "Memoization first, then bottom-up — show both in the answer"] },
  { day: 18, title: "2-D Dynamic Programming", pillar: "foundations", focus: "Edit distance, longest common subsequence, unique paths.", studyItems: ["Solve 5-6 NeetCode 2D DP problems (LCS, Edit Distance, Unique Paths, Coin Change II)", "Sketch the DP table by hand for a tiny example before coding", "Identify the standard 2D-DP shapes (string vs grid)"] },
  { day: 19, title: "Greedy", pillar: "foundations", focus: "Jump Game, Gas Station, Hand of Straights, classic greedy proofs.", studyItems: ["Solve 6 NeetCode greedy problems", "For each, articulate why the greedy choice is safe", "Spot the trap: greedy that looks right but isn't (always sanity-check with a tiny counter-example)"] },
  { day: 20, title: "Intervals + bit manipulation", pillar: "foundations", focus: "Insert / merge intervals, meeting-room patterns, classic bit tricks.", studyItems: ["Solve all 6 NeetCode interval problems + Number of 1 Bits / Counting Bits / Reverse Bits", "Memorize the interval-overlap one-liner", "For bit manipulation, write the tricks down once and refer back"] },
  { day: 21, title: "Coding mock + company-tag start", pillar: "foundations", focus: "One timed mock, then start your first target company's tag.", studyItems: ["45-minute timed mock on a fresh medium", "Pick your top-priority company, open its top-30 LeetCode tag, solve 3", "Note the company's flavor (Meta = fast classic mediums, Google = Hard graph/DP, OpenAI = OOP-heavy)"] },

  // Week 4 — Company tags + OOP + concurrency (Days 22-28)
  { day: 22, title: "Company tag (target #1) — day 1", pillar: "foundations", focus: "5-7 problems from your highest-priority company tag.", studyItems: ["Solve 5-7 problems from your top company's LC tag", "After each, write the 'pattern + trick' in 1 line", "Stop trying to memorize — the goal is rapid pattern recognition"] },
  { day: 23, title: "Company tag (target #1) — day 2", pillar: "foundations", focus: "Continue the tag, prioritize problems with multiple thumbs-down.", studyItems: ["5-7 more from the same tag, focusing on Medium / Hard you haven't seen", "Identify any pattern that recurs in this company's questions", "If a Hard takes >40 min, look at the editorial and re-solve later"] },
  { day: 24, title: "Company tag (target #2)", pillar: "foundations", focus: "Switch to second-priority company tag.", studyItems: ["5-7 problems from a second company's tag", "Compare: how does its style differ from target #1?", "Note any patterns common to both — those are your highest-leverage drills"] },
  { day: 25, title: "OOP fundamentals", pillar: "foundations", focus: "Classes, inheritance, polymorphism, encapsulation — at interview depth.", studyItems: ["Refresh classes, inheritance, polymorphism, abstract classes, interfaces in your language", "Read one short post on SOLID principles", "Be able to explain Liskov Substitution and Single Responsibility in 30 seconds each"] },
  { day: 26, title: "OOP design patterns", pillar: "foundations", focus: "The patterns that actually come up: Singleton, Factory, Observer, Strategy.", studyItems: ["Implement Singleton, Factory, Observer, Strategy in your language", "For each, write down one real ML/infra use case", "Skip patterns you can't motivate with a use case — interviewers can tell"] },
  { day: 27, title: "Concurrency basics", pillar: "foundations", focus: "Threads, locks, async, the producer-consumer pattern.", studyItems: ["Read one focused post on Python GIL, threading vs asyncio vs multiprocessing", "Solve 1-2 simple concurrency problems (Producer/Consumer, Bounded Buffer)", "Be ready to discuss why concurrency matters in ML serving"] },
  { day: 28, title: "OOP design problem practice", pillar: "foundations", focus: "Walk through 2 OOP design problems end to end (especially for OpenAI-style loops).", studyItems: ["Design Parking Lot — classes, methods, edge cases, scale-up question", "Design Tic-Tac-Toe or Vending Machine", "Practice talking through requirements, classes, then implementing core methods"] },

  // Week 5 — ML coding + ML fundamentals I (Days 29-35)
  { day: 29, title: "PyTorch refresher", pillar: "deep-learning", focus: "Tensors, autograd, nn.Module, training loop — be fluent again.", studyItems: ["Refresh tensors, autograd, nn.Module, DataLoader", "Write a 30-line MLP training loop from scratch", "Common gotchas: device placement, .item() vs .detach(), zero_grad()"] },
  { day: 30, title: "NumPy + ML coding setup", pillar: "foundations", focus: "Vectorized NumPy and the implementation style interviewers expect.", studyItems: ["Refresh broadcasting, vectorization, common ndarray ops", "Pick your ML coding approach: from scratch / sklearn-mimic / framework-style", "Write one simple gradient-descent loop in pure NumPy"] },
  { day: 31, title: "ML coding: linear & logistic regression from scratch", pillar: "foundations", focus: "Implement both with gradient descent, no sklearn.", studyItems: ["Code linear regression with MSE loss + GD update — fit on toy data", "Code logistic regression with binary cross-entropy", "Be ready to extend to L2 regularization in 5 minutes if asked"], topicId: "ml-from-scratch" },
  { day: 32, title: "ML coding: k-means + decision tree split", pillar: "foundations", focus: "Two more classic from-scratch implementations.", studyItems: ["Implement k-means with random init + Lloyd's algorithm", "Implement information-gain split for a single decision-tree node", "Mention initialization sensitivity (k-means++) without going down the rabbit hole"] },
  { day: 33, title: "AI-assisted coding round practice", pillar: "foundations", focus: "Practice the new AI-pair-programming style round.", studyItems: ["Pick a medium-hard problem you haven't seen", "Solve it with AI assistance (Cursor, Copilot, or chat) — narrate your decisions", "Reflect: where did you over-trust the AI, where did you correctly override it"] },
  { day: 34, title: "SQL fundamentals", pillar: "foundations", focus: "Joins, aggregations, CTEs — fast.", studyItems: ["Solve 6-8 SQL LeetCode problems (Joins, GROUP BY, HAVING, CTEs)", "Practice avoiding double-counting in event-style data", "If your loop has SQL, do company-tag SQL too"] },
  { day: 35, title: "SQL window functions", pillar: "foundations", focus: "ROW_NUMBER, LAG/LEAD, partition-by — for cohort and funnel prompts.", studyItems: ["Solve all SQL window-function LeetCode problems", "Practice the cohort-retention pattern (build cohort, join activity, define denominator)", "Avoid double-counting events vs users"], topicId: "sql-window-functions", questionIds: ["window-functions"] },

  // Week 6 — ML fundamentals II (Days 36-42)
  { day: 36, title: "Bias-variance + regularization", pillar: "traditional-ml", focus: "Diagnose under- vs over-fitting from real validation curves.", studyItems: ["Read UDL chapter on bias-variance, then close the book and explain it", "Symptoms of high bias vs high variance, with the standard remedies", "Why regularization helps and when it can't"], questionIds: ["bias-variance"] },
  { day: 37, title: "Loss functions", pillar: "traditional-ml", focus: "MSE vs MAE vs Huber; cross-entropy vs hinge; pairwise vs listwise.", studyItems: ["Walk through the gradients of MSE and cross-entropy", "When to pick MAE / Huber over MSE", "Pairwise / listwise losses for ranking"] },
  { day: 38, title: "Classification metrics + calibration", pillar: "math-stats", focus: "Pick metrics that match the business decision.", studyItems: ["Precision, recall, F1, ROC-AUC, PR-AUC — when each fits", "Calibration (reliability diagrams, ECE) and threshold tuning", "Why accuracy is the wrong metric for imbalance"], topicId: "metrics-and-calibration" },
  { day: 39, title: "Regression + ranking metrics", pillar: "math-stats", focus: "RMSE, MAE, R², NDCG, MRR, MAP.", studyItems: ["When to use absolute vs squared error", "NDCG and MRR by hand on a tiny example", "Articulate why ranking ≠ classification at the metric level"] },
  { day: 40, title: "Trees + ensembles", pillar: "traditional-ml", focus: "Random Forest vs GBDT (XGBoost / LightGBM) — defend the choice.", studyItems: ["Read the GBDT chapter or paper summary; understand why it usually beats RF", "When tree-based vs linear models win on tabular data", "Pitfalls: overfitting on small data, miscalibrated probabilities"], topicId: "tree-ensembles" },
  { day: 41, title: "Linear models + regularization", pillar: "traditional-ml", focus: "Logistic regression, L1 vs L2, elastic net.", studyItems: ["Derive logistic regression loss + gradient", "L1 vs L2 — sparsity vs shrinkage", "When linear models still beat trees (tiny data, very high dim, sparse)"] },
  { day: 42, title: "Clustering + dim reduction", pillar: "traditional-ml", focus: "k-means / DBSCAN / hierarchical, PCA / t-SNE / UMAP intuition.", studyItems: ["Compare k-means, hierarchical, DBSCAN — which assumptions each makes", "PCA as compression / denoising / visualization, not just a formula", "When t-SNE / UMAP are the right call"], topicId: "anomaly-detection" },

  // Week 7 — Deep learning + transformers (Days 43-49)
  { day: 43, title: "Neural network basics", pillar: "deep-learning", focus: "Forward pass, loss, backprop — explain it cleanly.", studyItems: ["Walk through forward + backward pass on a 2-layer net by hand", "Activation functions: ReLU, GELU, sigmoid, softmax — when each", "Universal approximation in plain language"], topicId: "backprop-and-optimization", questionIds: ["backprop"] },
  { day: 44, title: "Optimizers + learning rate schedules", pillar: "deep-learning", focus: "SGD, momentum, Adam, warmup + cosine decay.", studyItems: ["SGD vs Adam — when each generalizes better", "Learning-rate warmup and why it stabilizes early training", "Practical learning-rate finder workflow"] },
  { day: 45, title: "Regularization in deep nets", pillar: "deep-learning", focus: "Dropout, weight decay, label smoothing, augmentation.", studyItems: ["Why dropout works as an ensemble approximation", "Weight decay vs L2 in modern optimizers (subtle but interview-worthy)", "Data augmentation as cheap regularization"] },
  { day: 46, title: "CNN design patterns", pillar: "deep-learning", focus: "Convolutions, receptive fields, ResNet, why depth helps.", studyItems: ["Kernel size, stride, padding — what each controls", "Why residual connections fix degradation in deep nets", "Latency / memory trade-offs for real deployments"], topicId: "cnn-design-patterns" },
  { day: 47, title: "RNNs / LSTMs / GRUs", pillar: "deep-learning", focus: "Sequence modeling before transformers replaced it.", studyItems: ["Vanilla RNN vanishing-gradient problem", "Why gating in LSTM/GRU helps gradient flow", "Where RNNs still beat transformers (small data, streaming low-latency)"] },
  { day: 48, title: "Transformers from first principles", pillar: "deep-learning", focus: "Self-attention, multi-head, positional encoding.", studyItems: ["Walk through attention(Q, K, V) end to end", "Why multi-head attention helps", "Quadratic cost in sequence length and modern mitigations"], topicId: "transformers-first-principles", questionIds: ["self-attention"] },
  { day: 49, title: "DL fundamentals mock", pillar: "deep-learning", focus: "Run a rapid-fire DL Q&A round.", studyItems: ["8 mixed prompts in 45 minutes — backprop, optimizer choice, transformer attention", "Score yourself on intuition vs formula recitation", "Promote weak topics into next week"] },

  // Week 8 — GenAI + LLMs (Days 50-56)
  { day: 50, title: "LLM basics", pillar: "generative-ai", focus: "Pretraining, instruction tuning, RLHF / DPO.", studyItems: ["What pretraining objective actually optimizes (next-token, masked LM)", "Why instruction tuning + RLHF / DPO followed", "Where LLMs still hallucinate and the structural reason"], topicId: "llm-basics", questionIds: ["temperature-top-p"] },
  { day: 51, title: "Tokenization + embeddings", pillar: "generative-ai", focus: "BPE / SentencePiece, embedding spaces, multilingual edge cases.", studyItems: ["Why BPE exists — handle OOV without char-level cost", "How embeddings are learned and what they encode", "Multilingual tokenization: where naive BPE fails"] },
  { day: 52, title: "Prompt engineering patterns", pillar: "generative-ai", focus: "Few-shot, chain-of-thought, structured output, function calling.", studyItems: ["When few-shot helps vs hurts", "Chain-of-thought vs single-shot — measured cost vs quality", "Structured output via JSON schema or function-calling APIs"] },
  { day: 53, title: "RAG architecture", pillar: "generative-ai", focus: "End-to-end RAG: chunking, retrieval, generation, citations.", studyItems: ["Chunk size + overlap trade-offs", "Hybrid (dense + sparse) retrieval and why it usually wins", "Citation UX and refusal modes when retrieval is weak"], topicId: "rag-architecture" },
  { day: 54, title: "Vector stores + ANN", pillar: "generative-ai", focus: "HNSW vs IVF vs flat — and when BM25 still wins.", studyItems: ["How HNSW works at a high level + memory cost", "When BM25 / lexical still beats dense", "Update cost: re-embedding when models change"] },
  { day: 55, title: "Reranking + LLM evaluation", pillar: "generative-ai", focus: "Cross-encoder rerankers + faithfulness / relevance / citation eval.", studyItems: ["Bi-encoder vs cross-encoder rerankers — cost vs quality", "Faithfulness, answer relevance, citation accuracy as separate metrics", "LLM-as-judge calibration against human ratings"], topicId: "llm-evaluation", questionIds: ["rag-eval"] },
  { day: 56, title: "Fine-tuning + agents + guardrails", pillar: "generative-ai", focus: "Defend fine-tune vs RAG vs prompt; agents only when justified.", studyItems: ["When prompt + RAG plateaus — only then fine-tune (LoRA / PEFT)", "When multi-agent or tool-use is worth the latency / debug cost", "Layered guardrails: input filter, schema check, policy check, output filter"], topicId: "agents-and-guardrails", questionIds: ["agent-architecture"] },

  // Week 9 — ML model design + 3 case studies (Days 57-63)
  { day: 57, title: "ML system design framework", pillar: "ml-system-design", focus: "Adopt a reusable scaffold for every design prompt.", studyItems: ["Clarify decision, success metrics, constraints, scale", "Data → feature → model → serving → monitoring", "Always close with a trade-off you would defend hardest"], topicId: "system-design-framework" },
  { day: 58, title: "RecSys deep dive: collab, content, two-tower", pillar: "ml-system-design", focus: "Read a couple of classic recsys papers + summary posts.", studyItems: ["Matrix factorization (and its modern two-tower descendants)", "Content-based vs collaborative — when each cold-starts", "Why two-tower dominates retrieval in modern recsys"] },
  { day: 59, title: "Multi-stage ranking", pillar: "ml-system-design", focus: "Retrieval → first-pass ranker → heavy ranker → re-ranking policy.", studyItems: ["Per-stage latency budgeting", "Cheap features vs expensive features by stage", "Re-ranking for diversity, freshness, business policy"] },
  { day: 60, title: "Case: short-video recommendations", pillar: "ml-system-design", focus: "Walk the case end to end on paper, talking out loud.", studyItems: ["Clarify: watch time vs retention vs creator diversity", "Multi-stage architecture with explicit budgets", "Cold-start, exploration, and feedback-loop mitigation"], caseStudySlug: "video-recommendation", questionIds: ["recommendation-design"] },
  { day: 61, title: "Case: ads conversion modeling (CTR)", pillar: "ml-system-design", focus: "CTR prediction inside an auction — calibration is the architect's word.", studyItems: ["Auction integration: bid × pCTR with quality adjustment", "Calibration that survives in production", "Delayed labels, position bias, exploration slots"], caseStudySlug: "ad-click-prediction" },
  { day: 62, title: "Case: enterprise RAG chatbot", pillar: "generative-ai", focus: "Permissioned retrieval + citations + faithfulness.", studyItems: ["ACL enforcement at retrieval time, never after generation", "Hybrid retrieval and reranking", "Refusal modes for ungrounded answers"], caseStudySlug: "enterprise-rag-chatbot" },
  { day: 63, title: "Case: search ranking", pillar: "ml-system-design", focus: "Three-stage architecture under tight latency.", studyItems: ["Query understanding → candidate retrieval → ranking → policy", "Implicit vs explicit labels and bias correction", "Cold-start exploration for new inventory"], caseStudySlug: "search-ranking" },

  // Week 10 — More cases + ML infra design (Days 64-70)
  { day: 64, title: "Case: fraud detection", pillar: "ml-system-design", focus: "Real-time scoring with imbalanced labels and tight latency.", studyItems: ["Synchronous online vs cached features", "Per-segment thresholds and dynamic adjustment", "Reviewer queue capacity and graceful degradation"], caseStudySlug: "fraud-detection" },
  { day: 65, title: "Case: AI customer support agent", pillar: "generative-ai", focus: "Tool use + layered guardrails + escalation tiers.", studyItems: ["Action allowlist with risk tiers", "Planner / executor split for auditability", "Tiered rollout: shadow → read-only → tier-1 actions → tier-2"], caseStudySlug: "customer-support-agent" },
  { day: 66, title: "Case: LLM evaluation platform", pillar: "generative-ai", focus: "Suites, runs, gates, regression detection across teams.", studyItems: ["Versioned prompts, models, retrieval configs", "Regression detection with significance, not just delta", "Multi-tenant cost budgets and shared LLM-judge calibration"], caseStudySlug: "llm-evaluation-platform" },
  { day: 67, title: "ML infra: training pipelines", pillar: "ml-system-design", focus: "Reliable, reproducible training from data to artifact.", studyItems: ["Pipeline orchestration (Airflow / Prefect / Dagster) at a high level", "Distributed training when you actually need it (DDP, FSDP)", "Retraining triggers vs schedules"] },
  { day: 68, title: "ML infra: feature stores", pillar: "ml-system-design", focus: "Online / offline parity, point-in-time correctness, governance.", studyItems: ["Why feature stores exist — and when they're overkill", "Point-in-time correctness for backfills", "Feature ownership, freshness, discoverability"], topicId: "feature-stores", questionIds: ["feature-store-purpose"] },
  { day: 69, title: "ML infra: serving + capacity", pillar: "ml-system-design", focus: "Realtime / near-real-time / batch — and how to size each.", studyItems: ["Per-stage latency budget for a 100ms p99", "Batching, caching, autoscaling levers", "Graceful degradation paths under load"], topicId: "online-serving-tradeoffs", questionIds: ["architect-capacity-planning"] },
  { day: 70, title: "ML infra: registry + CI/CD + deployment", pillar: "mlops", focus: "Promote models like code: shadow, canary, auto-rollback.", studyItems: ["Registry as source of truth + tests that gate promotion", "Shadow → canary → progressive rollout", "Auto-rollback triggers tied to SLOs, not vibes"], topicId: "model-registry-cicd" },

  // Week 11 — Production / governance / cost (Days 71-77)
  { day: 71, title: "Monitoring + drift", pillar: "mlops", focus: "Separate infra, data, and model monitoring with playbooks.", studyItems: ["KS / PSI for distribution drift", "Delayed labels and proxy signals", "Alerts that map to actions, not just dashboards"], topicId: "monitoring-drift", questionIds: ["monitoring-production"] },
  { day: 72, title: "Cost optimization at scale", pillar: "mlops", focus: "Per-request cost decomposition + small-first cascades.", studyItems: ["Cost per request, per feature, per user segment", "Small-first model cascade routing", "When caching beats more capacity"], questionIds: ["architect-cost-optimization"] },
  { day: 73, title: "LLMOps specifics", pillar: "generative-ai", focus: "Prompt versioning, model routing, regression gating.", studyItems: ["Prompt + model + retrieval as versioned artifacts together", "Routing by uncertainty / cost / risk", "Release-time regression gates against an eval suite"] },
  { day: 74, title: "Multi-tenant ML systems", pillar: "ml-system-design", focus: "Compute / data / policy isolation — pick per risk tier.", studyItems: ["Per-tenant namespaces, quotas, audit", "Hard vs soft isolation per risk level", "Cost attribution across tenants"], questionIds: ["architect-multi-tenant-isolation"] },
  { day: 75, title: "Privacy + compliance + audit", pillar: "mlops", focus: "Bake privacy in, not after.", studyItems: ["Data minimization and retention windows", "Audit logs for inference and training", "Region / residency constraints in design"] },
  { day: 76, title: "Build vs buy + migration", pillar: "ml-system-design", focus: "Vector stores, feature platforms, eval tooling — when each.", studyItems: ["Differentiation vs undifferentiated heavy lifting", "Reversible decisions with explicit revisit triggers", "Zero-downtime migration: shadow + parity + ramp"], questionIds: ["architect-build-vs-buy", "architect-migration-plan"] },
  { day: 77, title: "ML infra design mock", pillar: "ml-system-design", focus: "60-minute infra-flavored design round.", studyItems: ["Pick a serving + monitoring + retraining prompt", "Defend latency budgets, scaling, fallback paths", "Trade-off close: which axis you'd protect hardest"] },

  // Week 12 — Behavioral + storytelling (Days 78-84)
  { day: 78, title: "Resume rewrite", pillar: "behavioral-storytelling", focus: "Quantify outcomes; lead with the decision you owned.", studyItems: ["Rewrite each bullet as 'I decided X under Y constraints; result was Z'", "Cut anything you can't defend in 60 seconds", "Verify metrics you cite — interviewers will ask"] },
  { day: 79, title: "Career story (your 'why ML' narrative)", pillar: "behavioral-storytelling", focus: "Three-minute version that lands the arc.", studyItems: ["Write the 3-minute version: what got you in, the pivots, what you want next", "Practice with a mentor or peer; ask for the part that felt slow", "Tighten until it lands in under 4 minutes"] },
  { day: 80, title: "Most complex project deep dive", pillar: "behavioral-storytelling", focus: "Your A-team story — be ready for follow-ups two layers deep.", studyItems: ["Write a one-page brief: problem, decision, alternatives, outcome, what you'd change", "Anticipate three follow-ups (technical, organizational, hindsight)", "Practice the 90-second version and the 5-minute version"], topicId: "project-storytelling" },
  { day: 81, title: "Ownership / failure story", pillar: "behavioral-storytelling", focus: "Show learning without minimizing the impact.", studyItems: ["Write one failure story in STAR format", "Make sure the corrective action you took is concrete (process / metric / system)", "End with what you'd do earlier next time, not a bow"], topicId: "behavioral-ownership", questionIds: ["story-failure"] },
  { day: 82, title: "Conflict / disagreement story", pillar: "behavioral-storytelling", focus: "Demonstrate disagreement without making the other side look bad.", studyItems: ["Pick a real disagreement (technical or cross-functional)", "Frame as 'we wanted different things, here's how we aligned'", "Show the data or principle you used to break the tie"] },
  { day: 83, title: "Leadership / influence story", pillar: "behavioral-storytelling", focus: "Cross-team alignment without inflating your title.", studyItems: ["Pick a moment you influenced a decision outside your reporting line", "Show the framing / RFC / data you used", "What changed about how the team works after"] },
  { day: 84, title: "Company-specific behavioral prep", pillar: "behavioral-storytelling", focus: "Map your stories to each target company's value rubric.", studyItems: ["Read recent posts / blog / RFCs from your top companies", "Map your existing stories to their stated values", "Prepare 2 questions per round per interviewer"] },

  // Week 13 — Mocks + final polish (Days 85-90)
  { day: 85, title: "Coding mock — Meta-style", pillar: "foundations", focus: "Fast classic mediums; you must finish without stalling.", studyItems: ["Pick 2 fresh mediums; solve each in under 22 minutes", "Verbalize trade-offs continuously", "Score yourself on speed + clarity, not just correctness"] },
  { day: 86, title: "Coding mock — Google-style", pillar: "foundations", focus: "Hard LC: graph or DP, with elegant simplification.", studyItems: ["Pick a Hard from your weak pattern (graph, DP, or string)", "Spend 5 minutes designing before coding", "If you stall, talk through alternatives — Google interviews reward reasoning"] },
  { day: 87, title: "Coding mock — OOP / OpenAI-style", pillar: "foundations", focus: "Object-modeling design problem under interview pressure.", studyItems: ["Pick an OOP design problem (Cache, Queue, Rate Limiter)", "Walk requirements → classes → methods → extension question", "Be ready for a non-standard behavior round and a project presentation slot"] },
  { day: 88, title: "ML model design mock", pillar: "ml-system-design", focus: "60-minute full case from cold-start to monitoring.", studyItems: ["Pick a fresh case study you haven't drilled this round", "Use the framework start to finish", "Trade-off close: name the one trade-off you'd defend hardest"] },
  { day: 89, title: "ML infra design mock + behavioral mock", pillar: "ml-system-design", focus: "One infra design + one behavioral round in the same sitting.", studyItems: ["60-min infra-flavored design (serving, monitoring, retraining)", "30-min behavioral with 5-6 prompts back to back", "Capture residual gaps for tomorrow's review"] },
  { day: 90, title: "Light review + sleep + walk in", pillar: "behavioral-storytelling", focus: "Don't add new content. Trust the prep.", studyItems: ["Re-read your one-page project brief and your career story", "Skim the trade-off playbook once", "Sleep, eat, hydrate — performance compounds physically"] },
];

export function getDayPlan(day: number) {
  return dailyPlan.find((entry) => entry.day === day);
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
