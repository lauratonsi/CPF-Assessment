# Graph Report - CPF Assesment  (2026-08-29)

## Corpus Check
- Corpus is ~37,340 words - fits in a single context window. You may not need a graph.

## Summary
- 96 nodes · 171 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.84)
- Token cost: 145,000 input · 8,400 output

## Community Hubs (Navigation)
- Capability Assessment & §3.6 Calculations
- Multi-Regime Classification Engine
- App Core, Persistence & Test Runner
- Dependency Mapping (§3.4)
- Function Definition & Data Schema
- CCE Logic: Consequences & Paths (§3.1)
- Theme Toggle
- Test Assertion Suite
- Dumbbell Chart Renderer
- App Shell / Appbar

## God Nodes (most connected - your core abstractions)
1. `Dashboard — Assessment outcome` - 18 edges
2. `Step 1 — Regime classification` - 14 edges
3. `Step 4a — Intolerable consequences & compromise paths` - 14 edges
4. `Step 2 — Cyber-physical function definition` - 12 edges
5. `Step 3 — Dependency mapping` - 11 edges
6. `Step 4b — Capability assessment` - 11 edges
7. `CPF Assessment — Home & assessment list` - 9 edges
8. `CPF measurement model (Ch. 3)` - 8 edges
9. `Engine verification page` - 7 edges
10. `B->A dependency notation (§3.4)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `CPF measurement model (Ch. 3)` --conceptually_related_to--> `Function as unit of analysis (§3.2)`  [INFERRED]
  README.md → pages/step2-funzione.html
- `CPF measurement model (Ch. 3)` --conceptually_related_to--> `Non-compensable threshold / weak link (§3.6)`  [INFERRED]
  README.md → pages/step4a-conseguenze.html
- `Regulatory verification priority` --semantically_similar_to--> `Intervention vs verification priority (§3.6)`  [INFERRED] [semantically similar]
  pages/step1-regimi.html → pages/dashboard.html
- `CPF Assessment — Home & assessment list` --references--> `Dashboard — Assessment outcome`  [EXTRACTED]
  index.html → pages/dashboard.html
- `CPF Assessment — Home & assessment list` --references--> `Step 1 — Regime classification`  [EXTRACTED]
  index.html → pages/step1-regimi.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CPF Assessment six-step wizard flow** — pages_step1_regimi_html_step1_regimi, pages_step2_funzione_html_step2_funzione, pages_step3_dipendenze_html_step3_dipendenze, pages_step4a_conseguenze_html_step4a_conseguenze, pages_step4b_capacita_html_step4b_capacita, pages_dashboard_html_dashboard [EXTRACTED 0.95]
- **§3.6 derived calculations** — pages_dashboard_html_dimension_gap, pages_dashboard_html_essential_shortfall, pages_dashboard_html_rank_domains, pages_step4a_conseguenze_html_non_compensable_threshold, pages_dashboard_html_priority_split [INFERRED 0.85]
- **CPF test-suite pages and shared cases** — tests_calcs_html_calcs, tests_engine_html_engine, pages_test_html_test, tests_cases, tests_runner [EXTRACTED 0.95]

## Communities (12 total, 2 thin omitted)

### Community 0 - "Capability Assessment & §3.6 Calculations"
Cohesion: 0.25
Nodes (14): Dashboard — Assessment outcome, Descriptive-only aggregate (§3.7), Dimension gap (§3.6), Essential shortfall (§3.6), Intervention vs verification priority (§3.6), Domain ranking (§3.6), Target profile (§3.6), Capability domains (6-7 fixed, §2.9) (+6 more)

### Community 1 - "Multi-Regime Classification Engine"
Cohesion: 0.15
Nodes (6): Multi-regime classification, Regime interactions, Size-cap rule (NIS2), Step 1 — Regime classification, Regulatory verification priority, Test page — regime engine

### Community 2 - "App Core, Persistence & Test Runner"
Cohesion: 0.19
Nodes (5): CPF Assessment — Home & assessment list, Client-side persistence (localStorage + JSON import/export), Function-definition coherence heuristics, Engine verification page, Test page — §3.6 derived calculations

### Community 3 - "Dependency Mapping (§3.4)"
Cohesion: 0.23
Nodes (10): Dependency flow diagram (upstream/downstream SVG), B->A dependency notation (§3.4), Critical link (tight coupling + no alternative), Dependency taxonomy: class / coupling / position / failure (§3.4), Empirical grounding (Gudrun 2005, NAT, 2003 blackout), Ryden & Sonesson — storm Gudrun (2005), Step 3 — Dependency mapping, Dependency curves / temporal dimension (+2 more)

### Community 4 - "Function Definition & Data Schema"
Cohesion: 0.29
Nodes (4): Reusable organization regime profile, Per-function regime override (§3.2), Step 2 — Cyber-physical function definition, Function as unit of analysis (§3.2)

### Community 5 - "CCE Logic: Consequences & Paths (§3.1)"
Cohesion: 0.52
Nodes (7): Bochman & Freeman, Countering Cyber Sabotage (2021), INL, CCE logic (consequence-driven), Compromise paths, Intolerable consequences (§3.1), Non-compensable threshold / weak link (§3.6), Required vs essential capabilities, Step 4a — Intolerable consequences & compromise paths

### Community 6 - "Theme Toggle"
Cohesion: 0.60
Nodes (5): apply(), current(), mount(), render(), systemDark()

### Community 7 - "Test Assertion Suite"
Cohesion: 0.47
Nodes (3): has(), ok(), traceHas()

## Knowledge Gaps
- **5 isolated node(s):** `Size-cap rule (NIS2)`, `Regime interactions`, `Dependency curves / temporal dimension`, `Argonne National Laboratory (2015)`, `Ryden & Sonesson — storm Gudrun (2005)`
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Dashboard — Assessment outcome` connect `Capability Assessment & §3.6 Calculations` to `Multi-Regime Classification Engine`, `App Core, Persistence & Test Runner`, `Dependency Mapping (§3.4)`, `CCE Logic: Consequences & Paths (§3.1)`, `Demo Assessment Data`, `Dumbbell Chart Renderer`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `Step 3 — Dependency mapping` connect `Dependency Mapping (§3.4)` to `App Core, Persistence & Test Runner`, `Function Definition & Data Schema`, `CCE Logic: Consequences & Paths (§3.1)`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `Step 1 — Regime classification` connect `Multi-Regime Classification Engine` to `Capability Assessment & §3.6 Calculations`, `App Core, Persistence & Test Runner`, `Function Definition & Data Schema`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Dashboard — Assessment outcome` (e.g. with `Step 1 — Regime classification` and `Step 4a — Intolerable consequences & compromise paths`) actually correct?**
  _`Dashboard — Assessment outcome` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Step 4a — Intolerable consequences & compromise paths` (e.g. with `Step 3 — Dependency mapping` and `Dashboard — Assessment outcome`) actually correct?**
  _`Step 4a — Intolerable consequences & compromise paths` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Step 3 — Dependency mapping` (e.g. with `Step 2 — Cyber-physical function definition` and `Step 4a — Intolerable consequences & compromise paths`) actually correct?**
  _`Step 3 — Dependency mapping` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Size-cap rule (NIS2)`, `Regime interactions`, `Dependency curves / temporal dimension` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._