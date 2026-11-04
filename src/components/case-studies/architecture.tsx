"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

function Arrow({ label }: { label?: string }) {
  return (
    <div className="architecture-arrow">
      <svg viewBox="0 0 24 40" aria-hidden="true">
        <path d="M12 1v35m-6-6 6 6 6-6" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}
function Node({
  title,
  detail,
  code,
  children,
}: {
  title: string;
  detail?: string;
  code?: string;
  children?: ReactNode;
}) {
  return (
    <div className="architecture-node">
      {code && <code>{code}</code>}
      <strong>{title}</strong>
      {detail && <p>{detail}</p>}
      {children}
    </div>
  );
}
function Diagram({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="architecture-diagram">
      <p className="architecture-title">{title}</p>
      {children}
      {note && <p className="case-diagram-note">{note}</p>}
    </div>
  );
}

export function StackCodebase() {
  return (
    <Diagram
      title="StackHUD codebase and data connections"
      note="The collection path writes the poker database; the application path reads it. Study notes have a separate storage path tied to the signed-in user."
    >
      <div className="architecture-columns">
        <div>
          <h4>How a game becomes structured data</h4>
          <Node
            title="1. Register a game"
            code="apps/discord-bot"
            detail="The bot records a shared PokerNow game URL. A download queue tracks the source game so the same session can be collected and processed consistently."
          />
          <Arrow label="Game URL → acquisition queue" />
          <Node
            title="2. Preserve the original exports"
            code="workers/downloader"
            detail="Retrieve hand-history JSON and ledger CSV. Keep the original files so a parsed hand or financial result can be checked against its source."
          />
          <Arrow label="Two sources with different responsibilities" />
          <div className="architecture-pair">
            <Node
              title="3a. Reconstruct the poker"
              code="packages/pokernow-parser"
              detail="Turn the log into seats, cards, streets, ordered actions, and pot awards. Interpret each action in the context of the preceding wagers."
            />
            <Node
              title="3b. Reconcile the money"
              code="packages/ledger-units"
              detail="Read buy-ins and cash-outs, normalize amount units, and preserve source rows. These records define session finances independently of the hand log."
            />
          </div>
          <Arrow label="Import scripts + reviewed player identities" />
          <Node
            title="4. Store connected records"
            code="packages/db · Prisma"
            detail="Prisma writes the normalized records to PostgreSQL. Games connect to hands and actions; reviewed canonical players connect aliases, statistics, and financial results."
          />
        </div>
        <div>
          <h4>How a page retrieves its information</h4>
          <Node
            title="5. Request a view"
            code="apps/web · Next.js"
            detail="A profile, comparison, ranking, or replay requests the data needed for the selected player, hand, or reporting filters. Shared client hooks manage loading and cached responses."
          />
          <Arrow label="Requests follow separate data and study routes" />
          <div className="architecture-pair">
            <div>
              <Node
                title="6a. Forward poker-data requests"
                code="/api/data"
                detail="The Next.js gateway forwards allowed requests to the API service. Filters travel with the request."
              />
              <Arrow label="Query and filter parameters" />
              <Node
                title="7. Query and calculate"
                code="apps/api"
                detail="Read normalized records and return statistics, sample counts, player summaries, or the actions required to reconstruct a hand."
              />
              <Arrow label="Prisma queries → structured response" />
              <Node
                title="Shared poker records"
                code="packages/db"
                detail="The same PostgreSQL records power several views. A statistic and its supporting hands remain connected to the same source history."
              />
            </div>
            <div>
              <Node
                title="6b. Load private study work"
                code="/api/study"
                detail="Resolve the signed-in user before reading or saving their review material."
              />
              <Arrow label="Session user ID → private storage key" />
              <Node
                title="User study store"
                code="packages/study-store.ts"
                detail="A separate per-user JSON store keeps saved hands, notes, and review status out of the shared poker-data import path."
              />
            </div>
          </div>
        </div>
      </div>
    </Diagram>
  );
}

export function PokerModelNetwork() {
  const groups = [
    {
      name: "Current decision",
      input: "Public state, action sequence, and legal choices",
      models: [
        ["Postflop behavior", "LightGBM"],
        ["Within-hand line", "CatBoost"],
        ["Action & size", "LightGBM"],
      ],
    },
    {
      name: "Prior behavior",
      input: "Player histories, session histories, and observed opportunities",
      models: [
        ["Player archetype", "XGBoost"],
        ["Multiway response", "CatBoost"],
        ["Strategy drift", "CatBoost"],
      ],
    },
    {
      name: "Conditional evidence",
      input: "Supported fold responses and reveal-based training targets",
      models: [
        ["Fold response", "Extra Trees"],
        ["Bluff likelihood", "XGBoost"],
        ["Showdown calibration", "CatBoost"],
      ],
    },
  ];
  return (
    <Diagram
      title="Parallel opponent-model architecture"
      note="These are separate tree-ensemble predictors, not sequential neural layers. Revealed cards supply selected training targets; future cards are not decision-time inputs."
    >
      <Node
        title="Structured decision and historical records"
        detail="Board · position · stacks · pot · prior actions · completed hands"
      />
      <Arrow label="Construct only features available at the decision" />
      <div className="architecture-fanout">
        {groups.map((group) => (
          <div key={group.name}>
            <Node title={group.name} detail={group.input} />
            <Arrow />
            <div className="architecture-model-list">
              {group.models.map(([name, model]) => (
                <div key={name}>
                  <span>{model}</span>
                  <strong>{name}</strong>
                </div>
              ))}
            </div>
            <Arrow />
          </div>
        ))}
      </div>
      <Node
        title="Per-model predictions and support checks"
        detail="Action probabilities, sizing information, historical support, and coverage"
      />
      <div className="architecture-pair">
        <div>
          <Arrow label="Diagnostic output" />
          <Node
            title="Behavior diagnostics"
            detail="Display supported predictions and historical context; zero strategy weight"
          />
        </div>
        <div>
          <p className="architecture-independent">Independent strategy input</p>
          <Node
            title="Separate policy reference"
            detail="Stored CFR+ / DCFR policies, legal-action checks, and bounded sizing supply the advice"
          />
        </div>
      </div>
      <Arrow label="Displayed together in the interface" />
      <Node
        title="Human decision"
        detail="The interface presents advice and diagnostic context; the player chooses the action."
      />
    </Diagram>
  );
}

export function LegalActionExample() {
  const [facingBet, setFacingBet] = useState(true);
  return (
    <Diagram
      title="Example: translating table controls into legal actions"
      note="Illustrative state, not a recorded hand or a model recommendation."
    >
      <fieldset className="case-controls" aria-label="Poker decision example">
        <button
          type="button"
          aria-pressed={facingBet}
          onClick={() => setFacingBet(true)}
        >
          Facing a bet
        </button>
        <button
          type="button"
          aria-pressed={!facingBet}
          onClick={() => setFacingBet(false)}
        >
          No bet to call
        </button>
      </fieldset>
      <div className="architecture-pair">
        <Node
          title="Visible state"
          detail={
            facingBet
              ? "Pot: 60 BB · Call: 20 BB · Stack: 100 BB"
              : "Pot: 40 BB · Call: 0 BB · Stack: 100 BB"
          }
        />
        <Node
          title="Observed betting controls"
          detail={facingBet ? "Fold · Call · Raise" : "Check · Bet"}
        />
      </div>
      <Arrow label="Legal-action mask" />
      <div className="legal-actions" aria-live="polite">
        {["Fold", "Check", "Call", "Bet", "Raise"].map((action) => {
          const allowed = facingBet
            ? ["Fold", "Call", "Raise"].includes(action)
            : ["Check", "Bet"].includes(action);
          return (
            <div
              key={action}
              className={allowed ? "legal-allowed" : "legal-excluded"}
            >
              <strong>{action}</strong>
              <span>{allowed ? "Available" : "Excluded"}</span>
            </div>
          );
        })}
      </div>
      <Arrow />
      <Node
        title="Constrained policy output"
        detail="Unavailable actions are excluded. Aggressive sizing must fit the observed bounds; inconsistent bounds cause abstention."
      />
    </Diagram>
  );
}

export function TransformerArchitecture() {
  return (
    <Diagram
      title="DistilBERT sequence-classification architecture"
      note="Model configuration: 6 encoder blocks, 12 attention heads, 768-dimensional hidden states, and a 3,072-dimensional feed-forward layer."
    >
      <div className="architecture-columns transformer-columns">
        <div>
          <h4>Classification pipeline</h4>
          <Node
            title="Retained token IDs + attention mask"
            detail="Special tokens, prompt structure, demonstrations, and query"
          />
          <Arrow />
          <Node
            title="Token + position embeddings"
            detail="768 dimensions per token"
          />
          <Arrow />
          <div className="transformer-stack">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={`encoder-${n}`}>
                <span>Encoder {n}</span>
                <small>Self-attention + feed-forward</small>
              </div>
            ))}
          </div>
          <Arrow />
          <Node title="First-token representation" code="hidden_state[:, 0]" />
          <Arrow />
          <Node
            title="Classification head"
            detail="Linear → ReLU → dropout → 2 logits"
          />
          <Arrow />
          <div className="architecture-pair">
            <Node title="Negative" />
            <Node title="Positive" />
          </div>
        </div>
        <div className="transformer-block">
          <h4>Inside each encoder block</h4>
          <Node
            title="Hidden states"
            detail="One vector for each input token"
          />
          <Arrow />
          <div className="attention-projections">
            <span>Query</span>
            <span>Key</span>
            <span>Value</span>
          </div>
          <Arrow />
          <Node
            title="12-head self-attention"
            detail="Masked attention combines information across the retained sequence."
          />
          <Arrow />
          <Node title="Residual connection + layer norm" />
          <Arrow />
          <Node
            title="Feed-forward network"
            detail="768 → 3,072 → GELU → 768"
          />
          <Arrow />
          <Node title="Residual connection + layer norm" />
          <Arrow />
          <Node
            title="Updated hidden states"
            detail="Passed to the next encoder block"
          />
        </div>
      </div>
    </Diagram>
  );
}

