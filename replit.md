# Knowledge Synthesis Engine (KSE)

An autonomous multi-agent orchestration framework for cross-domain scientific knowledge discovery. It fetches ArXiv papers, extracts semantic concepts via Gemini, stores them in a content-addressable graph, generates cross-domain hypotheses, and audits them with Grok — all visualized as an interactive 3D knowledge graph.

## Stack

- **Backend:** Node.js 20 / TypeScript / Hono (served on port 5000)
- **Frontend:** React 18 / Vite / Three.js / react-force-graph-3d / Tailwind CSS
- **LLM APIs:** Google Gemini (concept extraction), xAI Grok (logical audit), OpenRouter/Gemma (synthesis)
- **Persistence:** JSON file at `data/knowledge_graph.json`

## How to Run

```
npm run start
```

This builds the TypeScript backend (esbuild → `dist/server.js`) and the React frontend (Vite → `dist/frontend/`), then starts the Hono server on port 5000.

The workflow is configured as **"Start application"** with `npm run start`.

## Environment Variables / Secrets

Set in Replit Secrets:

| Key | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini for concept extraction from papers |
| `GROK_API_KEY` | xAI Grok for logical audit of hypotheses |
| `OPENROUTER_API_KEY` | OpenRouter for Gemma synthesis generation |
| `ADMIN_API_KEY` | Protects `/api/*` endpoints (optional — unset = open) |

Optional env vars (set as plain env vars):

| Key | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Server port |
| `DB_PATH` | `data/knowledge_graph.json` | Graph persistence path |
| `DEFAULT_RESEARCH_DOMAIN` | `interdisciplinary science discovery` | Default scout seed |

## Architecture

- `src/core/types.ts` — Shared TypeScript types
- `src/core/store.ts` — JSON-based graph persistence (CID store)
- `src/core/arxiv.ts` — ArXiv Atom XML API client
- `src/core/ingestion.ts` — Gemini-powered concept extraction + CID generation
- `src/core/synthesis.ts` — OpenRouter hypothesis generation + Grok audit
- `src/core/scout.ts` — Autonomous scout loop
- `src/api/routes/synthesis.ts` — REST endpoints for graph + validation
- `src/frontend/` — React UI with 3D force graph

## API Endpoints

All `/api/*` endpoints require `X-API-KEY` header if `ADMIN_API_KEY` is set.

- `GET /api/v1/synthesis/graph` — Full knowledge graph (nodes, links, proposals)
- `POST /api/v1/scout/trigger` — Start scout cycle `{ seed_query?: string }`
- `GET /api/v1/activity` — Last 50 intelligence feed events
- `POST /api/v1/synthesis/:id/validate` — Approve/reject a proposal

## User Preferences

- Keep the existing project structure (Hono backend + Vite frontend, monorepo in one repo)
- Do not migrate to a database unless explicitly requested — JSON persistence is intentional for local dev
