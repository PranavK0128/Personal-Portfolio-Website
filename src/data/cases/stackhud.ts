import type { CaseStudy } from "@/data/case-study-types";

export const stackhudCase: CaseStudy = {
  id: "stackhud",
  title: "Stack Society HUD",
  subtitle: "A complete analytics and study platform for a poker community.",
  accent: "#9ed4b7",
  overview: [
    "I built StackHUD to connect a poker community’s game history: the sessions people played, the money that changed hands, and the decisions worth revisiting. It brings PokerNow exports into one product for exploring results, understanding player tendencies, and reviewing individual hands.",
    "The result is a deployed platform spanning data collection, a normalized database, player profiles, financial reporting, an interactive replayer, and private study tools. I developed the product from the underlying poker semantics through the web experience, keeping the original records connected to the insights people see.",
  ],
  links: [
    { label: "Explore StackHUD", href: "https://stacksocietyhud.com/" },
    {
      label: "GitHub (private repository)",
      href: null,
    },
  ],
  sections: [
    {
      id: "context",
      label: "Context",
      title: "Project context and goals",
      paragraphs: [
        "Poker and building software are two interests that came together in this project. Within a Discord poker community, each PokerNow session produced useful history: hands, wagers, player names, and a closing ledger. Much of that information remained separated by game, even when the same people played together repeatedly.",
        "I wanted a place where players could move naturally between the big picture and the details. The dashboard introduces activity, results, and notable hands; the rest of the product helps answer what happened, how a player tends to play, and what deserves another look.",
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      title: "Inconsistent identities, actions, and financial records",
      paragraphs: [
        "Combining exports meant resolving differences that could otherwise distort every chart. A person could appear under multiple identities, an action’s meaning depended on the preceding bets, and financial amounts needed consistent units. Even a familiar percentage could mislead if it counted the wrong opportunities.",
        "I treated these as product requirements. Users needed a consistent history, statistics with understandable sample sizes, and a way to inspect the hands behind a result. Administrators needed review tools for ambiguity that could not safely be resolved automatically.",
      ],
      points: [
        {
          title: "Preserve the evidence",
          text: "Keep raw exports alongside the records and summaries derived from them.",
        },
        {
          title: "Resolve player identities",
          text: "Review aliases and PokerNow identities before combining a player’s history.",
        },
        {
          title: "Report sample sizes",
          text: "Pair statistics with their opportunities, reporting scope, and supporting hands.",
        },
      ],
    },
    {
      id: "pipeline",
      label: "Data foundation",
      title: "Data ingestion and storage",
      paragraphs: [
        "The collection workflow begins with game links tracked in Discord and an acquisition queue. A TypeScript parser transforms hand-history JSON into games, hands, players, actions, cards, and pot awards. PostgreSQL stores these relationships through Prisma, while validation checks the imported records against their source files.",
        "Two sources retain distinct responsibilities: hand histories describe the poker, and ledger exports describe session finances. Reviewed canonical identities connect both to the same player. Derived profiles and action-state snapshots then support a Fastify API and a Next.js interface, giving several product features a common foundation.",
      ],
      visual: "stack-pipeline",
      caption:
        "Raw exports remain the evidence; normalized records connect them to profiles, financial results, and replay.",
    },
    {
      id: "architecture",
      label: "Codebase architecture",
      title: "Applications, shared packages, and storage",
      paragraphs: [
        "The codebase separates collection, domain processing, API services, and the web application. The Discord bot records game links; the downloader retrieves source files; parsing and import scripts write structured records through shared database packages.",
        "The Next.js interface requests poker data through a gateway to the Fastify API. Shared modules provide consistent statistics and player-analysis definitions. Private study notes follow a separate route to a user-specific store, so they remain separate from poker-data imports.",
      ],
      visual: "stack-codebase",
      caption:
        "Module connections from the implemented repository. The ingestion and application paths share the normalized poker database.",
    },
    {
      id: "players",
      label: "Player analysis",
      title: "Player profiles and statistics",
      paragraphs: [
        "A player profile combines results, volume, playing tendencies, and identity history. General statistics provide an entry point, while detailed preflop and postflop views expose specific situations. The goal is to make a pattern explorable without requiring users to reconstruct it across separate game files.",
        "Play-style analysis adds cumulative winnings, showdown and non-showdown results, rolling win rates, sizing patterns, and comparisons with the player pool. Opportunity counts give conditional statistics context. Changing a rolling window changes the recent-performance view while preserving the underlying cumulative totals.",
      ],
      visual: "stack-player",
      caption:
        "Explore actual profile views: overview, profit and loss, detailed statistics, play style, opponent context, and history.",
    },
    {
      id: "comparisons",
      label: "Player comparisons",
      title: "Compare player statistics and sample sizes",
      paragraphs: [
        "The comparison panel supports selecting two to four players using names, aliases, or PokerNow identities. It places financial results, preflop tendencies, postflop tendencies, and playing volume side by side.",
        "Conditional statistics include their numerators and opportunity counts. Sample-quality labels help distinguish supported patterns from limited evidence. Observed-pattern summaries and profile links provide a starting point for deeper analysis; comparisons should use matching games, stakes, and table sizes.",
      ],
      visual: "stack-comparison",
      caption:
        "Screenshots of StackHUD’s implemented comparison interface, populated with public player statistics. Switch views to see player selection and the resulting side-by-side comparison.",
    },
    {
      id: "leaderboards",
      label: "Leaderboards",
      title: "Rank players using explicit reporting criteria",
      paragraphs: [
        "Leaderboards combine financial outcomes, volume, and playing statistics in a sortable table. Users can rank by net profit, BB per 100 hands, average profit per game, hands, games, or supported betting statistics.",
        "Search, reporting-period, stake, minimum-hand, and confidence filters narrow the population before interpreting a ranking. Opportunity counts remain visible for conditional rates so a high percentage can be assessed alongside its underlying sample.",
      ],
      visual: "stack-leaderboards",
      caption:
        "The actual leaderboard interface includes ranking controls, sample filters, and player-level statistics.",
    },
    {
      id: "replay",
      label: "Hand replay",
      title: "Step through a real nine-player hand",
      paragraphs: [
        "Hand search connects broad questions to concrete examples. Players can look for situations and action sequences, then open the relevant hand rather than interpreting an aggregate in isolation. Evidence links can jump to the action that matters, including hands that would be missed by a biggest-pot view.",
        "The replayer reconstructs the board, wagers, stacks, and action timeline as the hand unfolds. That presentation depends on the same contextual action semantics used by the statistics. Keeping those interpretations aligned makes the replay a useful way to inspect the analysis.",
        "Try the actual replayer below with a recorded single-board hand. Nine players are seated, five put money in voluntarily before the flop, and two continue to a showdown worth $8,083. Pocket jacks make four of a kind against a full house made with pocket aces.",
      ],
      visual: "stack-replay",
      caption:
        "The working StackHUD replayer uses its real public demo hand. Table state, wagers, stacks, and pot change as you navigate the recorded actions.",
      additionalVisuals: [
        {
          visual: "stack-action-history",
          caption:
            "A separate hand’s detailed action table exposes the wagers, pot sizes, and stack changes behind the replay.",
        },
      ],
    },
    {
      id: "financials",
      label: "Financial accounting",
      title: "Ledger reconciliation and financial reporting",
      paragraphs: [
        "Financial reporting starts with ledger buy-ins and cash-outs. The import path normalizes amounts, retains source rows, and produces player results for each game. Those results feed the ledger, financial leaderboards, and longer-term player summaries.",
        "Identity reconciliation matters here as much as it does for playing statistics: an alias should not split someone’s history, and a shared name should not combine different people. Reviewable mappings and accounting checks make those relationships explicit before they become lifetime totals.",
      ],
      visual: "stack-ledger",
      additionalVisuals: [
        {
          visual: "stack-ledger-screen",
          caption:
            "The ledger interface groups buy-ins, cash-outs, and net results by player, with filters and financial summaries.",
        },
      ],
      caption:
        "Ledger rows become normalized amounts, reconciled session results, and canonical-player financial summaries.",
    },
    {
      id: "study",
      label: "Study workflow",
      title: "Saved hands, practice, and equity analysis",
      paragraphs: [
        "My Study supports saving and reviewing decisions found during analysis. Players can save hands, write private notes, organize tags and filters, track review status, and export review packets. Practice asks users to record their reasoning before revealing the outcome, preserving the distinction between a good result and a good decision.",
        "The equity workbench supports another kind of investigation: comparing weighted ranges with board cards, blockers, and dead cards. It reports exact or reproducibly sampled results where supported. Together, these tools turn an interesting hand into something the player can investigate and revisit.",
      ],
      visual: "stack-study",
      caption:
        "The equity workbench complements saved hands and private review notes with scenario exploration.",
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "Product scope and results",
      paragraphs: [
        "StackHUD is live, with a public dashboard and previews leading into member features. An inspected local corpus snapshot contained 339,635 hands; local validation recorded more than 5.7 million actions and 994 ledger imports. These describe the inspected dataset, not current live usage or a count of registered users.",
        "The central achievement is the connection across the product: a session leads to a player, a statistic leads to supporting hands, and a replay leads to a saved review. Building that chain taught me to design data definitions and user interactions together. The interface is most useful when its explanations remain connected to evidence.",
      ],
    },
  ],
};
