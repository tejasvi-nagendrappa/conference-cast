# 📡 ConferenceCast

> **Every room is a channel. Every session is a broadcast.**

ConferenceCast applies the TV broadcast metaphor to tech conferences — giving attendees a personalised AI-powered programme guide and giving organisers a real-time control room dashboard.

Built for the **Progress × GitNation Hackathon 2026** — *"Build the tools that make tech events more meaningful."*

🔗 **[Live Demo](https://tejasvi-nagendrappa.github.io/conference-cast/)**

---

## The Problem

Multi-track conferences run 5+ sessions simultaneously. Attendees miss talks they'd love because there's no personalised guide, no live signal on which room has energy, and no way to make an informed choice in the moment. Organisers run the whole event blind — no real-time view of attendance, Q&A activity, or room capacity.

## The Solution

**For attendees:**
- AI-personalised lineup scored against your track interests and experience level, with a plain-English "why this matches you" explanation
- **LIVE tab** — all currently broadcasting sessions in a grid; click to expand an inline video player + live Q&A without leaving the page
- **UPCOMING tab** — time-grouped sessions with live countdown timers
- **GUIDE tab** — full horizontal EPG timeline (09:00–13:00), colour-coded by channel, with a NOW indicator line and ended sessions visually greyed out

**For organisers (`/control-room`):**
- Real-time KPIs: live viewer count, avg room capacity, Q&A activity rate
- 5 channel tiles with fill-rate progress bars and live badges
- Live viewership chart across all channels (KendoReact Chart)
- Alert feed: capacity warnings, Q&A spikes, low-attendance flags

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI Components | **KendoReact** (Charts, Input, Button, Chip, ProgressBar) |
| State | Zustand |
| Routing | React Router v6 (HashRouter for static hosting) |
| Time | date-fns |
| Persistence | localStorage (profile + theme only) |

### KendoReact Components Used

- **`Chart` + `ChartSeries` + `ChartCategoryAxis` + `ChartValueAxis`** — live viewership line chart in the Control Room
- **`Input`** — session search bar
- **`Button`** — personalise drawer trigger, clear search
- **`Chip`** — track filter bar (React / JS / DevOps / UX / Perf / AI)
- **`ProgressBar`** — room capacity bar in live session cards

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

App runs at `http://localhost:5173`  
Control Room at `http://localhost:5173/#/control-room`

---

## Project Structure

```
src/
├── components/
│   ├── controlroom/     # ViewershipChart, ChannelHealthTable, LiveAlertsFeed
│   ├── epg/             # EPGTimeline, TrackFilterBar
│   ├── lineup/          # HorizontalLineup (arrow-nav, AI scores)
│   ├── live/            # LiveGrid (accordion player), UpcomingList
│   ├── onboarding/      # PersonalizeDrawer
│   ├── player/          # SessionPlayer, QAPanel
│   └── shared/          # TrackBadge, StatusBadge
├── data/                # channels.ts, sessions.ts (16 sessions across 5 channels)
├── hooks/               # useAIRecommendation, useCountdown, useSimulatedViewership, usePersonalLineup
├── pages/               # AttendeePage, ControlRoomPage
├── store/               # useAppStore (Zustand)
└── types/               # index.ts
```

---

## Features

- **Dark / Light theme** — persisted to localStorage, applied via CSS custom properties
- **Personalisation drawer** — name, role, topic interests, experience level
- **AI match scoring** — deterministic engine matching session track × user level → 0–99 score + label (Top Pick / Great Match / Good Fit / Explore)
- **Real-time simulation** — viewer counts, fill rates, Q&A activity, trend arrows update every 3 seconds
- **Mobile responsive** — topbar collapses cleanly at 600px, single-column grid on mobile
- **Arrow-nav lineup** — fixed-width horizontal card strip with ‹ › scroll buttons

---

## Author

**Tejasvi Nagendrappa**  
[github.com/tejasvi-nagendrappa](https://github.com/tejasvi-nagendrappa)

---

*Built with [KendoReact](https://www.telerik.com/kendo-react-ui) — a Progress product.*
