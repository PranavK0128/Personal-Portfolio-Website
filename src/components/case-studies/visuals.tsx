"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CompressionGate,
  LegalActionExample,
  NominationExample,
  OptionsNetwork,
  PokerModelNetwork,
  StackCodebase,
  TransformerArchitecture,
} from "./architecture";
import { StackComparison, StackReplay } from "./product-demos";
import {
  CompressionBatchTiming,
  CompressionRobustness,
  OptionsEquityCurves,
  OptionsRiskResults,
  PokerCoverageResults,
  PokerLedgerResults,
} from "./research-charts";

const asset = (name: string) => `/images/case-studies/${name}.webp`;

function Screenshot({
  name,
  alt,
  paper = false,
  eager = false,
}: {
  name: string;
  alt: string;
  paper?: boolean;
  eager?: boolean;
}) {
  return (
    <a
      className={`case-screenshot ${paper ? "case-paper-figure" : ""}`}
      href={asset(name)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${alt}. Open full-size image in a new tab`}
    >
      <Image
        src={asset(name)}
        alt={alt}
        width={1800}
        height={1012}
        unoptimized
        loading={eager ? "eager" : "lazy"}
        sizes="(max-width: 767px) 90vw, 1044px"
      />
      <span className="case-image-hint">
        View full size <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}

function Flow({
  title,
  steps,
  note,
}: {
  title: string;
  steps: [string, string][];
  note?: string;
}) {
  return (
    <div className="case-diagram">
      <p className="case-diagram-title">{title}</p>
      <ol className="case-flow">
        {steps.map(([heading, description], i) => (
          <li key={heading}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{heading}</strong>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      {note && <p className="case-diagram-note">{note}</p>}
    </div>
  );
}

function Stats({ items }: { items: [string, string][] }) {
  return (
    <div className="case-stats">
      {items.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function PlayerViews() {
  const views = [
    [
      "Overview",
      "sean-general",
      "A player’s activity and key statistics in one view.",
    ],
    [
      "Profit & loss",
      "sean-pnl",
      "Session outcomes and financial history over time.",
    ],
    [
      "Statistics",
      "sean-stats",
      "Detailed poker statistics with the opportunities behind each rate.",
    ],
    [
      "Play style",
      "sean-playStyle",
      "Patterns across situations, positions, and actions.",
    ],
    [
      "Opponent study",
      "sean-playAgainst",
      "Context for studying how a player responds.",
    ],
    [
      "Identity",
      "sean-about",
      "A consistent profile across names and sessions.",
    ],
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="case-player-views">
      <fieldset className="case-controls" aria-label="Player profile views">
        {views.map(([label], i) => (
          <button
            key={label}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {label}
          </button>
        ))}
      </fieldset>
      <Screenshot
        name={views[selected][1]}
        alt={`StackHUD player profile: ${views[selected][0]}`}
      />
      <p className="case-diagram-note" aria-live="polite">
        {views[selected][2]}
      </p>
    </div>
  );
}

function PromptAnatomy({ hero = false }: { hero?: boolean }) {
  return (
    <div className={`case-prompt ${hero ? "case-prompt-hero" : ""}`}>
      <div className="case-prompt-row">
        <span>Instruction</span>
        <p>Classify the sentiment of the review.</p>
        <small>Protected</small>
      </div>
      <div className="case-prompt-row case-prompt-demo">
        <span>Demonstration</span>
        <p>
          <del>A film that is </del>
          <mark>beautifully</mark> <del>made and </del>
          <mark>moving</mark>
          <del> from start to finish</del>.<br />
          <b>Positive</b>
        </p>
        <small>Compress</small>
      </div>
      <div className="case-prompt-row">
        <span>Query</span>
        <p>It isn’t perfect, but it stays with you.</p>
        <small>Protected</small>
      </div>
      <div className="case-prompt-output">
        <span>Retained tokens</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h16m-7-7 7 7-7 7" />
        </svg>
        <strong>DistilBERT</strong>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h16m-7-7 7 7-7 7" />
        </svg>
        <span>Sentiment</span>
      </div>
      <p className="case-diagram-note">
        Illustrative text and selection, not a recorded model prediction.
      </p>
    </div>
  );
}

const compressionRows = [
  { name: "Full prompt", accuracy: 90.44, tokens: 136.16, time: 0.351 },
  { name: "Cached IDF", accuracy: 90.9, tokens: 97.16, time: 0.179 },
  { name: "Learned", accuracy: 90.37, tokens: 97.16, time: 0.922 },
  { name: "Query only", accuracy: 90.67, tokens: 25.16, time: 0.147 },
];
function CompressionResults() {
  const [metric, setMetric] = useState<"accuracy" | "tokens" | "time">(
    "tokens",
  );
  const max = metric === "accuracy" ? 100 : metric === "tokens" ? 150 : 1;
  const label =
    metric === "accuracy"
      ? "Accuracy (%) · higher is better"
      : metric === "tokens"
        ? "Mean input tokens · fewer is shorter"
        : "Pipeline ms / example · lower is faster";
  return (
    <div className="case-chart">
      <fieldset
        className="case-controls"
        aria-label="Compression result metric"
      >
        {(["tokens", "accuracy", "time"] as const).map((m) => (
          <button
            type="button"
            aria-pressed={metric === m}
            onClick={() => setMetric(m)}
            key={m}
          >
            {m === "tokens"
              ? "Input length"
              : m === "accuracy"
                ? "Accuracy"
                : "Pipeline time"}
          </button>
        ))}
      </fieldset>
      <p className="case-diagram-title" aria-live="polite">
        {label}
      </p>
      <div className="case-bar-chart">
        {compressionRows.map((row) => (
          <div className="case-bar-row" key={row.name}>
            <span>{row.name}</span>
            <div className="case-bar-track">
              <div style={{ width: `${(row[metric] / max) * 100}%` }} />
            </div>
            <strong>
              {row[metric].toFixed(metric === "time" ? 3 : 2)}
              {metric === "accuracy" ? "%" : ""}
            </strong>
          </div>
        ))}
      </div>
      <p className="case-diagram-note">
        Bars start at zero. Accuracy is the mean across three seeds; small
        differences do not establish superiority.
      </p>
      <details className="case-data-table">
        <summary>View all measurements</summary>
        <table>
          <caption>Three-seed means, warm GPU batch size 16</caption>
          <thead>
            <tr>
              <th>Method</th>
              <th>Accuracy</th>
              <th>Tokens</th>
              <th>ms/example</th>
            </tr>
          </thead>
          <tbody>
            {compressionRows.map((row) => (
              <tr key={row.name}>
                <th>{row.name}</th>
                <td>{row.accuracy}%</td>
                <td>{row.tokens}</td>
                <td>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function PokerArchitecture({ hero = false }: { hero?: boolean }) {
  return (
    <div
      className={`case-architecture ${hero ? "case-architecture-hero" : ""}`}
    >
      <div className="case-architecture-input">
        <small>Visible table + prior hand history</small>
        <strong>Reconstruct the decision</strong>
        <span>Position · Board · Pot · Stack · Legal actions</span>
      </div>
      <div className="case-branches">
        <div>
          <span className="case-branch-label">Strategy reference</span>
          <h3>Stored solver policy</h3>
          <p>CFR+ / DCFR lookup</p>
          <div className="case-branch-line" />
          <h3>Legal action & sizing</h3>
          <p>Bounded conditioning and guards</p>
          <strong className="case-branch-output">Advice for the player</strong>
        </div>
        <div>
          <span className="case-branch-label">Behavior diagnostics</span>
          <h3>Historical features</h3>
          <p>Completed hands and prior actions</p>
          <div className="case-branch-line" />
          <h3>Nine predictive layers</h3>
          <p>Probabilities and support checks</p>
          <strong className="case-branch-output">
            Context alongside advice
          </strong>
        </div>
      </div>
      <p className="case-diagram-note">
        Later runtime: predictive diagnostics have zero strategy weight. The
        human makes the decision.
      </p>
    </div>
  );
}

function OptionsTimeline() {
  return (
    <div className="case-timeline">
      <p className="case-diagram-title">Chronological evaluation partitions</p>
      {[
        ["01", "Initial fitting history", "Evaluation period 1"],
        ["02", "Expanded fitting history", "Evaluation period 2"],
        ["03", "Further expanded history", "Evaluation period 3"],
      ].map(([n, train, test]) => (
        <div className="case-fold" key={n}>
          <span>Fold {n}</span>
          <div>
            <small>Prior history</small>
            <strong>{train}</strong>
            <p>Fit → reserve final 20% of prior sessions for calibration</p>
          </div>
          <div>
            <small>Evaluate</small>
            <strong>{test}</strong>
            <p>New $10,000 simulated account</p>
          </div>
        </div>
      ))}
      <p className="case-diagram-note">
        Calibration rows are not refitted. This is examined historical data, not
        a new untouched holdout.
      </p>
    </div>
  );
}

function OptionsResults({ hero = false }: { hero?: boolean }) {
  const models = [
    { name: "Ridge", values: [3909, -1097, -423] },
    { name: "Shallow tree", values: [1396, -676, -2070] },
    { name: "Two-part network", values: [2677, -180, -5130] },
    { name: "Frozen L18", values: [561, -312, 521] },
  ];
  const [selected, setSelected] = useState(0);
  const model = models[selected];
  return (
    <div
      className={`case-chart case-options-chart ${hero ? "case-options-hero" : ""}`}
    >
      <fieldset className="case-controls" aria-label="Model account results">
        {models.map((m, i) => (
          <button
            key={m.name}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {m.name}
          </button>
        ))}
      </fieldset>
      <p className="case-diagram-title">Net simulated profit / loss (USD)</p>
      <div className="case-fold-chart" aria-live="polite">
        {model.values.map((value, i) => (
          <div
            className="case-fold-result"
            key={i === 0 ? "Fold 1" : i === 1 ? "Fold 2" : "Fold 3"}
          >
            <strong className={value < 0 ? "case-negative" : ""}>
              {value >= 0 ? "+" : "−"}${Math.abs(value).toLocaleString("en-US")}
            </strong>
            <div className="case-signed-track">
              <span className="case-zero-line" />
              <span
                className={`case-signed-bar ${value < 0 ? "case-loss" : ""}`}
                style={{
                  height: `${(Math.abs(value) / 6000) * 50}%`,
                  bottom:
                    value >= 0
                      ? "50%"
                      : `${50 - (Math.abs(value) / 6000) * 50}%`,
                }}
              />
            </div>
            <span>{["Fold 1", "Fold 2", "Fold 3"][i]}</span>
            <small>$10,000 starting cash</small>
          </div>
        ))}
      </div>
      <p className="case-diagram-note">
        Independent accounts; common scale ±$6,000. No compounding. Predeclared
        selection: CASH.
      </p>
      {!hero && (
        <details className="case-data-table">
          <summary>View all account outcomes</summary>
          <table>
            <caption>Net simulated USD; each fold starts with $10,000</caption>
            <thead>
              <tr>
                <th>Model</th>
                <th>Fold 1</th>
                <th>Fold 2</th>
                <th>Fold 3</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.name}>
                  <th>{m.name}</th>
                  {m.values.map((v, i) => (
                    <td key={`${m.name}-${["Fold 1", "Fold 2", "Fold 3"][i]}`}>
                      {v.toLocaleString("en-US")}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th>Zero / Earlier mean</th>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}

export function CaseVisual({ name }: { name: string }) {
  switch (name) {
    case "stack-codebase":
      return <StackCodebase />;
    case "stack-comparison":
      return <StackComparison />;
    case "poker-ledger-results":
      return <PokerLedgerResults />;
    case "poker-coverage":
      return <PokerCoverageResults />;
    case "compression-robustness":
      return <CompressionRobustness />;
    case "compression-batch-timing":
      return <CompressionBatchTiming />;
    case "options-equity-curves":
      return <OptionsEquityCurves />;
    case "options-risk-results":
      return <OptionsRiskResults />;
    case "stack-leaderboards":
      return (
        <Screenshot
          name="leaderboard-monitor"
          alt="StackHUD leaderboard with player search, ranking metrics, stakes, minimum-hand filters, and sample confidence"
        />
      );
    case "stack-ledger-screen":
      return (
        <Screenshot
          name="ledger-preview"
          alt="StackHUD ledger review showing financial totals, player results, buy-ins, and cash-outs"
        />
      );
    case "poker-legal-example":
      return <LegalActionExample />;
    case "compression-transformer":
      return <TransformerArchitecture />;
    case "compression-gate":
      return <CompressionGate />;
    case "options-network":
      return <OptionsNetwork />;
    case "options-nomination":
      return <NominationExample />;
    case "stackhud-hero":
    case "stack-dashboard":
      return (
        <Screenshot
          name="dashboard-monitor"
          eager={name === "stackhud-hero"}
          alt="StackHUD dashboard with session analytics, hand search, leaderboards, and ledger tools"
        />
      );
    case "stack-player":
      return <PlayerViews />;
    case "stack-replay":
      return <StackReplay />;
    case "stack-action-history":
      return (
        <Screenshot
          name="hand-replayer-fullscreen"
          alt="StackHUD action-history table with street, player, action, wager, pot, and stack information"
        />
      );
    case "stack-study":
      return (
        <Screenshot
          name="tools-monitor"
          alt="StackHUD poker study tools and hand analysis workspace"
        />
      );
    case "stack-pipeline":
      return (
        <Flow
          title="Data processing pipeline"
          steps={[
            [
              "Collect",
              "Game logs and settlement ledgers retain their source.",
            ],
            [
              "Reconstruct",
              "Parse hands, actions, seats, and street transitions.",
            ],
            ["Reconcile", "Resolve player identity and verify amount units."],
            ["Explore", "Serve profiles, statistics, replay, and study tools."],
          ]}
          note="Raw evidence → normalized PostgreSQL records → API → Next.js interface"
        />
      );
    case "stack-ledger":
      return (
        <Flow
          title="Financial normalization and reconciliation"
          steps={[
            ["Source amounts", "Read each game's chip and currency context."],
            [
              "Normalize units",
              "Apply verified scale consistently to financial amounts.",
            ],
            [
              "Reconcile",
              "Check buy-ins, cash-outs, balances, and ledger totals.",
            ],
            [
              "Review outcomes",
              "Present session results with traceable evidence.",
            ],
          ]}
        />
      );
    case "prompt-compression-hero":
      return <PromptAnatomy hero />;
    case "compression-prompt":
      return <PromptAnatomy />;
    case "compression-data":
      return (
        <Stats
          items={[
            ["56,087", "Training phrases"],
            ["6,432", "Development phrases"],
            ["32", "Support examples"],
            ["872", "Final evaluation examples"],
          ]}
        />
      );
    case "compression-methods":
      return (
        <Flow
          title="Token-ranking methods"
          steps={[
            ["Random", "Choose eligible words without an importance signal."],
            ["IDF", "Prioritize less common words using corpus statistics."],
            ["Learned", "Score content using frozen encoder representations."],
          ]}
          note="Every ranking → whole-word budget selection → retained token IDs → classifier"
        />
      );
    case "compression-results":
      return <CompressionResults />;
    case "compression-location":
      return (
        <div className="case-comparison">
          <div>
            <span>Compress demonstrations</span>
            <strong>
              90.18<small>%</small>
            </strong>
            <p>Keep the query intact</p>
          </div>
          <div>
            <span>Compress the query</span>
            <strong>
              73.74<small>%</small>
            </strong>
            <p>Remove task-specific evidence</p>
          </div>
        </div>
      );
    case "pokernow-assistant-hero":
      return <PokerArchitecture hero />;
    case "poker-architecture":
      return <PokerArchitecture />;
    case "poker-layers":
      return <PokerModelNetwork />;
    case "poker-data":
      return (
        <Flow
          title="Decision-time features, chronological evaluation"
          steps={[
            ["Train", "1,821,293 earlier decision rows."],
            ["Develop", "398,940 subsequent decision rows."],
            ["Calibrate", "113,228 later decision rows."],
            ["Replay", "313,672 replay decisions."],
          ]}
          note="Replay includes 106,318 confirmation rows, 198,448 development rows, and 8,906 training-overlap rows. Component support is evaluated separately."
        />
      );
    case "poker-solver":
      return (
        <Flow
          title="Offline solving → runtime lookup"
          steps={[
            [
              "Restricted roots",
              "Specify public state, stack anchors, and range families.",
            ],
            ["CFR+ / DCFR", "Update regret and accumulate strategies offline."],
            [
              "Stored policy",
              "Retain evaluated policies for supported situations.",
            ],
            ["Runtime", "Select, condition, and constrain to legal actions."],
          ]}
          note="Restricted policy references, not a new full-game equilibrium solve at every decision."
        />
      );
    case "poker-results":
      return (
        <Screenshot
          name="layer_comparisons"
          alt="Paper figure comparing predictive layers against frozen priors and the selected postflop predictor, with uncertainty intervals"
          paper
        />
      );
    case "poker-history":
      return (
        <Screenshot
          name="history_ablations"
          alt="Paper figure comparing session history and player history for action prediction and conditional sizing"
          paper
        />
      );
    case "stock-options-hero":
      return <OptionsResults hero />;
    case "options-results":
      return <OptionsResults />;
    case "options-timeline":
      return <OptionsTimeline />;
    case "options-pipeline":
      return (
        <Flow
          title="Contract-opportunity pipeline"
          steps={[
            [
              "Contract opportunity",
              "Build features available before the decision.",
            ],
            ["Forecast", "Estimate net cash outcome divided by initial debit."],
            ["Nominate", "Choose a unique highest positive forecast."],
            [
              "Simulate",
              "Apply execution, capital, fees, and settlement rules.",
            ],
          ]}
        />
      );
    case "options-models":
      return (
        <div className="case-models">
          <div>
            <span>01 / Linear</span>
            <h3>Ridge</h3>
            <p>Regularized weighted regression</p>
            <code>features → weighted sum</code>
          </div>
          <div>
            <span>02 / Nonlinear</span>
            <h3>Shallow trees</h3>
            <p>Histogram gradient boosting</p>
            <code>features → depth-3 trees</code>
          </div>
          <div>
            <span>03 / Decomposed</span>
            <h3>Two-part network</h3>
            <p>Probability, gain, and loss heads</p>
            <code>p × gain − (1 − p) × loss</code>
          </div>
        </div>
      );
    case "options-account":
      return (
        <Flow
          title="Account simulation stages"
          steps={[
            [
              "Available cash",
              "Check buying power and nomination restrictions.",
            ],
            ["Reserve & execute", "Apply the modeled entry window and fees."],
            ["Hold & exit", "Follow original position and exit rules."],
            ["Settle", "Release settled proceeds back to available cash."],
          ]}
          note="A rejected nomination does not become a trade. Simulated execution is not a verified historical fill."
        />
      );
    case "options-selection":
      return (
        <div className="case-comparison">
          <div>
            <span>Highest retrospective total</span>
            <strong>Ridge</strong>
            <p>+$2,389 across three separate accounts</p>
          </div>
          <div>
            <span>Predeclared forecast rule</span>
            <strong>CASH</strong>
            <p>No candidate passed both early-fold gates</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}
