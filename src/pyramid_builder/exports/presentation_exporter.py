"""
Interactive HTML Presentation Exporter for Strategic Pyramids.

Generates a self-contained, multi-slide HTML presentation with
McKinsey/BCG-style professional design. Features:
- Keyboard navigation (arrow keys, space, escape)
- Touch/swipe support for mobile/tablet
- Click-to-drill-down exploration
- SVG-based diagrams and iconography
- Responsive design for projection and screen viewing
- Print-friendly styles
"""

from typing import Optional, List, Dict, Any
from pathlib import Path
import json
import html as html_lib

from ..models.pyramid import (
    StrategyPyramid,
    StrategicDriver,
    StrategicIntent,
    IconicCommitment,
    Enabler,
    TeamObjective,
    IndividualObjective,
)
from .design_system import DesignColors


def _esc(text: str) -> str:
    """HTML-escape a string."""
    return html_lib.escape(str(text)) if text else ""


class PresentationExporter:
    """Export pyramids to interactive HTML presentation."""

    def __init__(self, pyramid: StrategyPyramid):
        self.pyramid = pyramid
        self.colors = DesignColors
        self._driver_color_map = self._build_driver_colors()

    def _build_driver_colors(self) -> Dict[str, str]:
        """Assign distinct accent colors to each strategic driver."""
        palette = [
            "#1f4e79", "#c0392b", "#16a085", "#8e44ad",
            "#e67e22", "#2980b9", "#27ae60", "#d35400",
        ]
        mapping = {}
        for i, driver in enumerate(self.pyramid.strategic_drivers):
            mapping[str(driver.id)] = palette[i % len(palette)]
        return mapping

    def _get_driver_color(self, driver_id: str) -> str:
        return self._driver_color_map.get(str(driver_id), "#1f4e79")

    # ------------------------------------------------------------------
    # Lookup helpers
    # ------------------------------------------------------------------
    def _driver_name(self, driver_id) -> str:
        d = self.pyramid.get_driver_by_id(driver_id)
        return d.name if d else "Unknown"

    def _intents_for_driver(self, driver_id) -> List[StrategicIntent]:
        return [i for i in self.pyramid.strategic_intents if str(i.driver_id) == str(driver_id)]

    def _enablers_for_driver(self, driver_id) -> List[Enabler]:
        return [e for e in self.pyramid.enablers if str(driver_id) in [str(did) for did in e.driver_ids]]

    def _commitments_for_driver(self, driver_id, primary_only=True) -> List[IconicCommitment]:
        if primary_only:
            return [c for c in self.pyramid.iconic_commitments if str(c.primary_driver_id) == str(driver_id)]
        result = [c for c in self.pyramid.iconic_commitments if str(c.primary_driver_id) == str(driver_id)]
        for c in self.pyramid.iconic_commitments:
            for a in c.secondary_alignments:
                if str(a.target_id) == str(driver_id) and c not in result:
                    result.append(c)
        return result

    def _team_objectives_for_commitment(self, commitment_id) -> List[TeamObjective]:
        return [t for t in self.pyramid.team_objectives if str(t.primary_commitment_id) == str(commitment_id)]

    def _individual_objectives_for_team(self, team_id) -> List[IndividualObjective]:
        return [i for i in self.pyramid.individual_objectives if str(team_id) in [str(tid) for tid in i.team_objective_ids]]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def export(self, filepath: str) -> Path:
        """Export pyramid to self-contained HTML presentation file."""
        html_content = self._generate_html()
        filepath_obj = Path(filepath)
        filepath_obj.write_text(html_content, encoding="utf-8")
        return filepath_obj

    def export_to_string(self) -> str:
        """Export pyramid to HTML string."""
        return self._generate_html()

    # ------------------------------------------------------------------
    # Top-level HTML generation
    # ------------------------------------------------------------------
    def _generate_html(self) -> str:
        slides = []
        slides.append(self._slide_cover())
        slides.append(self._slide_executive_summary())
        slides.append(self._slide_purpose_overview())
        if self.pyramid.vision and self.pyramid.vision.statements:
            slides.append(self._slide_vision_detail())
        if self.pyramid.values:
            slides.append(self._slide_values())
        if self.pyramid.behaviours:
            slides.append(self._slide_behaviours())
        slides.append(self._slide_strategy_overview())
        for driver in self.pyramid.strategic_drivers:
            slides.append(self._slide_driver_deep_dive(driver))
        if self.pyramid.enablers:
            slides.append(self._slide_enablers())
        slides.append(self._slide_execution_overview())
        if self.pyramid.iconic_commitments:
            slides.append(self._slide_time_horizons())
        if self.pyramid.team_objectives:
            slides.append(self._slide_team_cascade())
        if self.pyramid.individual_objectives:
            slides.append(self._slide_individual_cascade())
        slides.append(self._slide_strategic_alignment())
        slides.append(self._slide_closing())

        slides_html = "\n".join(slides)
        total = len(slides)

        nav_dots = "".join(
            f'<button class="nav-dot" data-slide="{i}" onclick="goToSlide({i})" '
            f'aria-label="Go to slide {i+1}"></button>'
            for i in range(total)
        )

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{_esc(self.pyramid.metadata.project_name)} — Presentation</title>
{self._css()}
</head>
<body>
<div id="presentation" class="presentation">
{slides_html}
</div>

<!-- Navigation -->
<nav class="slide-nav" id="slideNav">
  <button class="nav-btn" onclick="prevSlide()" aria-label="Previous slide">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
  </button>
  <div class="nav-dots" id="navDots">
    {nav_dots}
  </div>
  <button class="nav-btn" onclick="nextSlide()" aria-label="Next slide">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
  </button>
  <span class="nav-counter" id="navCounter">1 / {total}</span>
</nav>

<!-- Overlay for drill-down panels -->
<div class="overlay" id="overlay" onclick="closePanel()"></div>
<div class="detail-panel" id="detailPanel">
  <button class="panel-close" onclick="closePanel()" aria-label="Close">&times;</button>
  <div class="panel-content" id="panelContent"></div>
</div>

{self._javascript(total)}
</body>
</html>"""

    # ------------------------------------------------------------------
    # CSS
    # ------------------------------------------------------------------
    def _css(self) -> str:
        c = self.colors
        return f"""<style>