export function CompressionGate() {
  return (
    <Diagram
      title="Learned compression: scoring and selection"
      note="Soft weighting still encodes the full input. Hard selection shortens the downstream sequence but includes the cost of the first encoder pass."
    >
      <Node title="Complete formatted prompt" />
      <Arrow />
      <Node
        title="Frozen DistilBERT encoder"
        detail="Contextual representation for each token"
      />
      <Arrow />
      <Node
        title="Trainable token gate"
        detail="Linear 768 → 768 · ReLU · dropout · linear 768 → 1 · sigmoid"
      />
      <Arrow label="Protect query, scaffold, and negation" />
      <div className="architecture-pair">
        <div>
          <h4>Soft weighting</h4>
          <Node
            title="Weighted content pooling"
            detail="Pool contextual vectors using gate scores"
          />
          <Arrow />
          <Node
            title="Trainable classification head"
            detail="Two sentiment logits; encoder stays frozen"
          />
        </div>
        <div>
          <h4>Hard token selection</h4>
          <Node
            title="Whole-word selection"
            detail="Apply a matched budget or threshold to eligible content"
          />
          <Arrow />
          <Node
            title="Retained token IDs"
            detail="Pass selected IDs without decoding and retokenizing"
          />
          <Arrow />
          <Node
            title="Fine-tuned classifier"
            detail="A separate DistilBERT classifier processes the shorter input"
          />
        </div>
      </div>
    </Diagram>
  );
}

