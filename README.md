# Yen's Personal Dashboard

A personal productivity dashboard built with React + Vite.

## Getting Started

### 1. Install dependencies (first time only)

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

The terminal will show:

```
VITE ready in ...ms
➜  Local: http://localhost:5173/
```

### 3. Open in browser

Visit **http://localhost:5173** in any browser.

Or open it inside VS Code:
1. `Cmd+Shift+P` → type **Simple Browser: Show** → Enter
2. Paste `http://localhost:5173` → Enter

### 4. Stop the server

Press `Ctrl+C` in the terminal where `npm run dev` is running.

---

## Sections

| Section | Status | Notes |
|---|---|---|
| Profile | ✅ | Frog icon + name |
| Date & Time | ✅ | Live clock |
| Goals | ✅ | Health, C++, Music — click to edit, saves locally |
| Weekly Events | ⏳ | Placeholder — TimeTree integration coming |
| Routine Checks | ✅ | Daily habits, resets each day |
| Emergency To-Do | ✅ | Add/remove tasks with priority |
| LeetCode Tracker | ✅ | 3 problems per day, shuffles daily |
| Investment | ⏳ | Placeholder — connect real data later |
| C++ Resources | ✅ | Links to cppreference, godbolt, etc. |

---

## Project Structure

```
src/
  App.jsx                  — layout
  components/
    Profile/               — frog icon + name card
    DateTime/              — live clock card
    Goals/                 — health / C++ / music goals
    WeeklyEvents/          — weekly calendar
    RoutineChecks/         — daily habit checklist
    TodoList/              — emergency to-do list
    LeetcodeTracker/       — daily LeetCode problems
    FinancialStatus/       — investment overview
    CppArticle/            — C++ resources & links
public/
  avatar.png               — your profile icon
```

## Adding Your Avatar

Save your icon image as `public/avatar.png`. It will appear in the Profile card automatically.