/* ================================================================
   RESET & BASE
   ================================================================ */
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {{
  --primary: {c.PRIMARY.to_hex()};
  --primary-light: {c.PRIMARY_LIGHT.to_hex()};
  --primary-dark: {c.PRIMARY_DARK.to_hex()};
  --secondary: {c.SECONDARY.to_hex()};
  --accent: {c.ACCENT.to_hex()};
  --h1-color: {c.HORIZON_H1.to_hex()};
  --h2-color: {c.HORIZON_H2.to_hex()};
  --h3-color: {c.HORIZON_H3.to_hex()};
  --tier-vision: {c.TIER_FOUNDATION.to_hex()};
  --tier-values: {c.TIER_VALUES.to_hex()};
  --tier-behaviours: {c.TIER_BEHAVIOURS.to_hex()};
  --tier-drivers: {c.TIER_DRIVERS.to_hex()};
  --tier-intents: {c.TIER_INTENTS.to_hex()};
  --tier-enablers: {c.TIER_ENABLERS.to_hex()};
  --tier-commitments: {c.TIER_COMMITMENTS.to_hex()};
  --tier-team: {c.TIER_TEAM.to_hex()};
  --tier-individual: {c.TIER_INDIVIDUAL.to_hex()};
  --text: {c.TEXT_PRIMARY.to_hex()};
  --text-muted: {c.TEXT_SECONDARY.to_hex()};
  --text-light: {c.TEXT_LIGHT.to_hex()};
  --bg: #ffffff;
  --bg-alt: {c.BACKGROUND_ALT.to_hex()};
  --border: {c.BORDER.to_hex()};
  --border-light: {c.BORDER_LIGHT.to_hex()};
  --success: {c.SUCCESS.to_hex()};
  --warning: {c.WARNING.to_hex()};
  --error: {c.ERROR.to_hex()};
  --info: {c.INFO.to_hex()};
}}

html {{ font-size: 16px; -webkit-font-smoothing: antialiased; }}
body {{
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  background: #0a0a0a;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}}

/* ================================================================
   SLIDE FRAMEWORK
   ================================================================ */
.presentation {{
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}}

.slide {{
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateX(40px);
  overflow-y: auto;
  padding: 60px 80px 80px;
}}

.slide.active {{
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  z-index: 10;
}}

.slide.prev {{
  transform: translateX(-40px);
}}

/* ================================================================
   NAVIGATION
   ================================================================ */
.slide-nav {{
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(44, 62, 80, 0.92);
  backdrop-filter: blur(12px);
  padding: 10px 20px;
  border-radius: 40px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}}

.nav-btn {{
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}}
.nav-btn:hover {{ background: rgba(255,255,255,0.15); color: #fff; }}

.nav-dots {{
  display: flex;
  gap: 6px;
  align-items: center;
}}

.nav-dot {{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}}
.nav-dot.active {{
  background: var(--accent);
  width: 24px;
  border-radius: 4px;
}}

.nav-counter {{
  color: rgba(255,255,255,0.6);
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 44px;
  text-align: center;
  letter-spacing: 0.05em;
}}

/* ================================================================
   DETAIL PANEL (drill-down)
   ================================================================ */
.overlay {{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}}
.overlay.open {{ opacity: 1; visibility: visible; }}

.detail-panel {{
  position: fixed;
  top: 0;
  right: -540px;
  width: 520px;
  max-width: 90vw;
  height: 100vh;
  background: var(--bg);
  z-index: 210;
  box-shadow: -8px 0 40px rgba(0,0,0,0.2);
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  padding: 40px;
}}
.detail-panel.open {{ right: 0; }}

.panel-close {{
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-muted);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
}}
.panel-close:hover {{ background: var(--bg-alt); }}

.panel-content h3 {{
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}}
.panel-content .panel-subtitle {{
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 24px;
  font-weight: 400;
}}
.panel-content .panel-section {{
  margin-bottom: 24px;
}}
.panel-content .panel-section-title {{
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 10px;
}}
.panel-content .panel-item {{
  padding: 12px 16px;
  background: var(--bg-alt);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
}}
.panel-content .panel-metric {{
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 0.85rem;
}}
.panel-content .panel-metric::before {{
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}}

/* ================================================================
   TYPOGRAPHY
   ================================================================ */
.slide-label {{
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin-bottom: 12px;
}}

.slide-title {{
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}}

.slide-subtitle {{
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 680px;
  margin-bottom: 40px;
}}

h2 {{
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}}

h3 {{
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.3;
}}

/* ================================================================
   COVER SLIDE
   ================================================================ */
.cover {{
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
  color: #fff;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 100px;
  position: relative;
  overflow: hidden;
}}
.cover::before {{
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 500px;
  height: 500px;
  background: rgba(255,255,255,0.04);
  border-radius: 50%;
}}
.cover::after {{
  content: '';
  position: absolute;
  bottom: -80px;
  left: 30%;
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.03);
  border-radius: 50%;
}}
.cover .slide-label {{ color: rgba(255,255,255,0.6); }}
.cover .cover-org {{
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.7);
  margin-bottom: 48px;
}}
.cover .cover-title {{
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  max-width: 800px;
  letter-spacing: -0.03em;
}}
.cover .cover-desc {{
  font-size: 1.15rem;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255,255,255,0.8);
  max-width: 600px;
  margin-bottom: 48px;
}}
.cover .cover-meta {{
  display: flex;
  gap: 32px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.02em;
}}
.cover .cover-meta-item {{
  display: flex;
  align-items: center;
  gap: 8px;
}}
.cover .cover-divider {{
  width: 60px;
  height: 3px;
  background: var(--accent);
  margin-bottom: 32px;
  border-radius: 2px;
}}

/* ================================================================
   CARDS & GRIDS
   ================================================================ */
.card-grid {{
  display: grid;
  gap: 20px;
  flex: 1;
  align-content: start;
}}
.card-grid.cols-2 {{ grid-template-columns: repeat(2, 1fr); }}
.card-grid.cols-3 {{ grid-template-columns: repeat(3, 1fr); }}
.card-grid.cols-4 {{ grid-template-columns: repeat(4, 1fr); }}
.card-grid.cols-5 {{ grid-template-columns: repeat(5, 1fr); }}

