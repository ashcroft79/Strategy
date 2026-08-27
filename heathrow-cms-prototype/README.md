# CMS & Assessment System — standalone prototype

A click-through prototype of the Heathrow CMS & Assessment System, built directly
from `CMS & Assessment System — Screen & Component Specification` (v01, DBLX,
27 August 2026, Project 679806 — Heathrow People Transformation Programme).

It's a static, dependency-free web app — no build step, no backend, no npm
install. Every persona, screen and component is parsed from the spec and
rendered with full backlog-ID traceability; a handful of screens (dashboards,
the manager team view, an observation flow) are built out further to
demonstrate the 27 August design principles in something closer to real use.
Everything else renders as a structured inventory of what belongs on that
screen — which is what the source document asks PS to treat it as, not a
finished visual design.

## Run it

No install required. From this directory:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser (some browsers block
`fetch`-like script loading from `file://` — the local server avoids that).

## What's in here

- `index.html` — shell markup
- `assets/spec-data.js` — the full persona → screen → component data set,
  parsed verbatim from Section 5 and Section 7 of the specification
  (7 personas, 46 screens, 15 system-wide components, 8 design principles,
  301 backlog-traced components in total)
- `assets/app.js` — rendering & interaction logic (routing, search, quick
  actions, notifications, the hero screens)
- `assets/styles.css` — the design system used throughout

## Navigating it

- **Persona switcher** (top right) — jump between the seven personas
  (Colleague, Manager/Supervisor, Trainer/Assessor, Assessment Administrator,
  Competency Administrator, System Administrator, Leadership & Workforce
  Planning)
- **Sidebar** — every screen for the current persona, with its component count
- **Global search** — searches screen and component names/descriptions/story
  IDs across all personas
- **Quick actions** (Manager / Trainer personas) — the "one or two clicks from
  anywhere" pattern from the 27 August session
- **"About this prototype"** (info icon in the sidebar, or the logo) — Sections
  1, 3, 4, 5 and 6 of the spec: purpose, persona model, journey stages,
  system-wide components and design principles

## Notes on scope

- Names, dates, scores and team rosters on dashboard-style screens are
  illustrative mock data — not real Heathrow records.
- Section 8 (Traceability Appendix & Open Items) isn't rendered as its own
  screen; it covers non-screen-facing platform/architecture stories, which
  are out of scope for a UI prototype. Everything screen-facing from Sections
  5 and 7 is represented.
- This was generated for an internal working conversation with Publicis
  Sapient and the DBLX/HAL programme team — it does not use Heathrow's brand
  assets, only descriptive text.
