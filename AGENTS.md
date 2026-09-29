# Workspace Guidelines: Nordic Minimalist Todo List App

This repository contains the codebase for a high-polish, **Nordic Minimalist Todo List Application**. All AI agents working on this project must follow the design standards, technical architecture, and implementation guidelines detailed below.

---

## 🎨 Design System & Aesthetics

### 1. Visual Theme: Nordic Minimalist
- **Philosophy**: Generous whitespace, calm color palette, elegant typography, subtle depth, and tactile micro-interactions.
- **Color Palette**:
  - Backgrounds: Off-white / warm porcelain (`#F8FAFC`, `#F9FAFB`, `#F3F4F6`)
  - Surface Cards: Pure white (`#FFFFFF`) with subtle translucent borders (`border-slate-200/80`)
  - Typography: Primary slate (`#0F172A` / `#1E293B`), Secondary muted slate (`#64748B`), Muted details (`#94A3B8`)
  - Pastel Accents:
    - Sage Green (Success/Complete): `#84A98C` / `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Soft Lavender (Personal/Tags): `#B8C0EC` / `bg-purple-50 text-purple-700 border-purple-200`
    - Warm Sand / Amber (Priority/Pending): `#F4A261` / `bg-amber-50 text-amber-700 border-amber-200`
    - Soft Rose (Urgent/Delete): `#E63946` / `bg-rose-50 text-rose-700 border-rose-200`

### 2. Typography & Layout
- **Font Family**: Modern clean sans-serif (e.g., `Inter` or `Plus Jakarta Sans` via Google Fonts).
- **Cards & Radius**: Soft rounded corners (`rounded-2xl` for containers, `rounded-xl` for task items and buttons).
- **Shadows**: Soft, multi-layered ambient shadows (`shadow-sm`, `shadow-slate-200/50`, `hover:shadow-md transition-shadow`).

---

## 🛠️ Tech Stack & Dependencies

- **HTML**: Semantic HTML5 (`<main>`, `<section>`, `<header>`, `<footer>`, `<button>`, `<label>`).
- **Styling**: **Tailwind CSS** (via CDN script or build setup) for utility-first styling.
- **Scripting**: Vanilla JavaScript (ES6+ modular architecture, direct DOM manipulation, event delegation).
- **Enhancements**:
  - **Icons**: Lucide Icons or Feather Icons (via CDN SVG / script).
  - **Confetti**: `canvas-confetti` CDN library for celebration effects upon completing tasks.
  - **Sound Effects**: Web Audio API synthetic soft chime/pop sounds (no external asset files required).

---

## ✨ Features & UX Requirements

### Core Functionality
1. **Task Management (CRUD)**:
   - Add task with Title, Category Tag, Priority Level (Low, Medium, High), and optional Due Date.
   - Toggle completion status with custom animated checkbox.
   - Edit inline or via quick modal.
   - Delete task with soft confirmation or instant undo toast.
2. **Filtering & Search**:
   - Filter tabs: **All**, **Active**, **Completed**, and category tags.
   - Real-time search bar filtering tasks by title.
3. **Data Persistence**:
   - Save tasks to browser `localStorage`.
   - Pre-populate with clean sample tasks on first launch.

### UX & Visual Polish
1. **Micro-Animations**:
   - Smooth entrance animations (`fade-in`, `slide-down`) when adding tasks.
   - Strike-through animation and opacity shift when completing tasks.
   - Scale feedback on button clicks (`active:scale-95`).
2. **Delight Elements**:
   - **Confetti Explosion**: Trigger subtle canvas confetti burst when all tasks in a view are completed or when completing a high-priority task.
   - **Audio Toggle**: Optional soft sound effect toggle (click pop on check, gentle chime on goal complete).
   - **Empty States**: Minimalist illustrations/icons with calm motivational text when list is empty.
   - **Progress Stats**: Modern progress ring or bar displaying completed vs total task count.

---

## 📁 Code Structure Guidelines

```text
stage-1-task/
├── AGENTS.md             # Project guidelines & specifications (this file)
├── index.html            # Main HTML document with Tailwind CDN & structure
├── src/
│   ├── css/
│   │   └── styles.css    # Custom CSS animations & Tailwind overrides
│   └── js/
│       ├── app.js        # Main initialization & state coordinator
│       ├── storage.js    # LocalStorage CRUD handlers
│       ├── audio.js      # Web Audio API sound synthesizer
│       └── ui.js         # DOM renderers & animation helpers
└── README.md             # Setup and documentation
```

---

## 📐 Rulebook for AI Agents

1. **Maintain Aesthetics**: Never introduce harsh colors, default browser inputs, or plain unstyled buttons. Always stick to the Nordic Minimalist design rules.
2. **Clean Vanilla JS**: Keep JavaScript modular, clean, readable, and free of heavy framework bloat.
3. **Responsive First**: Ensure layout looks flawless across mobile screens (375px+), tablets, and desktop displays.
4. **Accessibility**: Include `aria-label`, keyboard navigation support (`Enter` to submit, `Escape` to cancel), and visible focus rings (`focus:ring-2 focus:ring-slate-400`).
