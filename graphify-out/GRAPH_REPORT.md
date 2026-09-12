# Graph Report - CPF Assesment  (2026-09-11)

## Corpus Check
- Corpus is ~46,453 words - fits in a single context window. You may not need a graph.

## Summary
- 114 nodes · 104 edges · 44 communities (36 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.82)
- Token cost: 180,434 input · 4,200 output

## Community Hubs (Navigation)
- App Hub & Project Docs
- Multi-Regime Classification Engine
- Capability Model (Cap. 3)
- App Shell & Accessibility
- Theme Toggle
- Test Framework Helpers
- Dependency Case Studies (§3.4)
- Dumbbell Chart Renderer
- Dependency Taxonomy Sources
- Dependency Diagram (SVG)
- Index: Step Progress
- Step 1: Draw Domain Links
- Step 1: Render Result
- Step 3: Persist
- Step 4a: Sync

## God Nodes (most connected - your core abstractions)
1. `CPF Assessment (progetto)` - 11 edges
2. `Step 2 — Definizione della funzione cyber-fisica` - 8 edges
3. `Step 4b — Valutazione delle capacità` - 8 edges
4. `index.html — ingresso valutazioni` - 6 edges
5. `Step 1 — Regimi applicabili` - 6 edges
6. `Dashboard — Esito della valutazione` - 6 edges
7. `build()` - 5 edges
8. `Step 4a — Conseguenze intollerabili e percorsi` - 5 edges
9. `Test page — regime engine` - 4 edges
10. `Step 3 — Mappatura delle dipendenze` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Complementarità PSNC/strumento (§5.2, §5.7)` --rationale_for--> `Dashboard — Esito della valutazione`  [INFERRED]
  README.md → pages/dashboard.html
- `Complementarità PSNC/strumento (§5.2, §5.7)` --rationale_for--> `Step 1 — Regimi applicabili`  [INFERRED]
  README.md → pages/step1-regimi.html
- `CPF Assessment (progetto)` --references--> `Step 4a — Conseguenze intollerabili e percorsi`  [EXTRACTED]
  README.md → pages/step4a-conseguenze.html
- `CPF Assessment (progetto)` --references--> `Step 4b — Valutazione delle capacità`  [EXTRACTED]
  README.md → pages/step4b-capacita.html
- `CPF Assessment (progetto)` --references--> `tests/calcs.html — runner suite calcs`  [EXTRACTED]
  README.md → tests/calcs.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flusso del wizard CPF (index → step1 → step2 → step3 → step4a → step4b → dashboard)** — index_page, pages_step1_regimi_page, pages_step2_funzione_page, pages_step3_dipendenze_page, pages_step4a_conseguenze_page, pages_step4b_capacita_page, pages_dashboard_page [EXTRACTED 1.00]
- **Logica CCE: conseguenza → percorso → capacità → soglia essenziale** — readme_logica_cce, readme_capacita_essenziali, pages_step4a_conseguenze_page, pages_step4b_capacita_page [INFERRED 0.85]
- **Verifica distinta da intervento: pattern epistemico ricorrente** — pages_step1_regimi_page, pages_step4b_capacita_page, pages_dashboard_page, readme_forza_probatoria [INFERRED 0.80]

## Communities (44 total, 8 thin omitted)

### Community 0 - "App Hub & Project Docs"
Cohesion: 0.22
Nodes (17): index.html — ingresso valutazioni, Casi di riferimento (Cap. 5), Dashboard — Esito della valutazione, Step 1 — Regimi applicabili, Step 2 — Definizione della funzione cyber-fisica, Step 3 — Mappatura delle dipendenze, Verifica del motore (test.html), CPF Assessment (progetto) (+9 more)

### Community 2 - "Capability Model (Cap. 3)"
Cohesion: 0.29
Nodes (8): Step 4a — Conseguenze intollerabili e percorsi, Step 4b — Valutazione delle capacità, Bochman & Freeman 2021 (INL), Capacità essenziali e soglie non compensabili (anello debole), Priorità come regola ordinale (domainPriority), Forza probatoria (separata dal livello), Logica CCE (Consequence-driven Cyber-informed Engineering), Matrice di corroborazione (§3.5)

### Community 3 - "App Shell & Accessibility"
Cohesion: 0.48
Nodes (5): a11y(), absorbToggle(), backToTop(), build(), footer()

### Community 5 - "Theme Toggle"
Cohesion: 0.60
Nodes (5): apply(), current(), mount(), render(), systemDark()

### Community 6 - "Test Framework Helpers"
Cohesion: 0.47
Nodes (3): has(), ok(), traceHas()

### Community 7 - "Dependency Case Studies (§3.4)"
Cohesion: 0.40
Nodes (5): depIssues(d), Caso infrastrutture sottomarine del Baltico, Casi fuori dall'unità di analisi del modello, Caso Estonia, Ridondanza reale vs nominale (§5.4.2, Baltico)

### Community 11 - "Dependency Taxonomy Sources"
Cohesion: 0.67
Nodes (3): Argonne National Laboratory 2015, Dipendenze B → A, Rinaldi, Peerenboom & Kelly 2001

## Knowledge Gaps
- **14 isolated node(s):** `Prof. Michele Colajanni (relatore)`, `Matrice di corroborazione (§3.5)`, `Forza probatoria (separata dal livello)`, `Bochman & Freeman 2021 (INL)`, `Rinaldi, Peerenboom & Kelly 2001` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CPF Assessment (progetto)` connect `App Hub & Project Docs` to `Capability Model (Cap. 3)`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Casi di riferimento (Cap. 5)` connect `App Hub & Project Docs` to `Dependency Case Studies (§3.4)`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Step 1 — Regimi applicabili` (e.g. with `Step 4b — Valutazione delle capacità` and `Complementarità PSNC/strumento (§5.2, §5.7)`) actually correct?**
  _`Step 1 — Regimi applicabili` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Prof. Michele Colajanni (relatore)`, `Matrice di corroborazione (§3.5)`, `Forza probatoria (separata dal livello)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._