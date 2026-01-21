# Strategic Pyramid Builder

**Version:** 1.0.0
**Stack:** Next.js + FastAPI
**Status:** Production Ready (Vercel + Railway)

A web-based strategy development tool that helps organizations build clear, coherent strategies using a proven 9-tier pyramid architecture. Unlike traditional strategy tools, we **enforce strategic clarity** by requiring each initiative to have ONE primary driver while acknowledging secondary contributions.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com)

---

## 🎯 What Makes This Different

Most strategy tools are glorified documentation platforms. **Strategic Pyramid Builder** is a decision-forcing engine:

- ✅ **Forces Hard Decisions** - Each commitment MUST have ONE primary driver (no ambiguity)
- ✅ **Real-Time Validation** - 8 quality checks catch issues during creation (not after 6 months)
- ✅ **Audience-Specific Exports** - Generate exactly what each audience needs (Board, Teams, Detailed)
- ✅ **Interactive Visualizations** - See distribution imbalance and strategic gaps immediately
- ✅ **Jargon Detection** - Warns when language is vague ("drive excellence" means nothing)

---

## 📊 The 9-Tier Framework

```
PURPOSE
├─ Tier 1: Vision/Mission/Belief     ← "The Why"
├─ Tier 2: Values                    ← "What we stand for"
└─ Tier 3: Behaviours                ← "Values in action"

STRATEGY
├─ Tier 4: Strategic Intent          ← "What we're hearing" (customer voice)
├─ Tier 5: Strategic Drivers         ← "Our focus areas" (3-5 themes)
└─ Tier 6: Enablers                  ← "What we need to succeed"

EXECUTION
├─ Tier 7: Iconic Commitments        ← "What we'll deliver" (H1/H2/H3)
├─ Tier 8: Team Objectives           ← "How teams contribute"
└─ Tier 9: Individual Objectives     ← "What each person owns"
```

**The Key Innovation**: Every commitment MUST declare ONE primary driver. This forces strategic choices and reveals real priorities.

---

## 🚀 Quick Start

### Option 1: Local Development (Recommended for Testing)

**Prerequisites**: Node.js 18+, Python 3.11+

```bash
# 1. Clone the repository
git clone https://github.com/ashcroft79/Strategy.git
cd Strategy

# 2. Start the backend (FastAPI)
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000

# 3. Start the frontend (Next.js) - in a new terminal
cd frontend
npm install
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs
```

### Option 2: Production Deployment