.card {{
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}}
.card:hover {{
  border-color: var(--border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}}
.card.clickable {{ cursor: pointer; }}
.card.clickable:hover {{
  border-color: var(--primary-light);
  box-shadow: 0 6px 24px rgba(31,78,121,0.12);
}}

.card-accent {{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}}

.card-icon {{
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}}

.card-title {{
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.3;
}}

.card-text {{
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.55;
}}

.card-tag {{
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 4px;
  margin-top: 12px;
}}

/* ================================================================
   STAT BLOCKS
   ================================================================ */
.stats-row {{
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}}

.stat {{
  display: flex;
  flex-direction: column;
}}
.stat-value {{
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}}
.stat-label {{
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-top: 6px;
}}

/* ================================================================
   PYRAMID DIAGRAM (SVG)
   ================================================================ */
.pyramid-container {{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px 0;
}}

/* ================================================================
   TIME HORIZON BARS
   ================================================================ */
.horizon-section {{
  margin-bottom: 32px;
}}
.horizon-header {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}}
.horizon-badge {{
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}}
.horizon-label {{
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}}
.horizon-items {{
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 4px;
}}
.horizon-item {{
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: var(--bg-alt);
  border-radius: 8px;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}}
.horizon-item:hover {{
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}}
.horizon-item-name {{
  font-size: 0.88rem;
  font-weight: 600;
  flex: 1;
}}
.horizon-item-meta {{
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}}

/* ================================================================
   ALIGNMENT FLOW
   ================================================================ */
.alignment-flow {{
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}}
.flow-row {{
  display: flex;
  align-items: stretch;
  gap: 0;
  position: relative;
}}
.flow-tier {{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
}}
.flow-tier-label {{
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 6px;
}}
.flow-node {{
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 500;
  text-align: center;
  max-width: 160px;
  line-height: 1.35;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}}
.flow-node:hover {{
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}}
.flow-connector {{
  display: flex;
  align-items: center;
  padding: 0 4px;
  color: var(--border);
}}

/* ================================================================
   CLOSING SLIDE
   ================================================================ */
.closing {{
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: #fff;
  justify-content: center;
  align-items: center;
  text-align: center;
}}
.closing .cover-title {{ max-width: 700px; text-align: center; }}

/* ================================================================
   SECTION DIVIDER
   ================================================================ */
.section-divider {{
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}}
.section-line {{
  flex: 1;
  height: 1px;
  background: var(--border-light);
}}

/* ================================================================
   VALUE RING DIAGRAM
   ================================================================ */
.values-visual {{
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 20px 0;
}}
.value-card {{
  width: 180px;
  text-align: center;
  padding: 32px 20px;
  border-radius: 16px;
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  cursor: pointer;
}}
.value-card:hover {{
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border-color: var(--tier-values);
}}
.value-icon {{
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}}
.value-name {{
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}}
.value-desc {{
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.5;
}}

/* ================================================================
   BEHAVIOUR ITEMS
   ================================================================ */
.behaviour-list {{
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}}
.behaviour-item {{
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 24px;
  background: var(--bg-alt);
  border-radius: 10px;
  border-left: 3px solid var(--tier-behaviours);
  transition: all 0.2s;
}}
.behaviour-item:hover {{
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}}
.behaviour-num {{
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--tier-behaviours);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}}
.behaviour-text {{
  font-size: 0.88rem;
  line-height: 1.55;
  flex: 1;
}}

/* ================================================================
   ENABLER MATRIX
   ================================================================ */
.enabler-matrix {{
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  flex: 1;
  align-content: start;
}}
.enabler-card {{
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  transition: all 0.25s;
  cursor: pointer;
}}
.enabler-card:hover {{
  border-color: var(--tier-enablers);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}}
.enabler-type {{
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tier-enablers);
  margin-bottom: 8px;
}}
.enabler-name {{
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 6px;
}}
.enabler-desc {{
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 12px;
}}
.enabler-drivers {{
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}}
.enabler-driver-tag {{
  font-size: 0.65rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  color: #fff;
}}

/* ================================================================
   TEAM CASCADE TABLE
   ================================================================ */
.cascade-table {{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.82rem;
  flex: 1;
}}
.cascade-table th {{
  text-align: left;
  padding: 10px 16px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  border-bottom: 2px solid var(--border-light);
}}
.cascade-table td {{
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  vertical-align: top;
}}
.cascade-table tr {{
  cursor: pointer;
  transition: background 0.15s;
}}
.cascade-table tbody tr:hover {{
  background: var(--bg-alt);
}}

/* ================================================================
   RESPONSIVE
   ================================================================ */
@media (max-width: 1024px) {{
  .slide {{ padding: 40px 48px 70px; }}
  .cover {{ padding: 60px; }}
  .cover .cover-title {{ font-size: 2.5rem; }}
  .slide-title {{ font-size: 2rem; }}
  .card-grid.cols-4 {{ grid-template-columns: repeat(2, 1fr); }}
  .card-grid.cols-3 {{ grid-template-columns: repeat(2, 1fr); }}
}}

@media (max-width: 768px) {{
  .slide {{ padding: 32px 24px 70px; }}
  .cover {{ padding: 40px 32px; }}
  .cover .cover-title {{ font-size: 1.8rem; }}
  .slide-title {{ font-size: 1.5rem; }}
  .card-grid.cols-2,
  .card-grid.cols-3,
  .card-grid.cols-4 {{ grid-template-columns: 1fr; }}
  .stats-row {{ gap: 20px; }}
  .values-visual {{ gap: 12px; }}
  .value-card {{ width: 140px; padding: 20px 12px; }}
  .detail-panel {{ width: 100vw; max-width: 100vw; }}
}}

/* ================================================================
   PRINT
   ================================================================ */
