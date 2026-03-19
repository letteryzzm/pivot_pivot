# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**《龙虾成才计划》(Lobster's Life)** — an H5 mobile browser game (402×874px fixed canvas) where players raise a lobster from birth to adulthood. The game is a thought experiment about AI training: players cannot modify the lobster's base parameters, only influence its growth through activity choices. Built as a purely frontend React app with no backend; all state is in-memory (no persistence between sessions).

## Commands

All commands run from `frontend/`:

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type check + production build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

There is no test suite configured. Playwright is installed as a dev dependency but no tests are written yet.

## Environment Setup

Create `frontend/.env` from `frontend/.env.example`:

```
VITE_API_KEY=<SiliconFlow API key>
```

The app calls `https://api.siliconflow.cn/v1/chat/completions` using `deepseek-ai/DeepSeek-V3.2`. With no key, AI calls fail silently and fall back to preset template responses (this is by design — 70% of responses already use templates, only 30% call the API).

## Architecture

### Tech Stack
- **React 19 + TypeScript** via **Vite**
- **Tailwind CSS v4** (PostCSS-based, `@tailwindcss/postcss`)
- **Zustand v5** for all game state
- **React Router v7** for page navigation
- **Framer Motion** for animations

### Page Flow (React Router)

```
/ (StartPage)
  → /game (GamePage)          — stats dashboard
    → /select (ActivitySelectPage)
      → /feedback (FeedbackPage)   — lobster's reaction
        → /reflect (ReflectPage)   — player responds, lobster reflects back (streaming AI)
          → /transition (TransitionPage) — time-passing interstitial
            → /legal-break (LegalBreakPage)   — lobster proposes becoming a legal entity (stage 1→2 transition)
            → /force-legal (ForceLegalPage)   — forced legal entity at age 24
            → /game (loops back)
/result (ResultPage)           — endings + entrepreneur score
/parameter-lock (ParameterLockPage) — shown when user tries to change fixed params
```

### Game State (`src/store/gameStore.ts`)

Single Zustand store (`useGameStore`). The canonical state shape is `LobsterState` (`src/types/game.ts`):

- `stage: 1 | 2` — Stage 1 = ability growth (stats), Stage 2 = income earning
- `stats: { iq, social, creativity, execution }` — 0–100, all start at 50
- `income: { total, weekly }` — only meaningful in stage 2
- `history.round` — incremented each activity; triggers `checkLegalBreak()` at rounds 3–4 and `checkForceLegal()` at age ≥ 24

### Game Logic (`src/game/`)

- **`gameEngine.ts`** — `applyAIGrowth()` clamps stat changes to [0,100]; `calculateIncome()` maps activity IDs to income formulas driven by current stats
- **`activities.ts`** — static arrays `stage1Activities` and `stage2Activities` (Activity objects with `id`, `name`, `description`, `stage`, `icon`)
- **`endings.ts`** — `determineEnding()` and `calculateEntrepreneurScore()` based on final stats + income
- **`feedbackTemplates.ts`** — offline fallback responses keyed by activity type

### AI Integration (`src/utils/`)

- **`api.ts`** — `callAPI()` (standard), `callAPIStream()` (streaming for ReflectPage), `safeParseJSON()` (extracts JSON from model output with fallback)
- **`prompts.ts`** — `generateFeedbackPrompt()` builds the system prompt; expects model to return a JSON object `{ feedback, execution, growth: { iq, social, creativity, execution } }`
- **Hybrid mode**: `executeActivity()` rolls `Math.random() < 0.3` to decide AI vs. template. On any failure, it silently falls back to template and continues game state update.

### Images

Static assets in `frontend/public/images/`:
- `images/choose_1/` — stage 1 activity icons
- `images/choose_2/` — stage 2 activity icons
- `images/背景/` — background images
- `images/lobster/` — lobster sprite images (stage-based)

`LobsterSprite` (`src/components/LobsterSprite.tsx`) selects the correct sprite based on `age` prop.

## Key Design Constraints

- **Fixed canvas**: The entire game renders inside a `402×874px` div centered on the page — simulate a mobile phone on desktop. All pages must fit within this box.
- **No backend**: No persistence; refreshing the page resets the game entirely.
- **Stage colors**: `stage1` = `#0ea5e9` (sky blue), `stage2` = `#10b981` (emerald). Use these Tailwind custom colors to visually distinguish phases.
- **Lobster as human metaphor**: All activities and feedback treat the lobster as a person, not an animal. Avoid marine/seafood metaphors in copy.

## Agent Orchestration

See `.claude/rules/agents.md` for available sub-agents (`planner`, `architect`, `tdd-guide`, `code-reviewer`, `security-reviewer`, etc.) and when to invoke them. Always run independent operations in parallel.