**Frontend (Vercel)**:
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-railway-backend-url>`

**Backend (Railway)**:
1. Create new project in [Railway](https://railway.app)
2. Connect GitHub repo
3. Railway auto-detects Python and uses `railway.json` config
4. Backend deploys automatically

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

---

## ✨ Core Features

### 1. Complete Pyramid Builder
- **Full CRUD** for all 9 tiers
- **Inline editing** with Save/Cancel workflow
- **Delete functionality** with cascade warnings
- **Primary alignment** enforcement (ONE driver per commitment)

### 2. Validation Engine (8 Checks)
- ✅ **Completeness** - All required sections filled
- ✅ **Structure** - Valid relationships, no broken links
- ⚠️ **Orphans** - Items with no connections
- ⚠️ **Balance** - Distribution across drivers (prevent 80% on one pillar)
- ⚠️ **Language** - Jargon detection ("synergy", "leverage", etc.)
- ⚠️ **Commitment Quality** - Has owner, target date, specifics
- ⚠️ **Horizon Balance** - Not all H1 (unrealistic capacity)
- ⚠️ **Alignment Strength** - Clear primary ownership

### 3. Export Formats (4 Types)
- **Word (DOCX)** - Executive (1-2 pages), Leadership (3-5), Detailed (10-15), Team Cascade
- **PowerPoint (PPTX)** - Slide deck with driver-centric views
- **Markdown** - For wikis and documentation sites
- **JSON** - For integrations and programmatic access

### 4. Interactive Visualizations (4 Charts)
- **Pyramid Diagram** - 9-tier structure with item counts
- **Distribution Sunburst** - Commitment distribution across drivers
- **Horizon Timeline** - When deliverables happen (H1/H2/H3)
- **Driver Overview** - Intents + commitments per driver

---

## 🎓 Who This Is For

### HR Leaders & Facilitators
Run strategic planning workshops with leadership teams. Capture strategy in real-time, validate before leaving the room, export for stakeholders.

### Strategy & Transformation Teams
Build organizational strategies over weeks. Track distribution, identify gaps, generate review documents, create cascade views.

### Executive Leadership
Define vision, mission, and strategic direction. Force hard decisions, validate language quality, review distribution (is this really our strategy?).

### Program & Portfolio Managers
Cascade strategy to execution. Link team objectives to commitments, ensure full traceability, generate team-specific views.

---

## 📖 Key Concepts

### Primary + Secondary Architecture

**The Problem**: Traditional strategy tools allow initiatives to "support all pillars," which means they support none. Ownership is unclear.

**Our Solution**: Every commitment MUST have ONE primary driver (owns it) but CAN contribute secondarily to others.

**Example**:
- ❌ Bad: "Mobile App 2.0 supports Customer Excellence, Innovation, and Operational Resilience" (vague ownership)
- ✅ Good: "Mobile App 2.0 is OWNED by Customer Excellence (primary), with secondary contribution to Innovation"

This reveals:
- Real strategic bets (where resources go)
- Imbalanced portfolios (one driver has 12 commitments, another has 1)
- Clear accountability (who owns what)

### Strategic Intent vs. Commitments

**Common Mistake**: Conflating "what we hear" with "what we'll do."

**Strategic Intent** (Tier 4):
- External voices, customer needs, market trends
- "Customers expect 24/7 support across all channels"
- "Employees report burnout from always-on culture"

**Strategic Drivers** (Tier 5):
- How we respond to what we're hearing
- "Customer Excellence", "Sustainable Performance"

**Iconic Commitments** (Tier 7):
- What we'll actually deliver
- "Launch 24/7 chat support by Q3 2026"

### Horizon Framework (H1/H2/H3)

Commitments are time-bounded:
- **H1** (0-12 months) - Near-term wins, building momentum
- **H2** (12-24 months) - Mid-term transformations
- **H3** (24-36 months) - Long-term strategic bets

Forces conversation: "Can we really deliver 15 H1 commitments this year?"

---

## 🛠 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend Framework | Next.js 15 | Server-side rendering, optimized for Vercel |
| UI Library | React 19 + TypeScript | Component-based UI with type safety |
| Styling | Tailwind CSS 3.4 | Utility-first CSS, responsive design |
| State Management | Zustand 5.0 | Lightweight store (simpler than Redux) |
| Charts | react-plotly.js | Interactive visualizations |
| Backend Framework | FastAPI | REST API with automatic docs |
| Data Validation | Pydantic 2.5 | Type-safe models with validation |
| Exports | python-docx, python-pptx | Professional document generation |
| Deployment | Vercel + Railway | Modern, scalable hosting |

---

## 📁 Project Structure

```
Strategy/
├── frontend/                    # Next.js application
│   ├── app/                     # App Router pages
│   │   ├── page.tsx            # Home (create/load pyramid)
│   │   ├── builder/page.tsx    # Main builder interface
│   │   ├── validation/page.tsx # Validation results
│   │   ├── exports/page.tsx    # Export options
│   │   └── visualizations/page.tsx # Interactive charts
│   ├── components/ui/          # Reusable components
│   ├── lib/                    # API client, store, utils
│   └── types/                  # TypeScript definitions
│
├── api/                        # FastAPI backend
│   ├── main.py                 # App setup, CORS config
│   └── routers/                # API endpoints
│       ├── pyramids.py         # CRUD operations
│       ├── validation.py       # Validation checks
│       ├── exports.py          # Document generation
│       └── visualizations.py   # Chart data
│
├── src/pyramid_builder/        # Core business logic (~5,000 LOC)
│   ├── models/pyramid.py       # Pydantic models (9 tiers)
│   ├── core/
│   │   ├── pyramid_manager.py  # CRUD operations
│   │   └── builder.py          # High-level API
│   ├── validation/validator.py # 8 validation checks
│   ├── exports/                # Export generators
│   │   ├── word_exporter.py
│   │   ├── powerpoint_exporter.py
│   │   ├── markdown_exporter.py
│   │   └── json_exporter.py
│   └── visualization/pyramid_diagram.py # Plotly charts
│
├── examples/                   # Example pyramids
├── docs/                       # Documentation
│   └── archive/                # Archived docs (Streamlit era)
├── PRODUCT_DEFINITION.md       # Comprehensive product doc
├── DEPLOYMENT.md               # Deployment guide
├── CHANGELOG.md                # Version history
└── railway.json                # Railway deployment config
```

---

## 📚 Documentation

- **[PRODUCT_DEFINITION.md](./PRODUCT_DEFINITION.md)** - Comprehensive product definition, methodology, and design principles (20K+ words)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide for Vercel + Railway
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
- **API Docs** - Auto-generated at `/docs` when backend is running

---

## 🧪 Example Usage

### Create Your First Pyramid

1. **Launch App**: Navigate to http://localhost:3000
2. **Create Pyramid**: Enter organization name and project details
3. **Build Purpose**: Add vision, values, and behaviours
4. **Define Strategy**: Add strategic drivers (3-5 focus areas)
5. **Add Intents**: Capture what stakeholders are saying
6. **Define Commitments**: Create deliverables with PRIMARY driver ownership
7. **Validate**: Run validation to check structure and balance
8. **Visualize**: View distribution charts and timeline
9. **Export**: Generate Word doc for leadership review

### Load Example

```bash
# Start backend with example pyramid loaded
curl -X POST http://localhost:8000/api/pyramids/load \
  -H "Content-Type: application/json" \
  -d @examples/comprehensive_example.json