@media print {{
  body {{ background: #fff; overflow: visible; }}
  .slide {{
    position: relative;
    opacity: 1;
    visibility: visible;
    transform: none;
    page-break-after: always;
    height: auto;
    min-height: 100vh;
  }}
  .slide-nav, .overlay, .detail-panel {{ display: none; }}
}}
</style>"""

    # ------------------------------------------------------------------
    # JavaScript
    # ------------------------------------------------------------------
    def _javascript(self, total: int) -> str:
        # Build detail data for drill-down panels
        detail_data = self._build_detail_data()
        return f"""<script>
(function() {{
  const TOTAL = {total};
  let current = 0;

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.nav-dot');
  const counter = document.getElementById('navCounter');
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('detailPanel');
  const panelContent = document.getElementById('panelContent');

  // Detail data for drill-down
  const detailData = {json.dumps(detail_data, default=str)};

  function update() {{
    slides.forEach((s, i) => {{
      s.classList.remove('active', 'prev');
      if (i === current) s.classList.add('active');
      else if (i < current) s.classList.add('prev');
    }});
    dots.forEach((d, i) => {{
      d.classList.toggle('active', i === current);
    }});
    counter.textContent = (current + 1) + ' / ' + TOTAL;
  }}

  window.goToSlide = function(i) {{
    if (i >= 0 && i < TOTAL) {{ current = i; update(); }}
  }};
  window.nextSlide = function() {{
    if (current < TOTAL - 1) {{ current++; update(); }}
  }};
  window.prevSlide = function() {{
    if (current > 0) {{ current--; update(); }}
  }};

  // Keyboard
  document.addEventListener('keydown', function(e) {{
    if (panel.classList.contains('open')) {{
      if (e.key === 'Escape') closePanel();
      return;
    }}
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {{
      e.preventDefault(); nextSlide();
    }} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{
      e.preventDefault(); prevSlide();
    }} else if (e.key === 'Home') {{
      e.preventDefault(); goToSlide(0);
    }} else if (e.key === 'End') {{
      e.preventDefault(); goToSlide(TOTAL - 1);
    }} else if (e.key === 'Escape') {{
      // toggle nav visibility
      document.getElementById('slideNav').style.opacity =
        document.getElementById('slideNav').style.opacity === '0' ? '1' : '0';
    }}
  }});

  // Touch / swipe
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', function(e) {{
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }}, {{ passive: true }});
  document.addEventListener('touchend', function(e) {{
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {{
      if (dx < 0) nextSlide(); else prevSlide();
    }}
  }}, {{ passive: true }});

  // Detail panel
  window.showDetail = function(key) {{
    const data = detailData[key];
    if (!data) return;
    let html = '<h3>' + data.title + '</h3>';
    if (data.subtitle) html += '<p class="panel-subtitle">' + data.subtitle + '</p>';
    if (data.sections) {{
      data.sections.forEach(function(sec) {{
        html += '<div class="panel-section">';
        html += '<div class="panel-section-title">' + sec.title + '</div>';
        if (sec.items) {{
          sec.items.forEach(function(item) {{
            html += '<div class="panel-item">' + item + '</div>';
          }});
        }}
        if (sec.metrics) {{
          sec.metrics.forEach(function(m) {{
            html += '<div class="panel-metric">' + m + '</div>';
          }});
        }}
        html += '</div>';
      }});
    }}
    panelContent.innerHTML = html;
    overlay.classList.add('open');
    panel.classList.add('open');
  }};

  window.closePanel = function() {{
    overlay.classList.remove('open');
    panel.classList.remove('open');
  }};

  // Init
  update();
}})();
</script>"""

    # ------------------------------------------------------------------
    # Build detail data for drill-down panels
    # ------------------------------------------------------------------
    def _build_detail_data(self) -> Dict[str, Any]:
        data = {}

        # Driver details
        for driver in self.pyramid.strategic_drivers:
            key = f"driver-{driver.id}"
            intents = self._intents_for_driver(driver.id)
            enablers = self._enablers_for_driver(driver.id)
            commitments = self._commitments_for_driver(driver.id)
            sections = []
            if driver.rationale:
                sections.append({"title": "Rationale", "items": [driver.rationale]})
            if intents:
                sections.append({
                    "title": "Strategic Intents",
                    "items": [i.statement for i in intents]
                })
            if enablers:
                sections.append({
                    "title": "Enablers",
                    "items": [f"{e.name} — {e.description}" for e in enablers]
                })
            if commitments:
                sections.append({
                    "title": "Iconic Commitments",
                    "items": [f"[{c.horizon.value}] {c.name}" for c in commitments]
                })
            data[key] = {
                "title": driver.name,
                "subtitle": driver.description,
                "sections": sections,
            }

        # Commitment details
        for commitment in self.pyramid.iconic_commitments:
            key = f"commitment-{commitment.id}"
            teams = self._team_objectives_for_commitment(commitment.id)
            sections = [{"title": "Description", "items": [commitment.description]}]
            meta = []
            if commitment.target_date:
                meta.append(f"Target: {commitment.target_date}")
            if commitment.owner:
                meta.append(f"Owner: {commitment.owner}")
            meta.append(f"Horizon: {commitment.horizon.value}")
            driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
            if driver:
                meta.append(f"Primary Driver: {driver.name}")
            sections.append({"title": "Details", "metrics": meta})
            if teams:
                sections.append({
                    "title": "Team Objectives",
                    "items": [f"{t.team_name}: {t.name}" for t in teams]
                })
            data[key] = {
                "title": commitment.name,
                "subtitle": f"{commitment.horizon.value} Commitment",
                "sections": sections,
            }

        # Team objective details
        for team_obj in self.pyramid.team_objectives:
            key = f"team-{team_obj.id}"
            individuals = self._individual_objectives_for_team(team_obj.id)
            sections = [{"title": "Description", "items": [team_obj.description]}]
            if team_obj.metrics:
                sections.append({"title": "Metrics", "metrics": team_obj.metrics})
            if team_obj.owner:
                sections.append({"title": "Owner", "items": [team_obj.owner]})
            if individuals:
                sections.append({
                    "title": "Individual Contributions",
                    "items": [f"{ind.individual_name}: {ind.name}" for ind in individuals]
                })
            data[key] = {
                "title": team_obj.name,
                "subtitle": team_obj.team_name,
                "sections": sections,
            }

        # Individual objective details
        for ind_obj in self.pyramid.individual_objectives:
            key = f"individual-{ind_obj.id}"
            sections = [{"title": "Description", "items": [ind_obj.description]}]
            if ind_obj.success_criteria:
                sections.append({"title": "Success Criteria", "metrics": ind_obj.success_criteria})
            data[key] = {
                "title": ind_obj.name,
                "subtitle": ind_obj.individual_name,
                "sections": sections,
            }

        # Value details
        for value in self.pyramid.values:
            key = f"value-{value.id}"
            related_behaviours = [
                b for b in self.pyramid.behaviours
                if str(value.id) in [str(vid) for vid in b.value_ids]
            ]
            sections = []
            if value.description:
                sections.append({"title": "Description", "items": [value.description]})
            if related_behaviours:
                sections.append({
                    "title": "Demonstrated Through",
                    "items": [b.statement for b in related_behaviours]
                })
            data[key] = {
                "title": value.name,
                "subtitle": "Core Value",
                "sections": sections,
            }

        # Enabler details
        for enabler in self.pyramid.enablers:
            key = f"enabler-{enabler.id}"
            driver_names = [
                self._driver_name(did) for did in enabler.driver_ids
            ]
            sections = [{"title": "Description", "items": [enabler.description]}]
            if enabler.enabler_type:
                sections.append({"title": "Type", "items": [enabler.enabler_type]})
            if driver_names:
                sections.append({"title": "Supports Drivers", "metrics": driver_names})
            data[key] = {
                "title": enabler.name,
                "subtitle": enabler.enabler_type or "Enabler",
                "sections": sections,
            }

        return data

    # ------------------------------------------------------------------
    # SVG Icons (inline)
    # ------------------------------------------------------------------
    def _icon_svg(self, name: str, size: int = 20, color: str = "currentColor") -> str:
        icons = {
            "vision": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="3"/></svg>',
            "values": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
            "behaviours": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            "drivers": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
            "intents": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            "enablers": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
            "commitments": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
            "team": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
            "individual": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
            "arrow-right": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
            "calendar": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            "target": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
            "link": f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        }
        return icons.get(name, "")

    # ------------------------------------------------------------------
    # SLIDE GENERATORS
    # ------------------------------------------------------------------

    def _slide_cover(self) -> str:
        meta = self.pyramid.metadata
        version = f"v{meta.version}" if meta.version else ""
        created = meta.created_at.strftime("%B %Y") if meta.created_at else ""
        return f"""<div class="slide cover active">
  <div class="cover-org">{_esc(meta.organization)}</div>
  <div class="cover-divider"></div>
  <div class="cover-title">{_esc(meta.project_name)}</div>
  <div class="cover-desc">{_esc(meta.description or '')}</div>
  <div class="cover-meta">
    <div class="cover-meta-item">{self._icon_svg('calendar', 14, 'rgba(255,255,255,0.5)')} <span>{_esc(created)}</span></div>
    <div class="cover-meta-item">{self._icon_svg('individual', 14, 'rgba(255,255,255,0.5)')} <span>{_esc(meta.created_by)}</span></div>
    <div class="cover-meta-item"><span>{_esc(version)}</span></div>
  </div>
