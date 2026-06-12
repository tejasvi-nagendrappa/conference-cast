# 📡 ConferenceCast

> **Every room is a channel. Every session is a broadcast.**

Built for the **Progress × GitNation Hackathon 2026** — *"Build the tools that make tech events more meaningful."*

🔗 **[Live Demo](https://tejasvi-nagendrappa.github.io/conference-cast/)**

**Try it in 60 seconds:**
1. Open the demo → click **Personalise** → set your topics and level
2. See your AI-scored lineup and click a **LIVE** session card to watch inline
3. Switch to **GUIDE** to browse the full EPG timeline
4. Click **Control Room** in the topbar to see the organiser view

---

## The Problem

You pay €500 to attend a conference. Five talks run at the same time. You pick one at random, sit through it, and later find out the talk in Room B was exactly what you needed. That moment of "I missed the right talk" is something every developer has felt.

It's not just in-person. Remote attendees face the same problem with five simultaneous streams and no guide. And organisers? They run the whole event blind — no real-time view of which rooms are packed, where Q&A is spiking, or where they're about to lose an audience.

**Multi-track conferences are an information problem. ConferenceCast is the solution.**

---

## The Solution

ConferenceCast treats every conference room like a TV channel — giving attendees a broadcast-style guide and giving organisers a real-time control room. Whether you're in the building or watching from home, you always know what's worth your time.

### For attendees
- **AI-personalised lineup** — every session scored 0–99 against your track interests and experience level, with a plain-English "why this matches you" explanation. No more random picks.
- **LIVE tab** — all currently broadcasting sessions in a grid; click any card to expand an inline video player + live Q&A panel without leaving the page
- **UPCOMING tab** — sessions grouped by time with live countdown timers and 2-minute start notifications
- **GUIDE tab** — full EPG timeline (09:00–13:00), colour-coded by channel, with a NOW indicator. Ended sessions stay visible so in-person attendees can find what they missed and watch recordings when published.
- **🔥 Trending** badge on the most-watched live session — instant signal on where the energy is

### For organisers (`/control-room`)
- Real-time KPIs with trend arrows: total live viewers, avg room capacity, Q&A activity rate
- **Now Broadcasting** strip — speaker avatars with live pulse, per-channel viewer counts and fill rates
- Live viewership area chart across all 5 channels
- Alert feed: capacity warnings, Q&A spikes, low-attendance flags

---

## What Makes It Meaningful

| Problem | ConferenceCast answer |
|---|---|
| "I don't know which of 5 talks to watch" | AI match score + plain-English reason |
| "I missed a session — where do I find it?" | EPG shows ended sessions; click to replay |
| "I can't tell which room has energy right now" | 🔥 Trending badge on most-watched live session |
| "I forgot a talk was starting soon" | Toast notification 2 min before start |
| "Our biggest room is overflowing" | Control Room capacity alerts in real time |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI Components | **KendoReact** |
| State | Zustand |
| Routing | React Router v6 (HashRouter for static hosting) |
| Time | date-fns |
| Hosting | GitHub Pages |

### KendoReact Components Used

- **`Chart` / `ChartSeries` / `ChartCategoryAxis` / `ChartValueAxis`** — live viewership line chart in the Control Room
- **`Input`** — session search bar
- **`Button`** — personalise drawer trigger, clear search
- **`Chip`** — track filter bar (React / JS / DevOps / UX / Perf / AI)
- **`ProgressBar`** — room capacity bars in live session cards
- **`Notification` / `NotificationGroup`** — 2-minute session start toasts
- **`Tooltip`** — session description on hover in the EPG timeline

---

## Future Scope

This prototype uses simulated real-time data. In a production integration:

- **Live stream URLs** pulled from conference CMS (Sessionize, Hopin, etc.)
- **Real attendance data** from ticketing / check-in systems
- **VOD links** auto-populated once recordings are published — attendees get a seamless "missed it? watch it" flow directly in the EPG
- **Push notifications** for sessions the AI scores as Top Pick for a specific attendee
- **Organiser actions** from the Control Room: send room alerts, adjust session order, flag capacity issues to venue staff

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
                   # Control Room: http://localhost:5173/#/control-room
npm run build
npm run deploy     # GitHub Pages
```

---

## Project Structure

```
src/
├── components/
│   ├── controlroom/       # ViewershipChart, ChannelHealthTable, LiveAlertsFeed
│   ├── epg/               # EPGTimeline, TrackFilterBar
│   ├── lineup/            # HorizontalLineup (arrow-nav, AI scores)
│   ├── live/              # LiveGrid (accordion player), UpcomingList
│   ├── notifications/     # SessionNotifier (Kendo Notification toasts)
│   ├── onboarding/        # PersonalizeDrawer
│   ├── player/            # QAPanel
│   └── shared/            # TrackBadge, StatusBadge
├── data/                  # channels.ts, sessions.ts (16 sessions, 5 channels)
├── hooks/                 # useAIRecommendation, useCountdown, useSimulatedViewership
├── pages/                 # AttendeePage, ControlRoomPage
├── store/                 # useAppStore (Zustand)
└── types/
```

---

## Author

**Tejasvi Nagendrappa**  
[github.com/tejasvi-nagendrappa](https://github.com/tejasvi-nagendrappa)

---

*Built with [KendoReact](https://www.telerik.com/kendo-react-ui) — a Progress product.*
