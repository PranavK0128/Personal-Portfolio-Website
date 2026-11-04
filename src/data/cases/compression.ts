import type { CaseStudy } from "../case-study-types";

export const compressionCase: CaseStudy = {
  id: "prompt-compression",
  title: "Prompt Compression",
  subtitle:
    "Transformer-based sentiment classification with compressed inputs.",
  accent: "#9fc6ef",
  overview: [
    "A collaborative NLP study of the trade-off between prompt length, classification quality, and inference cost. We fine-tuned DistilBERT on SST-2 movie reviews and compared full prompts with random, inverse document frequency (IDF), and learned compression. I rebuilt the implementation and rewrote the research paper; the research itself was shared equally across the team.",
    "Across three seeds, cached IDF compression reached 90.90% accuracy with 28.6% fewer input tokens and 48.8% lower measured warm-GPU pipeline time than full prompts. The most useful finding was broader: preserve the review being classified, measure the compressor itself, and always compare against a simple query-only baseline.",
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/PranavK0128/Prompt-Compression-For-Efficient-Text-Classification",
    },
    {
      label: "Research Paper",
      href: "https://github.com/PranavK0128/Prompt-Compression-For-Efficient-Text-Classification/blob/main/Prompt_Compression_Final_Report.pdf",
    },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      title: "Task and project goals",
      subtitle: "A controlled classification setting",
      paragraphs: [
        "A formatted prompt can contain instructions, labeled demonstrations, and the actual query. Those pieces play different roles, yet they all contribute to the sequence that a transformer processes. Repeating demonstrations for every review creates a natural question: how much of that context is necessary?",
        "We used supervised sentiment classification to make the question measurable. The task is to predict whether an SST-2 movie review is positive or negative. This is a fine-tuned encoder study, rather than a claim about instruction-following behavior in a large generative model. Accuracy, token count, and complete inference time are evaluated together.",
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      title: "Preserving meaning under a token budget",
      subtitle: "Measure compression and classification together",
      paragraphs: [
        "A compressor can remove many tokens and still be a poor system. It might delete a negation that reverses sentiment, spend more time choosing words than the classifier saves, or benefit from an easier token budget than a competing method.",
        "We designed matched comparisons around these failure modes. The study separates where compression happens from how tokens are ranked, and separates a shorter input from a faster end-to-end pipeline.",
      ],
      points: [
        {
          title: "Protect meaning",
          text: "Keep the query, formatting, negation, and a minimum amount of content in each demonstration.",
        },
        {
          title: "Compare equal budgets",
          text: "Give competing rankings the same attainable whole-word token budget, not just the same requested percentage.",
        },
        {
          title: "Keep simple controls",
          text: "Compare every method with the full prompt and with the review alone.",
        },
      ],
    },
    {
      id: "data",
      label: "Data & Splits",
      title: "Sentence-family data partitions",
      subtitle: "Split by sentence family",
      paragraphs: [
        "SST-2 includes phrases derived from longer sentences. A random phrase split can put closely related text on both sides of an evaluation boundary. We grouped examples by their original sentence ancestry and excluded ambiguous ancestry before forming training, development, and demonstration-support populations.",
        "The resulting partition contains 56,087 training phrases, 6,432 development phrases, and a separate 32-example support pool. IDF statistics use training and support text only. Checkpoints are selected using internal development accuracy, with the earliest epoch breaking ties.",
        "Final evaluation uses 872 labeled official validation examples. That set had been inspected historically, so it is an evaluation set rather than a newly blind test. Keeping this distinction visible matters when interpreting small differences between methods.",
      ],
      visual: "compression-data",
      caption:
        "02 — Training, development, and demonstration support are sentence-family disjoint. The official validation set is reported separately.",
    },
    {
      id: "methods",
      label: "Compression Methods",
      title: "Random, IDF, and learned token selection",
      subtitle: "Word ranking and budget constraints",
      paragraphs: [
        "Random selection is the control for deleting content without knowing its importance. IDF prioritizes less common words using corpus statistics. The learned method scores tokens from frozen DistilBERT representations and uses those scores to select content.",
        "Selection operates on complete whitespace words and passes retained token IDs directly to the classifier. This avoids breaking a word into inconsistent fragments or changing the budget through a decode-and-retokenize round trip. A dynamic-programming selector resolves attainable whole-word budgets so different rankings can be compared fairly.",
        "We also evaluated soft gates, which change pooling weights while still encoding the full input, and hard selection, which actually removes tokens before a newly fine-tuned classifier. Those are different interventions: low soft weights alone do not reduce the number of tokens processed.",
      ],
      visual: "compression-methods",
      caption:
        "03 — Random, IDF, and learned ranking share the same selection constraints. Only hard removal shortens the downstream input.",
    },
    {
      id: "transformer",
      label: "Transformer architecture",
      title: "DistilBERT encoder and classification head",
      subtitle: "Processing the retained sequence",
      paragraphs: [
        "The classifier converts retained token IDs into token and position embeddings, then passes them through six transformer encoder blocks. Each block has twelve self-attention heads followed by a feed-forward network. Attention allows each token representation to incorporate information from the other retained tokens.",
        "Residual connections and layer normalization are applied after attention and after the feed-forward network. The final representation of the first token passes through a linear layer, ReLU, dropout, and a two-output classification layer. Those outputs correspond to negative and positive sentiment.",
        "The main sequence-classification models fine-tune the encoder and classification head. The learned gate uses a separate frozen encoder to score content before either weighted pooling or hard token selection.",
      ],
      visual: "compression-transformer",
      caption:
        "The architecture follows the loaded DistilBERT configuration and sequence-classification implementation.",
      additionalVisuals: [
        {
          visual: "compression-gate",
          caption:
            "The learned gate has a separate scoring pass. Soft pooling and hard token removal follow different paths after the scores are computed.",
        },
      ],
    },
    {
      id: "experiments",
      label: "Study Design",
      title: "Experimental comparisons",
      subtitle: "43 configurations, three seeds",
      paragraphs: [
        "The core comparison varies the demonstration budget across random, IDF, and learned ranking. Three additional studies ask how many demonstrations help, where deletion is safest, and whether a learned gate provides a useful accuracy–compression trade-off.",
        "All configurations are reported across seeds 42, 43, and 44: 129 fits in total. The classification training batch size stays fixed across conditions, and checkpoints are frozen before final evaluation. This makes the result a comparison of input strategies rather than a search for the best-looking final score.",
        "We measured preprocessing, classifier time, and their combined pipeline time at batch sizes 1, 16, and 32. Learned compression includes its additional encoder pass. Robustness slices examine negation, contrast, and review length, helping reveal failures that a single accuracy number can conceal.",
      ],
      points: [
        {
          title: "Demonstration count",
          text: "Compare zero, two, four, and six demonstrations under a common prompt format.",
        },
        {
          title: "Compression location",
          text: "Delete equal attainable token counts from demonstrations, the query, or both.",
        },
        {
          title: "Gate penalties and thresholds",
          text: "Vary budget penalties and hard thresholds, then evaluate the resulting classifiers.",
        },
      ],
    },
    {
      id: "results",
      label: "Results",
      title: "Accuracy, input length, and inference time",
      subtitle: "Measured results",
      paragraphs: [
        "Cached IDF retained 97.16 input tokens on average, compared with 136.16 for the full prompt. It reached 90.90% mean accuracy and 0.179 ms per example in the warm-GPU, batch-16 pipeline benchmark. The full prompt reached 90.44% and 0.351 ms.",
        "The matched learned compressor retained the same number of tokens but took 0.922 ms per example. Its extra encoder pass outweighed the savings in the classifier. Meanwhile, query-only achieved 90.67% with just 25.16 tokens and 0.147 ms. Demonstrations did not establish a consistent accuracy advantage in this setup.",
      ],
      visual: "compression-results",
      caption:
        "04 — Saved study measurements, averaged across three seeds. Time includes online compression and classification at warm GPU batch size 16; it is not a production latency guarantee.",
    },
    {
      id: "robustness",
      label: "Robustness",
      title: "Accuracy across review types",
      subtitle: "Look beyond the overall average",
      paragraphs: [
        "Negation, contrast, and review length change the difficulty of the classification task. The saved evaluation separates these slices so each method can be inspected on the same examples, with its variation across three training seeds visible.",
        "Cached IDF reached 87.78% mean accuracy on negation examples and 88.21% on contrast examples, compared with 86.11% and 85.64% for full prompts. These are descriptive differences on overlapping slices, not independent evidence of statistical superiority.",
      ],
      visual: "compression-robustness",
      caption:
        "Three-seed mean accuracy with seed variability and sample counts. Negation and contrast slices can overlap with the length groups.",
    },
    {
      id: "timing",
      label: "Pipeline measurements",
      title: "Where inference time is spent",
      subtitle: "Compression has its own cost",
      paragraphs: [
        "A shorter classifier input does not guarantee a faster complete pipeline. Measuring preprocessing and classification separately shows that the learned gate adds an encoder pass before the compressed input reaches the classifier.",
        "The saved benchmarks cover batch sizes 1, 16, and 32. Comparing them shows how time per example changes when work is batched, while keeping the cost of online compression in the measurement.",
      ],
      visual: "compression-batch-timing",
      caption:
        "Warm-GPU time per example, averaged across three seeds. Batched throughput measurements are not single-request latency guarantees.",
    },
    {
      id: "findings",
      label: "What Mattered",
      title: "Effect of compression location",
      subtitle: "The location of deletion matters",
      paragraphs: [
        "At matched total-token deletion counts, demonstration compression achieved 90.18% accuracy while query compression fell to 73.74%. A demonstration can be partly redundant; the review contains the evidence needed for the actual decision.",
        "The project reinforced a practical research habit: start with a strong simple baseline, account for all computation, and distinguish observed differences from reliable improvements. The small accuracy gaps between the best core methods do not establish statistical superiority. The measured speed result is specific to the saved warm-GPU benchmark, not a promise of application cost savings.",
      ],
      visual: "compression-location",
      caption:
        "05 — H2 matched-deletion comparison. Preserving the query was more important than preserving repeated demonstration text.",
    },
  ],
};
