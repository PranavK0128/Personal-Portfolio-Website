# Development

The application currently renders a blank, pure-black (`#000000`) home page. Navigation, portfolio sections, and resume content will be added after layout review.

The foundation uses Next.js 16.4.3, React 19.3.1, Tailwind CSS 4.3.3, TypeScript 6.0.3, and Biome 2.6.3. TypeScript is pinned to the stable 6.x line for tooling compatibility. Dependency versions are reproducible through `package-lock.json`.

## Local setup

Use Node.js 24 LTS and npm. Install the locked dependencies with `npm ci`, then run `npm run dev`. Open http://localhost:3000.

Commands:

- `npm run dev`: start the development server.
- `npm run lint`: check source formatting and lint rules with Biome.
- `npm run format`: apply formatting and safe lint fixes.
- `npm run typecheck`: generate Next.js route types and run TypeScript.
- `npm run build`: create the production build.
- `npm start`: serve the production build.

## Folder responsibilities

```text
src/
  app/                 Routes, shared root layout, global CSS and theme tokens
  components/          Reusable UI; group by layout, UI primitive, or feature as needed
  data/                Profile, project and experience content, separate from presentation
  lib/                 Shared utilities and integrations when needed
public/
  images/projects/     Project screenshots and other public project images
  documents/           Approved public documents, including the updated resume
docs/
  DEVELOPMENT.md       Setup and development conventions
```

Empty directories are reserved with `.gitkeep` files. Add actual modules only when needed. Route files should compose components; keep content and reusable behaviors out of large page files. Use `@/` for imports from `src`.

Use lowercase kebab-case for ordinary filenames and route segments, PascalCase for React component exports, and the required Next.js filenames such as `page.tsx` and `layout.tsx`.

The default route components are server components. Add `"use client"` only for interactive code. Keep the root background pure black. Tailwind scans `src`; TypeScript and Biome are scoped to application files and configuration.

## Content status

Work experience and project descriptions await the updated resume. Future design placeholders should be visibly identified in development and kept separate from approved public content. Do not invent employers, achievements, dates, metrics, or functioning demo/resume links.

The initial application needs no database, authentication, environment variables, or third-party service credentials. Add dependencies when an approved feature requires them.
