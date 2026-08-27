/* ============================================================
   CMS & Assessment System — standalone click-through prototype
   Renders entirely from SPEC_DATA (assets/spec-data.js), which is
   parsed verbatim from the Screen & Component Specification.
   Numbers you see (names, dates, scores) on dashboard-style
   screens are illustrative mock data, clearly a prototype, not
   real Heathrow records.
   ============================================================ */

(function () {
  "use strict";

  // ---------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------
  function esc(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function moscowParts(moscowStr) {
    const parts = String(moscowStr || "").split("·").map((s) => s.trim());
    return { level: parts[0] || "", phase: parts[1] || "" };
  }

  function moscowClass(level) {
    switch (level) {
      case "Must": return "moscow-must";
      case "Should": return "moscow-should";
      case "Could": return "moscow-could";
      case "Won't": return "moscow-wont";
      default: return "moscow-could";
    }
  }

  function badge(moscowStr) {
    const { level, phase } = moscowParts(moscowStr);
    return `<span class="moscow-badge ${moscowClass(level)}">${esc(level)}</span><span class="phase-tag">${esc(phase)}</span>`;
  }

  function componentCard(c) {
    return `
      <div class="component-card">
        <div class="cc-top">
          <div class="cc-name">${esc(c.component)}</div>
          <span class="story-chip">${esc(c.storyId)}</span>
        </div>
        <div class="cc-what">${esc(c.what)}</div>
        <div class="cc-foot">${badge(c.moscow)}</div>
      </div>`;
  }

  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = el(`<div class="toast" id="toast"></div>`);
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ---------------------------------------------------------
  // Icons (inline SVG, no external assets)
  // ---------------------------------------------------------
  const ICONS = {
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    bolt: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    clipboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>',
    megaphone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h2l3.5 5V6L6 11H4a1 1 0 0 0-1 1z"/><path d="M14 8a4 4 0 0 1 0 8"/><path d="M17.5 5.5a8 8 0 0 1 0 13"/></svg>',
    userCheck: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',
    grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    info: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };
  function icon(name) { return ICONS[name] || ""; }

  // ---------------------------------------------------------
  // Persona presentation metadata
  // ---------------------------------------------------------
  const PERSONA_META = [
    { code: "CO", color: "#3b7dd8", title: "Colleague · Security Officer, T5" },
    { code: "MG", color: "#c07d0f", title: "Manager / Supervisor · Security" },
    { code: "TA", color: "#8a5cf6", title: "Trainer / Assessor · Security" },
    { code: "AA", color: "#0f9c8f", title: "Assessment Administrator" },
    { code: "CA", color: "#d13b2c", title: "Competency Administrator" },
    { code: "SA", color: "#344054", title: "System Administrator" },
    { code: "LW", color: "#1a9c5f", title: "Leadership & Workforce Planning" },
  ];

  const SD = window.SPEC_DATA;
  if (!SD) { document.write("SPEC_DATA failed to load"); throw new Error("SPEC_DATA missing"); }

  // Quick-actions panel is meaningful for personas with direct reports / delivery responsibility
  const QUICK_ACTION_PERSONAS = new Set([1, 2]); // Manager/Supervisor, Trainer/Assessor

  const QUICK_ACTIONS = [
    { icon: "eye", label: "Log an Observation", desc: "Field or group observation against a checklist" },
    { icon: "userCheck", label: "Record a One-to-One", desc: "Log a supervisory check-in for a team member" },
    { icon: "megaphone", label: "Log a Toolbox Talk / Briefing", desc: "Record attendance & link to competency maintenance" },
    { icon: "clipboard", label: "Send a Bulletin", desc: "Distribute a safety or operational bulletin" },
  ];

  const NOTIFICATIONS = [
    { level: "bad", title: "Confined Space Entry — expires in 4 days", sub: "Renewal assessment not yet booked", time: "2h ago" },
    { level: "warn", title: "TIP evaluation result received", sub: "Auto-logged from monthly TIP outcome feed", time: "5h ago" },
    { level: "good", title: "Manual Handling assessment passed", sub: "Certificate available to download", time: "1d ago" },
    { level: "warn", title: "Toolbox Talk acknowledgement due", sub: "“Lone working — revised procedure”", time: "1d ago" },
    { level: "good", title: "Q3 recurrent training scheduled", sub: "12 Sept, 09:00 — Training Suite 2", time: "3d ago" },
  ];

  // ---------------------------------------------------------
  // State + routing
  // ---------------------------------------------------------
  const state = {
    personaIdx: 0,
    screenIdx: 0,
    route: "screen", // 'screen' | 'about'
  };

  function personaSlug(p) { return slugify(p.name); }
  function screenSlug(s) { return slugify(s.name); }

  function navigate(personaIdx, screenIdx) {
    state.route = "screen";
    state.personaIdx = personaIdx;
    state.screenIdx = screenIdx;
    const p = SD.personas[personaIdx];
    const s = p.screens[screenIdx];
    location.hash = `#/${personaSlug(p)}/${screenSlug(s)}`;
    render();
    document.querySelector(".main").scrollTo?.(0, 0);
    window.scrollTo(0, 0);
    closeAllPanels();
  }

  function navigateAbout() {
    state.route = "about";
    location.hash = "#/about";
    render();
    window.scrollTo(0, 0);
    closeAllPanels();
  }

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    if (!h || h === "about") { state.route = h === "about" ? "about" : "screen"; if(!h){state.personaIdx=0;state.screenIdx=0;} return; }
    const [pSlug, sSlug] = h.split("/");
    const pIdx = SD.personas.findIndex((p) => personaSlug(p) === pSlug);
    if (pIdx === -1) return;
    const p = SD.personas[pIdx];
    const sIdx = Math.max(0, p.screens.findIndex((s) => screenSlug(s) === sSlug));
    state.route = "screen";
    state.personaIdx = pIdx;
    state.screenIdx = sIdx === -1 ? 0 : sIdx;
  }

  // ---------------------------------------------------------
  // Panels (dropdowns / modal)
  // ---------------------------------------------------------
  function closeAllPanels() {
    document.querySelectorAll(".dropdown-panel").forEach((n) => n.remove());
    document.querySelectorAll(".modal-backdrop").forEach((n) => n.remove());
  }

  function togglePanel(id, builder) {
    const existing = document.getElementById(id);
    closeAllPanels();
    if (existing) return; // was open -> just closed
    document.body.appendChild(builder());
    setTimeout(() => document.addEventListener("click", onOutsideClick), 0);
  }

  function onOutsideClick(e) {
    if (!e.target.closest(".dropdown-panel") && !e.target.closest(".icon-btn") && !e.target.closest(".persona-switch") && !e.target.closest(".quick-action-btn")) {
      closeAllPanels();
      document.removeEventListener("click", onOutsideClick);
    }
  }

  function openModal(title, bodyHtml, onSave) {
    closeAllPanels();
    const backdrop = el(`
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="mc-head"><h3>${esc(title)}</h3><button class="mc-close">&times;</button></div>
          <div class="mc-body">${bodyHtml}</div>
          <div class="mc-foot">
            <button class="btn btn-ghost" data-act="cancel">Cancel</button>
            <button class="btn btn-primary" data-act="save">Save</button>
          </div>
        </div>
      </div>`);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest(".mc-close") || e.target.closest('[data-act="cancel"]')) backdrop.remove();
      if (e.target.closest('[data-act="save"]')) { backdrop.remove(); onSave && onSave(); }
    });
    document.body.appendChild(backdrop);
  }

  function openQuickActionModal(qa) {
    openModal(qa.label, `
      <p style="margin-top:0;color:var(--ink-500)">${esc(qa.desc)}</p>
      <label>Team member</label>
      <select><option>Aisha Bello — Security Officer, T5</option><option>Marcus Reid — Security Officer, T3</option><option>Priya Shah — Engineering Technician</option></select>
      <label>Notes</label>
      <textarea rows="3" placeholder="Optional notes..."></textarea>
    `, () => toast(`${qa.label} saved (prototype — not persisted)`));
  }

  // ---------------------------------------------------------
  // Topbar
  // ---------------------------------------------------------
  function renderTopbar() {
    const persona = SD.personas[state.personaIdx];
    const meta = PERSONA_META[state.personaIdx];
    const showQA = QUICK_ACTION_PERSONAS.has(state.personaIdx);

    return `
      <div class="topbar">
        <button class="brand" id="brand-home" title="About this prototype">
          <div class="brand-mark">CMS</div>
          <div class="brand-text">
            <span class="b1">CMS &amp; Assessment System</span>
            <span class="b2">Heathrow People Transformation — prototype</span>
          </div>
        </button>
        <button class="icon-btn" id="sidebar-toggle" style="display:none" title="Menu">${icon("menu")}</button>
        <div class="global-search">
          ${icon("search")}
          <input type="text" id="global-search-input" placeholder="Search screens &amp; components across the platform&hellip;" autocomplete="off" />
          <div id="search-results-mount"></div>
        </div>
        <div class="topbar-spacer"></div>
        ${showQA ? `<button class="quick-action-btn" id="qa-btn">${icon("bolt")} Quick actions</button>` : ""}
        <button class="icon-btn" id="bell-btn" title="Notifications">${icon("bell")}<span class="badge-dot">${NOTIFICATIONS.length}</span></button>
        <button class="persona-switch" id="persona-btn" title="Switch persona (prototype device)">
          <div class="persona-avatar" style="background:${meta.color}">${meta.code}</div>
          <div class="ps-label">
            <div class="ps-name">${esc(persona.name)}</div>
            <div class="ps-role">Viewing as this persona</div>
          </div>
          ${icon("chevron")}
        </button>
      </div>`;
  }

  function buildSearchResults(query) {
    const q = query.trim().toLowerCase();
    const box = el(`<div class="search-results" id="search-results"></div>`);
    if (!q) { box.remove(); return null; }
    const hits = [];
    SD.personas.forEach((p, pi) => {
      p.screens.forEach((s, si) => {
        if (s.name.toLowerCase().includes(q)) {
          hits.push({ pi, si, title: s.name, path: `${p.name} — screen`, storyId: "" });
        }
        s.components.forEach((c) => {
          if (
            c.component.toLowerCase().includes(q) ||
            c.what.toLowerCase().includes(q) ||
            c.storyId.toLowerCase() === q
          ) {
            hits.push({ pi, si, title: c.component, path: `${p.name} → ${s.name}`, storyId: c.storyId });
          }
        });
      });
    });
    if (!hits.length) {
      box.innerHTML = `<div class="sr-empty">No screens or components match "${esc(query)}"</div>`;
    } else {
      box.innerHTML = hits.slice(0, 12).map((h) => `
        <button class="sr-item" data-pi="${h.pi}" data-si="${h.si}">
          <div class="sr-title">${esc(h.title)} ${h.storyId ? `<span class="story-chip">${esc(h.storyId)}</span>` : ""}</div>
          <div class="sr-path">${esc(h.path)}</div>
        </button>`).join("");
    }
    return box;
  }

  function wireTopbar() {
    document.getElementById("brand-home").addEventListener("click", navigateAbout);

    const searchInput = document.getElementById("global-search-input");
    const mount = document.getElementById("search-results-mount");
    searchInput.addEventListener("input", () => {
      mount.innerHTML = "";
      const box = buildSearchResults(searchInput.value);
      if (box) mount.appendChild(box);
    });
    searchInput.addEventListener("click", (e) => e.stopPropagation());
    mount.addEventListener("click", (e) => {
      const item = e.target.closest(".sr-item");
      if (!item) return;
      navigate(Number(item.dataset.pi), Number(item.dataset.si));
      searchInput.value = "";
      mount.innerHTML = "";
    });

    const qaBtn = document.getElementById("qa-btn");
    if (qaBtn) {
      qaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePanel("qa-panel", () => {
          const panel = el(`<div class="dropdown-panel" id="qa-panel"><div class="dp-head">Quick actions</div><div class="dp-body"></div></div>`);
          const body = panel.querySelector(".dp-body");
          QUICK_ACTIONS.forEach((qa) => {
            const item = el(`<div class="qa-item"><div class="qa-icon">${icon(qa.icon)}</div><div>${esc(qa.label)}</div></div>`);
            item.addEventListener("click", () => { closeAllPanels(); openQuickActionModal(qa); });
            body.appendChild(item);
          });
          return panel;
        });
      });
    }

    document.getElementById("bell-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      togglePanel("bell-panel", () => {
        const panel = el(`<div class="dropdown-panel" id="bell-panel"><div class="dp-head">Notifications</div><div class="dp-body"></div><div class="dp-foot">Notification settings (SYS-8)</div></div>`);
        const body = panel.querySelector(".dp-body");
        NOTIFICATIONS.forEach((n) => {
          body.appendChild(el(`
            <div class="notif-item">
              <div class="notif-dot dot-${n.level}"></div>
              <div>
                <div class="n-title">${esc(n.title)}</div>
                <div class="n-sub">${esc(n.sub)}</div>
                <div class="n-time">${esc(n.time)}</div>
              </div>
            </div>`));
        });
        panel.querySelector(".dp-foot").addEventListener("click", () => toast("Notification settings — SYS-8 (prototype)"));
        return panel;
      });
    });

    document.getElementById("persona-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      togglePanel("persona-panel", () => {
        const panel = el(`<div class="dropdown-panel" id="persona-panel"><div class="dp-head">Switch persona</div><div class="dp-body"></div></div>`);
        const body = panel.querySelector(".dp-body");
        SD.personas.forEach((p, i) => {
          const m = PERSONA_META[i];
          const compCount = p.screens.reduce((a, s) => a + s.components.length, 0);
          const opt = el(`
            <div class="persona-option ${i === state.personaIdx ? "active" : ""}">
              <div class="po-avatar" style="background:${m.color}">${m.code}</div>
              <div>
                <div class="po-name">${esc(p.name)}</div>
                <div class="po-count">${p.screens.length} screens · ${compCount} components</div>
              </div>
            </div>`);
          opt.addEventListener("click", () => navigate(i, 0));
          body.appendChild(opt);
        });
        return panel;
      });
    });
  }

  // ---------------------------------------------------------
  // Sidebar
  // ---------------------------------------------------------
  function renderSidebar() {
    if (state.route === "about") {
      return `
        <div class="sidebar" id="sidebar">
          <div class="sidebar-persona">
            <div class="sp-avatar">i</div>
            <div><div class="sp-name">About this prototype</div><div class="sp-tag">Sections 1–6 &amp; 8</div></div>
          </div>
          <div class="nav-section-label">Jump to</div>
          <div class="nav-item active" data-anchor="purpose">Purpose &amp; how to use</div>
          <div class="nav-item" data-anchor="principles">Design principles</div>
          <div class="nav-item" data-anchor="personas">Persona model</div>
          <div class="nav-item" data-anchor="stages">Journey stages</div>
          <div class="nav-item" data-anchor="systemwide">System-wide components</div>
          <div class="nav-footer-link" id="back-to-app">${icon("grid")} Back to the prototype</div>
        </div>`;
    }
    const persona = SD.personas[state.personaIdx];
    const meta = PERSONA_META[state.personaIdx];
    const items = persona.screens.map((s, i) => `
      <div class="nav-item ${i === state.screenIdx ? "active" : ""}" data-si="${i}">
        <div>
          ${esc(s.name)}
          <span class="ni-stage">${esc(s.stage)}</span>
        </div>
        <span class="ni-count">${s.components.length}</span>
      </div>`).join("");
    return `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-persona">
          <div class="sp-avatar" style="background:${meta.color}">${meta.code}</div>
          <div><div class="sp-name">${esc(persona.name)}</div><div class="sp-tag">${persona.screens.length} screens</div></div>
        </div>
        <div class="nav-section-label">Screens</div>
        ${items}
        <div class="nav-footer-link" id="about-link">${icon("info")} About this prototype</div>
      </div>`;
  }

  function wireSidebar() {
    if (state.route === "about") {
      document.getElementById("back-to-app").addEventListener("click", () => navigate(state.personaIdx, state.screenIdx));
      document.querySelectorAll("#sidebar .nav-item[data-anchor]").forEach((n) => {
        n.addEventListener("click", () => {
          document.querySelectorAll("#sidebar .nav-item").forEach((x) => x.classList.remove("active"));
          n.classList.add("active");
          document.getElementById("anchor-" + n.dataset.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      return;
    }
    document.querySelectorAll("#sidebar .nav-item[data-si]").forEach((n) => {
      n.addEventListener("click", () => navigate(state.personaIdx, Number(n.dataset.si)));
    });
    document.getElementById("about-link").addEventListener("click", navigateAbout);
  }

  // ---------------------------------------------------------
  // Generic screen chrome
  // ---------------------------------------------------------
  function screenHeader(persona, screen, extraMeta) {
    const counts = { Must: 0, Should: 0, Could: 0, "Won't": 0 };
    screen.components.forEach((c) => { counts[moscowParts(c.moscow).level]++; });
    return `
      <div class="screen-header">
        <div class="breadcrumb">${esc(persona.name)} <span>/</span> ${esc(screen.name)}</div>
        <div class="screen-title-row">
          <h1 class="screen-title">${esc(screen.name)}<span class="screen-stage-pill">${icon("calendar")} ${esc(screen.stage)}</span></h1>
        </div>
        <div class="screen-intro">${esc(screen.intro)}</div>
        <div class="screen-meta-row">
          <span class="meta-chip">${screen.components.length} component${screen.components.length === 1 ? "" : "s"} traced to backlog</span>
          ${counts.Must ? `<span class="meta-chip"><span class="status-dot dot-bad"></span>${counts.Must} Must</span>` : ""}
          ${counts.Should ? `<span class="meta-chip"><span class="status-dot dot-warn"></span>${counts.Should} Should</span>` : ""}
          ${counts.Could ? `<span class="meta-chip"><span class="status-dot dot-good"></span>${counts.Could} Could</span>` : ""}
          ${extraMeta || ""}
        </div>
      </div>`;
  }

  const BACK_OFFICE_STAGE = "Back office";

  function genericComponentsBlock(screen) {
    if (!screen.components.length) return "";
    if (screen.stage === BACK_OFFICE_STAGE) {
      return `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Story</th><th>Component</th><th>What it does</th><th>MoSCoW / Phase</th></tr></thead>
            <tbody>
              ${screen.components.map((c) => `
                <tr>
                  <td class="tc-id"><span class="story-chip">${esc(c.storyId)}</span></td>
                  <td class="tc-name">${esc(c.component)}</td>
                  <td class="tc-what">${esc(c.what)}</td>
                  <td class="tc-moscow">${badge(c.moscow)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    }
    return `<div class="card-grid">${screen.components.map(componentCard).join("")}</div>`;
  }

  // Screens where the spec has zero mapped backlog stories — narrative note instead of an empty grid
  const SPECIAL_EMPTY = {
    "1-0": (persona, screen) => `
      <div class="empty-note">
        <strong>No dedicated backlog stories map to this screen.</strong>
        In this prototype, a Manager's personal compliance view is the same screen a Colleague sees —
        it is not duplicated here by design.
        <br/><br/>
        <span class="inline-link" id="goto-colleague-dash">View My Compliance (Colleague dashboard) &rarr;</span>
      </div>`,
    "1-2": () => `
      <div class="empty-note">
        <strong>No dedicated backlog stories map to this screen</strong> — Quick Actions is a cross-cutting
        interaction pattern from the 27 August session, not a single story. It is realised through the
        observation/assessment-delivery stories under Trainer/Assessor, plus the header-level quick action
        button available on every screen for this persona.
      </div>
      <div class="action-chip-row" id="qa-demo-row">
        ${QUICK_ACTIONS.map((qa, i) => `<div class="action-chip" data-qa="${i}"><span class="ac-icon">${icon(qa.icon)}</span>${esc(qa.label)}</div>`).join("")}
      </div>`,
    "2-0": () => `
      <div class="empty-note">
        <strong>Confirmed gap, not an oversight.</strong> Recommendation: raise this as a candidate new
        backlog story rather than assume it away.
      </div>
      <div class="panel" style="margin-top:18px;max-width:760px">
        <div class="panel-head"><div><h3>Illustrative: Today's delivery queue</h3><div class="ph-sub">Speculative mock-up — not backed by a backlog story</div></div></div>
        <div class="panel-body">
          ${["Aisha Bello — Field Observation — 09:30 — Due", "Marcus Reid — Invigilated Exam (AS-125) — 10:15 — Scheduled", "Group: Ramp Team B — Group Observation (AS-126) — 13:00 — Scheduled", "Priya Shah — Retake (AS-63) — 14:30 — Awaiting confirmation"]
            .map((t) => {
              const [who, ...rest] = t.split(" — ");
              return `<div class="task-row"><div class="task-check"></div><div class="t-body"><div class="t-title">${esc(who)}</div><div class="t-sub">${esc(rest.join(" — "))}</div></div></div>`;
            }).join("")}
        </div>
      </div>`,
  };

  function renderGenericScreen(personaIdx, screenIdx) {
    const persona = SD.personas[personaIdx];
    const screen = persona.screens[screenIdx];
    const key = `${personaIdx}-${screenIdx}`;
    const body = screen.components.length
      ? genericComponentsBlock(screen)
      : (SPECIAL_EMPTY[key] ? SPECIAL_EMPTY[key](persona, screen) : `<div class="empty-note">${esc(screen.intro)}</div>`);
    return `<div class="main" id="main">${screenHeader(persona, screen)}${body}${footerNote()}</div>`;
  }

  function wireGenericScreen(personaIdx, screenIdx) {
    const key = `${personaIdx}-${screenIdx}`;
    if (key === "1-0") {
      document.getElementById("goto-colleague-dash")?.addEventListener("click", () => navigate(0, 0));
    }
    if (key === "1-2") {
      document.getElementById("qa-demo-row")?.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-qa]");
        if (chip) openQuickActionModal(QUICK_ACTIONS[Number(chip.dataset.qa)]);
      });
    }
  }

  function footerNote() {
    return `<div class="footer-note">This is an inventory-driven prototype, not a finished visual design. Layout, grouping and interaction shown here are illustrative — Publicis Sapient's design decisions remain to be made per Section 1 of the specification.</div>`;
  }

  // ---------------------------------------------------------
  // Shared mock-data building blocks for hero screens
  // ---------------------------------------------------------
  function findComp(storyId) {
    for (const p of SD.personas) {
      for (const s of p.screens) {
        const c = s.components.find((c) => c.storyId === storyId);
        if (c) return c;
      }
    }
    for (const c of SD.systemWide) if (c.storyId === storyId) return c;
    return { storyId, component: storyId, what: "", moscow: "Must · Now" };
  }

  function thresholdBand(pct) {
    if (pct >= 90) return { band: "good", label: "On track" };
    if (pct >= 75) return { band: "warn", label: "At risk" };
    return { band: "bad", label: "Below standard" };
  }

  function progressBar(pct) {
    const b = thresholdBand(pct);
    const color = b.band === "good" ? "var(--good-500)" : b.band === "warn" ? "var(--warn-500)" : "var(--bad-500)";
    return `<div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>`;
  }

  function gaugeRing(pct) {
    const b = thresholdBand(pct);
    const color = b.band === "good" ? "var(--good-500)" : b.band === "warn" ? "var(--warn-500)" : "var(--bad-500)";
    return `<div class="gauge-ring" style="background:conic-gradient(${color} ${pct * 3.6}deg, var(--ink-100) 0deg)"><div style="width:40px;height:40px;border-radius:50%;background:var(--white);display:flex;align-items:center;justify-content:center;color:var(--ink-900);font-size:11px">${pct}%</div></div>`;
  }

  function statusPill(band, label) {
    return `<span class="status-pill status-${band}"><span class="status-dot dot-${band}"></span>${esc(label)}</span>`;
  }

  function miniCalendar(monthLabel, daysInMonth, startDow, eventDays, mustDays, todayNum) {
    const dows = ["M", "T", "W", "T", "F", "S", "S"];
    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<div class="mc-day mc-blank"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const hasEvt = eventDays.includes(d);
      const isMust = mustDays.includes(d);
      cells += `<div class="mc-day ${d === todayNum ? "mc-today" : ""} ${isMust ? "mc-has-must" : ""}">${d}${hasEvt ? '<div class="mc-evt"></div>' : ""}</div>`;
    }
    return `
      <div class="mini-cal">
        <div class="mc-head"><span>${esc(monthLabel)}</span></div>
        <div class="mc-grid">
          ${dows.map((d) => `<div class="mc-dow">${d}</div>`).join("")}
          ${cells}
        </div>
      </div>`;
  }

  // ---------------------------------------------------------
  // HERO: Colleague / My Dashboard (Home)  [0-0]
  // ---------------------------------------------------------
  function heroColleagueDashboard() {
    const persona = SD.personas[0];
    const screen = persona.screens[0];
    const compScore = 88, assessScore = 71;
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="kpi-row">
        <div class="kpi-card"><div class="kpi-label">Competency (CMS-45)</div><div class="kpi-value">${compScore}%</div><div class="kpi-sub kpi-${thresholdBand(compScore).band}">${statusPill(thresholdBand(compScore).band, thresholdBand(compScore).label)}</div></div>
        <div class="kpi-card"><div class="kpi-label">Assessment (AS-4)</div><div class="kpi-value">${assessScore}%</div><div class="kpi-sub">${statusPill(thresholdBand(assessScore).band, thresholdBand(assessScore).label)}</div></div>
        <div class="kpi-card"><div class="kpi-label">Renewals due (SYS-58)</div><div class="kpi-value">2</div><div class="kpi-sub kpi-warn">within 30 days</div></div>
        <div class="kpi-card"><div class="kpi-label">Confidence self-check (CMS-104)</div><div class="kpi-value">Quartile 2</div><div class="kpi-sub kpi-good">▲ up from Q3 last cycle</div></div>
      </div>

      <div class="two-col">
        <div class="panel">
          <div class="panel-head"><div><h3>What you need to do</h3><div class="ph-sub">Activities due — not a competency status grid (Design principle: Utility over data-dump)</div></div></div>
          <div class="panel-body">
            ${[
              { t: "Book Confined Space Entry renewal assessment", s: "Requirement satisfies: Confined Space Entry — expires in 4 days", d: "4 days", band: "bad" },
              { t: "Complete Technical Readiness Check", s: "Ahead of Manual Handling recurrent assessment, AS-38", d: "6 days", band: "warn" },
              { t: "Acknowledge Toolbox Talk: Lone working procedure", s: "CMS-34 Bulletin Distribution", d: "2 days", band: "bad" },
              { t: "Complete confidence self-assessment", s: "Linked to Airside Vehicle Permit, CMS-121", d: "9 days", band: "warn" },
              { t: "Review gap recommendation: Tech Plus track", s: "CMS-42 — based on current role requirements", d: "No deadline", band: "good" },
            ].map((x) => `
              <div class="task-row">
                <div class="task-check"></div>
                <div class="t-body"><div class="t-title">${esc(x.t)}</div><div class="t-sub">${esc(x.s)}</div></div>
                <div class="t-due" style="color:var(--${x.band}-700)">${esc(x.d)}</div>
              </div>`).join("")}
          </div>
        </div>

        <div>
          <div class="panel" style="margin-bottom:16px">
            <div class="panel-head"><h3>Upcoming (SYS-53)</h3></div>
            ${miniCalendar("September 2026", 30, 1, [3, 8, 12, 18, 22, 27], [3, 22], 8)}
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Gap recommendation</h3><span class="story-chip">CMS-42</span></div>
            <div class="panel-body pad">
              <p style="margin:0 0 10px;font-size:12.5px;color:var(--ink-500)">Based on your current role requirements and recent confidence self-assessments:</p>
              <div class="status-pill status-good" style="margin-bottom:8px">Tech Plus track — eligible</div>
              <div style="font-size:12px;color:var(--ink-500)">You meet 4 of 5 prerequisites. Register interest via CMS-116.</div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top:22px">${genericComponentsBlock(screen)}</div>
      ${footerNote()}
    </div>`;
  }

  // ---------------------------------------------------------
  // HERO: Colleague / My Tasks & Actions  [0-1]
  // ---------------------------------------------------------
  function heroColleagueTasks() {
    const persona = SD.personas[0];
    const screen = persona.screens[1];
    const tasks = [
      { t: "Book Confined Space Entry renewal", sys: "CMS", due: "4 days", band: "bad" },
      { t: "Complete Technical Readiness Check", sys: "AS", due: "6 days", band: "warn" },
      { t: "Acknowledge Toolbox Talk: Lone working", sys: "CMS", due: "2 days", band: "bad" },
      { t: "Retake: Airside Driving theory", sys: "AS", due: "11 days", band: "warn" },
      { t: "Upload evidence: First Aid certificate renewal", sys: "CMS", due: "18 days", band: "good" },
      { t: "Complete practice assessment: Manual Handling", sys: "AS", due: "No deadline", band: "good" },
    ];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="empty-note" style="margin-bottom:18px">Consolidated across CMS-46 and AS-8 by due date, not by which system or competency the task belongs to — with reminders driven by CMS-30 / AS-9.</div>
      <div class="panel">
        <div class="panel-head"><h3>All tasks &amp; actions (6)</h3><div class="ph-sub">Sorted by due date</div></div>
        <div class="panel-body">
          ${tasks.map((x) => `
            <div class="task-row">
              <div class="task-check"></div>
              <div class="t-body"><div class="t-title">${esc(x.t)}</div><div class="t-sub">Source: ${x.sys === "CMS" ? "Competency Management" : "Assessment System"}</div></div>
              <div class="t-due" style="color:var(--${x.band}-700)">${esc(x.due)}</div>
            </div>`).join("")}
        </div>
      </div>
      <div style="margin-top:22px">${genericComponentsBlock(screen)}</div>
      ${footerNote()}
    </div>`;
  }

  // ---------------------------------------------------------
  // HERO: Colleague / My Calendar  [0-2]
  // ---------------------------------------------------------
  function heroColleagueCalendar() {
    const persona = SD.personas[0];
    const screen = persona.screens[2];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="two-col">
        <div class="panel">
          ${miniCalendar("September 2026", 30, 1, [3, 8, 12, 18, 22, 27], [3, 22], 8)}
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Upcoming</h3></div>
          <div class="panel-body">
            ${[
              { t: "Confined Space Entry — renewal assessment", d: "3 Sep, 09:30", tag: "Must" },
              { t: "TNCA review — Q3 progression", d: "8 Sep, 14:00", tag: "Should" },
              { t: "Manual Handling — recurrent (observation)", d: "12 Sep, 11:00", tag: "Must" },
              { t: "Toolbox Talk: revised lone-working procedure", d: "18 Sep", tag: "Should" },
              { t: "Airside Driving — theory retake window opens", d: "22 Sep", tag: "Must" },
            ].map((x) => `
              <div class="task-row">
                <div class="task-check" style="border-radius:50%"></div>
                <div class="t-body"><div class="t-title">${esc(x.t)}</div><div class="t-sub">${esc(x.d)}</div></div>
                <span class="moscow-badge ${moscowClass(x.tag)}">${esc(x.tag)}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
      <div class="empty-note" style="margin:18px 0">AS-11 — you'll be automatically alerted here if a scheduled assessment conflicts with your operational roster.</div>
      ${genericComponentsBlock(screen)}
      ${footerNote()}
    </div>`;
  }

  // ---------------------------------------------------------
  // HERO: Colleague / My Competency Record  [0-3]  (progressive disclosure)
  // ---------------------------------------------------------
  const COMPETENCIES = [
    { name: "Confined Space Entry", level: "Authorised", pct: 92, expiry: "3 Sep 2026" },
    { name: "Manual Handling", level: "Authorised", pct: 88, expiry: "12 Dec 2026" },
    { name: "Airside Driving Permit", level: "Provisional", pct: 64, expiry: "22 Sep 2026" },
    { name: "First Aid at Work", level: "Authorised", pct: 95, expiry: "4 Mar 2027" },
    { name: "Working at Height", level: "Training", pct: 40, expiry: "—" },
    { name: "Lone Working", level: "Authorised", pct: 100, expiry: "1 Jun 2027" },
  ];

  function heroCompetencyRecord() {
    const persona = SD.personas[0];
    const screen = persona.screens[3];
    const overviewIds = ["CMS-48", "CMS-38", "CMS-39"];
    const progressionIds = ["CMS-47", "CMS-106", "CMS-116", "CMS-51", "CMS-98", "CMS-99"];
    const requestsIds = ["CMS-37", "CMS-35"];
    const tabs = [
      { key: "overview", label: "Overview" },
      { key: "progression", label: "Progression & pathways" },
      { key: "requests", label: "Exemptions & assessments" },
    ];
    const tabBody = {
      overview: `
        <div class="panel" style="margin-bottom:18px">
          <div class="panel-head"><div><h3>My 6 competencies</h3><div class="ph-sub">Detail view — one click down from the dashboard (progressive disclosure)</div></div></div>
          <div class="panel-body pad">
            <div style="display:flex;flex-direction:column;gap:14px">
              ${COMPETENCIES.map((c) => `
                <div style="display:flex;align-items:center;gap:16px">
                  <div style="width:170px;font-size:12.5px;font-weight:600">${esc(c.name)}</div>
                  <div style="width:90px"><span class="status-pill status-${thresholdBand(c.pct).band}">${esc(c.level)}</span></div>
                  <div style="flex:1">${progressBar(c.pct)}</div>
                  <div style="width:36px;font-size:11.5px;color:var(--ink-500);text-align:right">${c.pct}%</div>
                  <div style="width:100px;font-size:11px;color:var(--ink-500);text-align:right">exp ${esc(c.expiry)}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>
        <div class="card-grid">${overviewIds.map((id) => componentCard(findComp(id))).join("")}</div>`,
      progression: `<div class="card-grid">${progressionIds.map((id) => componentCard(findComp(id))).join("")}</div>`,
      requests: `<div class="card-grid">${requestsIds.map((id) => componentCard(findComp(id))).join("")}</div>`,
    };
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="pill-tabs" id="cr-tabs">
        ${tabs.map((t, i) => `<div class="pill-tab ${i === 0 ? "active" : ""}" data-tab="${t.key}">${esc(t.label)}</div>`).join("")}
      </div>
      <div id="cr-tab-body">${tabBody.overview}</div>
      ${footerNote()}
    </div>`;
  }

  function wireCompetencyRecord() {
    const tabBodies = {
      overview: () => heroCompetencyRecordTabHtml("overview"),
    };
    document.getElementById("cr-tabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".pill-tab");
      if (!tab) return;
      document.querySelectorAll("#cr-tabs .pill-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("cr-tab-body").innerHTML = heroCompetencyRecordTabHtml(tab.dataset.tab);
    });
  }

  function heroCompetencyRecordTabHtml(key) {
    const overviewIds = ["CMS-48", "CMS-38", "CMS-39"];
    const progressionIds = ["CMS-47", "CMS-106", "CMS-116", "CMS-51", "CMS-98", "CMS-99"];
    const requestsIds = ["CMS-37", "CMS-35"];
    if (key === "overview") {
      return `
        <div class="panel" style="margin-bottom:18px">
          <div class="panel-head"><div><h3>My 6 competencies</h3><div class="ph-sub">Detail view — one click down from the dashboard (progressive disclosure)</div></div></div>
          <div class="panel-body pad">
            <div style="display:flex;flex-direction:column;gap:14px">
              ${COMPETENCIES.map((c) => `
                <div style="display:flex;align-items:center;gap:16px">
                  <div style="width:170px;font-size:12.5px;font-weight:600">${esc(c.name)}</div>
                  <div style="width:90px"><span class="status-pill status-${thresholdBand(c.pct).band}">${esc(c.level)}</span></div>
                  <div style="flex:1">${progressBar(c.pct)}</div>
                  <div style="width:36px;font-size:11.5px;color:var(--ink-500);text-align:right">${c.pct}%</div>
                  <div style="width:100px;font-size:11px;color:var(--ink-500);text-align:right">exp ${esc(c.expiry)}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>
        <div class="card-grid">${overviewIds.map((id) => componentCard(findComp(id))).join("")}</div>`;
    }
    if (key === "progression") return `<div class="card-grid">${progressionIds.map((id) => componentCard(findComp(id))).join("")}</div>`;
    return `<div class="card-grid">${requestsIds.map((id) => componentCard(findComp(id))).join("")}</div>`;
  }

  // ---------------------------------------------------------
  // HERO: Manager / My Team Dashboard  [1-1]
  // ---------------------------------------------------------
  const TEAM = [
    { name: "Aisha Bello", role: "Security Officer, T5", score: 92, flag: "" },
    { name: "Marcus Reid", role: "Security Officer, T3", score: 68, flag: "Assessment overdue" },
    { name: "Priya Shah", role: "Engineering Technician", score: 54, flag: "Not competent, confident — CMS-105" },
    { name: "Tom Whitfield", role: "Security Officer, T5", score: 97, flag: "" },
    { name: "Grace Ilori", role: "Airside Operative", score: 81, flag: "Renewal due in 9 days" },
    { name: "Sam O'Neill", role: "Security Officer, T3", score: 45, flag: "Suspended — CMS-111" },
  ];

  function heroTeamDashboard() {
    const persona = SD.personas[1];
    const screen = persona.screens[1];
    const remainingIds = ["SYS-69", "CMS-101", "CMS-105", "AS-48"];
    const compliant = TEAM.filter((t) => t.score >= 90).length;
    const overdue = TEAM.filter((t) => t.risk === "bad").length;
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="action-chip-row">
        ${QUICK_ACTIONS.map((qa, i) => `<div class="action-chip" data-qa="${i}"><span class="ac-icon">${icon(qa.icon)}</span>${esc(qa.label)}</div>`).join("")}
      </div>
      <div class="kpi-row">
        <div class="kpi-card"><div class="kpi-label">Team compliance (CMS-68)</div><div class="kpi-value">${Math.round((compliant / TEAM.length) * 100)}%</div><div class="kpi-sub">${statusPill(thresholdBand(Math.round((compliant / TEAM.length) * 100)).band, "composite score")}</div></div>
        <div class="kpi-card"><div class="kpi-label">High-risk (SYS-63)</div><div class="kpi-value" style="color:var(--bad-700)">${overdue}</div><div class="kpi-sub kpi-bad">needs action this week</div></div>
        <div class="kpi-card"><div class="kpi-label">Assessments this month (AS-42)</div><div class="kpi-value">14</div><div class="kpi-sub kpi-good">91% pass rate</div></div>
        <div class="kpi-card"><div class="kpi-label">Overdue training (SYS-68)</div><div class="kpi-value">3</div><div class="kpi-sub kpi-warn">across 2 team members</div></div>
      </div>
      <div class="team-table-wrap" style="margin-bottom:22px">
        <table class="team-table">
          <thead><tr><th>Team member</th><th>Composite readiness</th><th>Heatmap</th><th>Flag</th><th></th></tr></thead>
          <tbody>
            ${TEAM.map((t, i) => `
              <tr data-member="${i}">
                <td><div class="name-cell"><div class="avatar-ring" style="background:${["#3b7dd8", "#c07d0f", "#8a5cf6", "#0f9c8f", "#d13b2c", "#344054"][i % 6]}">${t.name.split(" ").map((n) => n[0]).join("")}</div><div><div class="nc-name">${esc(t.name)}</div><div class="nc-role">${esc(t.role)}</div></div></div></td>
                <td style="width:220px">${progressBar(t.score)}</td>
                <td><span class="heat-chip" style="background:var(--${thresholdBand(t.score).band}-500)"></span></td>
                <td style="font-size:12px;color:var(--ink-500)">${esc(t.flag) || "&mdash;"}</td>
                <td style="text-align:right"><span class="inline-link" style="font-size:12px">View &rarr;</span></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="section-block">
        <h2>Also on this screen</h2>
        <div class="sb-sub">Remaining backlog-traced components not shown in the mock-up above</div>
        <div class="card-grid">${remainingIds.map((id) => componentCard(findComp(id))).join("")}</div>
      </div>
      ${footerNote()}
    </div>`;
  }

  function wireTeamDashboard() {
    document.querySelectorAll(".action-chip[data-qa]").forEach((chip) => {
      chip.addEventListener("click", () => openQuickActionModal(QUICK_ACTIONS[Number(chip.dataset.qa)]));
    });
    document.querySelectorAll(".team-table tbody tr[data-member]").forEach((row) => {
      row.addEventListener("click", () => navigate(1, 3));
    });
  }

  // ---------------------------------------------------------
  // HERO: Manager / Individual Team Member Record  [1-3]
  // ---------------------------------------------------------
  function heroTeamMemberRecord() {
    const persona = SD.personas[1];
    const screen = persona.screens[3];
    const member = TEAM[1];
    const statusActionIds = ["CMS-111", "CMS-117", "CMS-70"];
    const devIds = ["CMS-67", "CMS-115", "CMS-114"];
    const assessIds = ["CMS-66", "CMS-69"];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="panel" style="margin-bottom:18px">
        <div class="panel-body pad" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
          <div class="avatar-ring" style="width:56px;height:56px;font-size:16px;background:#c07d0f">MR</div>
          <div style="flex:1;min-width:200px">
            <div style="font-weight:700;font-size:15px">${esc(member.name)}</div>
            <div style="font-size:12.5px;color:var(--ink-500)">${esc(member.role)} &middot; Employee ID 40218</div>
          </div>
          <div class="gauge-row">${gaugeRing(member.score)}<div><div style="font-size:11.5px;color:var(--ink-500)">Composite readiness</div>${statusPill(thresholdBand(member.score).band, thresholdBand(member.score).label)}</div></div>
        </div>
      </div>
      <div class="section-block">
        <h2>Status &amp; actions</h2>
        <div class="sb-sub">Suspension / restriction / exemption / override — every transaction is audited (CMS-111)</div>
        <div class="card-grid">${statusActionIds.map((id) => componentCard(findComp(id))).join("")}</div>
      </div>
      <div class="section-block">
        <h2>Development &amp; track</h2>
        <div class="card-grid">${devIds.map((id) => componentCard(findComp(id))).join("")}</div>
      </div>
      <div class="section-block">
        <h2>TNCA &amp; assessment context</h2>
        <div class="card-grid">${assessIds.map((id) => componentCard(findComp(id))).join("")}</div>
      </div>
      ${footerNote()}
    </div>`;
  }

  // ---------------------------------------------------------
  // HERO: Manager / Dashboard Configuration  [1-7]
  // ---------------------------------------------------------
  const WIDGET_LIB = [
    { name: "Team Readiness Heatmap", sub: "CMS-68", on: true },
    { name: "Renewal Tracking", sub: "SYS-58", on: true },
    { name: "Risk Register", sub: "AS-49", on: true },
    { name: "Covert Assessment Analytics", sub: "CMS-101", on: false },
    { name: "Confidence-Risk Quadrant", sub: "CMS-105", on: false },
    { name: "Event Calendar", sub: "SYS-53", on: true },
    { name: "Bulletin Feed", sub: "CMS-108", on: false },
    { name: "Assessor Calibration Summary", sub: "CMS-103", on: false },
  ];

  function heroDashboardConfig() {
    const persona = SD.personas[1];
    const screen = persona.screens[7];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="empty-note" style="margin-bottom:18px">Design principle: <strong>widgetised and configurable, not hard-coded</strong> — a wrong first guess at what a persona needs to see should be a configuration change, not a five-day rebuild.</div>
      <div class="panel">
        <div class="panel-head"><div><h3>Widget library</h3><div class="ph-sub">Toggle on/off, then save as a reusable template for your role</div></div><button class="btn btn-primary" id="save-template-btn">Save as template</button></div>
        <div class="panel-body pad">
          <div class="widget-lib" id="widget-lib">
            ${WIDGET_LIB.map((w, i) => `
              <div class="widget-opt">
                <div class="wo-body"><div class="wo-title">${esc(w.name)}</div><div class="wo-sub">${esc(w.sub)}</div></div>
                <div class="toggle ${w.on ? "on" : ""}" data-i="${i}"><div class="tg-knob"></div></div>
              </div>`).join("")}
          </div>
        </div>
      </div>
      <div style="margin-top:22px">${genericComponentsBlock(screen)}</div>
      ${footerNote()}
    </div>`;
  }

  function wireDashboardConfig() {
    document.getElementById("widget-lib").addEventListener("click", (e) => {
      const t = e.target.closest(".toggle");
      if (t) t.classList.toggle("on");
    });
    document.getElementById("save-template-btn").addEventListener("click", () => toast("Widget template saved (prototype — SYS-107)"));
  }

  // ---------------------------------------------------------
  // HERO: Trainer/Assessor / Conduct an Observation  [2-1]
  // ---------------------------------------------------------
  const OBS_CHECKLIST = [
    "Confirms area is isolated before entry",
    "Uses correct PPE for task",
    "Checks atmosphere monitoring device before entry",
    "Maintains communication with top-side watcher",
    "Follows emergency egress procedure when prompted",
  ];

  function heroConductObservation() {
    const persona = SD.personas[2];
    const screen = persona.screens[1];
    const steps = ["Candidate", "Checklist", "Score criteria", "Evidence & sign-off", "Submit"];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="stepper">
        ${steps.map((s, i) => `
          ${i > 0 ? '<div class="step-connector"></div>' : ""}
          <div class="step ${i < 2 ? "done" : i === 2 ? "now" : ""}"><div class="step-num">${i < 2 ? "&check;" : i + 1}</div><div class="step-label">${esc(s)}</div></div>`).join("")}
      </div>
      <div class="two-col">
        <div class="panel">
          <div class="panel-head">
            <div><h3>Confined Space Entry — Field Observation</h3><div class="ph-sub">AS-58 &middot; standardised checklist</div></div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-500)">Covert mode <div class="toggle" id="covert-toggle"><div class="tg-knob"></div></div></div>
          </div>
          <div class="panel-body">
            ${OBS_CHECKLIST.map((c, i) => `
              <div class="checklist-item ${i < 3 ? "pass" : ""}">
                <div class="ci-box"></div>
                <div style="flex:1"><div class="ci-title">${esc(c)}</div><div class="ci-sub">Performance criterion ${i + 1} of ${OBS_CHECKLIST.length}</div></div>
                <div class="score-pill-group">
                  <div class="score-pill ${i < 3 ? "sel" : ""}">P</div>
                  <div class="score-pill">F</div>
                  <div class="score-pill">N/A</div>
                </div>
              </div>`).join("")}
          </div>
        </div>
        <div>
          <div class="panel" style="margin-bottom:16px">
            <div class="panel-head"><h3>Candidate</h3></div>
            <div class="panel-body pad" style="display:flex;align-items:center;gap:12px">
              <div class="avatar-ring" style="background:#3b7dd8">AB</div>
              <div><div style="font-weight:700;font-size:13px">Aisha Bello</div><div style="font-size:11.5px;color:var(--ink-500)">Security Officer, T5</div></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Group observation</h3><span class="story-chip">AS-126</span></div>
            <div class="panel-body pad" style="font-size:12px;color:var(--ink-500)">This checklist can be applied to multiple candidates at once in a single tabular session — switch to Group mode from the candidate step.</div>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin:18px 0">
        <button class="btn btn-ghost" id="obs-save-draft">Save draft</button>
        <button class="btn btn-primary" id="obs-submit">Submit observation</button>
      </div>
      <div class="section-block">
        <h2>Also on this screen</h2>
        <div class="card-grid">${componentCard(findComp("CMS-100"))}</div>
      </div>
      ${footerNote()}
    </div>`;
  }

  function wireConductObservation() {
    document.querySelectorAll(".score-pill-group").forEach((grp) => {
      grp.addEventListener("click", (e) => {
        const pill = e.target.closest(".score-pill");
        if (!pill) return;
        grp.querySelectorAll(".score-pill").forEach((p) => p.classList.remove("sel"));
        pill.classList.add("sel");
        const item = grp.closest(".checklist-item");
        item.classList.toggle("pass", pill.textContent.trim() === "P");
      });
    });
    document.getElementById("covert-toggle").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("on");
      toast(e.currentTarget.classList.contains("on") ? "Covert mode on — CMS-100 (candidate not notified)" : "Covert mode off");
    });
    document.getElementById("obs-save-draft").addEventListener("click", () => toast("Draft saved (prototype)"));
    document.getElementById("obs-submit").addEventListener("click", () => toast("Observation submitted (prototype)"));
  }

  // ---------------------------------------------------------
  // HERO: Leadership / Executive & Compliance Dashboards  [6-0]
  // ---------------------------------------------------------
  function heroExecDashboard() {
    const persona = SD.personas[6];
    const screen = persona.screens[0];
    return `<div class="main" id="main">
      ${screenHeader(persona, screen)}
      <div class="kpi-row">
        <div class="kpi-card"><div class="kpi-label">Org-wide compliance (SYS-71)</div><div class="kpi-value">83%</div><div class="kpi-sub">${statusPill("warn", "At risk")}</div></div>
        <div class="kpi-card"><div class="kpi-label">Regulatory readiness</div><div class="kpi-value">96%</div><div class="kpi-sub">${statusPill("good", "On track")}</div></div>
        <div class="kpi-card"><div class="kpi-label">Forecasted gap, 24mo (CMS-93)</div><div class="kpi-value">140</div><div class="kpi-sub kpi-warn">roles at risk of coverage gap</div></div>
        <div class="kpi-card"><div class="kpi-label">Progression pipeline (CMS-107)</div><div class="kpi-value">62%</div><div class="kpi-sub kpi-good">expressed interest &rarr; active track</div></div>
      </div>
      <div class="section-block">
        <h2>Backlog-traced components</h2>
        ${genericComponentsBlock(screen)}
      </div>
      ${footerNote()}
    </div>`;
  }

  // ---------------------------------------------------------
  // Hero registry
  // ---------------------------------------------------------
  const HERO = {
    "0-0": { render: heroColleagueDashboard },
    "0-1": { render: heroColleagueTasks },
    "0-2": { render: heroColleagueCalendar },
    "0-3": { render: heroCompetencyRecord, wire: wireCompetencyRecord },
    "1-1": { render: heroTeamDashboard, wire: wireTeamDashboard },
    "1-3": { render: heroTeamMemberRecord },
    "1-7": { render: heroDashboardConfig, wire: wireDashboardConfig },
    "2-1": { render: heroConductObservation, wire: wireConductObservation },
    "6-0": { render: heroExecDashboard },
  };

  // ---------------------------------------------------------
  // About screen
  // ---------------------------------------------------------
  function renderAbout() {
    return `<div class="main" id="main">
      <div class="about-hero">
        <h1>${esc(SD.meta.title)}</h1>
        <div class="ah-sub">${esc(SD.meta.subtitle)}</div>
        <p>${esc(SD.meta.strapline)}</p>
        <div class="ah-meta">${esc(SD.meta.project)} &middot; Working paper, standalone click-through prototype built directly from the specification</div>
      </div>

      <div class="section-block" id="anchor-purpose">
        <h2>Purpose &amp; how to use this prototype</h2>
        <div class="sb-sub">This is an inventory rendered as a navigable app — not PS's finished visual design.</div>
        <p style="max-width:760px;font-size:13.5px;color:var(--ink-700);line-height:1.65">
          Every persona, screen and component below is parsed directly from Section 7 of the specification and traceable to a backlog story ID.
          A handful of screens (dashboards, the team view, an observation flow) are built out further to demonstrate the design principles in Section 6 in something
          closer to real use; everything else renders as a structured inventory of what belongs on that screen, exactly as the source document intends it to be used.
        </p>
      </div>

      <div class="section-block" id="anchor-principles">
        <h2>Design principles</h2>
        <div class="sb-sub">27 August Experience Principles &amp; Persona Priorities session — apply across every screen</div>
        <div class="principle-grid">
          ${SD.designPrinciples.map((p, i) => `
            <div class="principle-card"><div class="pc-num">0${i + 1}</div><h4>${esc(p.name)}</h4><p>${esc(p.description)}</p></div>`).join("")}
        </div>
      </div>

      <div class="section-block" id="anchor-personas">
        <h2>Persona model</h2>
        <div class="sb-sub">Twenty-plus "As a&hellip;" backlog labels, consolidated into seven working personas</div>
        <div class="persona-model-list">
          ${SD.personaModel.map((p, i) => `
            <div class="persona-model-row">
              <div class="pmr-name"><span class="persona-avatar" style="background:${PERSONA_META[i] ? PERSONA_META[i].color : "#667085"};display:inline-flex;width:22px;height:22px;font-size:9px;border-radius:6px;vertical-align:middle;margin-right:8px">${PERSONA_META[i] ? PERSONA_META[i].code : ""}</span>${esc(p.name)}</div>
              <div class="pmr-desc">${esc(p.description)}</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="section-block" id="anchor-stages">
        <h2>Journey stage framework</h2>
        <div class="sb-sub">Screens below are organised loosely against these stages, not a rigid gate</div>
        <div class="stage-strip">
          ${SD.journeyStages.map((s) => `<div class="stage-card"><h4>${esc(s.name)}</h4><p>${esc(s.description)}</p></div>`).join("")}
        </div>
      </div>

      <div class="section-block" id="anchor-systemwide">
        <h2>System-wide components</h2>
        <div class="sb-sub">The shared shell every screen in this prototype assumes exists — see the top bar</div>
        <div class="card-grid">${SD.systemWide.map(componentCard).join("")}</div>
      </div>

      <div class="footer-note">Parsed from the CMS &amp; Assessment System Screen &amp; Component Specification (v01, prepared by DBLX, 27 August 2026). 365 backlog stories reviewed; this prototype renders the persona-facing subset (Sections 5 &amp; 7).</div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Main render
  // ---------------------------------------------------------
  function render() {
    const app = document.getElementById("app");
    const topbarHtml = renderTopbar();
    const sidebarHtml = renderSidebar();
    let mainHtml;
    if (state.route === "about") {
      mainHtml = renderAbout();
    } else {
      const key = `${state.personaIdx}-${state.screenIdx}`;
      mainHtml = HERO[key] ? HERO[key].render() : renderGenericScreen(state.personaIdx, state.screenIdx);
    }
    app.innerHTML = `${topbarHtml}<div class="body-shell">${sidebarHtml}${mainHtml}</div>`;
    wireTopbar();
    wireSidebar();
    if (state.route === "screen") {
      const key = `${state.personaIdx}-${state.screenIdx}`;
      if (HERO[key] && HERO[key].wire) HERO[key].wire();
      if (!HERO[key]) wireGenericScreen(state.personaIdx, state.screenIdx);
    }
  }

  window.addEventListener("hashchange", () => { parseHash(); render(); });

  document.addEventListener("DOMContentLoaded", () => {
    parseHash();
    render();
  });
})();
