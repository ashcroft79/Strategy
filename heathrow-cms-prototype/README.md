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
- `assets/backlog-detail.js` — full acceptance-criteria detail for all 365
  backlog stories, parsed from the 26 August backlog workbook (System / CMS /
  Assessment User Stories sheets) — the source behind every component's detail
  drawer
- `assets/amendments.js` — the 65-entry amendments & placeholders log from the
  same workbook
- `assets/competency-scheme.js` — real competency-scheme content transcribed
  from the Security instance of the Training & Competence Scheme Manual (the
  Security Officer role profile, the 16-competency register, and the X-Ray
  Screening specification worked in full)
- `assets/app.js` — rendering & interaction logic (routing, search, quick
  actions, notifications, the hero screens, the detail drawer)
- `assets/styles.css` — the design system used throughout

## Navigating it

- **Persona switcher** (top right) — jump between the seven personas
  (Colleague, Manager/Supervisor, Trainer/Assessor, Assessment Administrator,
  Competency Administrator, System Administrator, Leadership & Workforce
  Planning)
- **Sidebar** — every screen for the current persona, with its component count,
  plus an "About this persona" link to that persona's write-up from Section 7
- **Click any component** (a card or a table row, on any screen) — opens a
  detail drawer with its real user story, full acceptance criteria,
  integration requirements and change notes, straight from the backlog
  workbook
- **Amendment references** (`A00`-style chips, wherever they appear in intros
  or story notes) — click one to see the amendment it came from
- **Global search** — searches screen and component names/descriptions/story
  IDs across all personas
- **Quick actions** (Manager / Trainer personas) — the "one or two clicks from
  anywhere" pattern from the 27 August session
- **Colleague → My Competency Record** — the real Security Officer competency
  set (16 competencies); click X-Ray Screening for its full specification
  (stages, requirements, maintaining-competence rules, failure & consequence
  escalation, overlays)
- **Competency Administrator → Competency Framework Builder** — the real
  Competency Register and Role Profile Register from the scheme manual
- **Manager → Individual Team Member Record** — an active restriction
  generated from X-Ray Screening's own tiered failure-consequence rule, not a
  fabricated example
- **"About this prototype"** (info icon in the sidebar, or the logo) — Sections
  1, 3, 4, 5 and 6 of the spec, plus what this prototype is grounded in and
  the full amendments log

## Notes on scope

- Per-person names, dates, scores and team rosters are illustrative mock
  data layered onto real competency/story content — not real Heathrow
  records.
- Section 8 (Traceability Appendix & Open Items) isn't rendered as its own
  screen; it covers non-screen-facing platform/architecture stories, which
  are out of scope for a UI prototype. Everything screen-facing from Sections
  5 and 7 is represented, and the amendments log (a close cousin of Section 8)
  is browsable from the About page.
- The scheme manual's Parts 1–2 prose is carried over from a shared template
  originally written for an Engineering business unit (it still refers to
  "Airside Technician" in places) — the Role Profile Register, Competency
  Register and X-Ray Screening specification are Security's own populated
  content, transcribed as drafted, "XX" placeholder pass marks included.
- Interaction patterns (session codes, active-session banners, colour-coded
  manipulation summaries, hierarchical catalogue browsing) take cues from the
  early wireframes supplied alongside the backlog and scheme manual, applied
  through this prototype's own design system rather than copied wholesale.
- This was generated for an internal working conversation with Publicis
  Sapient and the DBLX/HAL programme team — it does not use Heathrow's brand
  assets, only descriptive text.
