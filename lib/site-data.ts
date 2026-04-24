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
  | "senior-mle";

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
  { href: "/", label: "Home" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Question Bank" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

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
  const shortcutMap: Partial<Record<PillarSlug, string>> = {
    "traditional-ml": "/traditional-ml",
    "deep-learning": "/deep-learning",
    "generative-ai": "/generative-ai",
    "ml-system-design": "/ml-system-design",
    mlops: "/mlops",
  };

  return shortcutMap[slug] ?? `/learn/${slug}`;
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
  };

  return shortcutMap[slug];
}
