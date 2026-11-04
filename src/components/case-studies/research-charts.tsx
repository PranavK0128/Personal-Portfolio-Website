"use client";

import { useId, useState } from "react";
import {
  compressionRobustness,
  compressionTiming,
  optionsEquity,
  optionsRisk,
  pokerCoverage,
  pokerLedger,
  researchSources,
} from "../../data/research-charts";

const colors = [
  "var(--research-accent, var(--case-accent))",
  "var(--research-series-two)",
  "var(--research-series-three)",
  "var(--research-series-four)",
];
const methods = [
  { id: "demo_idf_25", name: "IDF" },
  { id: "demo_learned_25", name: "Learned" },
  { id: "full_prompt", name: "Full prompt" },
  { id: "query_only", name: "Query only" },
] as const;
const models = [
  { id: "RIDGE", name: "Ridge" },
  { id: "SHALLOW_TREE", name: "Shallow tree" },
  { id: "SMALL_TWO_PART_NET", name: "Two-part network" },
] as const;
const folds = ["F1", "F2", "F3"] as const;
type Fold = (typeof folds)[number];
type Series = { name: string; points: { x: number; y: number }[] };
const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", { maximumFractionDigits: decimals });
const usd = (n: number) => `${n < 0 ? "−" : ""}$${fmt(Math.abs(n))}`;

function required<T>(value: T | undefined): T {
  if (value === undefined)
    throw new Error("Missing published research chart row");
  return value;
}

function Source({ href }: { href: string }) {
  return (
    <a className="research-source" href={href} target="_blank" rel="noreferrer">
      Source data <span aria-hidden="true">↗</span>
    </a>
  );
}

function FoldControls({
  value,
  onChange,
}: {
  value: Fold;
  onChange: (fold: Fold) => void;
}) {
  return (
    <fieldset
      className="case-controls research-controls"
      aria-label="Evaluation fold"
    >
      {folds.map((fold, i) => (
        <button
          key={fold}
          type="button"
          aria-pressed={value === fold}
          onClick={() => onChange(fold)}
        >
          Fold {i + 1}
        </button>
      ))}
    </fieldset>
  );
}

function Legend({ names }: { names: string[] }) {
  return (
    <ul className="research-legend" aria-label="Chart series">
      {names.map((name, i) => (
        <li key={name}>
          <span style={{ background: colors[i] }} />
          {name}
        </li>
      ))}
    </ul>
  );
}