</div>"""

    def _slide_executive_summary(self) -> str:
        p = self.pyramid
        num_vision = len(p.vision.statements) if p.vision else 0
        num_values = len(p.values)
        num_drivers = len(p.strategic_drivers)
        num_commitments = len(p.iconic_commitments)
        num_teams = len(p.team_objectives)
        num_individuals = len(p.individual_objectives)

        # Build pyramid SVG
        pyramid_svg = self._build_pyramid_svg()

        return f"""<div class="slide">
  <div class="slide-label">Executive Summary</div>
  <div class="slide-title">Strategic Architecture</div>
  <div class="slide-subtitle">A complete 9-tier strategy framework connecting purpose through to individual action.</div>
  <div class="stats-row">
    <div class="stat"><span class="stat-value" style="color:var(--tier-vision)">{num_vision}</span><span class="stat-label">Purpose Statements</span></div>
    <div class="stat"><span class="stat-value" style="color:var(--tier-values)">{num_values}</span><span class="stat-label">Core Values</span></div>
    <div class="stat"><span class="stat-value" style="color:var(--tier-drivers)">{num_drivers}</span><span class="stat-label">Strategic Drivers</span></div>
    <div class="stat"><span class="stat-value" style="color:var(--tier-commitments)">{num_commitments}</span><span class="stat-label">Iconic Commitments</span></div>
    <div class="stat"><span class="stat-value" style="color:var(--tier-team)">{num_teams}</span><span class="stat-label">Team Objectives</span></div>
    <div class="stat"><span class="stat-value" style="color:var(--tier-individual)">{num_individuals}</span><span class="stat-label">Individual Objectives</span></div>
  </div>
  <div class="pyramid-container">
    {pyramid_svg}
  </div>
</div>"""

    def _build_pyramid_svg(self) -> str:
        """Build an SVG pyramid diagram showing all 9 tiers."""
        w, h = 700, 400
        tiers = [
            ("Purpose", "var(--tier-vision)", 1),
            ("Values", "var(--tier-values)", 2),
            ("Behaviours", "var(--tier-behaviours)", 3),
            ("Strategic Drivers", "var(--tier-drivers)", 4),
            ("Strategic Intents", "var(--tier-intents)", 5),
            ("Enablers", "var(--tier-enablers)", 6),
            ("Iconic Commitments", "var(--tier-commitments)", 7),
            ("Team Objectives", "var(--tier-team)", 8),
            ("Individual Objectives", "var(--tier-individual)", 9),
        ]
        rows = ""
        tier_height = h / len(tiers)
        cx = w / 2
        for i, (name, color, tier_num) in enumerate(tiers):
            y = i * tier_height
            # Pyramid narrows towards top
            factor = 0.25 + 0.75 * (i / (len(tiers) - 1))
            half_w = (w / 2) * factor
            x1 = cx - half_w
            x2 = cx + half_w
            rows += f'''<rect x="{x1:.0f}" y="{y + 2:.0f}" width="{x2 - x1:.0f}" height="{tier_height - 4:.0f}" rx="4" fill="{color}" opacity="0.9"/>'''
            rows += f'''<text x="{cx:.0f}" y="{y + tier_height/2 + 5:.0f}" text-anchor="middle" fill="#fff" font-size="12" font-weight="600" font-family="Inter, sans-serif">{name}</text>'''

        # Section labels
        sections = [
            ("THE WHY", 0, 3),
            ("THE HOW", 3, 3),
            ("THE WHAT", 6, 3),
        ]
        section_labels = ""
        for label, start, count in sections:
            y_mid = (start + count / 2) * tier_height
            section_labels += f'''<text x="8" y="{y_mid:.0f}" fill="var(--text-muted)" font-size="9" font-weight="700" font-family="Inter, sans-serif" letter-spacing="0.15em">{label}</text>'''

        return f'''<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">
{section_labels}
{rows}
</svg>'''

    def _slide_purpose_overview(self) -> str:
        vision_text = ""
        if self.pyramid.vision and self.pyramid.vision.statements:
            v = self.pyramid.vision.get_statements_ordered()[0]
            vision_text = v.statement

        values_html = ""
        for val in self.pyramid.values[:5]:
            color = self.colors.TIER_VALUES.to_hex()
            values_html += f'''<div class="value-card" onclick="showDetail('value-{val.id}')">
  <div class="value-icon" style="background:{color}15;color:{color};">{self._icon_svg('values', 24, color)}</div>
  <div class="value-name">{_esc(val.name)}</div>
  <div class="value-desc">{_esc(val.description or '')[:80]}{"..." if val.description and len(val.description) > 80 else ""}</div>
</div>'''

        return f"""<div class="slide">
  <div class="slide-label">Section 1 — Purpose</div>
  <div class="slide-title">The Why</div>
  <div class="slide-subtitle">{_esc(vision_text)}</div>
  <div class="values-visual">
    {values_html}
  </div>
