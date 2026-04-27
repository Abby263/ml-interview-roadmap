// Topic library: each topic has a track label + items + day-level interview questions
// drawn from the candidate-facing PDF question bank.

export async function build({ R }) {
  const TOPICS = {};

  // Helper for compact item definitions
  const item = (id, label, href, meta, qs) => {
    const it = { id, label };
    if (href) it.href = href;
    if (meta) it.meta = meta;
    if (qs && qs.length) it.interviewQuestions = qs.slice(0, 5);
    return it;
  };
  const topic = (key, def) => { TOPICS[key] = def; };

  // ─────────────── MATH & STATS ───────────────
  topic("probability-fundamentals", {
    trackLabel: "Math · Probability fundamentals",
    items: [
      item("stats-prob-axioms", "Probability axioms, sample spaces, joint / marginal / conditional", "https://seeing-theory.brown.edu/basic-probability/index.html", "Interactive", [
        "What's the difference between joint, marginal and conditional probability — give a worked example?",
        "When is independence the same as conditional independence? Why does the distinction matter for Naive Bayes?",
        "Explain the law of total probability with a churn-prediction example.",
      ]),
      item("stats-bayes", "Bayes' theorem: priors, likelihood, posterior", "https://seeing-theory.brown.edu/bayesian-inference/index.html", "Interactive", [
        "Walk through Bayes on a screening test (1% prevalence, 95% sensitivity, 90% specificity) — why is positive predictive value still low?",
        "How would you use Bayes to update belief during an A/B test as data arrives?",
        "When does using a strong prior hurt vs help in production ML?",
      ]),
      item("stats-cond-prob", "Conditional probability traps & base-rate fallacy", "https://en.wikipedia.org/wiki/Conditional_probability#Common_fallacies", "Read", [
        "Two children: at least one is a girl. What's the probability the other is also a girl? Defend your answer.",
        "Why is P(disease|positive) ≠ sensitivity in general?",
        "Explain the base-rate fallacy with a hiring or fraud example.",
      ]),
    ],
    dayQuestions: [
      "Walk through Bayes on a screening test (1% prevalence, 95% sensitivity, 90% specificity).",
      "Why is positive predictive value low when the base rate is small, even with a great classifier?",
      "Explain conditional probability and why P(A|B) ≠ P(B|A) — with a fraud-detection example.",
      "When does treating two events as independent break a model in production?",
    ],
  });

  topic("distributions", {
    trackLabel: "Math · Distributions you'll see in interviews",
    items: [
      item("stats-discrete-dists", "Bernoulli, Binomial, Poisson, Geometric — when to use which", "https://seeing-theory.brown.edu/probability-distributions/index.html", "Interactive", [
        "When should you model click events as Bernoulli vs Poisson?",
        "Derive the mean and variance of a Binomial(n, p).",
        "Why does the Poisson approximate the Binomial when n is large and p small?",
      ]),
      item("stats-continuous-dists", "Normal, Exponential, Uniform, Beta, Gamma — properties & use cases", "https://en.wikipedia.org/wiki/List_of_probability_distributions", "Read", [
        "Why is the Normal so common — what's the Central Limit Theorem intuition?",
        "When would you pick a Beta distribution over a Normal?",
        "How is the Exponential distribution memoryless, and why does that matter for modeling time-to-event?",
      ]),
      item("stats-clt", "Central Limit Theorem & Law of Large Numbers", "https://www.youtube.com/watch?v=YAlJCEDH2uY", "StatQuest", [
        "State the Central Limit Theorem precisely and explain what it does NOT say.",
        "How does the CLT justify using normal-based confidence intervals on means?",
        "When does the CLT fail or converge slowly?",
      ]),
    ],
    dayQuestions: [
      "Compare Bernoulli, Binomial, and Poisson — when do you reach for each in modeling?",
      "Why is the normal distribution everywhere — what's the CLT and what does it actually claim?",
      "When does the CLT fail or converge slowly enough that you should NOT trust it?",
      "Pick a real product metric (e.g., session length): which distribution would you model it with and why?",
    ],
  });

  topic("hypothesis-testing", {
    trackLabel: "Math · Hypothesis testing & p-values",
    items: [
      item("stats-null-alt", "Null vs alternative, type I / II errors, power", "https://www.statlearning.com/", "ISLR ch. 13", [
        "Define Type I and Type II error and give an example where each is much more costly.",
        "What does statistical power depend on, and how would you increase it?",
        "Why is multiple testing dangerous and how do Bonferroni / FDR fix it?",
      ]),
      item("stats-pvalue", "P-values: what they mean and don't", "https://www.nature.com/articles/d41586-019-00857-9", "Nature", [
        "What does a p-value of 0.03 actually mean? What does it NOT mean?",
        "Walk me through the steps of a two-sample t-test on conversion rates.",
        "Why is 'statistically significant but practically meaningless' a real concern in product A/B tests?",
      ]),
      item("stats-tests", "z, t, chi-squared, ANOVA — choosing the right test", "https://www.youtube.com/watch?v=0oc49DyA3hU", "StatQuest", [
        "When do you use a z-test vs a t-test?",
        "When does a chi-squared test apply?",
        "Why does ANOVA generalize the t-test, and when do you reach for it?",
      ]),
    ],
    dayQuestions: [
      "What does a p-value of 0.03 mean — and what does it NOT mean?",
      "Walk through the difference between Type I and Type II errors with a fraud-detection example.",
      "How do you choose between a t-test, z-test, chi-squared, and ANOVA?",
      "Why is multiple-testing correction critical when running dozens of A/B variants?",
    ],
  });

  topic("confidence-intervals", {
    trackLabel: "Math · Confidence intervals & bootstrapping",
    items: [
      item("stats-ci", "Confidence intervals: meaning, construction, common misreadings", "https://en.wikipedia.org/wiki/Confidence_interval#Common_misunderstandings", "Read", [
        "What does a 95% confidence interval actually mean?",
        "Why is a 95% CI NOT 'a 95% probability the true value is in this range' under frequentist statistics?",
        "How would you build a CI for a click-through rate with N=1,000?",
      ]),
      item("stats-bootstrap", "Bootstrap & permutation tests", "https://www.youtube.com/watch?v=Xz0x-8-cgaQ", "StatQuest", [
        "When is bootstrapping more useful than a parametric CI?",
        "Walk through bootstrapping a CI for the median.",
        "How does a permutation test compare to a t-test when assumptions are violated?",
      ]),
      item("stats-frequentist-bayes", "Frequentist vs Bayesian intervals", "https://en.wikipedia.org/wiki/Credible_interval", "Read", [
        "Compare frequentist confidence intervals vs Bayesian credible intervals.",
        "When does a Bayesian credible interval communicate uncertainty more naturally?",
      ]),
    ],
    dayQuestions: [
      "What does a 95% confidence interval actually mean — and what's the most common misinterpretation?",
      "Walk through how you'd bootstrap a confidence interval for the median order value.",
      "When would you reach for a Bayesian credible interval instead of a frequentist CI?",
    ],
  });

  topic("ab-testing", {
    trackLabel: "Math · A/B testing in production",
    items: [
      item("stats-ab-design", "Experiment design: power, MDE, randomization, SRM", "https://www.evanmiller.org/how-not-to-run-an-ab-test.html", "Evan Miller", [
        "How do you choose sample size for an A/B test? What's MDE?",
        "What is sample-ratio mismatch (SRM) and why is it a red flag?",
        "Walk through how to design an experiment to detect a 1% lift in conversion.",
      ]),
      item("stats-peeking", "Sequential / peeking problems & remedies", "https://www.evanmiller.org/sequential-ab-testing.html", "Evan Miller", [
        "Why does 'checking the test daily and stopping when significant' inflate Type I error?",
        "What are sequential testing methods (e.g., always-valid p-values) and when would you use them?",
      ]),
      item("stats-cuped", "Variance reduction: stratification & CUPED", "https://exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf", "Microsoft", [
        "Explain CUPED in plain English. Why does it shrink confidence intervals?",
        "What's the difference between stratification and CUPED for variance reduction?",
      ]),
    ],
    dayQuestions: [
      "Walk through how you'd design an A/B test to detect a 1% lift in conversion — what sample size, what guardrails?",
      "What is sample-ratio mismatch and why is it a red flag in an A/B test?",
      "Why does peeking at A/B results daily inflate Type I error, and what do you do instead?",
      "Explain CUPED in one minute and when it actually pays off.",
    ],
  });

  topic("sampling", {
    trackLabel: "Math · Sampling & survey design",
    items: [
      item("stats-sampling-methods", "Random, stratified, cluster, importance sampling", "https://en.wikipedia.org/wiki/Sampling_(statistics)", "Read", [
        "Compare simple random sampling vs stratified sampling — when does stratification reduce variance?",
        "What is importance sampling and where does it show up in ML?",
      ]),
      item("stats-bias", "Selection bias, survivorship bias, response bias", "https://towardsdatascience.com/types-of-bias-in-data-science-2d3c4d4f8c2c", "Read", [
        "Give an example where selection bias silently broke a model deployment.",
        "What is survivorship bias and where does it hurt model evaluation?",
      ]),
      item("stats-resampling", "Resampling for class imbalance & uncertainty", "https://imbalanced-learn.org/stable/user_guide.html", "imbalanced-learn", [
        "What's the difference between bootstrapping for uncertainty vs resampling for imbalance?",
        "When does oversampling the minority class help and when does it leak?",
      ]),
    ],
    dayQuestions: [
      "Compare simple random vs stratified vs cluster sampling — what governs your choice?",
      "Walk me through three real situations where selection bias broke a model deployment.",
      "What is importance sampling and where does it show up in ML training pipelines?",
    ],
  });

  topic("linear-algebra", {
    trackLabel: "Math · Linear algebra essentials",
    items: [
      item("linalg-vectors", "Vectors, matrices, dot product, transpose", "https://www.3blue1brown.com/lessons/vectors", "3Blue1Brown", [
        "What does the dot product mean geometrically?",
        "Why is the transpose used in y = Xθ vs y = θX?",
        "How does cosine similarity relate to the dot product?",
      ]),
      item("linalg-rank-null", "Rank, null space, column space", "https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces", "Khan Academy", [
        "What is the rank of a matrix and why does it matter for solving Ax = b?",
        "What does it mean for a feature matrix X to be rank-deficient, and how does it affect linear regression?",
      ]),
      item("linalg-norms", "Norms (L1, L2, infinity) and cosine similarity", "https://machinelearningmastery.com/vector-norms-machine-learning/", "MLM", [
        "Compare L1, L2, and L-infinity norms — when do you use each?",
        "How does the choice of norm change the geometry of regularization?",
      ]),
    ],
    dayQuestions: [
      "What does the dot product mean geometrically, and why is cosine similarity preferred over raw dot product for normalized embeddings?",
      "Compare L1 vs L2 regularization — what's the geometric intuition, and when does L1 give true sparsity?",
      "What is matrix rank, and how does rank deficiency in your feature matrix break OLS regression?",
    ],
  });

  topic("eigen", {
    trackLabel: "Math · Eigenvalues, eigenvectors, decompositions",
    items: [
      item("linalg-eig", "Eigenvalues & eigenvectors — the geometric picture", "https://www.3blue1brown.com/lessons/eigenvalues", "3Blue1Brown", [
        "What does it mean intuitively for a vector to be an eigenvector of a matrix?",
        "Where do eigenvalues show up in ML?",
      ]),
      item("linalg-spectral", "Spectral theorem & symmetric matrices", "https://en.wikipedia.org/wiki/Spectral_theorem", "Read", [
        "Why are eigenvectors of symmetric matrices orthogonal, and why does that matter for PCA?",
        "Compare diagonalization vs eigendecomposition.",
      ]),
      item("linalg-condition", "Condition number & numerical stability", "https://en.wikipedia.org/wiki/Condition_number", "Read", [
        "What is the condition number of a matrix and why does a high condition number hurt training?",
        "Give two practical fixes when your design matrix is ill-conditioned (e.g., regularization, feature scaling, removing collinear features).",
      ]),
    ],
    dayQuestions: [
      "What does it mean intuitively for a vector to be an eigenvector of a matrix?",
      "Why are eigenvectors of symmetric matrices orthogonal, and why does that matter for PCA?",
      "What is the condition number of a feature matrix and how does ill-conditioning hurt linear regression?",
    ],
  });

  topic("svd-pca", {
    trackLabel: "Math · SVD & PCA",
    items: [
      item("linalg-svd", "Singular Value Decomposition (SVD)", "https://www.youtube.com/watch?v=mBcLRGuAFUk", "Strang", [
        "Explain SVD geometrically: X = UΣVᵀ.",
        "Why does SVD always exist while eigendecomposition does not?",
        "Where is SVD used in recommender systems and embeddings?",
      ]),
      item("ml-pca", "PCA: derivation, variance retention, when it fails", "https://www.youtube.com/watch?v=FgakZw6K1QQ", "StatQuest", [
        "Derive PCA as maximizing variance OR minimizing reconstruction error — they give the same answer. Why?",
        "When does PCA fail (non-Gaussian, non-linear, scale-sensitive)?",
        "Compare PCA vs t-SNE vs UMAP — when do you pick each?",
      ]),
      item("ml-tsne", "t-SNE, UMAP — strengths and how to read the plots", "https://distill.pub/2016/misread-tsne/", "Distill", [
        "Why are distances in a t-SNE plot misleading?",
        "When would you choose UMAP over t-SNE?",
      ]),
    ],
    dayQuestions: [
      "Explain SVD geometrically and why X = UΣVᵀ always exists even when eigendecomposition doesn't.",
      "Walk through the derivation of PCA as maximizing variance OR minimizing reconstruction error — show they're equivalent.",
      "Compare PCA vs t-SNE vs UMAP — strengths, weaknesses, and when you'd reach for each.",
      "Why are distances in t-SNE plots misleading, and how should you actually interpret them?",
    ],
  });

  topic("calculus", {
    trackLabel: "Math · Calculus & gradients",
    items: [
      item("calc-derivatives", "Derivatives, partial derivatives, chain rule", "https://www.3blue1brown.com/topics/calculus", "3Blue1Brown", [
        "Derive the chain rule for f(g(x)) and apply it to a 2-layer neural network.",
        "What's the difference between a partial derivative and a directional derivative?",
      ]),
      item("calc-gradients", "Gradients, Jacobians, Hessians", "https://www.khanacademy.org/math/multivariable-calculus/multivariable-derivatives", "Khan Academy", [
        "What does the gradient vector represent geometrically?",
        "When would you need the full Jacobian or Hessian in ML?",
        "Why do second-order methods (Newton) rarely scale to deep nets?",
      ]),
      item("calc-backprop", "Backprop as the chain rule on a computation graph", "https://colah.github.io/posts/2015-08-Backprop/", "colah", [
        "Explain backpropagation as the chain rule applied to a computation graph.",
        "Why do vanishing gradients happen, and how do ReLU / residual connections help?",
      ]),
    ],
    dayQuestions: [
      "Walk through backpropagation as the chain rule on a computation graph — for a simple 2-layer MLP.",
      "What does the gradient vector represent geometrically, and why do we move opposite to it during training?",
      "Why do vanishing gradients happen in deep networks and how do ReLU and residual connections help?",
    ],
  });

  topic("optimization", {
    trackLabel: "Math · Optimization for ML",
    items: [
      item("opt-convex", "Convex vs non-convex optimization", "https://web.stanford.edu/~boyd/cvxbook/", "Boyd", [
        "What does convexity guarantee for optimization?",
        "Are deep neural network losses convex? Why does SGD still work?",
      ]),
      item("opt-gd", "Gradient descent, SGD, mini-batch SGD", "https://ruder.io/optimizing-gradient-descent/", "Sebastian Ruder", [
        "Compare batch GD, SGD, and mini-batch SGD — trade-offs in compute, noise, and convergence.",
        "Why does SGD with momentum converge faster than vanilla SGD?",
      ]),
      item("opt-momentum", "Momentum, Nesterov, Adam, AdamW, schedulers", "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html", "fast.ai", [
        "Compare Adam, AdamW, and SGD with momentum — which would you reach for first and why?",
        "Why is the AdamW correction important when using weight decay with adaptive optimizers?",
        "What's the role of learning-rate warmup and cosine schedules?",
      ]),
    ],
    dayQuestions: [
      "Compare SGD, momentum, Adam, and AdamW — when do you reach for each in practice?",
      "Why is the AdamW correction important when using weight decay with adaptive optimizers?",
      "If your loss is non-convex (it usually is for deep nets), why does SGD still find good solutions?",
      "Explain learning-rate warmup and cosine schedules — what problem do they fix?",
    ],
  });

  topic("bias-variance", {
    trackLabel: "ML · Bias-variance trade-off",
    items: [
      item("ml-bias-var", "Bias-variance decomposition with worked example", "https://www.youtube.com/watch?v=EuBBz3bI-aA", "StatQuest", [
        "Decompose expected squared error into bias², variance, and irreducible noise.",
        "Why does adding more training data reduce variance but not bias?",
      ]),
      item("ml-double-descent", "Double descent: when more parameters help", "https://openai.com/index/deep-double-descent/", "OpenAI", [
        "Explain the double-descent phenomenon. How does it overturn classical bias-variance intuition?",
        "Why do over-parameterized models often generalize well in deep learning?",
      ]),
      item("ml-learning-curves", "Learning curves: diagnose underfit vs overfit", "https://scikit-learn.org/stable/modules/learning_curve.html", "scikit-learn", [
        "How do you read a learning curve to decide between more data, regularization, or a bigger model?",
        "What does a large gap between training and validation curves usually mean — and what shrinks it?",
      ]),
    ],
    dayQuestions: [
      "Decompose expected squared error into bias², variance, and irreducible noise — give an example of each.",
      "How would you diagnose whether to add more data, regularize harder, or grow the model from a learning curve?",
      "Explain double descent — why does it overturn the classical bias-variance picture?",
    ],
  });

  // ─────────────── TRADITIONAL ML ───────────────
  topic("linear-regression", {
    trackLabel: "ML · Linear regression",
    items: [
      item("ml-ols", "OLS, normal equations, MLE interpretation", "https://www.statlearning.com/", "ISLR ch. 3", [
        "Derive the OLS solution θ = (XᵀX)⁻¹Xᵀy. When is XᵀX not invertible?",
        "Show that OLS = MLE under Gaussian noise.",
      ]),
      item("ml-lr-assumptions", "Assumptions: linearity, independence, homoscedasticity, normality", "https://en.wikipedia.org/wiki/Linear_regression#Assumptions", "Read", [
        "Walk through the four classical assumptions of linear regression and how to diagnose violations.",
        "What's heteroscedasticity and how do you fix it?",
      ]),
      item("ml-loss-fns", "Loss functions: MSE, MAE, Huber — when to use each", "https://heartbeat.comet.ml/5-regression-loss-functions-all-machine-learners-should-know-4fb140e9d4b0", "Read", [
        "Compare MSE, MAE, and Huber loss — what do you use when outliers matter?",
        "Why is Huber loss differentiable and robust at the same time?",
      ]),
    ],
    dayQuestions: [
      "Derive the OLS closed-form θ = (XᵀX)⁻¹Xᵀy and explain when it fails.",
      "Show that OLS coincides with MLE under Gaussian noise — why does that matter?",
      "Compare MSE vs MAE vs Huber loss for regression — when do you reach for each?",
      "What are the four classical OLS assumptions and how do you diagnose violations?",
    ],
  });

  topic("logistic-regression", {
    trackLabel: "ML · Logistic regression & classification",
    items: [
      item("ml-logreg", "Sigmoid, log-odds, and the LR loss", "https://www.youtube.com/watch?v=yIYKR4sgzI8", "StatQuest", [
        "Why do we use the log-loss (cross-entropy) instead of MSE for logistic regression?",
        "Derive the gradient of binary cross-entropy w.r.t. the weights.",
      ]),
      item("ml-classification-metrics", "Precision, recall, F1, ROC-AUC, PR-AUC, calibration", "https://scikit-learn.org/stable/modules/model_evaluation.html", "scikit-learn", [
        "When is ROC-AUC misleading? When should you use PR-AUC instead?",
        "What is a calibration plot and why does it matter for downstream decisions?",
        "How do you choose a classification threshold for a fraud-detection system?",
      ]),
      item("ml-multiclass", "Multi-class: one-vs-rest, softmax, multi-label vs multi-class", "https://en.wikipedia.org/wiki/Multiclass_classification", "Read", [
        "Compare one-vs-rest vs softmax for multi-class classification.",
        "What's the difference between multi-class and multi-label, and how does the loss change?",
      ]),
    ],
    dayQuestions: [
      "Why do we use cross-entropy instead of MSE for logistic regression — what breaks?",
      "When is ROC-AUC misleading and when should you use PR-AUC instead?",
      "How do you choose a classification threshold for a fraud-detection system with very imbalanced classes?",
      "What is calibration, why does it matter for decisions, and how do you fix a poorly-calibrated model?",
    ],
  });

  topic("regularization", {
    trackLabel: "ML · Regularization (L1, L2, ElasticNet)",
    items: [
      item("ml-l1-l2", "L1 vs L2 vs ElasticNet — geometry and selection", "https://www.youtube.com/watch?v=Q81RR3yKn30", "StatQuest", [
        "Why does L1 produce sparse solutions while L2 doesn't? Show the geometric picture.",
        "When do you use ElasticNet over L1 or L2 alone?",
      ]),
      item("ml-early-stopping", "Early stopping & dropout as regularizers", "https://en.wikipedia.org/wiki/Early_stopping", "Read", [
        "Why is early stopping equivalent to L2 regularization in some cases?",
        "How would you choose the early-stopping patience and what happens when it's too small or too large?",
      ]),
      item("ml-bayes-prior", "Regularization as a Bayesian prior", "https://en.wikipedia.org/wiki/Tikhonov_regularization#Bayesian_interpretation", "Read", [
        "Show that L2 regularization corresponds to a Gaussian prior on weights and L1 to a Laplace prior.",
        "When does the Bayesian framing actually change a modeling decision in practice?",
      ]),
    ],
    dayQuestions: [
      "Why does L1 produce sparse solutions while L2 doesn't — show the geometric picture.",
      "Show that L2 regularization is equivalent to a Gaussian prior on the weights — what's the Bayesian story?",
      "When would you choose ElasticNet over pure L1 or L2 — what's the failure mode it fixes?",
    ],
  });

  topic("cross-validation", {
    trackLabel: "ML · Cross-validation & evaluation",
    items: [
      item("ml-cv", "k-fold, stratified, leave-one-out, time-series CV", "https://scikit-learn.org/stable/modules/cross_validation.html", "scikit-learn", [
        "When does k-fold leak data, and what does TimeSeriesSplit do differently?",
        "Why is stratified k-fold important for imbalanced classification?",
      ]),
      item("ml-train-val-test", "Train/val/test split & nested CV", "https://www.youtube.com/watch?v=fSytzGwwBVw", "StatQuest", [
        "Why do you need both a validation and a test set for hyperparameter tuning?",
        "What is nested cross-validation and when is it worth the cost?",
      ]),
      item("ml-leakage", "Common forms of data leakage", "https://machinelearningmastery.com/data-leakage-machine-learning/", "MLM", [
        "Walk through three common ways data leakage sneaks into an ML pipeline.",
        "How would you build a pipeline that prevents leakage when scaling features?",
      ]),
    ],
    dayQuestions: [
      "Why does standard k-fold leak data on time-series, and what does TimeSeriesSplit do differently?",
      "Walk through three real ways data leakage sneaks into an ML pipeline and how you'd prevent each.",
      "Why do you need both a validation and a test set for hyperparameter tuning — can't you just use one?",
    ],
  });

  topic("decision-trees", {
    trackLabel: "ML · Decision trees",
    items: [
      item("ml-dt", "How a decision tree splits: Gini, entropy, information gain", "https://www.youtube.com/watch?v=_L39rN6gz7Y", "StatQuest", [
        "How does a decision tree decide where to split? Compare Gini vs entropy.",
        "Why are decision trees high-variance, and how does pruning help?",
      ]),
      item("ml-dt-vs-linear", "Trees vs linear models: when each wins", "https://stats.stackexchange.com/questions/520622", "Read", [
        "When does a tree-based model crush a linear model and vice versa?",
        "Why don't decision trees need feature scaling?",
      ]),
      item("ml-feature-importance", "Feature importance: gain, permutation, SHAP", "https://christophm.github.io/interpretable-ml-book/", "Molnar", [
        "Compare gain-based feature importance, permutation importance, and SHAP — pros and cons.",
        "Why can gain-based importance be misleading when features are correlated?",
      ]),
    ],
    dayQuestions: [
      "How does a decision tree decide where to split, and how do Gini vs entropy compare?",
      "Why are decision trees inherently high-variance, and what techniques fix it?",
      "Compare gain-based, permutation, and SHAP feature importance — when does each mislead you?",
    ],
  });

  topic("ensembles", {
    trackLabel: "ML · Ensembles: bagging, RF, boosting",
    items: [
      item("ml-bagging-rf", "Bagging & Random Forest", "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ", "StatQuest", [
        "How does bagging reduce variance? Why doesn't it reduce bias?",
        "What two extra ingredients does Random Forest add on top of bagging?",
      ]),
      item("ml-boosting", "Boosting intuition: AdaBoost, GBM", "https://www.youtube.com/watch?v=3CC4N4z3GJc", "StatQuest", [
        "Compare bagging vs boosting — what's reduced and how?",
        "Walk me through how AdaBoost reweights samples after each weak learner.",
      ]),
      item("ml-stacking", "Stacking & blending", "https://mlwave.com/kaggle-ensembling-guide/", "MLWave", [
        "When does stacking actually help vs just adding overhead?",
        "Walk me through how you'd avoid leakage when training a stacked model with k-fold meta-features.",
      ]),
    ],
    dayQuestions: [
      "Compare bagging and boosting — which reduces bias, which reduces variance, and why?",
      "What two extra ingredients does Random Forest add on top of vanilla bagging?",
      "When does stacking actually help in production vs just adding latency and ops cost?",
    ],
  });

  topic("gbdt", {
    trackLabel: "ML · Gradient boosting (XGBoost, LightGBM, CatBoost)",
    items: [
      item("ml-gbm-math", "GBM: gradient boosting on residuals", "https://www.youtube.com/watch?v=3CC4N4z3GJc", "StatQuest", [
        "Walk me through how GBM fits each new tree on the negative gradient of the loss.",
        "Why is GBM more sensitive to learning rate than Random Forest?",
      ]),
      item("ml-xgb", "XGBoost: histogram splits, regularization, missing values", "https://xgboost.readthedocs.io/en/stable/", "XGBoost", [
        "What does XGBoost do differently from vanilla GBM that made it dominate Kaggle?",
        "How does XGBoost handle missing values automatically?",
      ]),
      item("ml-lgbm", "LightGBM & CatBoost: leaf-wise growth, GOSS, ordered boosting", "https://lightgbm.readthedocs.io/", "LightGBM", [
        "When would you pick LightGBM over XGBoost?",
        "What problem does CatBoost's ordered boosting solve?",
      ]),
    ],
    dayQuestions: [
      "Why does GBDT usually beat Random Forest on tabular data — what's the intuition?",
      "What does XGBoost do differently from vanilla GBM that made it dominate Kaggle for years?",
      "Compare XGBoost, LightGBM, and CatBoost — when would you reach for each?",
      "How does XGBoost handle missing values and why is that a big deal?",
    ],
  });

  topic("hyperparam-tuning", {
    trackLabel: "ML · Hyperparameter tuning",
    items: [
      item("ml-tuning-search", "Grid, random, Bayesian, Hyperband search", "https://distill.pub/2020/bayesian-optimization/", "Distill", [
        "Why does random search often beat grid search?",
        "When is Bayesian optimization worth the complexity over random search?",
        "How does Hyperband save compute by early-stopping bad configs?",
      ]),
      item("ml-tuning-tools", "Optuna / Ray Tune in practice", "https://optuna.org/", "Optuna", [
        "How would you set up a tuning study for a GBDT model with limited compute?",
        "What's the difference between Optuna's TPE sampler and a random sampler — when does TPE actually help?",
      ]),
    ],
    dayQuestions: [
      "Why does random search often beat grid search for hyperparameter tuning?",
      "When is Bayesian optimization worth the complexity over random or Hyperband search?",
      "How would you tune an XGBoost model with a tight compute budget?",
    ],
  });

  topic("imbalance", {
    trackLabel: "ML · Imbalanced classification",
    items: [
      item("ml-imbalance-fix", "Resampling, class weights, SMOTE", "https://imbalanced-learn.org/stable/user_guide.html", "imbalanced-learn", [
        "Compare random oversampling, undersampling, SMOTE, and class weighting — when does each help?",
        "Why can SMOTE leak when applied before cross-validation?",
      ]),
      item("ml-imbalance-loss", "Focal loss & cost-sensitive learning", "https://arxiv.org/abs/1708.02002", "Lin et al.", [
        "Why does focal loss help with extreme imbalance in object detection?",
        "Compare focal loss vs class-weighted cross-entropy — when does focal actually win?",
      ]),
      item("ml-imbalance-eval", "Metric choice for imbalance: PR-AUC, F-beta, MCC", "https://machinelearningmastery.com/tour-of-evaluation-metrics-for-imbalanced-classification/", "MLM", [
        "Why is accuracy a terrible metric for imbalanced classification?",
        "When do you reach for F1, F-beta, MCC, or PR-AUC?",
      ]),
    ],
    dayQuestions: [
      "Compare oversampling, undersampling, SMOTE, and class weights — what are the failure modes of each?",
      "Why does SMOTE leak when applied before cross-validation, and how do you fix it?",
      "What metric do you reach for in extreme class imbalance and why is accuracy useless?",
      "Why does focal loss help with object detection but rarely fix tabular imbalance?",
    ],
  });

  topic("svm-knn", {
    trackLabel: "ML · SVM, kNN, Naive Bayes",
    items: [
      item("ml-svm", "SVM: max-margin, kernel trick, soft margin", "https://www.youtube.com/watch?v=efR1C6CvhmE", "StatQuest", [
        "What's the geometric intuition behind the max-margin SVM?",
        "Explain the kernel trick — why it lets us work in infinite-dimensional spaces without computing them.",
        "When would you NOT use an SVM today?",
      ]),
      item("ml-knn", "kNN: distance metrics, curse of dimensionality", "https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm", "Read", [
        "Why does kNN degrade in high dimensions (curse of dimensionality)?",
        "How would you choose k and the distance metric for kNN?",
      ]),
      item("ml-nb", "Naive Bayes: when 'naive' actually works", "https://www.youtube.com/watch?v=O2L2Uv9pdDA", "StatQuest", [
        "Why does Naive Bayes still work despite the unrealistic independence assumption?",
        "Compare generative vs discriminative classifiers using NB and Logistic Regression.",
      ]),
    ],
    dayQuestions: [
      "Explain the kernel trick in SVMs and why it lets you work in infinite-dimensional spaces.",
      "Why does kNN degrade in high dimensions — what's the curse of dimensionality?",
      "Compare generative (Naive Bayes) vs discriminative (Logistic Regression) classifiers — when does each win?",
    ],
  });

  topic("clustering", {
    trackLabel: "ML · Clustering",
    items: [
      item("ml-kmeans", "k-means: algorithm, initialization, evaluation", "https://www.youtube.com/watch?v=4b5d3muPQmA", "StatQuest", [
        "Walk through Lloyd's algorithm for k-means.",
        "Why does k-means initialization (k-means++) matter?",
        "How would you choose k? Elbow vs silhouette vs gap statistic.",
      ]),
      item("ml-dbscan", "DBSCAN & HDBSCAN", "https://scikit-learn.org/stable/modules/clustering.html#dbscan", "scikit-learn", [
        "When does DBSCAN beat k-means?",
        "What two hyperparameters does DBSCAN have and how do you pick them?",
      ]),
      item("ml-hier", "Hierarchical clustering & dendrograms", "https://www.youtube.com/watch?v=7xHsRkOdVwo", "StatQuest", [
        "When is hierarchical clustering more useful than k-means?",
        "Compare linkage methods (single, complete, average, Ward).",
      ]),
    ],
    dayQuestions: [
      "Walk through Lloyd's algorithm for k-means and explain why initialization matters.",
      "Compare k-means, DBSCAN, and hierarchical clustering — when does each win?",
      "How would you choose the number of clusters k — elbow, silhouette, or gap statistic?",
    ],
  });

  topic("feature-engineering", {
    trackLabel: "ML · Feature engineering",
    items: [
      item("ml-fe-numerical", "Scaling, log/Box-Cox, binning", "https://scikit-learn.org/stable/modules/preprocessing.html", "scikit-learn", [
        "When do tree models NOT need feature scaling, and when do they (gradient boosting libraries with regularization)?",
        "When would you apply a log transform vs Box-Cox?",
      ]),
      item("ml-fe-categorical", "One-hot, target, frequency, hashing encoders", "https://contrib.scikit-learn.org/category_encoders/", "category-encoders", [
        "Compare one-hot, target, frequency, and hashing encoders — trade-offs in cardinality and leakage.",
        "Why is target encoding leak-prone and how does k-fold target encoding fix it?",
      ]),
      item("ml-fe-missing", "Missing data: deletion, imputation, indicators", "https://scikit-learn.org/stable/modules/impute.html", "scikit-learn", [
        "When is mean/median imputation harmful?",
        "Why do tree models often handle missing values natively while linear models cannot?",
      ]),
    ],
    dayQuestions: [
      "Compare one-hot, target, frequency, and hashing encoders — when do you reach for each?",
      "Why is target encoding leak-prone, and how does k-fold target encoding fix it?",
      "When is mean/median imputation harmful, and what should you do instead?",
    ],
  });

  topic("feature-selection", {
    trackLabel: "ML · Feature selection",
    items: [
      item("ml-fs-filter", "Filter methods: chi-squared, mutual information", "https://scikit-learn.org/stable/modules/feature_selection.html", "scikit-learn", [
        "Compare filter, wrapper, and embedded feature selection.",
        "When would mutual information beat chi-squared as a filter, and vice versa?",
      ]),
      item("ml-fs-embedded", "Embedded: L1, tree-based importance", "https://scikit-learn.org/stable/modules/feature_selection.html#l1-based-feature-selection", "scikit-learn", [
        "Why is L1 effectively a feature selector?",
        "When would you trust tree-based importance over L1 selection?",
      ]),
      item("ml-fs-shap", "SHAP for feature attribution", "https://shap.readthedocs.io/", "SHAP", [
        "How does SHAP compute fair attributions, and how does it relate to game theory?",
        "Where does SHAP mislead — what's a worked example of correlated features confusing SHAP?",
      ]),
    ],
    dayQuestions: [
      "Compare filter, wrapper, and embedded feature selection — when do you reach for each?",
      "Why is L1 regularization effectively a feature selector?",
      "How does SHAP compute fair feature attributions and where can it mislead you?",
    ],
  });

  topic("ml-coding", {
    trackLabel: "ML · Coding from scratch",
    items: [
      item("ml-code-knn", "Code k-NN classifier from scratch", "https://github.com/alirezadir/Machine-Learning-Interviews/tree/main/src/MLC", "alirezadir", [
        "Implement k-NN from scratch and explain its time/space complexity.",
        "How would you speed up k-NN inference on millions of points without changing the prediction?",
      ]),
      item("ml-code-kmeans", "Code k-means from scratch", "https://github.com/alirezadir/Machine-Learning-Interviews/tree/main/src/MLC", "alirezadir", [
        "Implement k-means with k-means++ initialization.",
        "Why does k-means++ initialization matter, and what does it cost vs random init?",
      ]),
      item("ml-code-logreg", "Code logistic regression with SGD", "https://github.com/alirezadir/Machine-Learning-Interviews/tree/main/src/MLC", "alirezadir", [
        "Implement logistic regression with mini-batch SGD and L2 regularization.",
        "What numerical-stability pitfalls do you watch out for when implementing the sigmoid + log-loss?",
      ]),
    ],
    dayQuestions: [
      "Implement k-means with k-means++ initialization in 30 minutes.",
      "Implement logistic regression with mini-batch SGD and explain each step.",
      "Implement k-NN classifier and discuss time/space complexity.",
    ],
  });

  // ─────────────── OOPS / SWE ───────────────
  topic("oops-solid", {
    trackLabel: "SWE · OOPS & SOLID",
    items: [
      item("oops-pillars", "Encapsulation, inheritance, polymorphism, abstraction", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", "Read", [
        "Walk through the four pillars of OOP with code examples.",
        "When does composition beat inheritance?",
      ]),
      item("oops-solid-principles", "SOLID: SRP, OCP, LSP, ISP, DIP", "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design", "DigitalOcean", [
        "Walk through each SOLID principle with a real example.",
        "Which SOLID principle do you violate most often, and why?",
      ]),
      item("oops-design-mistakes", "Common OO design mistakes (god class, anemic models, deep inheritance)", "https://refactoring.guru/refactoring/smells", "Refactoring.guru", [
        "Spot a god class — what would you refactor it into?",
        "Why are deep inheritance hierarchies usually a smell, and what do you reach for instead?",
      ]),
    ],
  });

  topic("design-patterns", {
    trackLabel: "SWE · Design patterns",
    items: [
      item("dp-creational", "Creational: factory, builder, singleton", "https://refactoring.guru/design-patterns/creational-patterns", "Refactoring.guru", [
        "When is a singleton an anti-pattern in tests?",
        "Compare factory vs abstract factory vs builder.",
      ]),
      item("dp-structural", "Structural: adapter, decorator, facade", "https://refactoring.guru/design-patterns/structural-patterns", "Refactoring.guru", [
        "When would you reach for an adapter vs a facade?",
        "Where does the decorator pattern show up cleanly in an ML inference pipeline?",
      ]),
      item("dp-behavioral", "Behavioral: strategy, observer, command", "https://refactoring.guru/design-patterns/behavioral-patterns", "Refactoring.guru", [
        "Show how the strategy pattern lets you swap ML models without touching call sites.",
        "When does observer cause subtle bugs in a high-throughput system?",
      ]),
    ],
  });

  topic("concurrency", {
    trackLabel: "SWE · Concurrency in Python",
    items: [
      item("conc-gil", "Python GIL — what it does and doesn't lock", "https://realpython.com/python-gil/", "Real Python", [
        "Explain the GIL and why threading helps I/O-bound but not CPU-bound work in CPython.",
        "When does multiprocessing beat threading for ML workloads?",
      ]),
      item("conc-asyncio", "asyncio: event loop, coroutines, gather", "https://realpython.com/async-io-python/", "Real Python", [
        "When is asyncio the right choice over threads/processes?",
        "What are common pitfalls with mixing sync and async code?",
      ]),
      item("conc-patterns", "Producer-consumer, queues, futures", "https://docs.python.org/3/library/concurrent.futures.html", "Python docs", [
        "How would you parallelize an embarrassingly parallel inference workload?",
        "Compare ThreadPoolExecutor vs ProcessPoolExecutor — when does each fit, and what does the GIL mean here?",
      ]),
    ],
  });

  // ─────────────── DEEP LEARNING ───────────────
  topic("nn-basics", {
    trackLabel: "DL · Neural network foundations",
    items: [
      item("dl-perceptron", "Perceptron, MLP, forward pass", "https://www.deeplearning.ai/courses/deep-learning-specialization/", "DLS C1", [
        "Walk me through forward pass through a 2-layer MLP for binary classification.",
        "Why can't a single perceptron solve XOR — and how does adding a hidden layer fix it?",
      ]),
      item("dl-activations", "Activations: sigmoid, tanh, ReLU, GELU, SwiGLU", "https://en.wikipedia.org/wiki/Activation_function", "Read", [
        "Compare ReLU, Leaky ReLU, GELU, and SwiGLU — when does each shine?",
        "Why did ReLU largely replace sigmoid/tanh in deep networks?",
        "What is the dying ReLU problem and how do you mitigate it?",
      ]),
      item("dl-init", "Weight initialization (Xavier, He)", "https://www.deeplearning.ai/ai-notes/initialization/", "DLAI", [
        "Why does poor initialization cause vanishing or exploding gradients?",
        "Compare Xavier vs He initialization — which goes with which activation and why?",
      ]),
    ],
    dayQuestions: [
      "Walk me through the forward pass through a 2-layer MLP for binary classification.",
      "Why can't a single perceptron solve XOR, and how does adding a hidden layer fix it?",
      "Compare ReLU, Leaky ReLU, GELU, and SwiGLU — when does each shine?",
      "Why does poor initialization cause vanishing or exploding gradients?",
    ],
  });

  topic("backprop", {
    trackLabel: "DL · Backpropagation & autograd",
    items: [
      item("dl-backprop", "Backprop on a computation graph", "https://karpathy.ai/zero-to-hero.html", "Karpathy", [
        "Derive backprop for a 2-layer MLP with cross-entropy loss.",
        "Explain why automatic differentiation is reverse-mode for ML.",
      ]),
      item("dl-vanishing", "Vanishing & exploding gradients", "https://www.deeplearning.ai/ai-notes/initialization/", "DLAI", [
        "Why does a deep sigmoid network suffer vanishing gradients?",
        "How do residual connections, ReLU, and BN/LN help?",
      ]),
      item("dl-autograd", "PyTorch autograd in 30 minutes", "https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html", "PyTorch", [
        "When would you use torch.no_grad() and detach()?",
        "What does requires_grad=True actually do under the hood?",
      ]),
    ],
    dayQuestions: [
      "Derive backprop end-to-end for a 2-layer MLP with cross-entropy loss.",
      "Why does a deep sigmoid network suffer from vanishing gradients, and how do ReLU and residuals help?",
      "When would you use torch.no_grad() vs detach() in PyTorch — what's the difference?",
    ],
  });

  topic("dl-optimizers", {
    trackLabel: "DL · Optimizers in practice",
    items: [
      item("dl-sgd-momentum", "SGD, momentum, Nesterov", "https://ruder.io/optimizing-gradient-descent/", "Ruder", [
        "Why does momentum help SGD escape narrow ravines?",
        "How is Nesterov momentum different from plain momentum, and when does the difference matter?",
      ]),
      item("dl-adam-adamw", "Adam, AdamW, RMSprop", "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html", "fast.ai", [
        "Why is AdamW preferred over Adam when using weight decay?",
        "When would you ever pick SGD over Adam in deep learning?",
      ]),
      item("dl-lr-sched", "Warmup, cosine, OneCycle, step decay", "https://huggingface.co/docs/transformers/main_classes/optimizer_schedules", "HF", [
        "Why is learning rate warmup important for transformer training?",
        "Compare cosine vs step decay — when does each work better?",
      ]),
    ],
    dayQuestions: [
      "Compare Adam, AdamW, and SGD with momentum — which would you reach for first and why?",
      "Why is AdamW preferred over Adam when using weight decay?",
      "Why is learning-rate warmup critical for transformer training, and what schedule do you use after?",
    ],
  });

  topic("dl-regularization", {
    trackLabel: "DL · Regularization in deep nets",
    items: [
      item("dl-dropout", "Dropout: training vs inference, inverted dropout", "https://jmlr.org/papers/v15/srivastava14a.html", "JMLR", [
        "Why is dropout disabled at inference, and what is inverted dropout?",
        "Where does dropout work well, and where does it hurt (e.g., conv vs fully-connected)?",
      ]),
      item("dl-batchnorm", "BatchNorm vs LayerNorm vs GroupNorm vs RMSNorm", "https://arxiv.org/abs/1607.06450", "Ba et al.", [
        "Why does BN behave differently between train and eval mode?",
        "Why do transformers prefer LayerNorm over BatchNorm?",
        "What problem does RMSNorm solve in modern LLMs?",
      ]),
      item("dl-data-aug", "Data augmentation (vision, text, mixup)", "https://pytorch.org/vision/stable/transforms.html", "PyTorch", [
        "How does mixup regularize, and why does it improve calibration?",
        "Compare mixup vs CutMix vs RandAugment — when does each shine?",
      ]),
    ],
    dayQuestions: [
      "Why is dropout disabled at inference, and what is inverted dropout?",
      "Why do transformers prefer LayerNorm over BatchNorm?",
      "Compare BatchNorm, LayerNorm, GroupNorm, and RMSNorm — when does each fit?",
      "How does mixup regularize a classifier and why does it improve calibration?",
    ],
  });

  topic("dl-losses", {
    trackLabel: "DL · Loss functions in deep learning",
    items: [
      item("dl-ce", "Cross-entropy, NLL, label smoothing", "https://gombru.github.io/2018/05/23/cross_entropy_loss/", "Gombru", [
        "Why use cross-entropy instead of MSE for classification?",
        "What is label smoothing and why does it help calibration?",
      ]),
      item("dl-focal-contrastive", "Focal, contrastive, triplet, InfoNCE", "https://arxiv.org/abs/1708.02002", "Lin et al.", [
        "When does focal loss help, and how is it different from class weighting?",
        "What is contrastive loss (InfoNCE) and where is it used?",
      ]),
      item("dl-seq-loss", "Sequence losses: CTC, seq2seq cross-entropy", "https://distill.pub/2017/ctc/", "Distill", [
        "Walk me through CTC loss for speech recognition.",
        "Why does CTC need a blank token, and how does the alignment marginalization work?",
      ]),
    ],
    dayQuestions: [
      "Why use cross-entropy instead of MSE for classification — what breaks?",
      "When does focal loss actually help, and how is it different from class weighting?",
      "What is InfoNCE loss and where is it used in modern representation learning?",
    ],
  });

  topic("dl-training", {
    trackLabel: "DL · Training tricks that matter",
    items: [
      item("dl-grad-clip", "Gradient clipping, accumulation", "https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html", "PyTorch", [
        "When would you reach for gradient clipping?",
        "Why does gradient accumulation let you simulate a larger batch size?",
      ]),
      item("dl-mixed-prec", "Mixed precision (fp16, bf16, fp8)", "https://pytorch.org/docs/stable/amp.html", "PyTorch", [
        "Compare fp16 vs bf16 — why does bf16 matter for training stability?",
        "What is loss scaling and when do you still need it under bf16/fp8?",
      ]),
      item("dl-checkpoint", "Activation checkpointing for memory", "https://pytorch.org/docs/stable/checkpoint.html", "PyTorch", [
        "How does activation checkpointing trade compute for memory?",
        "When does activation checkpointing become NOT worth it — what's the typical compute overhead?",
      ]),
    ],
    dayQuestions: [
      "When would you reach for gradient clipping vs gradient accumulation?",
      "Compare fp16 vs bf16 vs fp8 — what changes for training stability?",
      "How does activation checkpointing trade compute for memory, and when is it worth it?",
    ],
  });

  topic("cnn-basics", {
    trackLabel: "DL · CNN basics",
    items: [
      item("cnn-conv", "Conv, padding, stride, dilation", "https://cs231n.github.io/convolutional-networks/", "CS231n", [
        "Walk me through how a conv layer works step by step.",
        "Compute the output shape of a 3×3 conv with stride 2 and padding 1 on a 32×32 input.",
        "What is dilation and where would you use it?",
      ]),
      item("cnn-pool", "Pooling, receptive field", "https://distill.pub/2019/computing-receptive-fields/", "Distill", [
        "What is the receptive field of a stack of 3 3×3 convs vs one 7×7 conv?",
        "Compare max pooling vs average pooling vs strided convolution — when does each fit?",
      ]),
      item("cnn-translation", "Translation invariance & equivariance", "https://arxiv.org/abs/1907.00657", "Read", [
        "Why are CNNs called translation-equivariant rather than translation-invariant?",
        "Where does global pooling at the end of a CNN buy you (approximate) translation invariance?",
      ]),
    ],
    dayQuestions: [
      "Walk me through how a conv layer computes its output, including padding, stride, and dilation.",
      "Compute the output shape of a 3×3 conv with stride 2 and padding 1 on a 32×32×3 input.",
      "What is the receptive field of a stack of 3 3×3 convs vs one 7×7 conv?",
      "Why are CNNs called translation-equivariant rather than translation-invariant?",
    ],
  });

  topic("cnn-architectures", {
    trackLabel: "DL · CNN architectures",
    items: [
      item("cnn-arch-list", "AlexNet → VGG → Inception → ResNet → DenseNet → EfficientNet", "https://cs231n.github.io/convolutional-networks/#case", "CS231n", [
        "What problem did ResNet's residual connections actually solve?",
        "Why did 1×1 convs become so important (Inception, bottleneck blocks)?",
      ]),
      item("cnn-resnet", "Why ResNet works: identity mappings", "https://arxiv.org/abs/1512.03385", "He et al.", [
        "Explain why training error went UP with depth before ResNet.",
        "Walk me through a residual block.",
      ]),
      item("cnn-eff", "Depthwise separable convs (MobileNet, EfficientNet)", "https://arxiv.org/abs/1905.11946", "EfficientNet", [
        "How do depthwise separable convolutions reduce compute?",
        "What does EfficientNet's compound scaling do that one-axis scaling doesn't?",
      ]),
    ],
    dayQuestions: [
      "What problem did ResNet's residual connections actually solve?",
      "Why are 1×1 convolutions so important — Inception modules and bottleneck blocks?",
      "How do depthwise separable convolutions reduce compute, and where does MobileNet use them?",
    ],
  });

  topic("cnn-transfer", {
    trackLabel: "DL · Transfer learning for vision",
    items: [
      item("cnn-tl", "Feature extraction vs fine-tuning", "https://www.fast.ai/", "fast.ai", [
        "When do you freeze the backbone vs fine-tune end-to-end?",
        "Why do you usually fine-tune with a lower learning rate than training from scratch?",
      ]),
      item("cnn-aug", "Augmentation strategies (RandAugment, AutoAugment)", "https://arxiv.org/abs/1909.13719", "RandAugment", [
        "Compare AutoAugment vs RandAugment — what's the simplification?",
        "When does heavy augmentation hurt instead of help — what's the failure mode?",
      ]),
    ],
    dayQuestions: [
      "When do you freeze the backbone vs fine-tune end-to-end in transfer learning?",
      "Why do you fine-tune with a lower learning rate than training from scratch?",
      "Compare AutoAugment vs RandAugment — what's the simplification and why does it matter?",
    ],
  });

  topic("detection-segmentation", {
    trackLabel: "DL · Detection & segmentation",
    items: [
      item("cv-detection", "R-CNN family, YOLO, DETR", "https://lilianweng.github.io/posts/2017-12-31-object-recognition-part-3/", "Lilian Weng", [
        "Compare two-stage (Faster R-CNN) vs one-stage (YOLO) detectors.",
        "How does DETR remove the need for NMS and anchor boxes?",
      ]),
      item("cv-segmentation", "Semantic vs instance segmentation; U-Net & Mask R-CNN", "https://arxiv.org/abs/1505.04597", "U-Net", [
        "How does U-Net's skip connection design help with segmentation?",
        "Compare semantic vs instance vs panoptic segmentation — when do you reach for each?",
      ]),
      item("cv-eval", "mAP, IoU, panoptic quality", "https://cocodataset.org/#detection-eval", "COCO", [
        "Define mAP at IoU=0.5:0.95 — what does each piece mean?",
        "Why does NMS need careful tuning, and what does it break when set wrong?",
      ]),
    ],
    dayQuestions: [
      "Compare two-stage (Faster R-CNN) vs one-stage (YOLO) detectors — speed/accuracy trade-offs.",
      "How does DETR remove the need for NMS and anchor boxes?",
      "How does U-Net's skip connection design help with segmentation?",
      "Define mAP at IoU=0.5:0.95 — what does each piece mean?",
    ],
  });

  topic("vit-clip", {
    trackLabel: "DL · ViT, CLIP, multimodal",
    items: [
      item("cv-vit", "Vision Transformer (ViT)", "https://arxiv.org/abs/2010.11929", "Google", [
        "How does ViT tokenize an image, and what's the role of the [CLS] token?",
        "When does a ViT beat a CNN, and when does data-hungriness hurt it?",
      ]),
      item("cv-clip", "CLIP: contrastive image-text pretraining", "https://arxiv.org/abs/2103.00020", "OpenAI", [
        "How does CLIP enable zero-shot image classification?",
        "Walk me through CLIP's contrastive training objective.",
      ]),
      item("cv-multimodal", "BLIP, LLaVA, multimodal LLMs", "https://arxiv.org/abs/2304.08485", "LLaVA", [
        "How do multimodal LLMs like LLaVA fuse vision encoders with language models?",
        "Compare early fusion vs late fusion in vision-language models — what does each cost in compute and quality?",
      ]),
    ],
    dayQuestions: [
      "How does ViT tokenize an image, and what's the role of the [CLS] token?",
      "How does CLIP enable zero-shot image classification?",
      "Walk me through CLIP's contrastive training objective end-to-end.",
      "How do multimodal LLMs like LLaVA fuse a vision encoder with a language model?",
    ],
  });

  topic("generative-vision", {
    trackLabel: "DL · Generative vision (VAE, GAN, Diffusion)",
    items: [
      item("dl-vae", "Variational Autoencoders", "https://lilianweng.github.io/posts/2018-08-12-vae/", "Lilian Weng", [
        "Walk through VAE's evidence lower bound (ELBO).",
        "Why is the reparameterization trick necessary?",
      ]),
      item("dl-gan", "GANs: generator/discriminator, mode collapse", "https://lilianweng.github.io/posts/2017-08-20-gan/", "Lilian Weng", [
        "What is mode collapse in GANs and what fixes it?",
        "Walk me through Wasserstein GAN — why does the new loss stabilize training?",
      ]),
      item("dl-diffusion", "Diffusion models (DDPM, latent diffusion)", "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/", "Lilian Weng", [
        "Walk me through the forward and reverse processes in DDPM.",
        "What does latent diffusion (Stable Diffusion) do differently?",
      ]),
    ],
    dayQuestions: [
      "Walk through the VAE evidence lower bound (ELBO) and the reparameterization trick.",
      "What is mode collapse in GANs, and what techniques fix it?",
      "Walk me through the forward and reverse processes in a DDPM diffusion model.",
      "Why does latent diffusion (Stable Diffusion) work in latent space instead of pixel space?",
    ],
  });

  // ─────────────── NLP ───────────────
  topic("nlp-foundations", {
    trackLabel: "NLP · Foundations",
    items: [
      item("nlp-tokenization", "Tokenization: BPE, WordPiece, SentencePiece, Unigram", "https://huggingface.co/docs/transformers/tokenizer_summary", "HF", [
        "Compare BPE, WordPiece, and SentencePiece tokenizers.",
        "Why does tokenizer choice affect cross-lingual performance?",
      ]),
      item("nlp-embeddings", "Word2Vec, GloVe, FastText, contextual embeddings", "https://jalammar.github.io/illustrated-word2vec/", "Jay Alammar", [
        "Walk through how word2vec (skip-gram) is trained.",
        "How are contextual embeddings (BERT) different from static ones (word2vec)?",
      ]),
      item("nlp-tasks", "Classic NLP tasks (NER, POS, SRL, parsing)", "https://web.stanford.edu/class/cs224n/", "CS224n", [
        "Compare token-level (NER) vs sequence-level (classification) tasks.",
        "Why is dependency parsing harder than POS tagging, and where does it still matter today?",
      ]),
    ],
    dayQuestions: [
      "Compare BPE, WordPiece, and SentencePiece tokenizers — when do you reach for each?",
      "Walk through how word2vec skip-gram is trained, and contrast static vs contextual embeddings.",
      "Why does tokenizer choice strongly affect cross-lingual model performance?",
    ],
  });

  topic("rnn-lstm", {
    trackLabel: "DL · RNN, LSTM, GRU",
    items: [
      item("dl-rnn", "RNN forward + truncated BPTT", "https://www.deeplearning.ai/courses/deep-learning-specialization/", "DLS C5", [
        "Why do vanilla RNNs struggle with long-term dependencies?",
        "Walk through truncated backprop-through-time — why is it the practical default?",
      ]),
      item("dl-lstm", "LSTM cell: gates and cell state", "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", "colah", [
        "Walk through an LSTM cell: forget, input, output gates and cell state.",
        "How does the cell state help with vanishing gradients?",
      ]),
      item("dl-gru", "GRU vs LSTM", "https://arxiv.org/abs/1412.3555", "Chung et al.", [
        "When would you pick GRU over LSTM?",
        "What does GRU's update gate do that LSTM splits across forget + input gates?",
      ]),
    ],
    dayQuestions: [
      "Walk through an LSTM cell — what each gate does and how the cell state helps with vanishing gradients.",
      "Why do vanilla RNNs struggle with long-term dependencies?",
      "When would you pick GRU over LSTM?",
    ],
  });

  topic("attention-transformer", {
    trackLabel: "DL · Attention & Transformer",
    items: [
      item("dl-attention", "Self-attention(Q, K, V) end-to-end", "https://jalammar.github.io/illustrated-transformer/", "Jay Alammar", [
        "Walk me through self-attention(Q, K, V) end-to-end.",
        "Why divide by √d_k inside softmax?",
        "What does multi-head attention buy you over a single head?",
      ]),
      item("dl-transformer", "Encoder-decoder, positional encoding, residuals", "https://arxiv.org/abs/1706.03762", "Vaswani et al.", [
        "Walk me through the transformer block: attention → add+norm → FFN → add+norm.",
        "Compare absolute vs relative vs RoPE positional encodings.",
      ]),
      item("dl-attn-variants", "Sparse, linear, FlashAttention, MQA, GQA", "https://arxiv.org/abs/2205.14135", "FlashAttention", [
        "What problem does FlashAttention solve, and how?",
        "Compare MHA, MQA, and GQA — KV-cache trade-offs.",
      ]),
    ],
    dayQuestions: [
      "Walk me through self-attention(Q, K, V) end-to-end including the √d_k scaling.",
      "What does multi-head attention buy you over a single head?",
      "Compare absolute, relative, and rotary (RoPE) positional encodings.",
      "What problem does FlashAttention solve, and how does it speed up training?",
      "Compare MHA vs MQA vs GQA — what changes in the KV cache?",
    ],
  });

  topic("bert-t5-gpt", {
    trackLabel: "NLP · Pretrained models (BERT, T5, GPT)",
    items: [
      item("nlp-bert", "BERT: MLM + NSP, encoder-only", "https://arxiv.org/abs/1810.04805", "Devlin et al.", [
        "Walk through BERT's MLM and NSP objectives.",
        "Why is BERT bidirectional while GPT is left-to-right?",
        "How would you fine-tune BERT for token classification (NER)?",
      ]),
      item("nlp-t5-bart", "T5 / BART: encoder-decoder", "https://arxiv.org/abs/1910.10683", "Raffel et al.", [
        "What is T5's text-to-text framing, and what does it enable?",
        "Compare BART vs T5 for summarization.",
      ]),
      item("nlp-gpt", "GPT: decoder-only, causal LM", "https://openai.com/research/language-unsupervised", "OpenAI", [
        "Why did decoder-only models win the LLM race?",
        "What does the causal-LM objective give you that masked-LM doesn't, and vice versa?",
      ]),
    ],
    dayQuestions: [
      "Walk through BERT's MLM and NSP pretraining objectives — and why later models dropped NSP.",
      "Compare encoder-only (BERT), decoder-only (GPT), and encoder-decoder (T5) — when do you reach for each?",
      "How would you fine-tune BERT for NER vs sentence classification — what changes?",
    ],
  });

  topic("nlp-tasks-deep", {
    trackLabel: "NLP · Practical tasks",
    items: [
      item("nlp-ner", "Named-entity recognition: BIO tagging, span-based", "https://huggingface.co/learn/nlp-course/chapter7/2", "HF", [
        "Compare BIO tagging vs span-based NER models.",
        "How would you evaluate a NER model — token-level F1 vs entity-level F1, and which actually matters?",
      ]),
      item("nlp-summarization", "Extractive vs abstractive summarization", "https://huggingface.co/learn/nlp-course/chapter7/5", "HF", [
        "How would you evaluate a summarization model — ROUGE vs BERTScore vs LLM-as-judge?",
        "Compare extractive vs abstractive summarization — when is each the right tool?",
      ]),
      item("nlp-translation", "Machine translation: BLEU, beam search", "https://huggingface.co/learn/nlp-course/chapter7/4", "HF", [
        "Why is beam search standard for translation but not for open-ended generation?",
        "What is BLEU actually measuring, and where does it mislead?",
      ]),
    ],
    dayQuestions: [
      "How would you evaluate a summarization model — ROUGE, BERTScore, or LLM-as-judge?",
      "Compare BIO tagging vs span-based NER — pros and cons of each approach.",
      "Why is beam search standard for translation but not for open-ended generation?",
    ],
  });

  // ─────────────── MLOPS ───────────────
  topic("ml-lifecycle", {
    trackLabel: "MLOps · ML lifecycle",
    items: [
      item("mlops-lifecycle", "Lifecycle: data → train → eval → deploy → monitor → retrain", "https://madewithml.com/", "Made with ML", [
        "Walk through the end-to-end ML lifecycle and the failure modes at each stage.",
        "Where do most ML projects actually fail in the lifecycle, and what catches it earlier?",
      ]),
      item("mlops-roles", "ML roles: research, applied, MLE, MLOps, platform", "https://huyenchip.com/2022/06/30/mlops-platform.html", "Chip Huyen", [
        "Compare the responsibilities of an ML researcher vs an MLE vs an MLOps engineer.",
        "When does a company actually need a dedicated ML platform team — and what's the smallest valid platform?",
      ]),
      item("mlops-team", "Team topology & ownership boundaries", "https://eugeneyan.com/writing/mlops-team-structure/", "Eugene Yan", [
        "How would you structure an ML team at a 50-person startup vs a 5,000-person company?",
        "Where do ownership disputes typically erupt between data, ML, and platform teams — and how do you preempt them?",
      ]),
    ],
    dayQuestions: [
      "Walk through the end-to-end ML lifecycle and the failure modes at each stage.",
      "Compare the responsibilities of an ML researcher vs an MLE vs an MLOps engineer.",
      "How would you structure an ML team at a 50-person startup vs a 5,000-person company?",
    ],
  });

  topic("feature-stores", {
    trackLabel: "MLOps · Feature stores",
    items: [
      item("mlops-fs-why", "Why feature stores: training/serving skew, reuse", "https://www.tecton.ai/blog/what-is-a-feature-store/", "Tecton", [
        "What is training/serving skew and how does a feature store eliminate it?",
        "When is a feature store overkill?",
      ]),
      item("mlops-fs-tools", "Feast, Tecton, Vertex Feature Store", "https://docs.feast.dev/", "Feast", [
        "Walk through how Feast separates the offline and online stores.",
        "Compare Feast vs Tecton vs Vertex Feature Store — when does each fit?",
      ]),
      item("mlops-fs-pit", "Point-in-time correctness", "https://www.tecton.ai/blog/time-travel-in-ml/", "Tecton", [
        "Why is point-in-time correctness critical for training data, and how does feature store handle it?",
        "Walk me through how a leak from forward-looking features actually breaks model rollout.",
      ]),
    ],
    dayQuestions: [
      "What is training/serving skew, and how does a feature store eliminate it?",
      "Why is point-in-time correctness critical for training data, and how does a feature store handle it?",
      "When is a feature store overkill — what's the smaller alternative?",
    ],
  });

  topic("model-registry", {
    trackLabel: "MLOps · Model registry & versioning",
    items: [
      item("mlops-mlflow", "MLflow registry: stages, lineage, model cards", "https://mlflow.org/docs/latest/model-registry.html", "MLflow", [
        "Walk through promoting a model from staging → production in MLflow.",
        "Why is lineage (data → model → deployment) important for compliance?",
      ]),
      item("mlops-versioning", "Versioning: code + data + model + features", "https://dvc.org/doc", "DVC", [
        "Why is versioning data as important as versioning code in ML?",
        "What does DVC give you that git-LFS doesn't?",
      ]),
      item("mlops-model-cards", "Model cards & documentation", "https://modelcards.withgoogle.com/", "Google", [
        "What goes into a useful model card for a production model?",
        "How would you keep a model card honest and up-to-date as the model retrains?",
      ]),
    ],
    dayQuestions: [
      "Walk through promoting a model from staging → production in MLflow.",
      "Why is versioning data as important as versioning code in ML?",
      "What goes into a useful model card for a production model?",
    ],
  });

  topic("training-pipelines", {
    trackLabel: "MLOps · Training pipelines & experiment tracking",
    items: [
      item("mlops-pipelines", "Pipeline orchestrators: Airflow, Prefect, Kubeflow, Metaflow", "https://www.kubeflow.org/", "Kubeflow", [
        "Compare Airflow vs Prefect vs Kubeflow for ML pipelines.",
        "When does an ML team outgrow Airflow?",
      ]),
      item("mlops-tracking", "Experiment tracking: MLflow, W&B, Comet", "https://docs.wandb.ai/", "W&B", [
        "What metadata do you log for every training run?",
        "How would you reconstruct a 6-month-old training run from your tracking metadata?",
      ]),
      item("mlops-repro", "Reproducibility: seeds, environments, lockfiles", "https://huggingface.co/docs/transformers/main_classes/trainer", "HF Trainer", [
        "Why does setting a seed not guarantee reproducibility on GPUs?",
        "What three artifacts MUST you pin to make an ML training run actually reproducible?",
      ]),
    ],
    dayQuestions: [
      "Compare Airflow vs Prefect vs Kubeflow for ML pipelines — when does each fit?",
      "What metadata do you log for every training run, and why does it matter?",
      "Why does setting a seed not guarantee bit-perfect reproducibility on GPUs?",
    ],
  });

  topic("ci-cd-ml", {
    trackLabel: "MLOps · CI/CD for ML",
    items: [
      item("mlops-cicd", "CI/CD pipelines: code, data, model, deployment", "https://martinfowler.com/articles/cd4ml.html", "Martin Fowler", [
        "How does CI/CD for ML differ from traditional CI/CD?",
        "What are the four levels of MLOps maturity (Google's framing)?",
      ]),
      item("mlops-cicd-tests", "Testing ML systems: unit, integration, model, data", "https://eugeneyan.com/writing/testing-ml/", "Eugene Yan", [
        "What kinds of tests do you write specifically for ML code?",
        "What is a behavioral test (CheckList) for an NLP model?",
      ]),
      item("mlops-shadow", "Shadow deployments & blue/green for ML", "https://martinfowler.com/articles/cd4ml.html", "Martin Fowler", [
        "Compare shadow, canary, and blue/green deployments for ML.",
        "What's the operational cost of running a shadow deployment for weeks before you cut over?",
      ]),
    ],
    dayQuestions: [
      "How does CI/CD for ML differ from traditional CI/CD — what extra pipelines do you need?",
      "What kinds of tests do you write specifically for ML code (unit, integration, model, data)?",
      "Compare shadow, canary, and blue/green deployments for ML — when does each fit?",
    ],
  });

  topic("deployment-patterns", {
    trackLabel: "MLOps · Deployment patterns",
    items: [
      item("mlops-batch-rt", "Batch vs real-time vs streaming inference", "https://huyenchip.com/2020/12/27/real-time-machine-learning.html", "Chip Huyen", [
        "Compare batch, real-time, and streaming inference — when do you reach for each?",
        "What's the latency budget for an ad CTR model vs a churn model?",
      ]),
      item("mlops-edge", "Edge deployment & on-device ML", "https://pytorch.org/mobile/home/", "PyTorch Mobile", [
        "When does on-device ML beat cloud inference, and what are the constraints?",
        "What model-side techniques (quantization, pruning, distillation) actually move the needle for mobile?",
      ]),
      item("mlops-async", "Async inference & queues", "https://aws.amazon.com/blogs/machine-learning/announcing-the-launch-of-new-hugging-face-llm-inference-containers-on-amazon-sagemaker/", "AWS", [
        "When would you use async inference behind a queue?",
        "How do you size a queue worker pool for spiky inference traffic without over-provisioning?",
      ]),
    ],
    dayQuestions: [
      "Compare batch, real-time, and streaming inference — when do you reach for each?",
      "What's the latency budget for an ad CTR model vs a churn model — how does that change architecture?",
      "When does on-device ML beat cloud inference, and what are the engineering constraints?",
    ],
  });

  topic("serving-infra", {
    trackLabel: "MLOps · Serving infrastructure",
    items: [
      item("mlops-serving", "Model servers: TorchServe, Triton, BentoML, Seldon", "https://github.com/triton-inference-server/server", "Triton", [
        "Compare TorchServe, Triton, and BentoML — when does each fit?",
        "What is dynamic batching and why does it matter for GPU utilization?",
      ]),
      item("mlops-k8s", "Containerization & Kubernetes for ML", "https://www.kubeflow.org/docs/", "Kubeflow", [
        "Walk through deploying a model on Kubernetes with autoscaling.",
        "When do you reach for KServe vs custom Deployment + HPA?",
      ]),
      item("mlops-routing", "Traffic routing, model rollback, A/B serving", "https://kserve.github.io/website/", "KServe", [
        "How would you do a safe rollback when a new model regresses online metrics?",
        "What guardrail metrics would automatically trigger a rollback without a human in the loop?",
      ]),
    ],
    dayQuestions: [
      "Compare TorchServe, Triton, and BentoML — when does each fit?",
      "What is dynamic batching, and why does it matter for GPU utilization?",
      "Walk through deploying a model on Kubernetes with autoscaling — what knobs matter?",
    ],
  });

  topic("monitoring-drift", {
    trackLabel: "MLOps · Monitoring & drift",
    items: [
      item("mlops-drift", "Data drift, concept drift, label drift", "https://docs.evidentlyai.com/", "Evidently", [
        "Compare data drift vs concept drift vs label drift — give an example of each.",
        "Walk through three statistical tests you'd use to detect drift (PSI, KS, JS).",
      ]),
      item("mlops-monitor", "Monitoring stack: predictions, latency, errors", "https://docs.arize.com/", "Arize", [
        "What metrics do you monitor for a deployed model beyond accuracy?",
        "How would you slice your model monitoring dashboard so a regression in one cohort doesn't get masked?",
      ]),
      item("mlops-feedback", "Closed-loop monitoring & retraining triggers", "https://eugeneyan.com/writing/monitoring-ml-systems/", "Eugene Yan", [
        "How would you decide when to retrain — schedule vs trigger-based?",
        "How do you monitor when ground-truth labels arrive with delay?",
      ]),
    ],
    dayQuestions: [
      "Compare data drift, concept drift, and label drift — give a real example of each.",
      "Walk through three statistical tests for detecting drift (PSI, KS, JS) — when does each apply?",
      "What metrics do you monitor for a deployed model beyond accuracy?",
      "How would you monitor a model when ground-truth labels arrive with weeks of delay?",
    ],
  });

  topic("ab-prod", {
    trackLabel: "MLOps · Online experimentation",
    items: [
      item("mlops-ab", "A/B testing for models: lift, guardrails, ramp", "https://eugeneyan.com/writing/ab-testing-and-beyond/", "Eugene Yan", [
        "How is A/B testing a model different from A/B testing a UI feature?",
        "What guardrail metrics do you track on every model launch?",
      ]),
      item("mlops-canary", "Canary, shadow, interleaving", "https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html", "Chip Huyen", [
        "When does interleaving beat A/B for ranking systems?",
        "What's the smallest canary slice that's still statistically meaningful for a ranking model?",
      ]),
      item("mlops-causal", "Counterfactual & off-policy evaluation", "https://eugeneyan.com/writing/counterfactual-evaluation/", "Eugene Yan", [
        "What is off-policy evaluation, and where does it show up in recommender systems?",
        "Compare IPS vs doubly-robust off-policy estimators — when does each fall apart?",
      ]),
    ],
    dayQuestions: [
      "How is A/B testing a model different from A/B testing a UI feature?",
      "When does interleaving beat A/B testing for ranking systems?",
      "What is off-policy evaluation, and where does it show up in recommender systems?",
    ],
  });

  topic("cost-scale", {
    trackLabel: "MLOps · Cost & scaling",
    items: [
      item("mlops-cost", "Cost modeling: training vs inference, batching, autoscaling", "https://huyenchip.com/2023/04/11/llm-engineering.html", "Chip Huyen", [
        "How would you model the unit cost of a prediction in production?",
        "What levers reduce inference cost (batching, quantization, caching, distillation)?",
      ]),
      item("mlops-autoscale", "Autoscaling: HPA, KEDA, queue-based", "https://keda.sh/", "KEDA", [
        "Compare CPU-based HPA vs queue-based KEDA scaling for ML inference.",
        "Why does GPU-pinned inference often defeat HPA, and how do you actually scale GPU pods?",
      ]),
      item("mlops-spot", "Spot/preemptible instances for training", "https://cloud.google.com/architecture/run-cost-effective-deep-learning-workloads", "Google", [
        "How would you train safely on spot instances (checkpointing, retries)?",
        "When does spot training become NET more expensive than on-demand — what's the breakeven?",
      ]),
    ],
    dayQuestions: [
      "How would you model the unit cost of a prediction in production?",
      "What levers actually reduce inference cost (batching, quantization, caching, distillation)?",
      "How would you train safely on spot/preemptible instances — what do you need to handle?",
    ],
  });

  topic("privacy-security", {
    trackLabel: "MLOps · Privacy & security",
    items: [
      item("mlops-pii", "PII handling, anonymization, k-anonymity", "https://en.wikipedia.org/wiki/K-anonymity", "Read", [
        "How would you remove PII from training data without destroying signal?",
        "Compare hashing vs tokenization vs full redaction for PII fields — when does each fit?",
      ]),
      item("mlops-dp", "Differential privacy basics", "https://github.com/google/differential-privacy", "Google", [
        "Explain differential privacy in one minute — what does ε mean?",
        "How does DP-SGD differ from regular SGD, and what does it cost in accuracy?",
      ]),
      item("mlops-fed", "Federated learning", "https://federated.withgoogle.com/", "Google", [
        "When is federated learning the right choice over centralized training?",
        "What are the systems-side challenges in federated learning beyond the algorithm?",
      ]),
      item("mlops-attacks", "Adversarial & model-extraction attacks", "https://ai.googleblog.com/2018/02/adversarial-examples-on-real.html", "Google", [
        "What is a model-extraction attack, and how do you mitigate it?",
        "How would you defend a public ML API from membership-inference attacks?",
      ]),
    ],
    dayQuestions: [
      "How would you remove PII from training data without destroying signal?",
      "Explain differential privacy in plain English — what does ε mean and what does it cost in accuracy?",
      "When is federated learning the right choice over centralized training?",
    ],
  });

  topic("multi-tenant", {
    trackLabel: "MLOps · Multi-tenant & multi-region",
    items: [
      item("mlops-mt", "Multi-tenant model serving (per-tenant fine-tuning, isolation)", "https://www.anyscale.com/blog/turbo-charging-llm-fine-tuning-with-anyscale", "Anyscale", [
        "Compare per-tenant fine-tuned models vs a shared base model with adapters (LoRA).",
        "How would you isolate a noisy or abusive tenant from degrading other tenants' latency?",
      ]),
      item("mlops-region", "Multi-region serving & data residency", "https://cloud.google.com/architecture/best-practices-vpc-design", "Google", [
        "How do data-residency requirements (e.g., EU data stays in EU) shape your serving topology?",
        "What's the failover playbook when a region serving model traffic goes down?",
      ]),
      item("mlops-noisy", "Noisy neighbor & QoS", "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "k8s", [
        "How would you protect a critical model from noisy-neighbor latency on shared infra?",
        "Compare priority classes, resource quotas, and dedicated node pools for QoS — when does each fit?",
      ]),
    ],
    dayQuestions: [
      "Compare per-tenant fine-tuned models vs a shared base model with LoRA adapters — when does each win?",
      "How do data-residency requirements (e.g., EU data stays in EU) shape your serving topology?",
      "How would you protect a critical model from noisy-neighbor latency on shared infra?",
    ],
  });

  topic("observability", {
    trackLabel: "MLOps · Observability for ML",
    items: [
      item("mlops-obs", "Logs, metrics, traces for ML systems", "https://opentelemetry.io/", "OpenTelemetry", [
        "What's the difference between logs, metrics, and traces, and what does each tell you?",
        "How would you trace a single user request through retrieval → LLM → tool calls and back?",
      ]),
      item("mlops-llm-obs", "LLM-specific observability: tokens, latency, cost", "https://docs.smith.langchain.com/", "LangSmith", [
        "What dimensions do you slice LLM observability by (model, prompt, user, tool)?",
        "How would you detect prompt regressions on production traffic without leaking PII to humans?",
      ]),
      item("mlops-alerts", "Alerts & on-call for ML systems", "https://sre.google/workbook/practical-alerting/", "Google SRE", [
        "What's a meaningful SLO for an ML inference service?",
        "How do you avoid alert fatigue from noisy ML metrics — what's a sane page-worthy threshold?",
      ]),
    ],
    dayQuestions: [
      "What's the difference between logs, metrics, and traces, and what does each tell you about an ML system?",
      "What dimensions do you slice LLM observability by (model, prompt, user, tool)?",
      "What's a meaningful SLO for an ML inference service, and how do you alert on it?",
    ],
  });

  topic("build-vs-buy", {
    trackLabel: "MLOps · Build vs buy",
    items: [
      item("mlops-bvb", "Framework: build vs buy for ML platform components", "https://eugeneyan.com/writing/applied-mlops-resources/", "Eugene Yan", [
        "Walk through your decision framework for build vs buy on an ML platform component.",
        "What recurring failure modes have you seen when teams 'build' something that should have been 'bought'?",
      ]),
      item("mlops-vendor-eval", "Evaluating ML/AI vendors", "https://www.latent.space/", "Latent Space", [
        "What axes would you use to evaluate an LLM API vendor?",
        "How do you de-risk vendor lock-in when you adopt a hosted ML service?",
      ]),
    ],
    dayQuestions: [
      "Walk through your decision framework for build vs buy on an ML platform component.",
      "What axes would you use to evaluate an LLM API vendor for production use?",
    ],
  });

  // ─────────────── GENERATIVE AI ───────────────
  topic("llm-basics", {
    trackLabel: "GenAI · LLM foundations",
    items: [
      item("llm-pretraining", "Pretraining: data, scaling laws (Chinchilla)", "https://arxiv.org/abs/2203.15556", "Hoffmann et al.", [
        "Walk me through Chinchilla scaling laws — what's the data:parameters ratio?",
        "Why has 'compute-optimal' training overtaken 'parameter-optimal' as the design target?",
      ]),
      item("llm-arch", "Decoder-only transformer for LLMs", "https://jalammar.github.io/illustrated-gpt2/", "Jay Alammar", [
        "Walk me through one forward pass of a decoder-only LLM at inference time.",
        "What is the KV cache and why is it so important?",
      ]),
      item("llm-emergent", "Emergent abilities & in-context learning", "https://arxiv.org/abs/2206.07682", "Wei et al.", [
        "Define 'emergent abilities' in LLMs — and why some researchers say they're a measurement artifact.",
        "What does the 'mirage' paper claim, and how does the choice of metric drive apparent emergence?",
      ]),
    ],
    dayQuestions: [
      "Walk me through Chinchilla scaling laws — what's the data:parameters ratio?",
      "Walk through one forward pass of a decoder-only LLM at inference time, including the KV cache.",
      "What does 'emergent abilities' mean in LLMs and why is the framing controversial?",
    ],
  });

  topic("tokenization-deep", {
    trackLabel: "GenAI · Tokenization deep-dive",
    items: [
      item("llm-bpe", "BPE algorithm step-by-step", "https://huggingface.co/learn/nlp-course/chapter6/5", "HF", [
        "Walk through the BPE training algorithm.",
        "Why does BPE result in different tokenizations for similar words across languages?",
      ]),
      item("llm-vocab", "Vocabulary size trade-offs", "https://huggingface.co/docs/transformers/tokenizer_summary", "HF", [
        "Why is vocabulary size a critical design choice — what does increasing it cost?",
        "How does vocab size affect throughput and memory of the embedding + LM-head layers?",
      ]),
      item("llm-tokenization-issues", "Tokenization quirks: numbers, code, multilingual", "https://www.beren.io/2023-07-05-Tokenization-and-its-discontents/", "Read", [
        "Why do LLMs struggle with arithmetic, and how does tokenization contribute?",
        "Why are non-Latin-script languages disproportionately expensive to serve, and how do you fix it?",
      ]),
    ],
    dayQuestions: [
      "Walk through the BPE training algorithm step by step.",
      "Why does vocabulary size matter — what does doubling it cost in compute and memory?",
      "Why do LLMs struggle with arithmetic, and how does tokenization contribute?",
    ],
  });

  topic("llm-decoding", {
    trackLabel: "GenAI · Decoding strategies",
    items: [
      item("llm-decoding-strats", "Greedy, beam, top-k, top-p, temperature", "https://huggingface.co/blog/how-to-generate", "HF", [
        "Compare greedy, beam, top-k, and nucleus (top-p) decoding.",
        "Why is beam search usually a bad choice for open-ended generation?",
        "What does temperature actually do to the softmax distribution?",
      ]),
      item("llm-speculative", "Speculative decoding & draft models", "https://arxiv.org/abs/2211.17192", "Leviathan et al.", [
        "How does speculative decoding speed up inference without hurting quality?",
        "Why doesn't speculative decoding always help — what's the relationship between draft acceptance rate and speedup?",
      ]),
      item("llm-constrained", "Constrained / structured decoding (JSON mode, grammars)", "https://github.com/outlines-dev/outlines", "Outlines", [
        "How would you force an LLM to emit valid JSON — and what are the failure modes?",
        "Compare grammar-constrained decoding vs prompt-+-retry-+-validate — when does each fit?",
      ]),
    ],
    dayQuestions: [
      "Compare greedy, beam, top-k, and nucleus (top-p) decoding — when do you reach for each?",
      "Why is beam search usually a bad choice for open-ended generation?",
      "How does speculative decoding speed up inference without hurting quality?",
      "How would you force an LLM to emit valid JSON, and what are the failure modes?",
    ],
  });

  topic("prompting", {
    trackLabel: "GenAI · Prompt engineering",
    items: [
      item("llm-prompt-basics", "Zero-shot, few-shot, system vs user", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "Anthropic", [
        "When does few-shot help vs hurt?",
        "How do you design a system prompt for a customer-support agent?",
      ]),
      item("llm-cot", "Chain-of-thought, ReAct, ToT", "https://arxiv.org/abs/2201.11903", "Wei et al.", [
        "Walk through how chain-of-thought prompting changes performance on reasoning tasks.",
        "When does CoT hurt accuracy?",
      ]),
      item("llm-prompt-attacks", "Prompt injection & jailbreaks", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "Anthropic", [
        "How would you defend a customer-facing LLM against prompt injection from user-supplied content?",
        "Why is 'just tell the model to ignore injection' insufficient — what's the actual defense-in-depth?",
      ]),
    ],
    dayQuestions: [
      "When does chain-of-thought prompting hurt accuracy instead of helping?",
      "Walk me through designing a system prompt for a customer-support agent.",
      "How would you defend a customer-facing LLM against prompt injection from user-supplied content?",
      "When does few-shot prompting help vs hurt — what's the rule of thumb?",
    ],
  });

  topic("function-calling", {
    trackLabel: "GenAI · Tool use & function calling",
    items: [
      item("llm-fc", "Function calling: schemas, parsing, retries", "https://platform.openai.com/docs/guides/function-calling", "OpenAI", [
        "Walk through how function calling works under the hood — what does the model actually emit?",
        "How do you handle a model that hallucinates a tool call with bad arguments?",
      ]),
      item("llm-tools-design", "Designing tool catalogs for agents", "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", "Anthropic", [
        "How would you design a tool catalog for a research agent — what are the trade-offs in granularity?",
        "Why do agents perform worse when you give them too many tools, and what's a good cutoff?",
      ]),
      item("llm-mcp", "Model Context Protocol (MCP)", "https://modelcontextprotocol.io/", "MCP", [
        "What problem does MCP solve compared to ad-hoc function calling?",
        "Walk me through how an MCP server is built and what guarantees the protocol gives you.",
      ]),
    ],
    dayQuestions: [
      "Walk through how function calling works under the hood — what does the model actually emit?",
      "How do you handle a model that hallucinates a tool call with bad arguments?",
      "What problem does MCP solve compared to ad-hoc function calling?",
    ],
  });

  topic("reasoning-models", {
    trackLabel: "GenAI · Reasoning models (o1, o3, thinking)",
    items: [
      item("llm-o1", "o1 / o3: long reasoning, RL on reasoning traces", "https://openai.com/index/learning-to-reason-with-llms/", "OpenAI", [
        "How do reasoning models like o1 differ from standard chat LLMs?",
        "When are reasoning models worth their cost, and when are they overkill?",
      ]),
      item("llm-thinking", "Claude extended thinking & test-time compute", "https://www.anthropic.com/news/visible-extended-thinking", "Anthropic", [
        "What does test-time compute scaling buy you over training-time compute?",
        "When does extended thinking actually hurt — what tasks does it slow down without quality gains?",
      ]),
      item("llm-tot", "Tree of Thoughts, self-consistency", "https://arxiv.org/abs/2305.10601", "Yao et al.", [
        "Compare CoT vs ToT vs self-consistency — when does each help?",
        "Why does self-consistency improve reasoning, and when does it fail?",
      ]),
    ],
    dayQuestions: [
      "How do reasoning models like o1 / o3 differ from standard chat LLMs?",
      "When are reasoning models worth their cost, and when are they overkill?",
      "What does test-time compute scaling buy you over training-time compute?",
    ],
  });

  topic("llm-eval", {
    trackLabel: "GenAI · LLM evaluation",
    items: [
      item("llm-perplexity", "Perplexity: what it is and isn't", "https://huggingface.co/docs/transformers/perplexity", "HF", [
        "Define perplexity precisely — and explain why it's a poor proxy for downstream task quality.",
        "Two models with the same perplexity perform very differently on a benchmark. What's going on?",
      ]),
      item("llm-bench", "Benchmarks: MMLU, HumanEval, GPQA, SWE-bench", "https://paperswithcode.com/sota", "Papers with Code", [
        "Compare MMLU vs GPQA vs SWE-bench — what does each measure?",
        "Why has benchmark contamination become a serious issue?",
      ]),
      item("llm-eval-judge", "LLM-as-judge: design, biases, calibration", "https://arxiv.org/abs/2306.05685", "Zheng et al.", [
        "When is LLM-as-judge reliable, and what biases does it introduce?",
        "How would you calibrate an LLM judge to human preferences?",
      ]),
    ],
    dayQuestions: [
      "Define perplexity precisely and explain why it's a poor proxy for downstream task quality.",
      "Compare MMLU vs GPQA vs SWE-bench — what does each measure?",
      "When is LLM-as-judge reliable, and what biases does it introduce?",
      "Why has benchmark contamination become a serious issue, and how do you defend against it?",
    ],
  });

  topic("rag-basics", {
    trackLabel: "GenAI · RAG foundations",
    items: [
      item("rag-why", "Why RAG: closed-book vs open-book LLMs", "https://python.langchain.com/docs/concepts/rag/", "LangChain", [
        "When would you reach for RAG over fine-tuning, and vice versa?",
        "What problems does RAG solve that long context windows don't?",
      ]),
      item("rag-pipeline", "Standard RAG pipeline: index → retrieve → rerank → generate", "https://www.pinecone.io/learn/retrieval-augmented-generation/", "Pinecone", [
        "Walk through the four stages of a standard RAG pipeline.",
        "Where does latency hide in a RAG pipeline?",
      ]),
      item("rag-chunking", "Chunking strategies: fixed, semantic, hierarchical", "https://www.pinecone.io/learn/chunking-strategies/", "Pinecone", [
        "Compare fixed-size, semantic, and hierarchical chunking — when does each fit?",
        "How does chunk size affect retrieval quality vs answer quality?",
      ]),
    ],
    dayQuestions: [
      "When would you reach for RAG over fine-tuning, and vice versa?",
      "Walk through the four stages of a standard RAG pipeline and where latency hides.",
      "Compare fixed-size, semantic, and hierarchical chunking — when does each fit?",
      "How does chunk size affect retrieval quality vs answer quality?",
    ],
  });

  topic("embeddings-vectors", {
    trackLabel: "GenAI · Embeddings & vector DBs",
    items: [
      item("rag-emb-models", "Embedding models: ada, e5, bge, voyage, jina", "https://huggingface.co/spaces/mteb/leaderboard", "MTEB", [
        "How do you pick an embedding model — what does the MTEB leaderboard tell you and not tell you?",
        "Why does dimension count matter for cost and recall?",
      ]),
      item("rag-vdb", "Vector DBs: Pinecone, Weaviate, Qdrant, pgvector", "https://www.pinecone.io/learn/vector-database/", "Pinecone", [
        "Compare Pinecone, Weaviate, Qdrant, and pgvector — when does each fit?",
        "When is pgvector enough vs when do you need a dedicated vector DB?",
      ]),
      item("rag-ann", "ANN indexes: HNSW, IVF, ScaNN", "https://github.com/facebookresearch/faiss/wiki", "FAISS", [
        "Compare HNSW vs IVF for ANN — accuracy/speed/memory trade-offs.",
        "When would you switch from in-memory FAISS to a hosted vector DB — what's the breakpoint?",
      ]),
    ],
    dayQuestions: [
      "How do you pick an embedding model — what does the MTEB leaderboard tell you and not tell you?",
      "Compare Pinecone, Weaviate, Qdrant, and pgvector — when does each fit?",
      "Compare HNSW vs IVF for ANN search — accuracy/speed/memory trade-offs.",
    ],
  });

  topic("retrieval-strategies", {
    trackLabel: "GenAI · Retrieval strategies",
    items: [
      item("rag-dense-sparse", "Dense vs sparse vs hybrid (BM25 + dense)", "https://www.pinecone.io/learn/hybrid-search-intro/", "Pinecone", [
        "When does sparse retrieval (BM25) beat dense retrieval?",
        "How would you combine BM25 and dense scores in hybrid search?",
      ]),
      item("rag-query-expansion", "Query expansion: HyDE, multi-query, query rewriting", "https://arxiv.org/abs/2212.10496", "HyDE", [
        "How does HyDE work, and when does it actually help?",
        "When would you decompose a query into multiple sub-queries?",
      ]),
      item("rag-multi-hop", "Multi-hop & iterative retrieval", "https://arxiv.org/abs/2305.14283", "FLARE", [
        "How would you handle a multi-hop question that requires chaining retrieval calls?",
        "What stopping criterion do you use for iterative retrieval — and how do you avoid runaway loops?",
      ]),
    ],
    dayQuestions: [
      "When does sparse retrieval (BM25) beat dense retrieval?",
      "How does HyDE work, and when does it actually help?",
      "How would you handle a multi-hop question that requires chaining retrieval calls?",
    ],
  });

  topic("reranking", {
    trackLabel: "GenAI · Reranking",
    items: [
      item("rag-rerank-bi-cross", "Bi-encoder (retrieve) vs cross-encoder (rerank)", "https://www.sbert.net/examples/applications/cross-encoder/README.html", "Sentence-BERT", [
        "Why is a cross-encoder more accurate than a bi-encoder, and why can't we use it for retrieval?",
        "What's the latency cost of cross-encoder reranking, and how do you keep it under your budget?",
      ]),
      item("rag-rerank-models", "Cohere Rerank, BGE Rerank, monoT5", "https://docs.cohere.com/docs/rerank-2", "Cohere", [
        "When does adding a reranker actually move the needle?",
        "Compare hosted (Cohere) vs self-hosted (BGE / monoT5) rerankers — when would you pick each?",
      ]),
      item("rag-mmr", "MMR & diversity reranking", "https://docs.llamaindex.ai/en/stable/examples/node_postprocessor/MaximalMarginalRelevanceMMR/", "LlamaIndex", [
        "What is MMR, and why does diversity matter in retrieved context?",
        "How would you tune the MMR diversity λ — what does the user actually feel as it changes?",
      ]),
    ],
    dayQuestions: [
      "Why is a cross-encoder more accurate than a bi-encoder, and why can't we use it for retrieval?",
      "When does adding a reranker actually move the needle in a RAG system?",
      "What is MMR, and why does diversity matter in retrieved context?",
    ],
  });

  topic("rag-eval", {
    trackLabel: "GenAI · RAG evaluation",
    items: [
      item("rag-ragas", "Ragas: faithfulness, context recall, context precision, answer relevance", "https://docs.ragas.io/", "Ragas", [
        "Walk through the four Ragas metrics and what each tells you.",
        "How would you build a golden eval set for a domain-specific RAG?",
      ]),
      item("rag-eval-llm-judge", "LLM-as-judge for RAG", "https://www.evidentlyai.com/llm-guide/llm-as-a-judge", "Evidently", [
        "Compare LLM-as-judge vs human eval for RAG — when does LLM-as-judge fail?",
        "What biases would an LLM judge introduce, and how do you control for them?",
      ]),
      item("rag-needle", "Needle-in-haystack & long-context evals", "https://github.com/gkamradt/LLMTest_NeedleInAHaystack", "Read", [
        "Why are needle-in-haystack tests easy to game, and what are stronger evals?",
        "What does 'lost in the middle' mean for long-context LLMs, and how do you mitigate it?",
      ]),
    ],
    dayQuestions: [
      "Walk through the four Ragas metrics — what does each tell you, and what do they miss?",
      "How would you build a golden eval set for a domain-specific RAG system?",
      "Compare LLM-as-judge vs human eval for RAG — when does LLM-as-judge fail?",
      "Why are needle-in-haystack tests easy to game, and what are stronger evals?",
    ],
  });

  topic("advanced-rag", {
    trackLabel: "GenAI · Advanced RAG",
    items: [
      item("rag-parent-child", "Parent-child / sentence-window / auto-merging", "https://docs.llamaindex.ai/en/stable/examples/retrievers/auto_merging_retriever/", "LlamaIndex", [
        "When does parent-child retrieval beat naive chunked retrieval?",
        "What's the failure mode of auto-merging, and when does it return a chunk that's too large?",
      ]),
      item("rag-graph", "GraphRAG & knowledge-graph augmented retrieval", "https://microsoft.github.io/graphrag/", "Microsoft", [
        "How does GraphRAG help with multi-hop reasoning?",
        "What's the cost of building and maintaining the knowledge graph in GraphRAG — and when is it not worth it?",
      ]),
      item("rag-finetune-emb", "Fine-tuning embeddings on domain data", "https://www.sbert.net/docs/training/overview.html", "SBERT", [
        "When is it worth fine-tuning the embedding model on your domain?",
        "How would you build training pairs for embedding fine-tuning when you don't have labeled relevance data?",
      ]),
    ],
    dayQuestions: [
      "When does parent-child or auto-merging retrieval beat naive chunked retrieval?",
      "How does GraphRAG help with multi-hop reasoning over enterprise knowledge?",
      "When is it worth fine-tuning the embedding model on your domain data?",
    ],
  });

  topic("long-context-rag", {
    trackLabel: "GenAI · Long context & agentic RAG",
    items: [
      item("rag-long-ctx", "1M+ context windows: when do they replace RAG?", "https://www.anthropic.com/news/100k-context-windows", "Anthropic", [
        "Do long context windows kill RAG? Defend your view.",
        "What's the cost picture (latency + $) of stuffing 1M tokens vs RAG over the same corpus?",
      ]),
      item("rag-agentic", "Agentic RAG: planning + tool-use over retrieval", "https://www.llamaindex.ai/blog/agentic-rag-with-llamaindex-2721b8a49ff6", "LlamaIndex", [
        "What does agentic RAG add over a static RAG pipeline?",
        "When does agentic RAG perform WORSE than static RAG — what are the failure modes?",
      ]),
      item("rag-cache", "Prompt caching & retrieval caching", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", "Anthropic", [
        "How does prompt caching change the cost picture for repeated context?",
        "Compare exact-match retrieval caching vs semantic caching — when does each fit?",
      ]),
    ],
    dayQuestions: [
      "Do long context windows kill RAG? Defend your view.",
      "What does agentic RAG add over a static RAG pipeline?",
      "How does prompt caching change the cost picture for repeated context?",
    ],
  });

  topic("agents", {
    trackLabel: "GenAI · LLM agents",
    items: [
      item("agent-react", "ReAct, Plan-and-Execute", "https://arxiv.org/abs/2210.03629", "Yao et al.", [
        "Walk through ReAct: how does interleaving thought and action change behavior?",
        "When does Plan-and-Execute beat pure ReAct?",
      ]),
      item("agent-mem", "Agent memory: short, long, episodic, semantic", "https://lilianweng.github.io/posts/2023-06-23-agent/", "Lilian Weng", [
        "How would you design memory for a long-running personal-assistant agent?",
        "What invalidates a memory entry, and how do you forget gracefully without losing important state?",
      ]),
      item("agent-anthropic", "Building effective agents (Anthropic)", "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems", "Anthropic", [
        "Compare workflow vs agent — when do you NOT need an agent?",
        "Walk through the building-blocks: prompt chaining, routing, parallelization, orchestrator-workers — when does each apply?",
      ]),
    ],
    dayQuestions: [
      "Walk through ReAct: how does interleaving thought and action change agent behavior?",
      "When does Plan-and-Execute beat pure ReAct?",
      "How would you design memory for a long-running personal-assistant agent?",
      "Compare workflow vs agent — when do you NOT need an agent?",
    ],
  });

  topic("multi-agent", {
    trackLabel: "GenAI · Multi-agent systems",
    items: [
      item("ma-orchestration", "Orchestration patterns: supervisor, swarm, hierarchical", "https://github.com/langchain-ai/langgraph", "LangGraph", [
        "Compare supervisor vs swarm vs hierarchical multi-agent topologies.",
        "Why do swarm agents often degrade into chaos in practice — what stabilizes them?",
      ]),
      item("ma-coord", "Coordination, conflict resolution, voting", "https://arxiv.org/abs/2308.10848", "AutoGen", [
        "How do you handle two agents that disagree on the next action?",
        "When does majority voting between agents help, and when does it just amplify a shared bias?",
      ]),
      item("ma-frameworks", "AutoGen, CrewAI, LangGraph", "https://microsoft.github.io/autogen/", "AutoGen", [
        "Compare AutoGen, CrewAI, and LangGraph — when do you reach for each?",
        "Why might you prefer LangGraph's explicit state machine over AutoGen's free-form conversation?",
      ]),
    ],
    dayQuestions: [
      "Compare supervisor vs swarm vs hierarchical multi-agent topologies.",
      "How do you handle two agents that disagree on the next action in a multi-agent system?",
      "Compare AutoGen, CrewAI, and LangGraph for multi-agent orchestration.",
    ],
  });

  topic("fine-tuning", {
    trackLabel: "GenAI · Fine-tuning (full vs LoRA vs QLoRA)",
    items: [
      item("ft-decide", "When to fine-tune vs prompt vs RAG", "https://huggingface.co/blog/dpo-trl", "HF", [
        "When does fine-tuning beat RAG, and vice versa?",
        "When is prompt engineering enough?",
      ]),
      item("ft-lora", "LoRA, QLoRA: math and trade-offs", "https://arxiv.org/abs/2106.09685", "Hu et al.", [
        "Walk through how LoRA decomposes weight updates into low-rank matrices.",
        "What does QLoRA add on top of LoRA, and what does it cost?",
        "How do you pick rank r and alpha for LoRA?",
      ]),
      item("ft-data", "Fine-tuning data: curation, dedup, contamination", "https://huggingface.co/learn/llm-course/chapter11/1", "HF", [
        "How would you curate 10k high-quality examples for fine-tuning a domain LLM?",
        "What's your dedup + contamination check between training and eval sets — and why does it matter?",
      ]),
    ],
    dayQuestions: [
      "When does fine-tuning beat RAG, and vice versa?",
      "Walk through how LoRA decomposes weight updates into low-rank matrices.",
      "What does QLoRA add on top of LoRA, and what does it cost in quality?",
      "How would you curate 10k high-quality examples for fine-tuning a domain LLM?",
    ],
  });

  topic("alignment", {
    trackLabel: "GenAI · SFT, DPO, RLHF",
    items: [
      item("ft-sft", "Supervised fine-tuning (SFT)", "https://huggingface.co/blog/peft", "HF", [
        "Walk through the SFT objective — how is it different from pretraining?",
        "How do you choose the SFT learning rate and number of epochs without overfitting on a small dataset?",
      ]),
      item("ft-rlhf", "RLHF: reward model + PPO", "https://huggingface.co/blog/rlhf", "HF", [
        "Walk through the three stages of RLHF: SFT → reward model → PPO.",
        "Why is reward hacking a problem in RLHF?",
      ]),
      item("ft-dpo", "DPO and friends (IPO, KTO, ORPO)", "https://arxiv.org/abs/2305.18290", "Rafailov et al.", [
        "Why is DPO simpler than PPO-based RLHF, and what does it sacrifice?",
        "Compare DPO, IPO, KTO, and ORPO — when does each fit?",
      ]),
    ],
    dayQuestions: [
      "Walk through the three stages of RLHF: SFT → reward model → PPO.",
      "Why is reward hacking a problem in RLHF, and how do you mitigate it?",
      "Why is DPO simpler than PPO-based RLHF, and what does it sacrifice?",
      "Compare DPO, IPO, KTO, and ORPO — when does each fit?",
    ],
  });

  topic("guardrails", {
    trackLabel: "GenAI · Guardrails & safety",
    items: [
      item("safety-input-output", "Input filtering & output moderation", "https://github.com/NVIDIA/NeMo-Guardrails", "NeMo Guardrails", [
        "Compare input vs output filtering — what does each catch and miss?",
        "What latency does an output-moderation step add, and how do you keep it under your SLO?",
      ]),
      item("safety-jailbreak", "Jailbreaks: DAN, role-play, payload smuggling", "https://www.anthropic.com/research/many-shot-jailbreaking", "Anthropic", [
        "Walk through three categories of jailbreak attacks, and how you'd defend against each.",
        "Why is many-shot jailbreaking so effective on long-context models, and what mitigates it?",
      ]),
      item("safety-redteam", "Red-teaming & evals for safety", "https://www.anthropic.com/news/frontier-model-security", "Anthropic", [
        "How would you build a red-teaming process for a customer-facing LLM?",
        "How would you scale red-teaming with automated attackers without missing novel attack vectors?",
      ]),
    ],
    dayQuestions: [
      "Compare input vs output filtering for LLM safety — what does each catch and miss?",
      "Walk through three categories of jailbreak attacks, and how you'd defend against each.",
      "How would you build a red-teaming process for a customer-facing LLM?",
    ],
  });

  topic("agent-protocols", {
    trackLabel: "GenAI · MCP, A2A, agent protocols",
    items: [
      item("ap-mcp", "Model Context Protocol (MCP) deep dive", "https://modelcontextprotocol.io/", "MCP", [
        "What's the MCP architecture (host, client, server)?",
        "When would you build an MCP server vs use function calling directly?",
      ]),
      item("ap-a2a", "Agent-to-agent (A2A) protocols", "https://google.github.io/A2A/", "Google", [
        "What problem does A2A solve over ad-hoc agent integration?",
        "Compare MCP and A2A — when do you reach for each, and can they coexist?",
      ]),
      item("ap-tools", "Standardizing tool catalogs across agents", "https://modelcontextprotocol.io/clients", "MCP", [
        "How would you design a shared tool registry for multiple agents in your company?",
        "How do you handle versioning and breaking changes in tool definitions consumed by many agents?",
      ]),
    ],
    dayQuestions: [
      "What's the MCP architecture (host, client, server) and when would you reach for it?",
      "When would you build an MCP server vs use function calling directly?",
      "What problem does A2A solve over ad-hoc agent integration?",
    ],
  });

  topic("llmops", {
    trackLabel: "LLMOps · Caching, routing, cost",
    items: [
      item("lo-cache", "Prompt caching & semantic caching", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", "Anthropic", [
        "Compare exact-match prompt caching vs semantic caching — when does each fit?",
        "How would you measure semantic-cache safety — what's the false-hit failure mode?",
      ]),
      item("lo-routing", "Model routing: cheap-then-expensive cascades", "https://www.anyscale.com/blog/announcing-anyscale-llm-router-foundational-model-router", "Anyscale", [
        "How would you route requests across GPT-5, Claude 4.5, and a small open-source model?",
        "Walk through how a verifier model gates the cheap-model output before falling back to the expensive one.",
      ]),
      item("lo-vllm", "Inference servers: vLLM, TensorRT-LLM, SGLang", "https://docs.vllm.ai/", "vLLM", [
        "What does vLLM's PagedAttention do for throughput?",
        "Compare vLLM vs TensorRT-LLM vs SGLang.",
      ]),
    ],
    dayQuestions: [
      "Compare exact-match prompt caching vs semantic caching — when does each fit?",
      "How would you route LLM requests across cheap and expensive models — what's the framework?",
      "What does vLLM's PagedAttention do for throughput, and how does it differ from naive batching?",
      "Compare vLLM, TensorRT-LLM, and SGLang for LLM serving — strengths of each.",
    ],
  });

  // ─────────────── ML INFRA & SPECIALIZATIONS ───────────────
  topic("distributed-training", {
    trackLabel: "Infra · Distributed training",
    items: [
      item("dist-ddp", "Data parallelism: DDP", "https://pytorch.org/tutorials/intermediate/ddp_tutorial.html", "PyTorch", [
        "Walk me through how DDP synchronizes gradients across GPUs.",
        "What does NCCL do in this picture?",
      ]),
      item("dist-fsdp", "FSDP, ZeRO, DeepSpeed", "https://engineering.fb.com/2021/07/15/open-source/fsdp/", "Meta", [
        "How does FSDP shard parameters, gradients, and optimizer state?",
        "Compare ZeRO-1, ZeRO-2, ZeRO-3 stages.",
      ]),
      item("dist-tp-pp", "Tensor & pipeline parallelism", "https://huggingface.co/docs/transformers/perf_train_gpu_many", "HF", [
        "When do you need tensor parallelism vs pipeline parallelism, and how do they compose with data parallelism (3D parallelism)?",
        "What is pipeline-parallel bubble overhead, and how do you minimize it?",
      ]),
    ],
    dayQuestions: [
      "Walk me through how DDP synchronizes gradients across GPUs and what NCCL does.",
      "How does FSDP shard parameters, gradients, and optimizer state — compare ZeRO-1/2/3.",
      "When do you need tensor parallelism vs pipeline parallelism vs data parallelism (3D parallelism)?",
    ],
  });

  topic("training-efficiency", {
    trackLabel: "Infra · Training efficiency",
    items: [
      item("eff-mp", "Mixed precision training (fp16, bf16, fp8)", "https://pytorch.org/docs/stable/amp.html", "PyTorch", [
        "Compare fp16 vs bf16 vs fp8 training — when does each fail or shine?",
        "What does dynamic loss scaling do, and on which hardware do you still need it?",
      ]),
      item("eff-grad-accum", "Gradient accumulation & micro-batching", "https://huggingface.co/docs/transformers/perf_train_gpu_one", "HF", [
        "Why does gradient accumulation let you simulate a larger batch size?",
        "When does gradient accumulation NOT match true large-batch training (e.g., BatchNorm)?",
      ]),
      item("eff-checkpoint", "Activation checkpointing & offloading", "https://pytorch.org/docs/stable/checkpoint.html", "PyTorch", [
        "How does activation checkpointing trade compute for memory?",
        "When would you offload optimizer state to CPU/NVMe?",
      ]),
    ],
    dayQuestions: [
      "Compare fp16 vs bf16 vs fp8 training — when does each fail or shine?",
      "How does activation checkpointing trade compute for memory, and when is it worth it?",
      "When would you offload optimizer state to CPU/NVMe, and what's the throughput cost?",
    ],
  });

  topic("hardware", {
    trackLabel: "Infra · GPUs, TPUs, accelerators",
    items: [
      item("hw-gpu", "NVIDIA GPUs: A100, H100, B200 — memory, FLOPs, tensor cores", "https://developer.nvidia.com/h100", "NVIDIA", [
        "Compare A100, H100, and B200 — what changed each generation?",
        "Why does HBM matter more than FLOPs for many ML workloads?",
      ]),
      item("hw-tpu", "TPUs: pods, slices, XLA", "https://cloud.google.com/tpu/docs/system-architecture-tpu-vm", "Google", [
        "Compare GPUs vs TPUs for training — when does each win?",
        "What's the cost of porting a PyTorch model to TPU via XLA, and where does it break?",
      ]),
      item("hw-net", "NVLink, InfiniBand, network bottlenecks", "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html", "NCCL", [
        "Why does interconnect (NVLink, IB) often bottleneck distributed training before compute does?",
        "How would you diagnose whether your distributed training is bottlenecked by compute, memory, or network?",
      ]),
    ],
    dayQuestions: [
      "Compare A100, H100, and B200 — what changed each generation?",
      "Why does HBM bandwidth matter more than FLOPs for many ML workloads?",
      "Why does interconnect (NVLink, IB) often bottleneck distributed training before compute does?",
    ],
  });

  topic("inference-opt", {
    trackLabel: "Infra · Inference optimization",
    items: [
      item("inf-quant", "Quantization: INT8, INT4, FP8, GPTQ, AWQ", "https://huggingface.co/docs/transformers/main_classes/quantization", "HF", [
        "Compare post-training quantization (PTQ) vs quantization-aware training (QAT).",
        "How do GPTQ and AWQ work, and what quality do you lose?",
      ]),
      item("inf-distill", "Knowledge distillation (teacher → student)", "https://arxiv.org/abs/1503.02531", "Hinton et al.", [
        "Walk me through knowledge distillation — what is the soft-target loss?",
        "Why does temperature in the soft target matter, and how do you pick it?",
      ]),
      item("inf-prune", "Pruning: structured vs unstructured", "https://pytorch.org/tutorials/intermediate/pruning_tutorial.html", "PyTorch", [
        "Compare structured vs unstructured pruning — which actually speeds up inference?",
        "Why does unstructured pruning rarely move latency on GPU, even when sparsity is high?",
      ]),
      item("inf-batch", "Continuous batching & dynamic batching", "https://www.anyscale.com/blog/continuous-batching-llm-inference", "Anyscale", [
        "How does continuous batching beat static batching for LLM serving?",
        "What's the trade-off between max batch size and per-request latency under continuous batching?",
      ]),
    ],
    dayQuestions: [
      "Compare post-training quantization vs quantization-aware training — when does each fit?",
      "Walk me through knowledge distillation — what is the soft-target loss?",
      "Compare structured vs unstructured pruning — which actually speeds up inference?",
      "How does continuous batching beat static batching for LLM serving?",
    ],
  });

  topic("speech-spec", {
    trackLabel: "Specialization · Speech (ASR, TTS)",
    items: [
      item("speech-asr", "ASR: from HMMs to Whisper", "https://arxiv.org/abs/2212.04356", "OpenAI Whisper", [
        "Walk through Whisper's encoder-decoder design and weakly-supervised training data.",
        "Compare CTC vs attention-based seq2seq for ASR.",
      ]),
      item("speech-tts", "TTS: Tacotron, FastSpeech, neural vocoders", "https://google.github.io/tacotron/", "Google", [
        "Compare two-stage (text → mel → wav) vs end-to-end TTS.",
        "Why does prosody / expressive control remain hard in TTS, and how do modern systems handle it?",
      ]),
      item("speech-streaming", "Streaming ASR: latency vs accuracy", "https://arxiv.org/abs/2102.01547", "Read", [
        "What's the trade-off between latency and accuracy in streaming ASR?",
        "How would you design a chunked / look-ahead streaming ASR to keep latency under 300ms?",
      ]),
    ],
    dayQuestions: [
      "Walk through Whisper's encoder-decoder design and weakly-supervised training.",
      "Compare CTC vs attention-based seq2seq for ASR — when does each win?",
      "What's the trade-off between latency and accuracy in streaming ASR?",
    ],
  });

  topic("cv-spec", {
    trackLabel: "Specialization · CV deep dive",
    items: [
      item("cv-deep-detection", "Production object detection pipelines", "https://github.com/ultralytics/ultralytics", "Ultralytics", [
        "Walk through deploying a YOLO model in production — pre/post-processing, NMS, calibration.",
        "How would you handle class imbalance and rare categories in a production detection model?",
      ]),
      item("cv-deep-video", "Video understanding (3D CNN, video transformers)", "https://arxiv.org/abs/2103.15691", "ViViT", [
        "Compare 3D CNNs vs two-stream vs video transformers for action recognition.",
        "Why is temporal modeling hard, and what does sparse temporal sampling buy you?",
      ]),
      item("cv-deep-multi", "Multimodal CV: image-text, video-text", "https://openai.com/index/clip/", "OpenAI", [
        "Walk me through how a multimodal model fuses vision and text — case study CLIP.",
        "Where does CLIP fail, and how do later models (SigLIP, EVA-CLIP) improve it?",
      ]),
    ],
    dayQuestions: [
      "Walk through deploying a YOLO model in production — pre/post-processing, NMS, calibration.",
      "Compare 3D CNNs vs two-stream vs video transformers for action recognition.",
      "Walk me through how a multimodal model fuses vision and text — case study CLIP.",
    ],
  });

  topic("nlp-spec", {
    trackLabel: "Specialization · NLP deep dive",
    items: [
      item("nlp-ie", "Information extraction (NER, RE, OpenIE)", "https://web.stanford.edu/class/cs224n/", "CS224n", [
        "Compare span-based vs sequence-tagging IE — when does each win?",
        "How would you design a relation-extraction system that handles entities not seen in training?",
      ]),
      item("nlp-multilingual", "Multilingual & low-resource NLP", "https://arxiv.org/abs/1911.02116", "XLM-R", [
        "How does mBERT/XLM-R enable cross-lingual transfer, and where does it break?",
        "What's the curse of multilinguality, and how do you mitigate it for low-resource languages?",
      ]),
      item("nlp-code", "Code generation: Codex, StarCoder, Code Llama", "https://huggingface.co/blog/starcoder", "HF", [
        "How is training a code model different from training a natural-language model?",
        "How would you evaluate a code generation model — pass@k, HumanEval, SWE-bench?",
      ]),
    ],
    dayQuestions: [
      "Compare span-based vs sequence-tagging information extraction — when does each win?",
      "How does mBERT/XLM-R enable cross-lingual transfer, and where does it break?",
      "How is training a code model different from training a natural-language model?",
    ],
  });

  topic("rl-basics", {
    trackLabel: "Specialization · Reinforcement learning basics",
    items: [
      item("rl-mdp", "MDPs, value, policy, Bellman equation", "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html", "OpenAI", [
        "Walk through the Bellman equation for the value function.",
        "What's the difference between value iteration and policy iteration?",
      ]),
      item("rl-onoff", "On-policy vs off-policy", "https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html", "OpenAI", [
        "Compare on-policy vs off-policy RL — examples of each algorithm class.",
        "When is sample efficiency a deciding factor between on-policy and off-policy methods?",
      ]),
      item("rl-explore", "Exploration: epsilon-greedy, UCB, Thompson sampling", "https://lilianweng.github.io/posts/2018-01-23-multi-armed-bandit/", "Lilian Weng", [
        "Compare epsilon-greedy, UCB, and Thompson sampling in a contextual bandit.",
        "Why does Thompson sampling adapt better to non-stationary rewards than epsilon-greedy?",
      ]),
    ],
    dayQuestions: [
      "Walk through the Bellman equation for the value function and the policy iteration algorithm.",
      "Compare on-policy vs off-policy RL — give an example algorithm of each.",
      "Compare epsilon-greedy, UCB, and Thompson sampling for exploration in contextual bandits.",
    ],
  });

  topic("deep-rl", {
    trackLabel: "Specialization · Deep RL",
    items: [
      item("rl-dqn", "DQN: experience replay, target nets", "https://www.nature.com/articles/nature14236", "DeepMind", [
        "Why does DQN need experience replay and a target network?",
        "What does Double DQN fix that vanilla DQN gets wrong, and why does it matter in practice?",
      ]),
      item("rl-pg", "Policy gradients & REINFORCE", "https://lilianweng.github.io/posts/2018-04-08-policy-gradient/", "Lilian Weng", [
        "Walk through the policy gradient theorem.",
        "Why are baselines used (e.g., advantage estimation)?",
      ]),
      item("rl-ppo", "Actor-critic, PPO, GRPO", "https://arxiv.org/abs/1707.06347", "Schulman et al.", [
        "Walk me through PPO — what's the clipped surrogate objective and why does it stabilize training?",
        "How is GRPO (used in DeepSeek-R1) different from PPO?",
      ]),
    ],
    dayQuestions: [
      "Why does DQN need experience replay and a target network?",
      "Walk me through PPO — what's the clipped surrogate objective and why does it stabilize training?",
      "How is GRPO (used in DeepSeek-R1) different from PPO?",
    ],
  });

  topic("rlhf-deep", {
    trackLabel: "Specialization · RLHF & RLAIF deep dive",
    items: [
      item("rlhf-pipeline", "RLHF pipeline: SFT → RM → PPO", "https://huggingface.co/blog/rlhf", "HF", [
        "Walk through the three stages of RLHF end-to-end.",
        "What goes wrong if your reward model is poorly calibrated?",
      ]),
      item("rlhf-rlaif", "RLAIF, Constitutional AI, RLEF", "https://arxiv.org/abs/2212.08073", "Anthropic", [
        "What is Constitutional AI, and how does it reduce reliance on human labels?",
        "Where does RLAIF struggle — what kinds of judgments still need humans?",
      ]),
      item("rlhf-eval", "Reward hacking & alignment evals", "https://arxiv.org/abs/2305.18290", "Rafailov et al.", [
        "Walk through how reward hacking shows up in practice and how you'd detect it.",
        "How would you design an eval suite that catches sycophancy and excessive hedging in an RLHF'd model?",
      ]),
    ],
    dayQuestions: [
      "Walk through the three stages of RLHF end-to-end and what each stage actually optimizes.",
      "What is Constitutional AI, and how does it reduce reliance on human labels?",
      "How does reward hacking show up in practice, and how would you detect it?",
    ],
  });

  topic("recsys-foundations", {
    trackLabel: "Specialization · RecSys foundations",
    items: [
      item("recs-cf", "Collaborative filtering & matrix factorization", "https://developers.google.com/machine-learning/recommendation", "Google", [
        "Walk through matrix factorization for recommendations and how SGD trains it.",
        "What's the cold-start problem in CF and how do hybrid models fix it?",
      ]),
      item("recs-content", "Content-based & hybrid recsys", "https://developers.google.com/machine-learning/recommendation/content-based/basics", "Google", [
        "Compare content-based vs collaborative filtering — when does each fail?",
        "How would you blend content and CF signals — what's the failure mode of naive averaging?",
      ]),
      item("recs-eval", "RecSys metrics: nDCG, MAP, Hit Rate, MRR", "https://en.wikipedia.org/wiki/Discounted_cumulative_gain", "Read", [
        "Compare nDCG, MAP, MRR, and Recall@k — when do you use each?",
        "Why do offline metrics often disagree with online A/B test results in recsys?",
      ]),
    ],
    dayQuestions: [
      "Walk through matrix factorization for recommendations and how SGD trains it.",
      "What's the cold-start problem in CF and how do hybrid models fix it?",
      "Compare nDCG, MAP, MRR, and Recall@k — when do you use each?",
    ],
  });

  topic("two-tower", {
    trackLabel: "Specialization · Two-tower retrieval",
    items: [
      item("recs-2t", "Two-tower architecture (YouTube, retrieval)", "https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/", "Google", [
        "Walk through the YouTube two-tower paper — what does sampling-bias correction fix?",
        "Why is in-batch negative sampling biased, and how do you correct for it?",
      ]),
      item("recs-emb", "Embedding tables & ANN serving", "https://www.pinecone.io/learn/series/recs/", "Pinecone", [
        "How would you serve a billion-item two-tower retrieval system at sub-50ms?",
        "How do you keep the item embedding index fresh as new items are added every minute?",
      ]),
      item("recs-temporal", "Temporal & freshness signals", "https://research.google/pubs/recurrent-recommender-networks/", "Google", [
        "How would you incorporate item freshness without hurting long-term relevance?",
        "What's the right way to encode time-of-day and day-of-week signals in a recsys?",
      ]),
    ],
    dayQuestions: [
      "Walk through the YouTube two-tower paper — what does sampling-bias correction fix?",
      "Why is in-batch negative sampling biased, and how do you correct for it?",
      "How would you serve a billion-item two-tower retrieval system at sub-50ms latency?",
    ],
  });

  topic("ranking-mt", {
    trackLabel: "Specialization · Ranking & multi-task",
    items: [
      item("rank-mtl", "Multi-task learning: MMoE, PLE", "https://daiwk.github.io/assets/youtube-multitask.pdf", "Google", [
        "Walk through MMoE — how does it handle conflicting tasks?",
        "Compare MMoE vs PLE — what does PLE fix?",
      ]),
      item("rank-pos-bias", "Position bias correction (PAL)", "https://dl.acm.org/doi/10.1145/3298689.3347033", "Huawei", [
        "What is position bias in CTR ranking, and how does PAL correct for it?",
        "How would you measure how much position bias is contaminating your training labels?",
      ]),
      item("rank-calibrate", "Calibration in ranking models", "https://eugeneyan.com/writing/calibration-eval/", "Eugene Yan", [
        "Why is calibration important even when only ranking matters?",
        "Compare Platt scaling, isotonic regression, and temperature scaling — when does each fit?",
      ]),
    ],
    dayQuestions: [
      "Walk through MMoE — how does it handle conflicting tasks in a ranking system?",
      "What is position bias in CTR ranking, and how does PAL correct for it?",
      "Why is calibration important even when only ranking matters?",
    ],
  });

  topic("seq-recsys", {
    trackLabel: "Specialization · Sequential & LLM-based recsys",
    items: [
      item("recs-seq", "Sequential recsys: SASRec, BERT4Rec", "https://arxiv.org/abs/1808.09781", "SASRec", [
        "Compare SASRec and BERT4Rec — when does each win?",
        "What is causal masking in sequential recsys and why does it matter for next-item prediction?",
      ]),
      item("recs-llm", "LLM-based recsys: P5, GenRec", "https://arxiv.org/abs/2305.06474", "Read", [
        "What's the case for and against using LLMs directly for recommendation?",
        "How would you serve an LLM-based recsys at billion-user scale without exploding cost?",
      ]),
      item("recs-causal", "Causal & off-policy recsys", "https://eugeneyan.com/writing/counterfactual-evaluation/", "Eugene Yan", [
        "Walk through off-policy evaluation for a recsys without rolling out a new model.",
        "How would you account for selection bias when training on logged user clicks?",
      ]),
    ],
    dayQuestions: [
      "Compare SASRec and BERT4Rec for sequential recommendation — when does each win?",
      "What's the case for and against using LLMs directly for recommendation?",
      "Walk through off-policy evaluation for a recsys without rolling out a new model.",
    ],
  });

  // ─────────────── ML SYSTEM DESIGN ───────────────
  topic("sd-framework", {
    trackLabel: "ML System Design · Framework",
    items: [
      item("sd-framework-step", "7-step framework: clarify → metrics → data → model → infra → eval → edge cases", "http://patrickhalina.com/posts/ml-systems-design-interview-guide/", "Patrick Halina", [
        "Walk me through your 7-step framework for any ML system design interview.",
        "How do you avoid running out of time on the model section?",
      ]),
      item("sd-clarify", "Clarifying questions: scope, scale, latency, constraints", "https://github.com/khangich/machine-learning-interview", "khangich", [
        "What are the first five clarifying questions you ask in any ML system design interview?",
        "How do you confirm the business metric vs the ML metric without burning 10 minutes on it?",
      ]),
      item("sd-metrics", "Online vs offline metrics, business metrics", "https://eugeneyan.com/writing/improving-ml-system-design/", "Eugene Yan", [
        "How do you map a business metric to an offline ML metric?",
        "Walk through three real cases where offline gains didn't translate online.",
      ]),
    ],
    dayQuestions: [
      "Walk me through your 7-step framework for any ML system design interview.",
      "What are the first five clarifying questions you ask in any ML system design interview?",
      "How do you map a business metric to an offline ML metric — and where does the mapping break?",
      "Walk through three real cases where offline gains didn't translate online.",
    ],
  });

  topic("sd-recsys", {
    trackLabel: "ML System Design · Recommendations",
    items: [
      item("sd-feed", "Design YouTube/TikTok feed recommendations", "https://research.google/pubs/pub45530/", "Google", [
        "Walk me through designing TikTok's For You feed end-to-end.",
        "How would you handle the cold-start problem for a new user?",
        "What candidate-generation strategies would you use, and how do you combine them?",
      ]),
      item("sd-recall-rank", "Two-stage candidate generation + ranking", "https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/", "Google", [
        "Why do industrial recsys use a two-stage (recall + rank) architecture?",
        "How do you avoid training/serving skew between recall and ranking?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing TikTok's For You feed end-to-end.",
      "Why do industrial recsys use a two-stage (recall + rank) architecture?",
      "How would you handle the cold-start problem for a new user in a feed product?",
      "How do you avoid training/serving skew between recall and ranking stages?",
    ],
  });

  topic("sd-search", {
    trackLabel: "ML System Design · Search ranking",
    items: [
      item("sd-search-design", "Design Google/Amazon search ranking", "https://eugeneyan.com/writing/system-design-for-discovery/", "Eugene Yan", [
        "Walk me through designing Amazon's product search.",
        "How do you balance relevance, freshness, and diversity in search ranking?",
        "How would you handle long-tail queries with no historical data?",
      ]),
      item("sd-search-ltr", "Learning-to-rank: pointwise, pairwise, listwise", "https://eugeneyan.com/writing/system-design-for-discovery/", "Eugene Yan", [
        "Compare pointwise, pairwise, and listwise LTR — when does each fit?",
        "Why does pairwise LTR usually beat pointwise on click-data, even though pointwise is simpler?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing Amazon's product search end-to-end.",
      "How do you balance relevance, freshness, and diversity in search ranking?",
      "Compare pointwise, pairwise, and listwise learning-to-rank approaches.",
      "How would you handle long-tail queries with no historical click data?",
    ],
  });

  topic("sd-ads", {
    trackLabel: "ML System Design · Ads CTR",
    items: [
      item("sd-ctr", "Design ad CTR prediction at scale", "https://research.facebook.com/publications/practical-lessons-from-predicting-clicks-on-ads-at-facebook/", "Meta", [
        "Walk me through designing Meta's ad CTR prediction system.",
        "How do you handle billion-cardinality features (user_id, ad_id) at scale?",
      ]),
      item("sd-ctr-features", "Feature engineering for CTR (cross features, embeddings)", "https://research.google/pubs/pub45530/", "Google", [
        "How do cross features (e.g., user × ad) work, and how do you scale them?",
        "When does DCN / DeepFM beat hand-crafted cross features in production?",
      ]),
      item("sd-ctr-cal", "Calibration & bid optimization", "https://eugeneyan.com/writing/calibration-eval/", "Eugene Yan", [
        "Why is calibration critical for ad ranking, and how do you evaluate it?",
        "How would you recalibrate after a model retrain without disturbing existing bid logic?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing Meta's ad CTR prediction system end-to-end.",
      "How do you handle billion-cardinality features (user_id, ad_id) at scale?",
      "Why is calibration critical for ad ranking — what breaks if your model is uncalibrated?",
    ],
  });

  topic("sd-fraud", {
    trackLabel: "ML System Design · Fraud detection",
    items: [
      item("sd-fraud-design", "Design real-time fraud detection (Stripe/PayPal)", "https://stripe.com/blog/how-we-built-it-stripe-radar", "Stripe", [
        "Walk me through designing Stripe Radar — real-time fraud detection.",
        "How do you balance false positives (blocked good users) vs false negatives (fraud)?",
      ]),
      item("sd-fraud-features", "Feature engineering: velocity, graph, behavioral", "https://eugeneyan.com/writing/feature-stores/", "Eugene Yan", [
        "What kinds of features (velocity, graph, behavioral) actually catch fraud?",
        "How do you serve graph-based fraud features in real-time without exploding compute?",
      ]),
      item("sd-fraud-feedback", "Delayed labels & feedback loops", "https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html", "Chip Huyen", [
        "Fraud labels arrive weeks late (chargebacks). How do you train and monitor under delayed labels?",
        "How would you use early proxy signals (e.g., risk score, manual review) when chargebacks are slow?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing Stripe Radar — real-time fraud detection.",
      "How do you balance false positives (blocked good users) vs false negatives (fraud)?",
      "Fraud labels arrive weeks late (chargebacks) — how do you train and monitor under delayed labels?",
      "What kinds of features (velocity, graph, behavioral) actually catch fraud?",
    ],
  });

  topic("sd-eta", {
    trackLabel: "ML System Design · ETA & pricing",
    items: [
      item("sd-eta-design", "Design Uber/DoorDash ETA prediction", "https://www.uber.com/blog/deepeta-how-uber-predicts-arrival-times/", "Uber", [
        "Walk me through Uber's DeepETA — what features and architecture?",
        "How do you handle live traffic, weather, and rare events?",
      ]),
      item("sd-pricing", "Design surge pricing / dynamic pricing", "https://www.uber.com/blog/", "Uber", [
        "How would you design surge pricing — what's the optimization objective and constraints?",
        "How do you avoid the price-spiral feedback loop where surge causes drivers to game positions?",
      ]),
    ],
    dayQuestions: [
      "Walk me through Uber's DeepETA design — what features and architecture?",
      "How do you handle live traffic, weather, and rare events in ETA prediction?",
      "How would you design surge pricing — what's the optimization objective and constraints?",
    ],
  });

  topic("sd-feed", {
    trackLabel: "ML System Design · News feed / social ranking",
    items: [
      item("sd-feed-design", "Design Facebook/Twitter news feed ranking", "https://research.facebook.com/publications/", "Meta", [
        "Walk me through designing Twitter's news feed ranking.",
        "How would you incorporate social-graph signals?",
        "How do you handle the chronological-vs-algorithmic trade-off?",
      ]),
      item("sd-feed-diversity", "Diversity & filter bubbles", "https://research.facebook.com/publications/", "Meta", [
        "How do you measure and improve diversity in a feed without hurting engagement?",
        "What's the trade-off between short-term engagement and long-term retention in feed ranking?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing Twitter's news feed ranking.",
      "How would you incorporate social-graph signals into a news feed model?",
      "How do you measure and improve diversity in a feed without hurting engagement?",
    ],
  });

  topic("sd-rag", {
    trackLabel: "ML System Design · Enterprise RAG",
    items: [
      item("sd-rag-design", "Design enterprise RAG over docs (Glean-style)", "https://www.glean.com/blog/", "Glean", [
        "Walk me through designing an enterprise RAG over Confluence + Slack + Drive.",
        "How do you handle access control / permissions in retrieval?",
        "How would you handle 50M docs and 10k QPS?",
      ]),
      item("sd-rag-eval", "Eval & monitoring for enterprise RAG", "https://docs.ragas.io/", "Ragas", [
        "How would you build an offline + online eval pipeline for an enterprise RAG?",
        "What synthetic golden set would you generate for a domain where humans can't easily score answers?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing an enterprise RAG over Confluence + Slack + Google Drive.",
      "How do you handle access control / permissions in retrieval?",
      "How would you build an offline + online eval pipeline for an enterprise RAG?",
      "How would you scale to 50M docs and 10k QPS?",
    ],
  });

  topic("sd-support-agent", {
    trackLabel: "ML System Design · AI customer-support agent",
    items: [
      item("sd-agent-design", "Design an AI customer-support agent", "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems", "Anthropic", [
        "Walk me through designing an LLM-based customer-support agent for a fintech.",
        "How would you decide when to escalate to a human?",
        "How do you measure ticket resolution quality offline and online?",
      ]),
      item("sd-agent-tools", "Tool catalog & guardrails", "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", "Anthropic", [
        "What tools would you give the agent (account lookup, refund, ticket create) and what guardrails?",
        "How would you scope a 'refund' tool so the agent can't accidentally refund $1M instead of $100?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing an LLM-based customer-support agent for a fintech.",
      "How would you decide when to escalate to a human?",
      "How do you measure ticket resolution quality offline and online?",
      "What tools would you give the agent (account lookup, refund, ticket create) and what guardrails?",
    ],
  });

  topic("sd-llm-eval", {
    trackLabel: "ML System Design · LLM eval platform",
    items: [
      item("sd-eval-platform", "Design an LLM eval platform (Braintrust/LangSmith style)", "https://docs.smith.langchain.com/", "LangSmith", [
        "Walk me through designing an internal LLM eval platform.",
        "What dimensions would you slice eval results by?",
      ]),
      item("sd-eval-pipeline", "Online + offline eval pipelines", "https://www.braintrust.dev/docs", "Braintrust", [
        "How would you continuously evaluate a production LLM agent on real traffic without leaking PII?",
        "How do you keep eval datasets fresh as user behavior shifts — what's the refresh cadence?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing an internal LLM eval platform (Braintrust / LangSmith style).",
      "What dimensions would you slice eval results by — model, prompt, user, tool?",
      "How would you continuously evaluate a production LLM agent on real traffic without leaking PII?",
    ],
  });

  topic("sd-doc-intel", {
    trackLabel: "ML System Design · Document intelligence",
    items: [
      item("sd-doc-design", "Design document intelligence (OCR + LLM extraction)", "https://www.anthropic.com/news/claude-3-vision", "Anthropic", [
        "Walk me through designing a system that ingests invoices/contracts and extracts structured fields.",
        "How would you handle hand-written or low-quality scans?",
      ]),
      item("sd-doc-eval", "Eval & confidence scoring", "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests", "Anthropic", [
        "How would you flag low-confidence extractions for human review?",
        "What's the unit cost of a human-review pass, and how do you optimize the routing threshold?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing a document-intelligence pipeline for invoices/contracts.",
      "How would you handle hand-written or low-quality scans?",
      "How would you flag low-confidence extractions for human review?",
    ],
  });

  topic("sd-code", {
    trackLabel: "ML System Design · Code assistant",
    items: [
      item("sd-code-design", "Design GitHub Copilot / Cursor", "https://github.blog/2023-05-17-how-github-copilot-is-getting-better-at-understanding-your-code/", "GitHub", [
        "Walk me through designing a GitHub Copilot-style code assistant.",
        "How do you handle context: open files, repo structure, project conventions?",
        "How do you measure quality (acceptance rate, retention, latency)?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing a GitHub Copilot-style code assistant.",
      "How do you handle context: open files, repo structure, project conventions?",
      "How do you measure quality (acceptance rate, retention, latency) for a coding assistant?",
    ],
  });

  topic("sd-imggen", {
    trackLabel: "ML System Design · Image generation",
    items: [
      item("sd-imggen-design", "Design an image-generation product (DALL-E/Midjourney scale)", "https://stability.ai/", "Stability AI", [
        "Walk me through designing an image-generation product end-to-end.",
        "How would you handle GPU capacity, queueing, and cost?",
      ]),
      item("sd-imggen-safety", "Safety: NSFW, IP, deepfakes", "https://openai.com/safety", "OpenAI", [
        "How would you build safety filters for an image-generation product?",
        "How do you handle IP / artist-style mimicry concerns at scale?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing an image-generation product end-to-end.",
      "How would you handle GPU capacity, queueing, and cost?",
      "How would you build safety filters for an image-generation product (NSFW, IP, deepfakes)?",
    ],
  });

  topic("sd-voice", {
    trackLabel: "ML System Design · Voice agent",
    items: [
      item("sd-voice-design", "Design a real-time voice agent (Sesame/ChatGPT voice)", "https://www.sesame.com/research", "Sesame", [
        "Walk me through designing a real-time voice agent (ASR → LLM → TTS).",
        "How do you handle interruption, turn-taking, and barge-in?",
        "What's your latency budget end-to-end (first audio out)?",
      ]),
    ],
    dayQuestions: [
      "Walk me through designing a real-time voice agent (ASR → LLM → TTS).",
      "How do you handle interruption, turn-taking, and barge-in?",
      "What's your latency budget end-to-end (first audio out), and how do you stay under it?",
    ],
  });

  topic("sd-tradeoffs", {
    trackLabel: "ML System Design · Cross-cutting trade-offs",
    items: [
      item("sd-tradeoff-lat-acc", "Latency vs accuracy: caching, distillation, cascades", "https://eugeneyan.com/writing/improving-ml-system-design/", "Eugene Yan", [
        "What levers do you pull when accuracy is great but latency misses the budget?",
        "Walk through where you'd add caching in a RAG + LLM pipeline to halve P99.",
      ]),
      item("sd-tradeoff-routing", "Multi-model routing & cascades", "https://www.anyscale.com/blog/announcing-anyscale-llm-router-foundational-model-router", "Anyscale", [
        "How would you design a cascade: cheap model first, expensive only when needed?",
        "What's the right verifier for the cheap model's output — and when does it dominate cost?",
      ]),
      item("sd-tradeoff-coldstart", "Cold-start strategies (recsys, search, ads)", "https://eugeneyan.com/writing/", "Eugene Yan", [
        "Walk through cold-start strategies for new users vs new items.",
        "Compare bandit-based exploration vs content-based bridges for cold start — when does each fit?",
      ]),
      item("sd-tradeoff-privacy", "Privacy-preserving ML: federated, DP, on-device", "https://federated.withgoogle.com/", "Google", [
        "When would you reach for federated learning vs differential privacy vs on-device inference?",
        "What's the accuracy cost of DP-SGD at typical ε values, and how do you decide if it's acceptable?",
      ]),
    ],
    dayQuestions: [
      "What levers do you pull when accuracy is great but latency misses the budget?",
      "How would you design a cascade: cheap model first, expensive model only when needed?",
      "Walk through cold-start strategies for new users vs new items in a recsys.",
      "When would you reach for federated learning vs differential privacy vs on-device inference?",
    ],
  });

  // ─────────────── BEHAVIORAL & MOCKS ───────────────
  topic("behavioral-framework", {
    trackLabel: "Behavioral · STAR framework & key stories",
    items: [
      item("beh-star", "STAR / CAR framework with worked examples", "https://www.themuse.com/advice/star-interview-method", "The Muse", [
        "Walk through STAR with one of your real stories.",
        "How do you keep a STAR answer under 3 minutes without losing impact?",
      ]),
      item("beh-tmaby", "Tell-me-about-yourself: 90-second version", "https://hbr.org/2022/05/a-simple-way-to-introduce-yourself", "HBR", [
        "Tell me about yourself in 90 seconds.",
        "What three threads should every TMABY hit?",
      ]),
      item("beh-why-co", "Why this company / why this role", "https://www.lennysnewsletter.com/", "Lenny's Newsletter", [
        "Why this company? Tailor in 60 seconds.",
        "Why this role over similar roles you've applied for?",
      ]),
    ],
  });

  topic("behavioral-stories", {
    trackLabel: "Behavioral · Conflict, failure, leadership",
    items: [
      item("beh-conflict", "Conflict with a teammate / stakeholder", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", "Amazon LPs", [
        "Tell me about a conflict with a teammate — how did you resolve it?",
        "When did you disagree with a senior leader's call? What did you do?",
      ]),
      item("beh-failure", "Failure and what you learned", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", "Amazon LPs", [
        "Tell me about a project that failed — what would you do differently?",
        "Describe a time you missed a deadline — root cause and learning.",
      ]),
      item("beh-leadership", "Leadership / influence without authority", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", "Amazon LPs", [
        "Tell me about a time you led without formal authority.",
        "Describe a time you mentored someone through a hard problem.",
      ]),
    ],
  });

  topic("behavioral-tech", {
    trackLabel: "Behavioral · Tech leadership & project deep-dive",
    items: [
      item("beh-deepdive", "Project deep-dive: structure & narrative", "https://www.lennysnewsletter.com/", "Lenny's Newsletter", [
        "Walk me through the most complex ML system you've shipped.",
        "What were the trade-offs you considered, and what did you NOT build?",
      ]),
      item("beh-influence", "Influence: convincing leadership of an ML investment", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", "Amazon LPs", [
        "Tell me about a time you convinced leadership to invest in an ML platform.",
        "Describe a time a senior leader pushed back on your proposal — how did you handle it?",
      ]),
      item("beh-cross-team", "Cross-team / cross-org collaboration", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", "Amazon LPs", [
        "Describe a project that required deep alignment across teams — what did you do?",
        "Tell me about a time another team's incentives conflicted with yours, and how you got to a shared outcome.",
      ]),
    ],
  });

  topic("mock-dsa", {
    trackLabel: "Mock · DSA round (45 min, 2 problems)",
    items: [
      item("mock-dsa-1", "Mock 1: medium array/hashing problem (20 min)", "https://neetcode.io/practice", "NeetCode", [
        "Solve and explain time/space complexity in under 25 minutes.",
        "Verbalize one optimization you skipped — and explain why it didn't make the cut for interview pacing.",
      ]),
      item("mock-dsa-2", "Mock 2: medium tree/graph problem (20 min)", "https://neetcode.io/practice", "NeetCode", [
        "Solve and explain time/space complexity in under 25 minutes.",
        "What edge cases (empty input, cycle, single node) did you cover before coding?",
      ]),
      item("mock-dsa-debrief", "Self-debrief: communication, edge cases, complexity", "https://www.pramp.com/", "Pramp", [
        "What did you skip explaining that the interviewer would have asked?",
        "Identify one moment where you went silent — what could you have said instead?",
      ]),
    ],
  });

  topic("mock-ml-coding", {
    trackLabel: "Mock · ML breadth + ML coding round",
    items: [
      item("mock-mlc-breadth", "Breadth round: 6 ML concepts in 45 min", "https://github.com/alirezadir/Machine-Learning-Interviews", "alirezadir", [
        "Pick 6 ML concept questions and time yourself for 7 min each.",
        "Which concept did you fumble — and what's the cleaner 90-second answer you'd give next time?",
      ]),
      item("mock-mlc-coding", "ML coding: implement k-means or logistic regression in 30 min", "https://github.com/alirezadir/Machine-Learning-Interviews/tree/main/src/MLC", "alirezadir", [
        "Implement k-means with k-means++ in 30 minutes — and discuss complexity.",
        "What edge cases (empty cluster, all points identical) did you handle, and how?",
      ]),
    ],
  });

  topic("mock-system-design", {
    trackLabel: "Mock · ML system design round (60 min)",
    items: [
      item("mock-sd-pick", "Pick a case (recsys / search / fraud / RAG) and self-mock 60 min", "http://patrickhalina.com/posts/ml-systems-design-interview-guide/", "Patrick Halina", [
        "Run a full 60-min self-mock and review your answers against the 7-step framework.",
        "Which step did you spend too long on, and which did you skim — what's your time budget next round?",
      ]),
      item("mock-sd-followups", "Anticipate 5 follow-up questions and write answers", "https://eugeneyan.com/writing/improving-ml-system-design/", "Eugene Yan", [
        "What 5 follow-up questions would the interviewer ask, and what's your answer to each?",
        "Pick the follow-up you're weakest on and write a 2-minute answer for it.",
      ]),
    ],
  });

  topic("mock-behavioral", {
    trackLabel: "Mock · Behavioral round + on-site simulation",
    items: [
      item("mock-beh-stories", "Run 5 STAR stories back-to-back, time each at 3 min", "https://www.themuse.com/advice/star-interview-method", "The Muse", [
        "Pick 5 stories (conflict, failure, leadership, influence, ambiguity) — record yourself, listen back.",
        "Which story is your strongest, and which is the most likely to come up on this loop?",
      ]),
      item("mock-beh-feedback", "Review recordings: filler words, structure, impact", "https://www.lennysnewsletter.com/", "Lenny's Newsletter", [
        "What's the one thing you'd cut from each story?",
        "Where did you bury the impact — how can you lead with the result and only then explain how?",
      ]),
      item("mock-onsite", "Day-of prep: sleep, food, environment, breaks", "https://github.com/alirezadir/Machine-Learning-Interviews", "alirezadir", [
        "What's your plan for the 5 minutes between rounds on a virtual onsite?",
        "What's your fallback if your camera or audio dies mid-round?",
      ]),
    ],
  });

  return { TOPICS };
}




