# Design System

## Color Palette (OKLCH)

### Backgrounds
- `--bg-base`: #0d0d0d (L 0.08) — app background, true near-black
- `--bg-sidebar`: #141414 (L 0.10) — sidebars, panels
- `--bg-surface`: #1a1a1a (L 0.12) — cards, elevated surfaces
- `--bg-elevated): #242424 (L 0.17) — hover states, active items

### Borders
- `--border-subtle`: #2a2a2a (L 0.18) — dividers, card borders
- `--border-strong`: #3a3a3a (L 0.25) — focused inputs, active borders

### Text
- `--text-primary`: #f0f0f0 (L 0.94) — body text, headings
- `--text-secondary`: #999999 (L 0.62) — descriptions, labels
- `--text-muted): #555555 (L 0.36) — placeholders, disabled

### Accent
- `--accent`: #f59e0b (amber) — primary actions, brand identity
- `--accent-hover`: #d97706 — pressed states
- `--accent-subtle`: #f59e0b/10 — tints, badges
- `--accent-red`: #ef4444 — errors, destructive, quality mode
- `--success`: #22c55e — confirmations, positive eval

## Typography

- **Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI)
- **Mono**: JetBrains Mono (SOUL.md editor, tool output)
- **Scale**: Fixed rem, 1.2 ratio
  - xs: 0.69rem (~10px)
  - sm: 0.83rem (~12px)
  - base: 1rem (~14px)
  - md: 1.14rem (~16px)
  - lg: 1.43rem (~20px)
  - xl: 1.71rem (~24px)
- **Line height**: 1.5 for body, 1.3 for headings

## Spacing

4px base unit. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

## Border Radius

- sm: 6px — buttons, small elements
- md: 8px — inputs, toggles
- lg: 12px — cards, panels
- xl: 16px — message bubbles, composer

## Components

### Buttons
- Primary: amber bg, black text, 8px radius
- Secondary: transparent, border, neutral text
- Ghost: transparent, no border, hover bg

### Inputs
- Dark surface bg, subtle border, focus ring via border color change
- No box-shadow on focus

### Toggle
- 48×24 track, 20×20 thumb
- Amber when on, neutral-700 when off

### Chat Bubbles
- Agent: left-aligned, amber accent on avatar
- User: left-aligned, neutral avatar
- Tool chips: collapsible, icon + label + detail

### Chess Board
- Standard green/cream squares (#769656 / #eeeed2)
- 8×8 grid, no coordinates (clean look)