</div>"""

    def _slide_vision_detail(self) -> str:
        statements_html = ""
        if self.pyramid.vision:
            for stmt in self.pyramid.vision.get_statements_ordered():
                stype = stmt.statement_type.value.title()
                color = self.colors.TIER_FOUNDATION.to_hex()
                statements_html += f"""<div class="card">
  <div class="card-accent" style="background:{color}"></div>
  <div class="card-tag" style="background:{color}15;color:{color}">{_esc(stype)}</div>
  <div style="margin-top:12px;font-size:1.05rem;line-height:1.6;font-weight:400">{_esc(stmt.statement)}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 1 — Foundation</div>
  <div class="slide-title">Vision, Mission &amp; Purpose</div>
  <div class="slide-subtitle">The foundational statements that define why we exist and what we aspire to become.</div>
  <div class="card-grid cols-{min(len(self.pyramid.vision.statements) if self.pyramid.vision else 1, 3)}">
    {statements_html}
  </div>
</div>"""

    def _slide_values(self) -> str:
        cards = ""
        icons = ["values", "target", "vision", "intents", "link"]
        for i, val in enumerate(self.pyramid.values):
            color = self.colors.TIER_VALUES.to_hex()
            icon_name = icons[i % len(icons)]
            cards += f"""<div class="card clickable" onclick="showDetail('value-{val.id}')">
  <div class="card-accent" style="background:{color}"></div>
  <div class="card-icon" style="background:{color}12;color:{color}">{self._icon_svg(icon_name, 22, color)}</div>
  <div class="card-title">{_esc(val.name)}</div>
  <div class="card-text">{_esc(val.description or '')}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 2 — Values</div>
  <div class="slide-title">What We Stand For</div>
  <div class="slide-subtitle">The core principles that guide our decisions and define our culture.</div>
  <div class="card-grid cols-{min(len(self.pyramid.values), 5)}">
    {cards}
  </div>
</div>"""

    def _slide_behaviours(self) -> str:
        items_html = ""
        for i, b in enumerate(self.pyramid.behaviours, 1):
            value_names = []
            for vid in b.value_ids:
                for v in self.pyramid.values:
                    if str(v.id) == str(vid):
                        value_names.append(v.name)
            tags = " ".join(
                f'<span style="font-size:0.68rem;background:var(--tier-values);color:#fff;padding:2px 8px;border-radius:3px;font-weight:600;margin-left:4px">{_esc(n)}</span>'
                for n in value_names
            )
            items_html += f"""<div class="behaviour-item">
  <div class="behaviour-num">{i}</div>
  <div class="behaviour-text">{_esc(b.statement)} {tags}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 3 — Behaviours</div>
  <div class="slide-title">How We Show Up</div>
  <div class="slide-subtitle">Observable actions that demonstrate our values in practice.</div>
  <div class="behaviour-list">
    {items_html}
  </div>
</div>"""

    def _slide_strategy_overview(self) -> str:
        driver_cards = ""
        for driver in self.pyramid.strategic_drivers:
            color = self._get_driver_color(str(driver.id))
            num_intents = len(self._intents_for_driver(driver.id))
            num_commitments = len(self._commitments_for_driver(driver.id))
            driver_cards += f"""<div class="card clickable" onclick="showDetail('driver-{driver.id}')">
  <div class="card-accent" style="background:{color}"></div>
  <div class="card-icon" style="background:{color}15;color:{color}">{self._icon_svg('drivers', 22, color)}</div>
  <div class="card-title">{_esc(driver.name)}</div>
  <div class="card-text">{_esc(driver.description[:120])}{"..." if len(driver.description) > 120 else ""}</div>
  <div style="display:flex;gap:12px;margin-top:14px;">
    <span class="card-tag" style="background:{color}12;color:{color}">{num_intents} Intent{"s" if num_intents != 1 else ""}</span>
    <span class="card-tag" style="background:{color}12;color:{color}">{num_commitments} Commitment{"s" if num_commitments != 1 else ""}</span>
  </div>
</div>"""

        cols = min(len(self.pyramid.strategic_drivers), 4)
        return f"""<div class="slide">
  <div class="slide-label">Section 2 — Strategy</div>
  <div class="slide-title">Strategic Drivers</div>
  <div class="slide-subtitle">The 3-5 focus areas that will guide our strategic choices and resource allocation.</div>
  <div class="card-grid cols-{cols}">
    {driver_cards}
  </div>
</div>"""

    def _slide_driver_deep_dive(self, driver: StrategicDriver) -> str:
        color = self._get_driver_color(str(driver.id))
        intents = self._intents_for_driver(driver.id)
        commitments = self._commitments_for_driver(driver.id)
        enablers = self._enablers_for_driver(driver.id)

        # Intents column
        intents_html = ""
        for intent in intents:
            intents_html += f"""<div class="card" style="padding:18px;margin-bottom:10px;">
  <div style="font-size:0.82rem;line-height:1.55;font-style:italic;color:var(--text);">"{_esc(intent.statement)}"</div>
</div>"""

        # Commitments column
        commitments_html = ""
        for c in commitments:
            h_color = {"H1": "var(--h1-color)", "H2": "var(--h2-color)", "H3": "var(--h3-color)"}.get(c.horizon.value, "var(--primary)")
            commitments_html += f"""<div class="card clickable" style="padding:16px;margin-bottom:10px;" onclick="showDetail('commitment-{c.id}')">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
    <span class="horizon-badge" style="background:{h_color}">{c.horizon.value}</span>
    <span style="font-size:0.75rem;color:var(--text-muted)">{_esc(c.target_date or '')}</span>
  </div>
  <div style="font-size:0.85rem;font-weight:600">{_esc(c.name)}</div>
