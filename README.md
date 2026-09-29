# Klarity — Nordic Minimalist Todo Application

Klarity is a high-polish, **Nordic Minimalist Todo List Application** built with Vanilla JavaScript, HTML5, and Tailwind CSS. It focuses on serene aesthetics, responsive layout, smooth micro-animations, and delightful user feedback.

---

## ✨ Features

- **Task Management (CRUD)**:
  - Add tasks with Title, Category Tag, Priority Level, and Due Date.
  - Custom check-box completion animation.
  - Inline/Modal editing of existing tasks.
  - Soft task deletion with an instant **Undo Toast notification**.
- **Nordic Minimalist Design System**:
  - Off-white porcelain background (`#F8FAFC`) with subtle translucent glassmorphic cards.
  - Soft pastel color palette (Sage Green, Soft Lavender, Warm Sand, Soft Rose).
  - Modern Plus Jakarta Sans typography.
- **Search & Filtering**:
  - Filter by status tabs (**All**, **Active**, **Completed**).
  - Filter by custom Category Pills (**Work**, **Personal**, **Health**, **Finance**, **Ideas**).
  - Real-time search query filtering.
- **UX & Visual Polish**:
  - **Confetti Explosion**: Canvas confetti celebration burst upon completing high-priority or all remaining tasks.
  - **Synthetic Audio FX**: Web Audio API generated soft pops, clicks, and chimes (with Mute/Unmute toggle).
  - **Progress Stats**: Live progress bar and completion percentage tracker.
- **Data Persistence**:
  - Automatic `localStorage` saving and pre-populated sample tasks for first-time visitors.

---

## 🚀 Getting Started

No build process or complex setup required!

1. Open `index.html` in any modern web browser or serve via a local HTTP server (e.g. VS Code Live Server or `npx serve .`).
2. Interact with tasks, toggle sound FX, try filtering, searching, and deleting tasks.

---

## 🛠️ Project Structure

```text
stage-1-task/
├── AGENTS.md             # Project guidelines & specifications
├── index.html            # Main HTML document & layout
├── src/
│   ├── css/
│   │   └── styles.css    # Animations, typography, & Tailwind overrides
│   └── js/
│       ├── app.js        # Main initialization & event orchestrator
│       ├── storage.js    # LocalStorage CRUD service
│       ├── audio.js      # Web Audio API sound synthesizer
│       └── ui.js         # DOM renderers, toasts, & confetti handlers
└── README.md             # Project documentation
```
