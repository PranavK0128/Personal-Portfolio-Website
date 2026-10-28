// Values from the public repository README, verified October 28, 2026.
// https://github.com/PranavK0128/Prompt-Compression-For-Efficient-Text-Classification
export function ResearchPreview() {
  return (
    <div className="project-research-preview">
      <p className="project-research-label">DISTILBERT / SST-2</p>
      <p className="project-research-title">Prompt Compression</p>
      <p className="project-research-summary">
        Keep the query. Compress the context.
      </p>
      <div className="research-pipeline">
        <div>
          <span>01 / INPUT</span>
          <strong>Examples + query</strong>
          <div className="research-tokens" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h18m-6-6 6 6-6 6" />
        </svg>
        <div>
          <span>02 / COMPRESS</span>
          <strong>IDF selection</strong>
          <div
            className="research-tokens research-tokens-short"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h18m-6-6 6 6-6 6" />
        </svg>
        <div>
          <span>03 / CLASSIFY</span>
          <strong>DistilBERT</strong>
          <small>Sentiment prediction</small>
        </div>
      </div>
      <table className="research-results">
        <caption>Measured study results</caption>
        <thead>
          <tr>
            <th scope="col">Method</th>
            <th scope="col">Mean tokens</th>
            <th scope="col">Accuracy</th>
            <th scope="col">ms / example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Full prompt</th>
            <td>136.16</td>
            <td>90.44 ± 0.48%</td>
            <td>0.351</td>
          </tr>
          <tr>
            <th scope="row">IDF · 25% demo budget</th>
            <td>97.16</td>
            <td>90.90 ± 0.43%</td>
            <td>0.179</td>
          </tr>
        </tbody>
      </table>
      <p className="research-scope">
        43 configurations <span>·</span> 129 fits <span>·</span> 3 seeds
      </p>
      <p className="project-research-caption">
        Accuracy: mean ± seed SD. Warm GPU pipeline timings, batch 16.
        <br />
        Small accuracy differences do not establish consistent superiority.
      </p>
    </div>
  );
}