</div>"""

        # Enablers column
        enablers_html = ""
        for e in enablers:
            enablers_html += f"""<div class="card clickable" style="padding:16px;margin-bottom:10px;" onclick="showDetail('enabler-{e.id}')">
  <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--tier-enablers);margin-bottom:4px">{_esc(e.enabler_type or 'Enabler')}</div>
  <div style="font-size:0.85rem;font-weight:600">{_esc(e.name)}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label" style="color:{color}">Strategic Driver Deep Dive</div>
  <div class="slide-title" style="display:flex;align-items:center;gap:16px;">
    <span style="width:10px;height:10px;border-radius:3px;background:{color};display:inline-block;flex-shrink:0"></span>
    {_esc(driver.name)}
  </div>
  <div class="slide-subtitle">{_esc(driver.description)}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;flex:1;align-content:start;">
    <div>
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:12px;">Strategic Intents</div>
      {intents_html or '<div style="font-size:0.82rem;color:var(--text-light)">No intents defined</div>'}
    </div>
    <div>
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:12px;">Iconic Commitments</div>
      {commitments_html or '<div style="font-size:0.82rem;color:var(--text-light)">No commitments defined</div>'}
    </div>
    <div>
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:12px;">Enablers</div>
      {enablers_html or '<div style="font-size:0.82rem;color:var(--text-light)">No enablers defined</div>'}
    </div>
  </div>
</div>"""

    def _slide_enablers(self) -> str:
        cards_html = ""
        for enabler in self.pyramid.enablers:
            driver_tags = ""
            for did in enabler.driver_ids:
                color = self._get_driver_color(str(did))
                name = self._driver_name(did)
                driver_tags += f'<span class="enabler-driver-tag" style="background:{color}">{_esc(name)}</span>'

            cards_html += f"""<div class="enabler-card" onclick="showDetail('enabler-{enabler.id}')">
  <div class="enabler-type">{_esc(enabler.enabler_type or 'Enabler')}</div>
  <div class="enabler-name">{_esc(enabler.name)}</div>
  <div class="enabler-desc">{_esc(enabler.description[:120])}{"..." if len(enabler.description) > 120 else ""}</div>
  <div class="enabler-drivers">{driver_tags}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 6 — Enablers</div>
  <div class="slide-title">What Makes Strategy Possible</div>
  <div class="slide-subtitle">The systems, capabilities, and resources that underpin strategic execution.</div>
  <div class="enabler-matrix">
    {cards_html}
  </div>
</div>"""

    def _slide_execution_overview(self) -> str:
        h1 = [c for c in self.pyramid.iconic_commitments if c.horizon.value == "H1"]
        h2 = [c for c in self.pyramid.iconic_commitments if c.horizon.value == "H2"]
        h3 = [c for c in self.pyramid.iconic_commitments if c.horizon.value == "H3"]

        return f"""<div class="slide">
  <div class="slide-label">Section 3 — Execution</div>
  <div class="slide-title">The What</div>
  <div class="slide-subtitle">Translating strategy into tangible outcomes through iconic commitments, team objectives, and individual contributions.</div>
  <div class="stats-row" style="margin-top:16px">
    <div class="stat">
      <span class="stat-value" style="color:var(--h1-color)">{len(h1)}</span>
      <span class="stat-label">H1 — Now to 12 months</span>
    </div>
    <div class="stat">
      <span class="stat-value" style="color:var(--h2-color)">{len(h2)}</span>
      <span class="stat-label">H2 — 12 to 24 months</span>
    </div>
    <div class="stat">
      <span class="stat-value" style="color:var(--h3-color)">{len(h3)}</span>
      <span class="stat-label">H3 — 24 to 36 months</span>
    </div>
  </div>
  <div class="stats-row">
    <div class="stat">
      <span class="stat-value" style="color:var(--tier-team)">{len(self.pyramid.team_objectives)}</span>
      <span class="stat-label">Team Objectives</span>
    </div>
    <div class="stat">
      <span class="stat-value" style="color:var(--tier-individual)">{len(self.pyramid.individual_objectives)}</span>
      <span class="stat-label">Individual Objectives</span>
    </div>
  </div>
  <div class="card-grid cols-3" style="flex:1;align-content:start;">
    <div class="card" style="border-left:4px solid var(--h1-color);">
      <div class="card-title" style="color:var(--h1-color)">Horizon 1</div>
      <div class="card-text">Immediate priorities delivering quick wins and foundational capabilities within the next 12 months.</div>
    </div>
    <div class="card" style="border-left:4px solid var(--h2-color);">
      <div class="card-title" style="color:var(--h2-color)">Horizon 2</div>
      <div class="card-text">Growth initiatives building on H1 foundations, expanding capabilities and market position over 12-24 months.</div>
    </div>
    <div class="card" style="border-left:4px solid var(--h3-color);">
      <div class="card-title" style="color:var(--h3-color)">Horizon 3</div>
      <div class="card-text">Transformational bets that reshape the organisation and industry over 24-36 months.</div>
    </div>
  </div>
</div>"""

    def _slide_time_horizons(self) -> str:
        horizons = {"H1": [], "H2": [], "H3": []}
        for c in self.pyramid.iconic_commitments:
            horizons.setdefault(c.horizon.value, []).append(c)

        sections_html = ""
        horizon_meta = {
            "H1": ("0–12 months", "var(--h1-color)"),
            "H2": ("12–24 months", "var(--h2-color)"),
            "H3": ("24–36 months", "var(--h3-color)"),
        }

        for hz in ["H1", "H2", "H3"]:
            items = horizons.get(hz, [])
            label, color = horizon_meta[hz]
            items_html = ""
            for c in items:
                driver_color = self._get_driver_color(str(c.primary_driver_id))
                driver_name = self._driver_name(c.primary_driver_id)
                items_html += f"""<div class="horizon-item" style="border-left-color:{driver_color}" onclick="showDetail('commitment-{c.id}')">
  <div class="horizon-item-name">{_esc(c.name)}</div>
  <div class="horizon-item-meta">{_esc(driver_name)} · {_esc(c.target_date or '')}</div>
