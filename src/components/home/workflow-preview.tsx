import "./workflow-preview.css";

export function PokerPreview() {
  return (
    <div className="workflow-preview poker-preview">
      <p className="workflow-eyebrow">STRATEGY / OPPONENT MODELING</p>
      <p className="workflow-title">PokerNow Deep Learning Assistant</p>
      <p className="workflow-subtitle">
        From table state to a more informed decision
      </p>
      <div className="poker-workflow">
        <div className="poker-input">
          <div className="poker-cards" aria-hidden="true">
            <span>
              A<b>♠</b>
            </span>
            <span>
              K<b>♥</b>
            </span>
          </div>
          <span>Table state + hand history</span>
        </div>
        <span className="workflow-arrow" aria-hidden="true">
          →
        </span>
        <div className="poker-branches">
          <div>
            <small>STRATEGY</small>
            <strong>CFR+ / DCFR</strong>
            <span>Legal actions · Conditional sizing</span>
          </div>
          <div>
            <small>DIAGNOSTICS</small>
            <strong>Opponent models</strong>
            <span>Player history · Support checks</span>
          </div>
        </div>
      </div>
      <div className="workflow-result">
        <span>OUTPUT</span>
        <strong>Advice displayed to the player</strong>
      </div>
      <p className="workflow-caption">The player makes the final decision</p>
    </div>
  );
}

export function OptionsPreview() {
  return (
    <div className="workflow-preview options-preview">
      <p className="workflow-eyebrow">QQQ / MACHINE LEARNING RESEARCH</p>
      <p className="workflow-title">Options Model Research</p>
      <p className="workflow-subtitle">
        Train on the past. Evaluate what comes next.
      </p>
      <div className="options-timeline">
        <div>
          <span>01 / TRAIN</span>
          <strong>Fit models</strong>
          <small>Historical features</small>
        </div>
        <div>
          <span>02 / VALIDATE</span>
          <strong>Compare</strong>
          <small>Chronological splits</small>
        </div>
        <div>
          <span>03 / EVALUATE</span>
          <strong>Simulate</strong>
          <small>Costs + constraints</small>
        </div>
      </div>
      <div className="options-time" aria-hidden="true">
        <span>PAST</span>
        <i />
        <span>FUTURE →</span>
      </div>
      <div className="options-models">
        <span>Linear models</span>
        <span>Decision trees</span>
        <span>Neural networks</span>
      </div>
      <div className="workflow-result">
        <span>RESEARCH OUTPUT</span>
        <strong>Forecasts, account ledgers, and comparisons</strong>
      </div>
      <p className="workflow-caption">
        Research, not a deployed trading strategy
      </p>
    </div>
  );
}