export function OptionsNetwork() {
  const [probability, setProbability] = useState(60);
  const sliderId = useId();
  const expected = (probability / 100) * 0.25 - (1 - probability / 100) * 0.15;
  return (
    <Diagram
      title="Two-part neural network"
      note="The slider demonstrates the output calculation with illustrative values. It does not run the trained model or predict a real contract."
    >
      <Node
        title="Fold-preprocessed feature vector"
        detail="Numeric inputs with the original missing-value treatment"
      />
      <Arrow />
      <div className="network-hidden">
        <strong>16-unit hidden layer · ReLU</strong>
        <div aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => `unit-${i + 1}`).map((id) => (
            <span key={id} />
          ))}
        </div>
      </div>
      <Arrow />
      <div className="architecture-fanout">
        <div>
          <Node title="Positive-outcome probability" code="p = sigmoid(z)" />
          <Arrow />
        </div>
        <div>
          <Node title="Conditional gain" code="g = softplus(z)" />
          <Arrow />
        </div>
        <div>
          <Node title="Conditional loss magnitude" code="l = softplus(z)" />
          <Arrow />
        </div>
      </div>
      <Node
        title="Expected opportunity outcome"
        code="p × g − (1 − p) × l"
        detail="Forecast net cash outcome relative to the initial debit"
      />
      <div className="network-calculator">
        <label htmlFor={sliderId}>
          Illustrative probability <strong>{probability}%</strong>
        </label>
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          step="5"
          value={probability}
          onChange={(e) => setProbability(Number(e.target.value))}
        />
        <div>
          <span>Gain if positive: +25%</span>
          <span>Loss magnitude: 15%</span>
          <output aria-live="polite">
            Expected outcome: {expected >= 0 ? "+" : ""}
            {(expected * 100).toFixed(1)}%
          </output>
        </div>
      </div>
    </Diagram>
  );
}

export function NominationExample() {
  const cases = [
    {
      name: "Unique positive forecast",
      values: [0.08, 0.03, -0.02],
      result: "Nominate contract A",
      detail:
        "A has the unique highest positive forecast. The account engine still checks cash, execution, and position constraints.",
    },
    {
      name: "Tied highest forecasts",
      values: [0.08, 0.08, -0.02],
      result: "No nomination",
      detail:
        "The best positive value is tied, so the selection rule stays out.",
    },
    {
      name: "No positive forecast",
      values: [-0.01, -0.03, -0.02],
      result: "No nomination",
      detail: "No candidate has a positive forecast, so no trade is nominated.",
    },
  ];
  const [selected, setSelected] = useState(0);
  const scenario = cases[selected];
  return (
    <Diagram
      title="Example: contract nomination at a decision point"
      note="Illustrative forecasts. A nominated contract is not an executed or profitable trade."
    >
      <fieldset className="case-controls" aria-label="Nomination scenarios">
        {cases.map((c, i) => (
          <button
            type="button"
            key={c.name}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            {c.name}
          </button>
        ))}
      </fieldset>
      <div className="architecture-fanout">
        {scenario.values.map((value, i) => (
          <Node
            key={["A", "B", "C"][i]}
            title={`Contract ${["A", "B", "C"][i]}`}
            detail={`${value > 0 ? "+" : ""}${(value * 100).toFixed(0)}% forecast outcome`}
          />
        ))}
      </div>
      <Arrow />
      <div aria-live="polite">
        <Node title={scenario.result} detail={scenario.detail} />
      </div>
    </Diagram>
  );
}