function LinePlot({
  title,
  series,
  xMax,
  yMin,
  yMax,
  xLabel,
  yLabel,
  yFormat = fmt,
  xTicks,
  reference,
  selectedX,
}: {
  title: string;
  series: Series[];
  xMax: number;
  yMin: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
  yFormat?: (value: number) => string;
  xTicks?: { value: number; label: string }[];
  reference?: number;
  selectedX?: number;
}) {
  const id = useId();
  const left = 100,
    right = 646,
    top = 40,
    bottom = 276;
  const x = (value: number) => left + (value / xMax) * (right - left);
  const y = (value: number) =>
    bottom - ((value - yMin) / (yMax - yMin)) * (bottom - top);
  const ticks =
    xTicks ??
    Array.from({ length: 5 }, (_, i) => {
      const value = Math.round((xMax * i) / 4);
      return { value, label: String(value) };
    });
  return (
    <div className="research-plot-scroll">
      <svg
        className="research-plot"
        viewBox="0 0 680 355"
        role="img"
        aria-labelledby={id}
      >
        <title id={id}>
          {`${title}. ${yLabel} by ${xLabel}. Exact values follow in the data table.`}
        </title>
        <text x={left} y={20} className="research-axis-title">
          {yLabel}
        </text>
        {Array.from({ length: 5 }, (_, i) => {
          const value = yMin + ((yMax - yMin) * i) / 4;
          return (
            <g key={value}>
              <line
                x1={left}
                x2={right}
                y1={y(value)}
                y2={y(value)}
                className="research-grid"
              />
              <text x={left - 12} y={y(value) + 5} textAnchor="end">
                {yFormat(value)}
              </text>
            </g>
          );
        })}
        {ticks.map((tick) => (
          <text
            key={tick.value}
            x={x(tick.value)}
            y={bottom + 25}
            textAnchor="middle"
          >
            {tick.label}
          </text>
        ))}
        <text
          x={(left + right) / 2}
          y={345}
          textAnchor="middle"
          className="research-axis-title"
        >
          {xLabel}
        </text>
        {reference !== undefined && (
          <line
            x1={left}
            x2={right}
            y1={y(reference)}
            y2={y(reference)}
            className="research-reference"
          />
        )}
        {selectedX !== undefined && (
          <line
            x1={x(selectedX)}
            x2={x(selectedX)}
            y1={top}
            y2={bottom}
            className="research-guide"
          />
        )}
        {series.map((line, i) => (
          <g key={line.name}>
            <polyline
              points={line.points.map((p) => `${x(p.x)},${y(p.y)}`).join(" ")}
              fill="none"
              stroke={colors[i]}
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {line.points.map((p) => (
              <circle
                key={p.x}
                cx={x(p.x)}
                cy={y(p.y)}
                r={selectedX === p.x ? 5 : 3}
                fill={colors[i]}
              >
                <title>
                  {`${line.name}: ${xLabel} ${p.x}, ${yFormat(p.y)} ${yLabel}`}
                </title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function PokerLedgerResults() {
  const [game, setGame] = useState(32);
  const inputId = useId();
  const selected = pokerLedger[game - 1];
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Recorded gameplay</p>
          <h3>Complete-game ledger results</h3>
        </div>
        <div className="research-headline">
          <strong>
            +9.97 <small>BB/100</small>
          </strong>
          <span>486.37 BB · 4,880 hands · 32 games</span>
        </div>
      </div>
      <LinePlot
        title="Cumulative recorded poker return"
        series={[
          {
            name: "Recorded return",
            points: [
              { x: 0, y: 0 },
              ...pokerLedger.map((r) => ({
                x: r.game,
                y: r.cumulative_net_bb,
              })),
            ],
          },
        ]}
        xMax={32}
        yMin={0}
        yMax={1400}
        xLabel="Eligible game number"
        yLabel="Cumulative net big blinds"
        selectedX={game}
      />
      <div className="research-inspector">
        <label htmlFor={inputId}>
          Inspect game <strong>{game}</strong>
        </label>
        <input
          id={inputId}
          type="range"
          min="1"
          max="32"
          value={game}
          onChange={(event) => setGame(Number(event.target.value))}
        />
        <output htmlFor={inputId} aria-live="polite">
          <strong>
            {selected.net_bb >= 0 ? "+" : ""}
            {fmt(selected.net_bb, 2)} BB
          </strong>{" "}
          in this game · {fmt(selected.cumulative_net_bb, 2)} BB across{" "}
          {fmt(selected.cumulative_hands)} hands
        </output>
      </div>
      <p className="case-diagram-note">
        Observed complete-game outcomes associated with the project. The rate is
        486.37 ÷ 4,880 × 100; this sample does not establish long-run
        profitability or the Assistant’s effect on winnings.
      </p>
      <details className="case-data-table research-table">
        <summary>View all 32 game results</summary>
        <div className="research-table-scroll">
          <table>
            <caption>Complete-game ledger returns; BB means big blinds</caption>
            <thead>
              <tr>
                <th>Game</th>
                <th>Hands</th>
                <th>Net BB</th>
                <th>Cumulative BB</th>
              </tr>
            </thead>
            <tbody>
              {pokerLedger.map((r) => (
                <tr key={r.game}>
                  <th scope="row">{r.game}</th>
                  <td>{r.hands}</td>
                  <td>{fmt(r.net_bb, 2)}</td>
                  <td>{fmt(r.cumulative_net_bb, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href={researchSources.poker} />
    </div>
  );
}

const slices = [
  { id: "all", label: "All reviews", short: "All", n: 872 },
  { id: "negation", label: "Negation", short: "Negation", n: 180 },
  { id: "contrast", label: "Contrast", short: "Contrast", n: 130 },
  { id: "short_1_10_words", label: "Short reviews", short: "Short", n: 152 },
  {
    id: "medium_11_25_words",
    label: "Medium reviews",
    short: "Medium",
    n: 495,
  },
  { id: "long_26plus_words", label: "Long reviews", short: "Long", n: 225 },
] as const;

export function CompressionRobustness() {
  const [slice, setSlice] = useState<(typeof slices)[number]["id"]>("negation");
  const active = slices.find((s) => s.id === slice) ?? slices[1];
  const rows = methods.map((method) => ({
    ...method,
    ...required(
      compressionRobustness.find(
        (r) => r.method === method.id && r.slice === slice,
      ),
    ),
  }));
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Linguistic robustness</p>
          <h3>Accuracy beyond the overall average</h3>
        </div>
        <span className="research-badge">3 seeds per method</span>
      </div>
      <fieldset
        className="case-controls research-controls"
        aria-label="Review slice"
      >
        {slices.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={slice === s.id}
            onClick={() => setSlice(s.id)}
          >
            {s.label}
          </button>
        ))}
      </fieldset>
      <div className="research-comparison" aria-live="polite">
        <div className="research-comparison-heading">
          <strong>{active.label}</strong>
          <span>{active.n} examples · mean accuracy ± seed SD</span>
        </div>
        {rows.map((r, i) => (
          <div className="research-metric-row" key={r.id}>
            <span>{r.name}</span>
            <div className="research-bar-track">
              <span
                style={{
                  width: `${r.accuracy_percent}%`,
                  background: colors[i],
                }}
              />
            </div>
            <strong>
              {r.accuracy_percent.toFixed(2)}%
              <small>±{r.seed_sd_percentage_points.toFixed(2)}</small>
            </strong>
          </div>
        ))}
        <div className="research-bar-axis">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <p className="case-diagram-note">
        Means across three seeds on the same examples. Negation and contrast
        slices can overlap; long reviews contain at least 26 words. These
        differences are descriptive, with no claim that small gaps establish
        superiority.
      </p>
      <details className="case-data-table research-table">
        <summary>Compare all review slices</summary>
        <div className="research-table-scroll">
          <table>
            <caption>
              Accuracy (%) averaged across three seeds; ± is seed standard
              deviation
            </caption>
            <thead>
              <tr>
                <th>Slice / examples</th>
                {methods.map((m) => (
                  <th key={m.id}>{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slices.map((s) => (
                <tr key={s.id}>
                  <th scope="row">
                    {s.label} / {s.n}
                  </th>
                  {methods.map((m) => {
                    const r = required(
                      compressionRobustness.find(
                        (v) => v.method === m.id && v.slice === s.id,
                      ),
                    );
                    return (
                      <td key={m.id}>
                        {r.accuracy_percent.toFixed(2)} ±{" "}
                        {r.seed_sd_percentage_points.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href={researchSources.compressionRobustness} />
    </div>
  );
}

export function CompressionBatchTiming() {
  const [batch, setBatch] = useState(16);
  const rows = methods.map((m) => ({
    ...m,
    ...required(
      compressionTiming.find(
        (r) => r.method === m.id && r.batch_size === batch,
      ),
    ),
  }));
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Complete inference pipeline</p>
          <h3>How batching changes measured cost</h3>
        </div>
        <span className="research-badge">Warm GPU</span>
      </div>
      <Legend names={methods.map((m) => m.name)} />
      <LinePlot
        title="Warm GPU pipeline time by batch size"
        series={methods.map((m) => ({
          name: m.name,
          points: compressionTiming
            .filter((r) => r.method === m.id)
            .map((r) => ({ x: r.batch_size, y: r.pipeline_ms_per_example })),
        }))}
        xMax={32}
        yMin={0}
        yMax={4.5}
        xLabel="Batch size"
        yLabel="Pipeline milliseconds per example"
        yFormat={(n) => n.toFixed(2)}
        xTicks={[
          { value: 1, label: "1" },
          { value: 16, label: "16" },
          { value: 32, label: "32" },
        ]}
        selectedX={batch}
      />
      <fieldset
        className="case-controls research-controls"
        aria-label="Timing batch size"
      >
        {[1, 16, 32].map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={batch === b}
            onClick={() => setBatch(b)}
          >
            Batch {b}
          </button>
        ))}
      </fieldset>
      <div className="research-timing-grid" aria-live="polite">
        {rows.map((r) => (
          <div key={r.id}>
            <span>{r.name}</span>
            <strong>
              {r.pipeline_ms_per_example.toFixed(3)} <small>ms</small>
            </strong>
            <small>per example</small>
          </div>
        ))}
      </div>
      <p className="case-diagram-note">
        Saved measurements averaged across three seeds, including online
        compression and classification. The learned method adds an encoder pass.
        Batched time per example describes throughput, not individual request
        latency.
      </p>
      <details className="case-data-table research-table">
        <summary>View timing measurements by batch</summary>
        <div className="research-table-scroll">
          <table>
            <caption>
              Pipeline milliseconds per example, mean across three seeds
            </caption>
            <thead>
              <tr>
                <th>Method</th>
                <th>Batch 1</th>
                <th>Batch 16</th>
                <th>Batch 32</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.id}>
                  <th scope="row">{m.name}</th>
                  {[1, 16, 32].map((b) => (
                    <td key={b}>
                      {compressionTiming
                        .find((r) => r.method === m.id && r.batch_size === b)
                        ?.pipeline_ms_per_example.toFixed(6)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href={researchSources.compressionTiming} />
    </div>
  );
}

export function OptionsEquityCurves() {
  const [fold, setFold] = useState<Fold>("F1");
  const rows = models.map((model) => ({
    ...model,
    ...required(
      optionsEquity.find((r) => r.fold === fold && r.model === model.id),
    ),
  }));
  const tradeNumbers = Array.from(
    { length: Math.max(...rows.map((r) => r.points.length)) },
    (_, i) => i,
  );
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Account paths</p>
          <h3>Equity after each closed trade</h3>
        </div>
        <span className="research-badge">$10,000 per account</span>
      </div>
      <FoldControls value={fold} onChange={setFold} />
      <Legend names={models.map((m) => m.name)} />
      <LinePlot
        title={`Fold ${fold.slice(1)} closed-trade equity`}
        series={rows.map((r) => ({
          name: r.name,
          points: r.points.map((p) => ({ x: p.trade, y: p.equity_dollars })),
        }))}
        xMax={28}
        yMin={4000}
        yMax={16000}
        xLabel="Closed trade number"
        yLabel="Account equity (USD)"
        yFormat={usd}
        reference={10000}
      />
      <div className="research-timing-grid research-three" aria-live="polite">
        {rows.map((r) => (
          <div key={r.id}>
            <span>{r.name}</span>
            <strong>{usd(r.points[r.points.length - 1].equity_dollars)}</strong>
            <small>
              {r.points.length - 1} closed trades · Fold {fold.slice(1)}
            </small>
          </div>
        ))}
      </div>
      <p className="case-diagram-note">
        Each fold uses separate $10,000 accounts. Curves share the same scale
        and stop at each model’s final trade. Trade number is not shared
        calendar time; equity is recorded at trade close, not marked
        continuously to market. The predeclared rule selected CASH.
      </p>
      <details className="case-data-table research-table">
        <summary>View selected fold’s equity values</summary>
        <div className="research-table-scroll">
          <table>
            <caption>
              Fold {fold.slice(1)}: simulated account equity in USD after trade
              close
            </caption>
            <thead>
              <tr>
                <th>Trade</th>
                {models.map((m) => (
                  <th key={m.id}>{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tradeNumbers.map((trade) => (
                <tr key={trade}>
                  <th scope="row">{trade === 0 ? "Starting cash" : trade}</th>
                  {rows.map((r) => (
                    <td key={r.id}>
                      {r.points[trade]
                        ? usd(r.points[trade].equity_dollars)
                        : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href={researchSources.options} />
    </div>
  );
}

export function OptionsRiskResults() {
  const [fold, setFold] = useState<Fold>("F1");
  const [metric, setMetric] = useState<"drawdown" | "concentration">(
    "drawdown",
  );
  const rows = models.map((model) => ({
    ...model,
    ...required(
      optionsRisk.find((r) => r.fold === fold && r.model === model.id),
    ),
  }));
  const id = useId();
  const x = (n: number) => 135 + ((n + 6000) / 10000) * 478;
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Risk and concentration</p>
          <h3>What the final profit number conceals</h3>
        </div>
      </div>
      <FoldControls value={fold} onChange={setFold} />
      <fieldset
        className="case-controls research-controls"
        aria-label="Account risk metric"
      >
        <button
          type="button"
          aria-pressed={metric === "drawdown"}
          onClick={() => setMetric("drawdown")}
        >
          Drawdown
        </button>
        <button
          type="button"
          aria-pressed={metric === "concentration"}
          onClick={() => setMetric("concentration")}
        >
          Largest-win sensitivity
        </button>
      </fieldset>
      {metric === "drawdown" ? (
        <div className="research-comparison" aria-live="polite">
          <div className="research-comparison-heading">
            <strong>Maximum closed-trade drawdown</strong>
            <span>Fold {fold.slice(1)} · USD</span>
          </div>
          {rows.map((r, i) => (
            <div className="research-metric-row" key={r.id}>
              <span>{r.name}</span>
              <div className="research-bar-track">
                <span
                  style={{
                    width: `${(r.closed_trade_drawdown_dollars / 6000) * 100}%`,
                    background: colors[i],
                  }}
                />
              </div>
              <strong>{usd(r.closed_trade_drawdown_dollars)}</strong>
            </div>
          ))}
          <div className="research-bar-axis">
            <span>$0</span>
            <span>$3,000</span>
            <span>$6,000</span>
          </div>
        </div>
      ) : (
        <>
          <div className="research-sensitivity-legend">
            <span>● All closed trades</span>
            <span>○ Without three largest wins</span>
          </div>
          <div className="research-plot-scroll">
            <svg
              className="research-plot research-risk-plot"
              viewBox="0 0 680 260"
              role="img"
              aria-labelledby={id}
            >
              <title id={id}>
                {`Fold ${fold.slice(1)} profit sensitivity to removing the three largest winning trades`}
              </title>
              {[-6000, -4000, -2000, 0, 2000, 4000].map((v) => (
                <g key={v}>
                  <line
                    x1={x(v)}
                    x2={x(v)}
                    y1={20}
                    y2={198}
                    className={v === 0 ? "research-reference" : "research-grid"}
                  />
                  <text x={x(v)} y={225} textAnchor="middle">
                    {v === 0
                      ? "$0"
                      : `${v < 0 ? "−" : ""}$${Math.abs(v) / 1000}k`}
                  </text>
                </g>
              ))}
              {rows.map((r, i) => {
                const y = 48 + i * 62;
                return (
                  <g key={r.id}>
                    <text x={122} y={y + 5} textAnchor="end">
                      {r.name}
                    </text>
                    <line
                      x1={x(r.top_three_removed_pnl_dollars)}
                      x2={x(r.net_pnl_dollars)}
                      y1={y}
                      y2={y}
                      stroke={colors[i]}
                      strokeWidth={3}
                    />
                    <circle
                      cx={x(r.net_pnl_dollars)}
                      cy={y}
                      r={6}
                      fill={colors[i]}
                    >
                      <title>{`All trades: ${usd(r.net_pnl_dollars)}`}</title>
                    </circle>
                    <circle
                      cx={x(r.top_three_removed_pnl_dollars)}
                      cy={y}
                      r={6}
                      fill="var(--background, #111)"
                      stroke={colors[i]}
                      strokeWidth={2}
                    >
                      <title>
                        {`Without three largest wins: ${usd(r.top_three_removed_pnl_dollars)}`}
                      </title>
                    </circle>
                  </g>
                );
              })}
              <text
                x={374}
                y={254}
                textAnchor="middle"
                className="research-axis-title"
              >
                Net simulated profit / loss (USD)
              </text>
            </svg>
          </div>
        </>
      )}
      <p className="case-diagram-note">
        {metric === "drawdown"
          ? "Peak-to-trough decline in closed-trade equity; this excludes unrealized movements while trades are open. Every account starts at $10,000, and folds are independent."
          : "Removing the three largest wins is retrospective arithmetic on the same executed trades. It reveals concentration; it does not represent an executable strategy, a new account replay, or a forecast."}
      </p>
      <details className="case-data-table research-table">
        <summary>View risk and concentration values</summary>
        <div className="research-table-scroll">
          <table>
            <caption>
              Fold {fold.slice(1)}: independent simulated accounts, USD
            </caption>
            <thead>
              <tr>
                <th>Model</th>
                <th>Net P&amp;L</th>
                <th>Drawdown</th>
                <th>Without top 3 wins</th>
                <th>Wins / trades</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.name}</th>
                  <td>{usd(r.net_pnl_dollars)}</td>
                  <td>{usd(r.closed_trade_drawdown_dollars)}</td>
                  <td>{usd(r.top_three_removed_pnl_dollars)}</td>
                  <td>
                    {r.wins} / {r.closed_trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href={researchSources.options} />
    </div>
  );
}

const layerNames: Record<string, string> = {
  joint_action_size_surprise: "Joint action and size",
  latent_player_archetype_shrinkage: "Player archetype",
  multiway_target_response: "Multiway response",
  opponent_bluff_likelihood: "Bluff likelihood",
  player_strategy_drift: "Strategy drift",
  postflop_behavior: "Postflop behavior",
  showdown_aware_range_calibration: "Showdown calibration",
  supported_fold_response_bluff_opportunity: "Fold response",
  within_hand_line_surprise: "Within-hand sequence",
};

export function PokerCoverageResults() {
  const [layer, setLayer] = useState("postflop_behavior");
  const selected = required(pokerCoverage.find((r) => r.layer === layer));
  const inputId = useId();
  return (
    <div className="case-chart research-chart">
      <div className="research-heading">
        <div>
          <p className="case-diagram-title">Predictive support</p>
          <h3>How much of the confirmation cohort each model covers</h3>
        </div>
        <span className="research-badge">106,318 candidate rows</span>
      </div>
      <div className="research-coverage-rows">
        {pokerCoverage.map((r) => (
          <div key={r.layer} className="research-coverage-row">
            <span>{layerNames[r.layer]}</span>
            <div className="research-bar-track">
              <span
                style={{
                  width: `${(r.confirmation_rows / 106318) * 100}%`,
                  background: colors[0],
                }}
              />
            </div>
            <strong>
              {fmt(r.confirmation_rows)}
              <small>
                {((r.confirmation_rows / 106318) * 100).toFixed(1)}%
              </small>
            </strong>
          </div>
        ))}
      </div>
      <div className="research-model-select">
        <label htmlFor={inputId}>Inspect a component</label>
        <select
          id={inputId}
          value={layer}
          onChange={(event) => setLayer(event.target.value)}
        >
          {pokerCoverage.map((r) => (
            <option key={r.layer} value={r.layer}>
              {layerNames[r.layer]}
            </option>
          ))}
        </select>
      </div>
      <div className="research-timing-grid research-three" aria-live="polite">
        <div>
          <span>Observed-action accuracy</span>
          <strong>{(selected.accuracy * 100).toFixed(2)}%</strong>
          <small>on {fmt(selected.confirmation_rows)} supported rows</small>
        </div>
        <div>
          <span>Model log loss</span>
          <strong>{selected.log_loss.toFixed(4)}</strong>
          <small>lower is better</small>
        </div>
        <div>
          <span>Prior log loss</span>
          <strong>{selected.prior_log_loss.toFixed(4)}</strong>
          <small>on this component’s cohort</small>
        </div>
      </div>
      <p className="case-diagram-note">
        Every component is evaluated across 23 games, with its own support
        filters. The bars show coverage of the 106,318-row confirmation cohort.
        These overlapping subsets are not additive, and their accuracy values do
        not form a like-for-like model ranking.
      </p>
      <details className="case-data-table research-table">
        <summary>View component metrics</summary>
        <div className="research-table-scroll">
          <table>
            <caption>
              Supported confirmation rows and component-specific predictive
              measurements
            </caption>
            <thead>
              <tr>
                <th>Component</th>
                <th>Rows</th>
                <th>Coverage</th>
                <th>Accuracy</th>
                <th>Log loss</th>
                <th>Prior log loss</th>
              </tr>
            </thead>
            <tbody>
              {pokerCoverage.map((r) => (
                <tr key={r.layer}>
                  <th scope="row">{layerNames[r.layer]}</th>
                  <td>{fmt(r.confirmation_rows)}</td>
                  <td>{((r.confirmation_rows / 106318) * 100).toFixed(1)}%</td>
                  <td>{(r.accuracy * 100).toFixed(2)}%</td>
                  <td>{r.log_loss.toFixed(4)}</td>
                  <td>{r.prior_log_loss.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Source href="https://github.com/PranavK0128/PokerNow-Machine-Learning-Assistant/blob/main/results/layer_metrics.json" />
    </div>
  );
}
