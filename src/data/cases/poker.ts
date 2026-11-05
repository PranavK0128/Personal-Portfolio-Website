import type { CaseStudy } from "../case-study-types";

export const pokerCase: CaseStudy = {
  id: "pokernow-assistant",
  title: "Machine Learning for Poker Opponent Modeling",
  subtitle:
    "Combining solver policies, player history, and empirical opponent models.",
  accent: "#bda4ed",
  overview: [
    "I built a poker decision-support system and research pipeline to study how stored solver policies and models of opponent behavior can inform human decisions. The system reconstructed visible table state, constrained advice to legal actions, and displayed predictions with their supporting context.",
    "Across a 313,672-decision replay, the selected postflop model reached 67.37% observed-action accuracy on supported confirmation rows. That establishes predictive performance, not improved winnings. The public release contains the paper, methodology, notebooks, and aggregate results; trained weights and the live Assistant remain private.",
  ],
  links: [
    {
      label: "Research Paper",
      href: "https://github.com/PranavK0128/PokerNow-Machine-Learning-Assistant/blob/main/report/main.pdf",
    },
    {
      label: "GitHub",
      href: "https://github.com/PranavK0128/PokerNow-Machine-Learning-Assistant",
    },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      title: "Decision support under hidden information",
      paragraphs: [
        "Poker provided a concrete setting for studying decisions with incomplete information. The same visible action can come from different holdings, strategies, or levels of experience. Position, stack depth, previous bets, and the number of remaining players all change its meaning.",
        "I developed the project around three questions: which learned components improve on simple predictive priors, whether player and session history add useful information, and what recorded play can actually establish about outcomes. Those questions shaped both the interface and the evaluation.",
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      title: "Legal actions and reliable decision inputs",
      visual: "poker-legal-example",
      caption:
        "An example legal-action mask built from observed controls. The mask constrains advice before it reaches the user.",
      paragraphs: [
        "Predicting an opponent’s next action does not identify the best action for the player. A recommendation also needs a valid game state, a legal action, an appropriate amount, and evidence that its inputs apply to the current situation.",
        "The system therefore needed explicit boundaries between strategy references, empirical predictions, and uncertain historical evidence. Missing histories had to remain missing; revealed cards could supply training labels without becoming information available at an earlier decision. I treated abstention and source labels as part of the product.",
      ],
    },
    {
      id: "architecture",
      label: "System",
      title: "System architecture",
      paragraphs: [
        "The read-only runtime reconstructed cards, stacks, betting controls, and the preceding action sequence. A legal-action mask removed unavailable choices. Stored policies and reviewed preflop references supplied the strategy foundation, followed by bounded conditioning and conditional sizing within the visible legal interval.",
        "A separate path combined player histories with learned models and support checks. Earlier Testing versions blended supported predictions into experimental advice. The later runtime retained those predictions as diagnostics with zero strategy weight. The human player remained responsible for every betting decision.",
      ],
      visual: "poker-architecture",
      caption:
        "Later architecture: policy selection and behavior diagnostics have separate roles in the displayed advice.",
    },
    {
      id: "data",
      label: "Data & evaluation",
      title: "Decision-time features and evaluation splits",
      paragraphs: [
        "The training source contained 2,334,700 decisions. Rule checks quarantined 1,239 inconsistent records, leaving 2,333,461 decisions from 202,788 hands across 447 games. Historical features used previously completed hands; within-hand features used only preceding actions. Identity resolution was retrospective.",
        "Chronological selection separated fitting, development, and calibration. Frozen-model replay then covered 313,672 decisions in 60 games, with 106,318 confirmation rows before component-specific support filters. Comparisons used 23 whole-game clusters and paired bootstrap intervals, preserving dependence between decisions from the same game.",
      ],
      visual: "poker-data",
      caption:
        "Training-source, calibration, and replay counts describe different cohorts; confirmation support varies by component.",
    },
    {
      id: "layers",
      label: "Opponent models",
      title: "Opponent-model architecture",
      paragraphs: [
        "I evaluated supervised tree ensembles from LightGBM, XGBoost, CatBoost, and Extra Trees. The selected layers model postflop behavior, within-hand sequences, joint action and sizing patterns, player archetypes, multiway responses, strategy drift, fold responses, bluff proxies, and showdown calibration.",
        "Each layer has its own features and support requirements. The postflop predictor uses 61 public-state features; within-hand modeling extends that representation with the visible action sequence. Reveal-based layers carry selection limitations: observed holdings and bluff proxies do not expose every opponent’s cards or intentions.",
      ],
      visual: "poker-layers",
      caption:
        "Nine separate predictive components, selected from tree-ensemble families and evaluated on their supported rows.",
    },
    {
      id: "solver",
      label: "Strategy reference",
      title: "Offline policy training and runtime lookup",
      paragraphs: [
        "The solver work used CFR+ and discounted CFR to train policies for declared poker subgames. Roots specified public histories, board textures, positions, stack depths, and range assumptions. The runtime consulted compiled policies instead of solving the full game during each hand.",
        "The installed river-policy subset contains 67 roots, each with two CFR+ and two DCFR lanes. Evaluation covered both seats, behavioral opponents, and paired cross-play. These checks support the retained artifacts within their restricted contracts; they do not establish equilibrium play for every live state.",
      ],
      visual: "poker-solver",
      caption:
        "Offline restricted-game training feeds a compiled reference; live conditioning does not create a newly solved equilibrium.",
    },
    {
      id: "results",
      label: "Predictive results",
      title: "Predictive performance against baseline models",
      paragraphs: [
        "All nine selected layers improved log loss over their frozen priors on supported confirmation rows. The postflop model achieved 67.37% accuracy on 42,451 rows, reducing log loss from 0.7955 to 0.6507. Its paired improvement was 0.1448, with a stored interval of 0.1352–0.1555.",
        "The comparison changes when the selected postflop model becomes the baseline. No alternative reliably improves on it. The within-hand model’s interval crosses zero; the other alternatives trail it. This finding argues for evaluating each contribution before combining models into a recommendation.",
      ],
      visual: "poker-results",
      additionalVisuals: [
        {
          visual: "poker-coverage",
          caption:
            "Supported confirmation rows for each predictive component. The cohorts overlap and vary by task, so their accuracies should not be treated as a common leaderboard.",
        },
      ],
      caption:
        "Paired log-loss improvement with whole-game bootstrap intervals. Positive is better; supported rows differ between comparisons.",
    },
    {
      id: "history",
      label: "History experiment",
      title: "Effects of player and session history",
      paragraphs: [
        "A separate experiment compared public-state, population, player, and current-session histories. Sparse histories were shrunk toward broader distributions. I evaluated observed actions and conditional aggressive sizing separately across three training windows.",
        "Session history improved conditional sizing over player history in all three windows. Action-prediction gains varied, including a decline in the smallest window. These results come from reused development games, so they support further investigation rather than an untouched confirmation claim.",
      ],
      visual: "poker-history",
      caption:
        "Session-versus-player history comparisons on reused development games; points and stored lower bounds are descriptive.",
    },
    {
      id: "outcomes",
      label: "Outcome & reflection",
      title: "Results and limitations",
      paragraphs: [
        "The project produced an implemented advisory system, a documented training and evaluation pipeline, and a public research report. Its clearest result is that behavior models can outperform simple priors while still requiring separate evidence before influencing strategy.",
        "The recorded gameplay sample finished at +486.37 big blinds across 4,880 hands in 32 games: +9.97 BB per 100 hands. The curve below shows how that total developed across complete games, including the losses along the way.",
        "This is an observed gameplay result associated with the project. Without a control group or verified recommendation use, it does not establish how much the Assistant contributed to the winnings.",
      ],
      visual: "poker-ledger-results",
      caption:
        "Recorded net big blinds, accumulated in game order. The overall rate is 486.37 ÷ 4,880 × 100 = +9.97 BB/100.",
    },
  ],
};
