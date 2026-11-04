/**
 * Build the isolated portfolio replay from the original StackHUD renderer.
 * Usage from the portfolio: node scripts/build-stackhud-demo.cjs
 * Optional: --source <canonical StackHUD folder> --out <output folder>
 * Uses already-installed StackHUD dependencies. Never modifies its source.
 */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { createRequire } = require("node:module");

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : path.resolve(process.argv[index + 1]);
}

const portfolioRoot = path.resolve(__dirname, "..");
const sourceRoot = option("--source", path.resolve(portfolioRoot, "..", "Stack Society PokerNow Analyzer"));
const outputRoot = option("--out", path.join(portfolioRoot, "public", "demos", "stackhud"));
const fromStack = createRequire(path.join(sourceRoot, "package.json"));
const esbuild = fromStack("esbuild");
const postcss = fromStack("postcss");
const tailwind = fromStack("@tailwindcss/postcss");
const sourcePath = (relative) => path.join(sourceRoot, relative).replaceAll("\\", "/");
const componentRoot = "apps/web/src/components/";

// The actual original public fixture is imported directly, not fetched at runtime.
const entry = `
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BoardReplayer } from ${JSON.stringify(sourcePath(componentRoot + "board-replayer.tsx"))};
import { sampleHand } from ${JSON.stringify(sourcePath(componentRoot + "landing-sample-hand.ts"))};

function ReplayDemo() {
  useEffect(() => {
    const demo = document.getElementById("demo");
    const stage = demo.children[0].children[1];
    const root = document.getElementById("root");
    const resize = () => {
      const width = demo.clientWidth;
      const stageWidth = Math.max(width, 1000);
      const scale = width / stageWidth;
      stage.style.width = stageWidth + "px";
      stage.style.marginLeft = "0px";
      stage.style.transform = "scale(" + scale + ")";
      stage.style.transformOrigin = "top left";
      stage.style.marginBottom = (12 + stage.offsetHeight * (scale - 1)) + "px";
      requestAnimationFrame(() => {
        parent.postMessage({
          type: "stackhud-demo-height",
          height: document.getElementById("root").getBoundingClientRect().height
        }, location.origin === "null" ? "*" : location.origin);
      });
    };
    const measure = (event) => {
      if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "stackhud-demo-measure") return;
      resize();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(document.getElementById("root"));
    window.addEventListener("message", measure);
    resize();
    return () => { observer.disconnect(); window.removeEventListener("message", measure); };
  }, []);
  return <main id="demo" className="replay-demo">
    <BoardReplayer {...sampleHand} initialEventIndex={29} />
  </main>;
}

if (parent !== window) document.documentElement.dataset.embedded = "true";
createRoot(document.getElementById("root")).render(<ReplayDemo />);
`;

const originalSourcePlugin = {
  name: "original-stackhud-source",
  setup(build) {
    build.onResolve({ filter: /^@\// }, ({ path: importPath }) => {
      const base = path.join(sourceRoot, "apps/web/src", importPath.slice(2));
      const resolved = [base, base + ".tsx", base + ".ts"].find((candidate) => fs.existsSync(candidate));
      if (!resolved) throw new Error("Cannot resolve StackHUD source: " + importPath);
      return { path: resolved };
    });

  },
};

const scannedSources = [
  componentRoot + "board-replayer.tsx",
  componentRoot + "money-text.tsx",
  "apps/web/src/lib/board-replayer-semantics.ts",
];

const css = `
@import "${sourcePath("node_modules/tailwindcss/index.css")}" source(none);
${scannedSources.map((file) => `@source "${sourcePath(file)}";`).join("\n")}
body { margin:0; background:#080808; color:white; font-family:Arial,Helvetica,sans-serif; overflow-x:hidden; }
#root { padding:12px; }
.replay-demo { min-width:0; max-width:1400px; margin:auto; }
/* Keep the desktop board geometry when the whole canvas scales on phones. */
@media(max-width:999px) {
  .replay-demo > div > div:nth-child(2) > .z-10 { width:600px; }
  .replay-demo > div > div:nth-child(2) > .z-10 > .grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
}
button { -webkit-tap-highlight-color:transparent; }

/* Keep the original draggable action strip, including its horizontal scrollbar. */
.scrollbar-soft { scrollbar-width:auto; scrollbar-color:auto; }
.scrollbar-soft::-webkit-scrollbar { height:10px; }
.scrollbar-soft::-webkit-scrollbar-thumb { background:#737373; border:2px solid #151515; border-radius:8px; }
.scrollbar-soft::-webkit-scrollbar-track { background:#151515; }
@supports not selector(::-webkit-scrollbar) {
  .scrollbar-soft { scrollbar-width:thin; scrollbar-color:#737373 #151515; }
}
/* The parent sizes embedded documents; their timeline remains independently scrollable. */
html[data-embedded], html[data-embedded] body { overflow:hidden; }
@media(prefers-reduced-motion:reduce) {
  *,*::before,*::after { scroll-behavior:auto!important; transition:none!important; animation:none!important; }
}
`;

async function main() {
  fs.mkdirSync(outputRoot, { recursive: true });
  await esbuild.build({
    stdin: { contents: entry, loader: "tsx", resolveDir: sourceRoot },
    outfile: path.join(outputRoot, "demo.js"),
    bundle: true,
    minify: true,
    legalComments: "eof",
    jsx: "automatic",
    platform: "browser",
    target: ["es2020"],
    nodePaths: [path.join(sourceRoot, "node_modules")],
    plugins: [originalSourcePlugin],
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const styles = await postcss([tailwind({ base: sourceRoot, optimize: true })]).process(css, {
    from: path.join(outputRoot, "input.css"), to: path.join(outputRoot, "demo.css"),
  });
  fs.writeFileSync(path.join(outputRoot, "demo.css"), styles.css);
  const revision = (file) => createHash("sha256").update(fs.readFileSync(path.join(outputRoot, file))).digest("hex").slice(0, 12);
  fs.writeFileSync(path.join(outputRoot, "replay.html"), `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>StackHUD · Real hand replay</title><link rel="stylesheet" href="./demo.css?v=${revision("demo.css")}"></head>
<body><div id="root"></div><script src="./demo.js?v=${revision("demo.js")}" defer></script></body></html>`);
  console.log("Built isolated StackHUD replay: " + outputRoot);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
