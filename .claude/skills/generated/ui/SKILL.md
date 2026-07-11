---
name: ui
description: "Skill for the Ui area of Personal-Management. 26 symbols across 13 files."
---

# Ui

26 symbols | 13 files | Cohesion: 83%

## When to Use

- Working with code in `frontend/`
- Understanding how StatCard, cn work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend/src/components/ui/card.jsx` | Card, CardHeader, CardTitle, CardDescription, CardContent (+1) |
| `frontend/src/components/ui/select.jsx` | SelectTrigger, SelectScrollUpButton, SelectScrollDownButton, SelectContent, SelectItem |
| `frontend/src/pages/FocusTaskPage.jsx` | FocusBackground, FocusModeButton, FocusThemeOption, FocusIconButton |
| `frontend/src/pages/WeeklyReportPage.jsx` | QuadrantLegend, CalendarViewSegment |
| `frontend/src/components/AppLayout.jsx` | NavigationLink |
| `frontend/src/components/StatCard.jsx` | StatCard |
| `frontend/src/components/ui/badge.jsx` | Badge |
| `frontend/src/components/ui/button.jsx` | Button |
| `frontend/src/components/ui/input.jsx` | Input |
| `frontend/src/components/ui/label.jsx` | Label |

## Entry Points

Start here when exploring this area:

- **`StatCard`** (Function) — `frontend/src/components/StatCard.jsx:5`
- **`cn`** (Function) — `frontend/src/utils/cn.js:3`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `StatCard` | Function | `frontend/src/components/StatCard.jsx` | 5 |
| `cn` | Function | `frontend/src/utils/cn.js` | 3 |
| `NavigationLink` | Function | `frontend/src/components/AppLayout.jsx` | 25 |
| `Badge` | Function | `frontend/src/components/ui/badge.jsx` | 4 |
| `Button` | Function | `frontend/src/components/ui/button.jsx` | 30 |
| `Card` | Function | `frontend/src/components/ui/card.jsx` | 4 |
| `CardHeader` | Function | `frontend/src/components/ui/card.jsx` | 13 |
| `CardTitle` | Function | `frontend/src/components/ui/card.jsx` | 18 |
| `CardDescription` | Function | `frontend/src/components/ui/card.jsx` | 23 |
| `CardContent` | Function | `frontend/src/components/ui/card.jsx` | 28 |
| `CardFooter` | Function | `frontend/src/components/ui/card.jsx` | 33 |
| `Input` | Function | `frontend/src/components/ui/input.jsx` | 4 |
| `Label` | Function | `frontend/src/components/ui/label.jsx` | 5 |
| `Progress` | Function | `frontend/src/components/ui/progress.jsx` | 4 |
| `SelectTrigger` | Function | `frontend/src/components/ui/select.jsx` | 10 |
| `SelectScrollUpButton` | Function | `frontend/src/components/ui/select.jsx` | 27 |
| `SelectScrollDownButton` | Function | `frontend/src/components/ui/select.jsx` | 38 |
| `SelectContent` | Function | `frontend/src/components/ui/select.jsx` | 49 |
| `SelectItem` | Function | `frontend/src/components/ui/select.jsx` | 73 |
| `Textarea` | Function | `frontend/src/components/ui/textarea.jsx` | 4 |

## How to Explore

1. `gitnexus_context({name: "StatCard"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