```

---

## 🔧 Configuration

### Frontend Environment Variables

Create `/frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production deployment (Vercel)
# NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
```

### Backend CORS Configuration

Update `/api/main.py` to add allowed origins:

```python
allow_origins=[
    "http://localhost:3000",               # Local dev
    "https://your-vercel-app.vercel.app",  # Your Vercel domain
]
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📈 Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Complete 9-tier pyramid builder
- [x] Validation engine (8 checks)
- [x] Export to Word, PowerPoint, Markdown, JSON
- [x] Interactive visualizations (4 charts)
- [x] Web UI (Next.js + FastAPI)
- [x] Deployment configs (Vercel + Railway)

### 🔄 Phase 2: Persistence & Scale (Q1 2026)
- [ ] PostgreSQL database integration
- [ ] User authentication (Auth0/Clerk)
- [ ] Save/load pyramids from database
- [ ] User workspaces (multiple pyramids)
- [ ] Audit log (change history)

### 🚀 Phase 3: Collaboration & Intelligence (Q2 2026)
- [ ] Real-time editing (WebSockets)
- [ ] Comments and discussions
- [ ] AI writing assistant
- [ ] Template library
- [ ] Import from existing docs

### 🌐 Phase 4: Integration & Ecosystem (Q3-Q4 2026)
- [ ] OKR tool integration (Lattice, 15Five)
- [ ] Project management sync (Jira, Asana)
- [ ] Mobile app (iOS, Android)
- [ ] Workshop facilitator mode

See [PRODUCT_DEFINITION.md](./PRODUCT_DEFINITION.md) for complete roadmap.

---

## 🐛 Known Limitations

- **No Database**: Currently in-memory only (data lost on restart) - suitable for demos/workshops
- **Single Server**: In-memory storage doesn't scale horizontally
- **No Auth**: Anyone with the URL can access pyramids
- **No Collaboration**: One user at a time per pyramid

These are intentional trade-offs for MVP speed. Database and auth coming in Phase 2.

---

## 📄 License

Copyright © 2026 Strategic Pyramid Builder

---

## 💬 Support & Feedback

- **Issues**: Report bugs via [GitHub Issues](https://github.com/ashcroft79/Strategy/issues)
- **Questions**: See [PRODUCT_DEFINITION.md](./PRODUCT_DEFINITION.md) for comprehensive documentation
- **Contributions**: Pull requests welcome!

---

## 🙏 Credits

**Product Vision**: Rob (HR Transformation Specialist)
**Implementation**: Claude (Anthropic AI)
**First Release**: January 19, 2026
**Current Version**: 1.0.0 (January 21, 2026)

---

**Built with ❤️ to make great strategy accessible to every organization.**
