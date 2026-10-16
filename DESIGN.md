---
name: PrepTrack Design System
description: Cohesive, high-contrast, distraction-free visual language for Indian Bank Exam preparation.
colors:
  primary: "#1d4ed8"
  primary-dark: "#1e3a8a"
  primary-brand: "#2563eb"
  primary-light: "#eff6ff"
  primary-selection: "#dbeafe"
  cyan-accent: "#0891b2"
  slate-dark: "#0f172a"
  slate-body: "#334155"
  slate-muted: "#64748b"
  slate-thumb: "#94a3b8"
  slate-track: "#cbd5e1"
  slate-border: "#e2e8f0"
  surface: "#ffffff"
  surface-subtle: "#f8fafc"
  success: "#15803d"
  success-light: "#f0fdf4"
  warning: "#b45309"
  warning-light: "#fffbeb"
  danger: "#b91c1c"
  danger-light: "#fef2f2"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.025em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
---

# PrepTrack Design System

## Overview
PrepTrack's visual system embodies the focus, precision, and authority of premier banking examinations (RBI, SBI, IBPS). It replaces generic AI tropes (purple gradients, washed-out low-contrast gray text, decorative blur halos) with a clean, high-clarity interface optimized for prolonged study.

## Colors
- **Banking Cobalt & Navy**: `#1d4ed8` and `#1e3a8a` serve as the primary anchors for active states, key interactive controls, and exam headers.
- **Slate Hierarchy**:
  - Headings: `#0f172a` (Slate 900)
  - Body & Questions: `#334155` (Slate 700)
  - Secondary & Labels: `#475569` (Slate 600) with strict contrast verification against white/light backgrounds.
  - Borders: `#e2e8f0` (Slate 200)
  - Page Ground: `#f8fafc` (Slate 50)
- **Functional Accents**:
  - Success/Correct: `#15803d` (Emerald 700 on Emerald 50)
  - Caution/Review: `#b45309` (Amber 700 on Amber 50)
  - Danger/Error: `#b91c1c` (Rose 700 on Rose 50)

## Typography
- Font: Inter with tabular figures (`tnum`) for timers, scores, and exam numerals.
- Hierarchy: Clear steps from display (1.5rem–1.75rem font-bold), section heads (1.125rem font-bold), to crisp question text (0.9375rem leading-relaxed).
- No gradient text; emphasis is achieved through weight and scale.

## Layout
- Strict vertical rhythm: generous group separation with compact related element groups.
- Responsive container caps at 1280px (`max-w-7xl`) with clean fluid padding.

## Elevation & Depth
- Layered, soft diffused shadows (`shadow-sm`, `shadow-xs`) with natural vertical offset; no hard zero-blur offset block shadows or colored halos.

## Shapes
- Modest corner radii: 8px to 12px for cards and containers, 6px for interactive tags and buttons, pill shape for timer badges.

## Components
- **Topic Chips**: Crisp bordered badges with clear contrast text and distinct touch targets.
- **Question Cards**: Uncluttered layout with full-width numbered options, distinct focus rings, and explicit feedback.
- **Speed Timer**: High-visibility pill badge with monotonic font-mono seconds counter.

## Do's and Don'ts
- **DO**: Use authored SVG icons with consistent 1.5–2px stroke weights.
- **DO**: Ensure all secondary text on colored pills uses a darker shade of that hue or crisp white.
- **DON'T**: Use purple-to-pink gradients or cyan neon text.
- **DON'T**: Use unicode emoji as icons.
- **DON'T**: Use washed-out gray text over colored backgrounds.