</div>"""

            if items:
                sections_html += f"""<div class="horizon-section">
  <div class="horizon-header">
    <span class="horizon-badge" style="background:{color}">{hz}</span>
    <span class="horizon-label">{label}</span>
    <span class="horizon-label" style="margin-left:auto;font-weight:600">{len(items)} commitment{"s" if len(items) != 1 else ""}</span>
  </div>
  <div class="horizon-items">
    {items_html}
  </div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 7 — Iconic Commitments</div>
  <div class="slide-title">Time Horizon Roadmap</div>
  <div class="slide-subtitle">Strategic commitments organised by delivery timeline, with driver alignment shown.</div>
  {sections_html}
</div>"""

    def _slide_team_cascade(self) -> str:
        rows_html = ""
        for t in self.pyramid.team_objectives:
            commitment_name = ""
            if t.primary_commitment_id:
                c = self.pyramid.get_commitment_by_id(t.primary_commitment_id)
                if c:
                    commitment_name = c.name
            metrics_html = ", ".join(t.metrics[:3]) if t.metrics else "—"
            rows_html += f"""<tr onclick="showDetail('team-{t.id}')">
  <td style="font-weight:600">{_esc(t.name)}</td>
  <td>{_esc(t.team_name)}</td>
  <td style="font-size:0.78rem;color:var(--text-muted)">{_esc(commitment_name)}</td>
  <td style="font-size:0.78rem;color:var(--text-muted)">{_esc(metrics_html)}</td>
  <td style="font-size:0.78rem">{_esc(t.owner or '—')}</td>
</tr>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 8 — Team Objectives</div>
  <div class="slide-title">Team Cascade</div>
  <div class="slide-subtitle">How teams translate iconic commitments into departmental objectives with clear ownership and metrics.</div>
  <table class="cascade-table">
    <thead>
      <tr>
        <th>Objective</th>
        <th>Team</th>
        <th>Supports Commitment</th>
        <th>Key Metrics</th>
        <th>Owner</th>
      </tr>
    </thead>
    <tbody>
      {rows_html}
    </tbody>
  </table>
</div>"""

    def _slide_individual_cascade(self) -> str:
        rows_html = ""
        for ind in self.pyramid.individual_objectives:
            criteria = ", ".join(ind.success_criteria[:2]) if ind.success_criteria else "—"
            if len(ind.success_criteria) > 2:
                criteria += f" (+{len(ind.success_criteria)-2} more)"
            rows_html += f"""<tr onclick="showDetail('individual-{ind.id}')">
  <td style="font-weight:600">{_esc(ind.name)}</td>
  <td>{_esc(ind.individual_name)}</td>
  <td style="font-size:0.78rem;color:var(--text-muted)">{_esc(criteria)}</td>
</tr>"""

        return f"""<div class="slide">
  <div class="slide-label">Tier 9 — Individual Objectives</div>
  <div class="slide-title">Individual Contributions</div>
  <div class="slide-subtitle">Personal objectives connecting every team member to the strategic vision.</div>
  <table class="cascade-table">
    <thead>
      <tr>
        <th>Objective</th>
        <th>Individual</th>
        <th>Success Criteria</th>
      </tr>
    </thead>
    <tbody>
      {rows_html}
    </tbody>
  </table>
</div>"""

    def _slide_strategic_alignment(self) -> str:
        """Build a visual strategic alignment / golden thread slide."""
        flow_html = ""

        for driver in self.pyramid.strategic_drivers:
            color = self._get_driver_color(str(driver.id))
            intents = self._intents_for_driver(driver.id)
            commitments = self._commitments_for_driver(driver.id)

            # Build flow nodes
            intent_nodes = ""
            for intent in intents[:2]:
                short = intent.statement[:50] + ("..." if len(intent.statement) > 50 else "")
                intent_nodes += f'<div class="flow-node" style="background:var(--tier-intents)" title="{_esc(intent.statement)}">{_esc(short)}</div>'

            commitment_nodes = ""
            for c in commitments[:2]:
                commitment_nodes += f'<div class="flow-node" style="background:var(--tier-commitments);cursor:pointer" onclick="showDetail(\'commitment-{c.id}\')">{_esc(c.name[:40])}</div>'

            team_nodes = ""
            for c in commitments[:2]:
                teams = self._team_objectives_for_commitment(c.id)
                for t in teams[:1]:
                    team_nodes += f'<div class="flow-node" style="background:var(--tier-team);cursor:pointer" onclick="showDetail(\'team-{t.id}\')">{_esc(t.name[:40])}</div>'

            arrow = '<div class="flow-connector"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--border)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>'

            flow_html += f"""<div class="flow-row" style="min-height:90px;">
  <div class="flow-tier">
    <div class="flow-node" style="background:{color};cursor:pointer" onclick="showDetail('driver-{driver.id}')">{_esc(driver.name)}</div>
  </div>
  {arrow}
  <div class="flow-tier">{intent_nodes or '<div style="color:var(--text-light);font-size:0.75rem">—</div>'}</div>
  {arrow}
  <div class="flow-tier">{commitment_nodes or '<div style="color:var(--text-light);font-size:0.75rem">—</div>'}</div>
  {arrow}
  <div class="flow-tier">{team_nodes or '<div style="color:var(--text-light);font-size:0.75rem">—</div>'}</div>
</div>"""

        return f"""<div class="slide">
  <div class="slide-label">Strategic Alignment</div>
  <div class="slide-title">Golden Threads</div>
  <div class="slide-subtitle">Tracing the line of sight from strategic drivers through to team delivery.</div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:start;margin-bottom:16px;">
    <div class="flow-tier-label" style="text-align:center">Drivers</div>
    <div></div>
    <div class="flow-tier-label" style="text-align:center">Intents</div>
    <div></div>
    <div class="flow-tier-label" style="text-align:center">Commitments</div>
    <div></div>
    <div class="flow-tier-label" style="text-align:center">Teams</div>
  </div>
  <div class="alignment-flow">
    {flow_html}
  </div>
</div>"""

    def _slide_closing(self) -> str:
        org = self.pyramid.metadata.organization
        return f"""<div class="slide closing">
  <div class="cover-divider" style="margin:0 auto 24px;"></div>
  <div class="cover-title">{_esc(self.pyramid.metadata.project_name)}</div>
  <div class="cover-desc" style="text-align:center;margin:20px auto 0;">{_esc(org)}</div>
</div>"""
