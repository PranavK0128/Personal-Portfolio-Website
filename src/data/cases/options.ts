import type { CaseStudy } from "../case-study-types";

export const optionsCase: CaseStudy = {
  id: "stock-options",
  title: "QQQ Options Research",
  subtitle: "From contract forecasts to cash-constrained trading simulations.",
  accent: "#f0bf7a",
  overview: [
    "An independent research project exploring whether machine learning can identify useful QQQ option opportunities. I built the workflow around historical data qualification, chronological model comparisons, and an account simulator that tracks execution, fees, cash, and settlement.",
    "RIDGE produced the highest combined simulated profit: $2,389 across three separate $10,000 accounts. Two periods lost money, and the predeclared forecast-selection rule chose CASH. The result is a completed research record with explicit limits on what the evidence supports.",
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/PranavK0128/QQQ-Options-Research",
    },
    {
      label: "Published results",
      href: "https://github.com/PranavK0128/QQQ-Options-Research/blob/main/RESULTS.html",
    },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      title: "Research context and goals",
      paragraphs: [
        "The project began with a broader investigation of financial prediction, including stock forecasts, public insider disclosures, and company screening. The final QQQ study brought the central question into focus: could a model identify attractive option opportunities under a consistent historical trading protocol?",
        "I developed the Python research workflow, compared models with scikit-learn and PyTorch, and connected their forecasts to a separate account engine. That separation made it possible to inspect both predictive behavior and the consequences of turning predictions into trades.",
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      title: "Forecast accuracy and trading constraints",
      paragraphs: [
        "Options introduce decisions about contracts, timing, available capital, and execution. Several contracts can look attractive at the same moment, but an account cannot spend the same cash twice. Proceeds also pass through settlement before they become available again.",
        "Evaluation must also account for leakage and unstable outcomes. Future information can leak into features or training labels, and a profitable total can conceal unstable periods. I designed the experiment to preserve those distinctions instead of reducing the entire project to one return figure.",
      ],
    },
    {
      id: "opportunities",
      label: "Data & targets",
      title: "Input features and prediction targets",
      paragraphs: [
        "The prediction target is an option opportunity’s net cash outcome divided by its initial debit. It measures the contract-level outcome relevant to the experiment. Retained feature rows, source identities, and original outcome records connect each forecast to the opportunity it describes.",
        "Features must be available at least one second before the decision. Original missing-value masks are restored, and preprocessing is learned within each fitting partition. If a required feature is unavailable, the entire contemporaneous choice clock is blocked, avoiding selective removal of individual alternatives.",
      ],
      visual: "options-pipeline",
      caption:
        "Each stage preserves the link between an opportunity, its features, its forecast, and its simulated outcome.",
    },
    {
      id: "evaluation",
      label: "Evaluation design",
      title: "Chronological fitting, calibration, and evaluation",
      paragraphs: [
        "Three chronological folds evaluate successive historical periods. Each fold fits a model on earlier data, reserves a separate calibration partition, and resets the simulated account to $10,000 before evaluation.",
        "The last 20% of prior sessions, rounded up, are reserved for calibration. Fitting labels must mature before calibration begins, and calibration labels must mature before the next evaluation decision. Calibration rows are excluded from refitting. Empirical residual intervals describe observed coverage; they do not guarantee future uncertainty bounds.",
      ],
      visual: "options-timeline",
      caption:
        "Chronological partitions control model fitting and calibration. All historical periods had already been examined; these are not untouched validation results.",
    },
    {
      id: "models",
      label: "Model comparison",
      title: "Candidate models and controls",
      paragraphs: [
        "The final campaign fixes the candidate architectures and hyperparameters before comparison. Three candidates across three folds produce nine fits. Adding zero, earlier-mean, and retained frozen-model controls produces eighteen funded account comparisons.",
      ],
      points: [
        {
          title: "Regularized linear regression",
          text: "RIDGE uses a weighted linear relationship with an L2 penalty, providing a controlled baseline with limited flexibility.",
        },
        {
          title: "Shallow boosted trees",
          text: "Histogram gradient boosting captures nonlinear interactions with 100 iterations, depth three, and at most seven leaves per tree.",
        },
        {
          title: "Two-part neural model",
          text: "A 16-unit hidden layer estimates positive-outcome probability and conditional gain/loss magnitudes. Its expected outcome combines all three: p × gain − (1 − p) × loss.",
        },
      ],
      visual: "options-models",
      additionalVisuals: [
        {
          visual: "options-network",
          caption:
            "The two-part network estimates a probability and two conditional magnitudes, then combines them into the expected opportunity outcome.",
        },
      ],
      caption:
        "All candidates predict the same contract-opportunity target; model complexity is the experimental variable.",
    },
    {
      id: "simulation",
      label: "Account simulation",
      title: "Account simulation and settlement",
      paragraphs: [
        "At each decision clock, the account nominates the uniquely highest positive forecast. Ties and nonpositive forecasts produce no nomination. A separate engine then applies position restrictions, available cash, execution windows, modeled fees, exits, and settlement constraints.",
        "The simulator records nominations, rejected decisions, trade paths, and cash journals. All eighteen final ledgers end in settled cash with no open contracts or pending obligations. These records make account outcomes inspectable while retaining the historical execution assumptions behind them.",
      ],
      visual: "options-account",
      additionalVisuals: [
        {
          visual: "options-nomination",
          caption:
            "The nomination examples demonstrate how ties and nonpositive forecasts prevent a contract from reaching the account checks.",
        },
      ],
      caption:
        "Cash availability, reservations, execution, and settlement determine which nominated opportunities an account can actually simulate.",
    },
    {
      id: "results",
      label: "Results",
      title: "Simulated profit and loss by evaluation fold",
      paragraphs: [
        "RIDGE earned $3,909 in Fold 1, lost $1,097 in Fold 2, and lost $423 in Fold 3, across 55 closed trades. Its $2,389 total adds dollars from three independently funded accounts. It is neither a continuous-account return nor a compounded return.",
        "The shallow tree totaled −$1,350 and the neural model −$2,633. Returns were concentrated: removing RIDGE’s three largest winning trades in Fold 1 changes that period’s profit to a $543 loss. This retrospective diagnostic exposes dependence on a few outcomes; it is not an executable trading filter.",
      ],
      visual: "options-results",
      caption:
        "Simulated net P&L by fold. Each account starts with $10,000; the bars must not be read as a continuous equity curve.",
    },
    {
      id: "account-paths",
      label: "Account paths",
      title: "Account value after each closed trade",
      paragraphs: [
        "The closing total hides the path an account took to get there. These curves reconstruct account value from the saved net outcomes of closed trades, with each model and evaluation fold beginning at $10,000.",
        "Switch between folds to see the changes in direction and the number of trades behind each result. The horizontal axis counts each model’s own closed trades; it does not align the models by clock time or show losses inside an open position.",
      ],
      visual: "options-equity-curves",
      caption:
        "Separate simulated accounts for each fold. Closed-trade value includes realized outcomes; it is not a continuously marked portfolio valuation.",
    },
    {
      id: "risk",
      label: "Risk & concentration",
      title: "Drawdown and dependence on large wins",
      paragraphs: [
        "Drawdown measures the largest decline from an earlier account high. The saved closed-trade records also let us inspect how much of each total depends on the largest winning trades.",
        "For RIDGE, removing the three largest wins in Fold 1 changes +$3,909 into −$543. This sensitivity calculation helps explain the positive total, but does not simulate an alternative trading strategy: it removes outcomes after the fact without replaying capital allocation.",
      ],
      visual: "options-risk-results",
      caption:
        "Drawdowns use closed-trade values. Removing the largest wins is a retrospective sensitivity calculation on the recorded trades.",
    },
    {
      id: "conclusion",
      label: "What the evidence supports",
      title: "Model selection and limitations",
      paragraphs: [
        "The predeclared rule required a candidate to beat both constant forecasts under the session/contract-day mean-squared-error criterion in each of the first two folds. None passed, so the rule selected CASH. RIDGE’s retrospective designation as the best historical model family preserves that original decision.",
        "The study does not establish a deployable strategy. Of 53,550 original opportunity rows, 14,179 retain unresolved unit labels, and historical source-arrival evidence remains conditional. With every period already examined, new promotion evidence would require genuinely untouched chronology. The public repository preserves the code and results, including losses and limitations.",
      ],
      visual: "options-selection",
      caption:
        "Highest historical simulated profit: RIDGE. Predeclared forecast-selection decision: CASH. No model was promoted to live trading.",
    },
  ],
};
