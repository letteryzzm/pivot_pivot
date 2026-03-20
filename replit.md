# 龙虾成才计划 (Lobster's Life)

## Project Overview

An interactive H5 nurturing game where players raise a virtual "Lobster" from infancy to adulthood (age 0–18+). The game serves as both entertainment and a philosophical experiment around AI growth, model training metaphors, and entrepreneurship.

Players act as "trainers," selecting activities (Study, Social, Create, Execute) that influence the Lobster's stats and personality. The game ends with a "Founder Compatibility Diagnosis."

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4 + PostCSS
- **Animations**: Framer Motion
- **AI Integration**: SiliconFlow API (DeepSeek-V3.2 model)
- **Routing**: react-router-dom
- **Utilities**: html-to-image, html2canvas (for shareable result posters)

## Project Structure

```
frontend/               # All frontend code
  src/
    game/               # Core game engine, activities, endings
    store/              # Zustand state management (gameStore.ts)
    pages/              # Game screens (Start, Activity, Reflect, Ending)
    components/         # Reusable UI (LobsterSprite, StatBar, TypewriterText)
    utils/              # API calls (api.ts) and LLM prompts (prompts.ts)
    config/             # Animation and image configs
  public/images/        # Pixel-art game assets by stage
```

## Development

- **Workflow**: `cd frontend && npm run dev`
- **Port**: 5000
- **Host**: 0.0.0.0 (required for Replit proxy)
- **All hosts**: allowed (required for Replit iframe preview)

## Deployment

- **Type**: Static site
- **Build**: `cd frontend && npm run build`
- **Public Dir**: `frontend/dist`

## Environment Variables

- `VITE_SILICONFLOW_API_KEY` — API key for SiliconFlow/DeepSeek AI integration (set in Replit Secrets)
